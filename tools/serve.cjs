// Local QA only. End the process to stop the server.
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname,'..');
http.createServer((req,res) => {
  let filename;
  try { filename = path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname)); } catch { res.writeHead(400).end(); return; }
  if (filename !== root && !filename.startsWith(root+path.sep)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(filename) && fs.statSync(filename).isDirectory()) filename = path.join(filename,'index.html');
  fs.readFile(filename,(error,bytes) => {
    if (error) { res.writeHead(404).end('Not found'); return; }
    const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'};
    res.writeHead(200,{'Content-Type':types[path.extname(filename)] || 'application/octet-stream'}).end(bytes);
  });
}).listen(8000,'127.0.0.1',() => console.log('Preview: http://127.0.0.1:8000/editor/'));
