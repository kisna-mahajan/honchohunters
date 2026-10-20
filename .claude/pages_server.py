"""Static server that mimics GitHub Pages: /foo serves foo.html, /dir/ serves dir/index.html."""
import functools
import http.server
import os
import sys

root = sys.argv[1]
port = int(sys.argv[2])


class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        local = super().translate_path(path)
        if not os.path.exists(local) and os.path.exists(local + ".html"):
            return local + ".html"
        return local


http.server.ThreadingHTTPServer(("127.0.0.1", port), functools.partial(Handler, directory=root)).serve_forever()
