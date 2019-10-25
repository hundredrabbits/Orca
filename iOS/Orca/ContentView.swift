import SwiftUI
import WebKit

struct ContentView: View {
    let webView = WebView()

    var body: some View {
        ZStack {
            VStack {
                Button(action: {
                    self.webView.refresh()
                }) {
                    Text("RELOAD")
                }
                webView
            }
        }

    }
}

struct WebView : UIViewRepresentable {

    let url: URL
    let request: URLRequest
    let webView = WKWebView()

    init() {
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
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        return ContentView()
    }
}

