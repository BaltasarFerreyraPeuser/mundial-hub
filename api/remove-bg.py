from http.server import BaseHTTPRequestHandler
from rembg import remove, new_session
import io

session = new_session("u2net_human_seg")

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        output_data = remove(post_data, session=session)
        
        self.send_response(200)
        self.send_header('Content-type', 'image/png')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(output_data)