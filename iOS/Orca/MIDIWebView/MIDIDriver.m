/*
 
 Copyright 2014 Takashi Mizuhiki
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 
 */

#import <mach/mach_time.h>
#import <CoreMIDI/CoreMIDI.h>

#import "MIDIDriver.h"
#import "MIDIParser.h"


@interface EndpointInfo : NSObject
@end

@implementation EndpointInfo
@end

@interface CoreMIDIEndpointInfo : EndpointInfo
@property (nonatomic, assign) SInt32 uniqueId;
@end

@implementation CoreMIDIEndpointInfo
@end

@interface VirtualEndpointInfo : EndpointInfo
@property (nonatomic, strong) NSString *name;
@end

@implementation VirtualEndpointInfo
@end

@implementation NSArray (CoreEndpointInfo)

- (NSUInteger)indexOfUniqueId:(SInt32)uniqueId
{
    for (NSUInteger index = 0; index < [self count]; index++) {
        CoreMIDIEndpointInfo *info = self[index];
        if (info.uniqueId == uniqueId) {
            return index;
        }
    }
    
    return NSNotFound;
}

@end

@interface MIDINotificationLogItem : NSObject
@property (nonatomic, assign) MIDIObjectAddRemoveNotification notification;
@end

@implementation MIDINotificationLogItem
@end

@interface MIDIDriver () {
    MIDIClientRef _clientRef;
    MIDIPortRef _inputPortRef;
    MIDIPortRef _outputPortRef;

    NSArray *_parsers;
    mach_timebase_info_data_t _base;
    
    NSArray *_destEndpointInfoArray;
    NSArray *_srcEndpointInfoArray;

    NSMutableArray *_virtualDestEndpointInfoArray;
    NSMutableArray *_virtualSrcEndpointInfoArray;
    
    NSMutableArray *_midiNotificationLog;
}

@end

@implementation MIDIDriver

#pragma mark -
#pragma mark API

- (OSStatus)sendMessage:(NSData *)data toDestinationIndex:(ItemCount)index deltatime:(float)deltatime_ms
{
    MIDITimeStamp timestamp = mach_absolute_time() + deltatime_ms * 1000000 /* ns */ * _base.denom / _base.numer;
    
    if (index < [_destEndpointInfoArray count]) {
        // proper Core MIDI endpoints
        MIDIEndpointRef endpoint = MIDIGetDestination(index);
        if (endpoint == 0) {
            return !noErr;
        }
        
        Byte buffer[sizeof(MIDIPacketList) + [data length]];
        MIDIPacketList *packetList = (MIDIPacketList *)buffer;
        MIDIPacket *packet = MIDIPacketListInit(packetList);
        packet = MIDIPacketListAdd(packetList, sizeof(buffer), packet, timestamp, [data length], [data bytes]);
        if (packet == NULL) {
            return !noErr;
        }
        
        OSStatus status = MIDISend(_outputPortRef, endpoint, packetList);
        
        return status;
    } else {
        // virtual endpoints
        ItemCount virtualDestIndex = index - [_destEndpointInfoArray count];

        if (_onMessageReceivedFromVirtualEndpoint) {
            _onMessageReceivedFromVirtualEndpoint(virtualDestIndex, data, timestamp);
        }

        return noErr;
    }
}

- (OSStatus)sendMessage:(NSData *)data toVirtualSourceIndex:(ItemCount)vindex timestamp:(uint64_t)timestamp
{
    if (vindex < [_virtualSrcEndpointInfoArray count]) {
        if (_onMessageReceived) {
            ItemCount index = [_srcEndpointInfoArray count] + vindex;
            _onMessageReceived(index, data, timestamp);
        }
    }
    
    return noErr;
}

- (OSStatus)clearWithDestinationIndex:(ItemCount)index
{
    OSStatus status = noErr;

    if (index < [_destEndpointInfoArray count]) {
        MIDIEndpointRef endpoint = MIDIGetDestination(index);
        status = MIDIFlushOutput(endpoint);
    }
    
    return status;
}

- (NSDictionary *)portinfoFromEndpointRef:(MIDIEndpointRef)endpoint
{
    OSStatus status;
    NSDictionary *portInfo = nil;

    SInt32 uniqueId;
    status = MIDIObjectGetIntegerProperty(endpoint, kMIDIPropertyUniqueID, &uniqueId);
    if (status != noErr) {
        uniqueId = 0;
    }
    
    CFStringRef manufacturer;
    status = MIDIObjectGetStringProperty(endpoint, kMIDIPropertyManufacturer, &manufacturer);
    if (status != noErr) {
        manufacturer = nil;
    }
    
    CFStringRef name;
    status = MIDIObjectGetStringProperty(endpoint, kMIDIPropertyName, &name);
    if (status != noErr) {
        name = nil;
    }
    
    SInt32 version;
    status = MIDIObjectGetIntegerProperty(endpoint, kMIDIPropertyDriverVersion, &version);
    if (status != noErr) {
        version = 0;
    }
    
    portInfo = @{ @"id"           : [NSNumber numberWithInt:uniqueId],
                  @"version"      : [NSNumber numberWithInt:version],
                  @"manufacturer" : ((__bridge_transfer NSString *)manufacturer ?: @""),
                  @"name"         : ((__bridge_transfer NSString *)name ?: @""),
                };

    return portInfo;
}

- (NSDictionary *)portinfoFromDestinationEndpointIndex:(ItemCount)index
{
    if (index < [_destEndpointInfoArray count]) {
        // proper Core MIDI endpoints
        return [self portinfoFromEndpointRef:MIDIGetDestination(index)];
    
    } else {
        ItemCount virtualDestIndex = index - [_destEndpointInfoArray count];
        VirtualEndpointInfo *info = _virtualDestEndpointInfoArray[virtualDestIndex];
        
        // virtual endpoints
        NSDictionary *portInfo = @{ @"id"           : [NSNumber numberWithInt:(int)index],
                                    @"version"      : [NSNumber numberWithInt:0],
                                    @"manufacturer" : @"",
                                    @"name"         : info.name,
                                  };

        return portInfo;
    }
    
    
    
    return [self portinfoFromEndpointRef:MIDIGetDestination(index)];
}

- (NSDictionary *)portinfoFromSourceEndpointIndex:(ItemCount)index
{
    if (index < [_srcEndpointInfoArray count]) {
        // proper Core MIDI endpoints
        return [self portinfoFromEndpointRef:MIDIGetSource(index)];

    } else {
        ItemCount virtualSrcIndex = index - [_srcEndpointInfoArray count];
        VirtualEndpointInfo *info = _virtualSrcEndpointInfoArray[virtualSrcIndex];
        
        // virtual endpoints
        NSDictionary *portInfo = @{ @"id"           : [NSNumber numberWithInt:(int)index],
                                    @"version"      : [NSNumber numberWithInt:0],
                                    @"manufacturer" : @"",
                                    @"name"         : info.name,
                                    };
        
        return portInfo;

    }
}

- (ItemCount)numberOfSources
{
    return [_srcEndpointInfoArray count] + [_virtualSrcEndpointInfoArray count];
}

- (ItemCount)numberOfDestinations
{
    return [_destEndpointInfoArray count] + [_virtualDestEndpointInfoArray count];
}

#pragma mark -
#pragma mark MIDIParser delegate

- (void)midiParser:(MIDIParser *)parser recvMessage:(uint8_t *)message length:(uint32_t)length timestamp:(uint64_t)timestamp
{
    NSData *data = [[NSData alloc] initWithBytes:message length:length];
    
    ItemCount index = [_parsers indexOfObject:parser];

    dispatch_async(dispatch_get_main_queue(), ^{
        if (_onMessageReceived) {
            _onMessageReceived(index, data, timestamp);
        }
    });    
}

static void MyMIDIInputProc(const MIDIPacketList *pktlist, void *readProcRefCon, void *srcConnRefCon)
{
    MIDIParser *parser = (__bridge MIDIParser *)srcConnRefCon;
    
    MIDIPacket *packet = (MIDIPacket *)&(pktlist->packet[0]);
    UInt32 packetCount = pktlist->numPackets;

    for (NSInteger i = 0; i < packetCount; i++) {
        [parser setMessage:packet->data length:packet->length timestamp:packet->timeStamp];
        packet = MIDIPacketNext(packet);
    }
}

static void MyMIDINotifyProc(const MIDINotification *notification, void *refCon)
{
    MIDIDriver *myself = (__bridge MIDIDriver *)refCon;
    [myself onMIDINotification:notification];
}

- (void)onMIDINotification:(const MIDINotification *)notification
{
    OSStatus status;
    
    switch (notification->messageID) {
        case kMIDIMsgSetupChanged:
            // Notify removed MIDI ports
            for (MIDINotificationLogItem *item in _midiNotificationLog) {
                MIDIObjectAddRemoveNotification n = item.notification;
                if (n.messageID == kMIDIMsgObjectRemoved) {
                    MIDIEndpointRef endpointRef = (MIDIEndpointRef)n.child;
                    SInt32 uniqueId;
                    status = MIDIObjectGetIntegerProperty(endpointRef, kMIDIPropertyUniqueID, &uniqueId);
                    NSAssert(status == noErr, @"MIDIObjectGetIntegerProperty(kMIDIPropertyUniqueID) error");

                    switch (n.childType) {
                        case kMIDIObjectType_Destination:
                            {
                                NSUInteger index = [_destEndpointInfoArray indexOfUniqueId:uniqueId];
                                NSAssert(index != NSNotFound, @"Removed unknown MIDI destination");
                                if (_onDestinationPortRemoved) {
                                    _onDestinationPortRemoved(index);
                                }
                            }
                            break;
                            
                        case kMIDIObjectType_Source:
                            {
                                NSUInteger index = [_srcEndpointInfoArray indexOfUniqueId:uniqueId];
                                NSAssert(index != NSNotFound, @"Removed unknown MIDI source");
                                if (_onSourcePortRemoved) {
                                    _onSourcePortRemoved(index);
                                }
                            }
                            break;
                            
                        default:
                            break;
                    }
                }
            }

            // Rebuild the port ID tables and the received MIDI message parsers
            [self disposeMIDIInPort];
            [self disposeMIDIOutPort];
            [self createMIDIInPort];
            [self createMIDIOutPort];

            // Notify added MIDI ports
            for (MIDINotificationLogItem *item in _midiNotificationLog) {
                MIDIObjectAddRemoveNotification n = item.notification;
                if (n.messageID == kMIDIMsgObjectAdded) {
                    MIDIEndpointRef endpointRef = (MIDIEndpointRef)n.child;
                    SInt32 uniqueId;
                    status = MIDIObjectGetIntegerProperty(endpointRef, kMIDIPropertyUniqueID, &uniqueId);
                    NSAssert(status == noErr, @"MIDIObjectGetIntegerProperty(kMIDIPropertyUniqueID) error");

                    switch (n.childType) {
                        case kMIDIObjectType_Destination:
                            {
                                if ([_destEndpointInfoArray count] == 0) {
                                    break;
                                }
                                
                                NSUInteger index = [_destEndpointInfoArray indexOfUniqueId:uniqueId];
                                NSAssert(index != NSNotFound, @"Added unknown MIDI destination");
                                if (_onDestinationPortAdded) {
                                    _onDestinationPortAdded(index);
                                }
                            }
                            break;
                            
                        case kMIDIObjectType_Source:
                            {
                                if ([_srcEndpointInfoArray count] == 0) {
                                    break;
                                }
                                
                                NSUInteger index = [_srcEndpointInfoArray indexOfUniqueId:uniqueId];
                                NSAssert(index != NSNotFound, @"Added unknown MIDI source");
                                if (_onSourcePortAdded) {
                                    _onSourcePortAdded(index);
                                }
                            }
                            break;
                            
                        default:
                            break;
                    }
                }
            }
            
            _midiNotificationLog = nil;
            
            break;
            
        case kMIDIMsgObjectAdded:
        case kMIDIMsgObjectRemoved:
            {
                if (_midiNotificationLog == nil) {
                    _midiNotificationLog = [NSMutableArray array];
                }
                
                MIDINotificationLogItem *item = [[MIDINotificationLogItem alloc] init];
                item.notification = *((MIDIObjectAddRemoveNotification *)notification);

                [_midiNotificationLog addObject:item];
            }
            break;
            
        default:
            break;
    }
}

- (BOOL)createMIDIInPort
{
    OSStatus err;
    
    NSString *inputPortName = @"inputPort";
    err = MIDIInputPortCreate(_clientRef, (__bridge CFStringRef)inputPortName, MyMIDIInputProc, (__bridge void *)(self), &_inputPortRef);
    if (err != noErr) {
        return NO;
    }
    
    // Get MIDI IN endpoints and connect them to the MIDI port.
    ItemCount sourceCount = MIDIGetNumberOfSources();
    NSMutableArray *parsers = [NSMutableArray arrayWithCapacity:sourceCount];
    NSMutableArray *sourceEndpointInfoArray = [NSMutableArray arrayWithCapacity:sourceCount];

    for (ItemCount i = 0; i < sourceCount; i++) {
        MIDIParser *parser = [[MIDIParser alloc] init];
        parser.delegate = self;
        [parsers addObject:parser];
        
        MIDIEndpointRef endpointRef = MIDIGetSource(i);
        err = MIDIPortConnectSource(_inputPortRef, endpointRef, (__bridge void *)parser);
        if (err != noErr) {
            return NO;
        }
        
        SInt32 uniqueId;
        err = MIDIObjectGetIntegerProperty(endpointRef, kMIDIPropertyUniqueID, &uniqueId);
        if (err != noErr) {
            return NO;
        }
        
        CoreMIDIEndpointInfo *info = [[CoreMIDIEndpointInfo alloc] init];
        info.uniqueId = uniqueId;
        [sourceEndpointInfoArray addObject:info];
    }
    
    _parsers = parsers;
    _srcEndpointInfoArray = sourceEndpointInfoArray;

    return YES;
}

- (BOOL)createMIDIOutPort
{
    OSStatus err;
    
    NSString *outputPortName = @"outputPort";
    err = MIDIOutputPortCreate(_clientRef, (__bridge CFStringRef)outputPortName, &_outputPortRef);
    if (err != noErr) {
        return NO;
    }

    ItemCount destinationCount = MIDIGetNumberOfDestinations();
    NSMutableArray *destinationEndpointInfoArray = [NSMutableArray arrayWithCapacity:destinationCount];
    for (ItemCount i = 0; i < destinationCount; i++) {
        MIDIEndpointRef endpointRef = MIDIGetDestination(i);

        SInt32 uniqueId;
        err = MIDIObjectGetIntegerProperty(endpointRef, kMIDIPropertyUniqueID, &uniqueId);
        if (err != noErr) {
            return NO;
        }
        
        CoreMIDIEndpointInfo *info = [[CoreMIDIEndpointInfo alloc] init];
        info.uniqueId = uniqueId;
        [destinationEndpointInfoArray addObject:info];
    }

    _destEndpointInfoArray = destinationEndpointInfoArray;
    
    return YES;
}

- (void)disposeMIDIInPort
{
    OSStatus status;
    status = MIDIPortDispose(_inputPortRef);
    NSAssert(status == noErr, @"MIDIPortDispose error");

    _inputPortRef = 0;
    _parsers = nil;
}

- (void)disposeMIDIOutPort
{
    OSStatus status;
    status = MIDIPortDispose(_outputPortRef);
    NSAssert(status == noErr, @"MIDIPortDispose error");

    _outputPortRef = 0;
}

- (BOOL)createMIDIClient
{
    OSStatus err;

    NSString *clientName = @"inputClient";
    err = MIDIClientCreate((__bridge CFStringRef)clientName, MyMIDINotifyProc, (__bridge void *)(self), &_clientRef);
    if (err != noErr) {
        return NO;
    }

    if ([self createMIDIInPort] == NO) {
        return NO;
    }

    if ([self createMIDIOutPort] == NO) {
        return NO;
    }

    return YES;
}

- (void)disposeMIDIClient
{
    OSStatus status;
    
    status = MIDIClientDispose(_clientRef);
    NSAssert(status == noErr, @"MIDIClientDispose");
}

- (ItemCount)createVirtualSrcEndpointWithName:(NSString *)name
{
    if (_virtualSrcEndpointInfoArray == nil) {
        _virtualSrcEndpointInfoArray = [[NSMutableArray alloc] init];
    }
    
    VirtualEndpointInfo *info = [[VirtualEndpointInfo alloc] init];
    info.name = name;
    
    [_virtualSrcEndpointInfoArray addObject:info];

    ItemCount vindex = [_virtualSrcEndpointInfoArray count] -1;
    
    if (_onSourcePortAdded) {
        ItemCount index = [_srcEndpointInfoArray count] + vindex;
        _onSourcePortAdded(index);
    }

    return vindex;
}

- (void)removeVirtualSrcEndpointWithIndex:(ItemCount)vindex
{
    if (vindex < [_virtualSrcEndpointInfoArray count]) {
        if (_onSourcePortRemoved) {
            ItemCount index = [_srcEndpointInfoArray count] + vindex;
            _onSourcePortRemoved(index);
        }
        
        [_virtualSrcEndpointInfoArray removeObjectAtIndex:vindex];
    }
}

- (ItemCount)createVirtualDestEndpointWithName:(NSString *)name
{
    if (_virtualDestEndpointInfoArray == nil) {
        _virtualDestEndpointInfoArray = [[NSMutableArray alloc] init];
    }
    
    VirtualEndpointInfo *info = [[VirtualEndpointInfo alloc] init];
    info.name = name;
    
    [_virtualDestEndpointInfoArray addObject:info];

    ItemCount vindex = [_virtualDestEndpointInfoArray count] - 1;
    
    if (_onDestinationPortAdded) {
        ItemCount index = [_destEndpointInfoArray count] + vindex;
        _onDestinationPortAdded(index);
    }
    
    return vindex;
}

- (void)removeVirtualDestEndpointWithIndex:(ItemCount)vindex
{
    if (vindex < [_virtualDestEndpointInfoArray count]) {
        if (_onDestinationPortRemoved) {
            ItemCount index = [_destEndpointInfoArray count] + vindex;
            _onDestinationPortRemoved(index);
        }
        
        [_virtualDestEndpointInfoArray removeObjectAtIndex:vindex];
    }
}


- (id)init
{
    self = [super init];
    if (self) {
        mach_timebase_info(&_base);

        BOOL result = [self createMIDIClient];
        _isAvailable = result;
    }
    
    return self;
}

- (void)dealloc
{
    [self disposeMIDIClient];
}

@end
