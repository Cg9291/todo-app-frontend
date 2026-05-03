import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

const port = Number(process.env.PORT || 4173);
const root = process.cwd();

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const pathname = url.pathname === '/' ? '/pages/login.html' : url.pathname;
  const filePath = path.join(root, pathname);
  const extension = path.extname(filePath);

  try {
    const body = await readFile(filePath);
    res.statusCode = 200;
    res.setHeader('Content-Type', contentTypes[extension] || 'application/octet-stream');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Frontend server running on http://localhost:${port}`);
});
