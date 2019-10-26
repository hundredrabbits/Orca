import SwiftUI
import WebKit

struct ContentView: View {
    let webView = WebView()

    var body: some View {
        VStack {
//                Button(action: {
//                    self.webView.refresh()
//                }) {
//                    Text("RELOAD")
//                }
            webView
        }
        .edgesIgnoringSafeArea(.all)
        .statusBar(hidden: true)
    }
}

struct WebView : UIViewRepresentable {

    let midiDriver = MIDIDriver()
    let url: URL
    let request: URLRequest
    /* https://github.com/mizuhiki/WebMIDIAPIShimForiOS */
    let webView: MIDIWebView

    init() {
        let config = MIDIWebView.createConfiguration(with: midiDriver) { str in
            return true
        }

        webView = MIDIWebView.init(frame: .zero, configuration: config!)
        url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "")!
        request = URLRequest(url: url)
    }

    func makeUIView(context: Context) -> WKWebView  {
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        refresh()
    }

    func refresh() {
        webView.configuration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")

        webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        webView.load(request)

        webView.becomeFirstResponder()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        return ContentView()
    }
}

