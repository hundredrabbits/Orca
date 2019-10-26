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

#import <Foundation/Foundation.h>

@interface MIDIDriver : NSObject

- (OSStatus)sendMessage:(NSData *)data toDestinationIndex:(ItemCount)index deltatime:(float)deltatime_ms;
- (OSStatus)sendMessage:(NSData *)data toVirtualSourceIndex:(ItemCount)vindex timestamp:(uint64_t)timestamp;
- (OSStatus)clearWithDestinationIndex:(ItemCount)index;

- (NSDictionary *)portinfoFromDestinationEndpointIndex:(ItemCount)index;
- (NSDictionary *)portinfoFromSourceEndpointIndex:(ItemCount)index;
- (ItemCount)numberOfSources;
- (ItemCount)numberOfDestinations;

- (ItemCount)createVirtualSrcEndpointWithName:(NSString *)name;
- (void)removeVirtualSrcEndpointWithIndex:(ItemCount)vindex;
- (ItemCount)createVirtualDestEndpointWithName:(NSString *)name;
- (void)removeVirtualDestEndpointWithIndex:(ItemCount)vindex;

@property (nonatomic, copy) void (^onMessageReceived)(ItemCount index, NSData *data, uint64_t timestamp);
@property (nonatomic, copy) void (^onMessageReceivedFromVirtualEndpoint)(ItemCount index, NSData *data, uint64_t timestamp);
@property (nonatomic, copy) void (^onDestinationPortAdded)(ItemCount index);
@property (nonatomic, copy) void (^onSourcePortAdded)(ItemCount index);
@property (nonatomic, copy) void (^onDestinationPortRemoved)(ItemCount index);
@property (nonatomic, copy) void (^onSourcePortRemoved)(ItemCount index);
@property (nonatomic, readonly) BOOL isAvailable;

@end
