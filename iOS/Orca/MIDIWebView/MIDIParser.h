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

@class MIDIParser;

@protocol MIDIParserDelegate
- (void)midiParser:(MIDIParser *)parser recvMessage:(uint8_t *)message length:(uint32_t)length timestamp:(uint64_t)timestamp;
@end

@interface MIDIParser : NSObject {
    id <MIDIParserDelegate> __weak delegate;
}

- (void)setMessage:(uint8_t *)message length:(uint32_t)length timestamp:(uint64_t)timestamp;
- (void)reset;

@property (weak) id delegate;

@end
