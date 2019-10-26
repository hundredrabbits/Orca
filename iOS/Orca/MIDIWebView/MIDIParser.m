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

#import "MIDIParser.h"

@interface MIDIParser () {
    uint8_t _parsedMessage[3];
    int _totalBytes;
    int _filledBytes;

    NSMutableData *_sysex;
}
@end

@implementation MIDIParser

@synthesize delegate;


- (int)getDataByteLength:(uint8_t)statusByte
{
    int len = 0;
    
    switch (statusByte & 0xF0) {
        case 0x80:
        case 0x90:
        case 0xA0:
        case 0xB0:
        case 0xE0:
            len = 3;
            break;
            
        case 0xC0:
        case 0xD0:
            len = 2;
            break;
            
        case 0xF0:
            if (statusByte == 0xF1)
                len = 2;
            else if (statusByte == 0xF2)
                len = 3;
            else if (statusByte == 0xF3)
                len = 2;
            else
                len = 1;

            break;
            
        default:
            break;
    }
    
    return len;
}

- (void)setMessage:(uint8_t *)message length:(uint32_t)length timestamp:(uint64_t)timestamp
{
    const uint8_t *p = message;
    const uint8_t *end = message + length;
    
    while (p < end) {
        if (*p & 0x80) {
            // status byte (MSB is 1)
            if (*p >= 0xF8) {
                // realtime message
                [delegate midiParser:self recvMessage:(uint8_t *)p length:1 timestamp:timestamp];
            } else if (_sysex) {
                // detected a status byte in SysEx
                if (*p == 0xF7) {
                    // End of SysEx
                    [_sysex appendBytes:p length:1];
                    [delegate midiParser:self recvMessage:(uint8_t *)[_sysex bytes] length:(uint32_t)[_sysex length] timestamp:timestamp];
                    _sysex = nil;
                } else {
                    // A unrightful status byte was found in the SysEx message.
                    // Finish parsing the message forcedly.
                    uint8_t f7 = 0xf7;
                    [_sysex appendBytes:&f7 length:1];
                    [delegate midiParser:self recvMessage:(uint8_t *)[_sysex bytes] length:(uint32_t)[_sysex length] timestamp:timestamp];
                    _sysex = nil;

                    // Continue to parse the unrightful status byte.
                    continue;
                }
            } else {
                if (*p == 0xF0) {
                    // Start parsing a SysEx.
                    _sysex = [NSMutableData data];
                    [_sysex appendBytes:p length:1];
                    _totalBytes = INT_MAX;
                    _filledBytes = 0;
                } else {
                    _parsedMessage[0] = *p;
                    _totalBytes = [self getDataByteLength:*p];
                    _filledBytes = 1;
                }
            }
        } else {
            // Data byte (MSB is 0)
            if (_sysex) {
                // A SysEx message is being parsed. Append the byte into the SysEx.
                [_sysex appendBytes:p length:1];
            } else if (_totalBytes == 0) {
                // A data byte has been detected without a status byte. It might be a running status.
                if (_parsedMessage[0]) {
                    _totalBytes = [self getDataByteLength:_parsedMessage[0]];
                    _filledBytes = 1;
                    
                    // Continue to parse next byte.
                    continue;
                }
                
                // Found a data byte but a valid status byte has not been detected.
                // The data byte will be ignored.
            } else {
                _parsedMessage[_filledBytes] = *p;
                _filledBytes++;
                
                if (_totalBytes == _filledBytes) {
                    [delegate midiParser:self recvMessage:_parsedMessage length:_totalBytes timestamp:timestamp];
                    _totalBytes = 0;
                    _filledBytes = 0;
                }
            }
        }
        
        p++;
    }
}

- (void)reset
{
    memset(_parsedMessage, 0, sizeof(_parsedMessage));
    _totalBytes = 0;
    _filledBytes = 0;
    _sysex = nil;
}

- (id)init
{
    self = [super init];
    if (self) {
        [self reset];
    }

    return self;
}


@end
