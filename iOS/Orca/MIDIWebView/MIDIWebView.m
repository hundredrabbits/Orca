/*
 
 Copyright 2015 Takashi Mizuhiki
 
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

#import "MIDIWebView.h"
#import "WebViewDelegate.h"

@implementation MIDIWebView

+ (WKWebViewConfiguration *)createConfigurationWithMIDIDriver:(MIDIDriver *)midiDriver sysexConfirmation:(BOOL (^)(NSString *url))confirmSysExAvailability
{
    WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];

    WebViewDelegate *delegate = [[WebViewDelegate alloc] init];
    delegate.midiDriver = midiDriver;
    delegate.confirmSysExAvailability = confirmSysExAvailability;
    
    // Create a delegate for handling informal URL schemes.
    NSString *polyfill_path = [[NSBundle mainBundle] pathForResource:@"WebMIDIAPIPolyfill" ofType:@"js"];
    NSString *polyfill_script = [NSString stringWithContentsOfFile:polyfill_path encoding:NSUTF8StringEncoding error:nil];
    WKUserScript *script = [[WKUserScript alloc] initWithSource:polyfill_script injectionTime:WKUserScriptInjectionTimeAtDocumentStart forMainFrameOnly:YES];
    
    // Inject Web MIDI API bridge JavaScript
    WKUserContentController *userContentController = [[WKUserContentController alloc] init];
    [userContentController addUserScript:script];
    [userContentController addScriptMessageHandler:delegate name:@"onready"];
    [userContentController addScriptMessageHandler:delegate name:@"send"];
    [userContentController addScriptMessageHandler:delegate name:@"clear"];

    configuration.userContentController = userContentController;
    
    return configuration;
}

@end
