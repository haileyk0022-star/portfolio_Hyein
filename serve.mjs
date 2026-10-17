import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.jpg':'image/jpeg'};
http.createServer(async (req,res) => {
 try {
  const url = new URL(req.url, 'http://127.0.0.1');
  const target = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
  if (!target.startsWith(root + path.sep)) {res.writeHead(403);res.end();return;}
  const data = await readFile(target);
  res.writeHead(200, {'Content-Type':types[path.extname(target)] || 'application/octet-stream'});
  res.end(data);
 } catch {res.writeHead(404);res.end('Not found');}
}).listen(4174, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4174'));
