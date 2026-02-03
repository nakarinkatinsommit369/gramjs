const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const UPLOAD_DIR = path.join(ROOT_DIR, 'uploads');
const MAX_BODY_SIZE = 10 * 1024 * 1024;

const mimeByExt = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_SIZE) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function listPhotos() {
  ensureUploadDir();
  return fs
    .readdirSync(UPLOAD_DIR)
    .filter((file) => !file.startsWith('.'))
    .map((file) => ({
      name: file,
      url: `/photos/${file}`,
    }));
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return mimeByExt[ext] || 'application/octet-stream';
}

function serveStaticFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': getContentType(filePath) });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/') {
    return serveStaticFile(res, path.join(PUBLIC_DIR, 'index.html'));
  }

  if (req.method === 'GET' && url.pathname.startsWith('/photos/')) {
    const requested = path.basename(url.pathname);
    const filePath = path.join(UPLOAD_DIR, requested);
    return serveStaticFile(res, filePath);
  }

  if (req.method === 'GET' && url.pathname === '/api/photos') {
    return sendJson(res, 200, { photos: listPhotos() });
  }

  if (req.method === 'POST' && url.pathname === '/api/photos') {
    try {
      const { filename, dataUrl } = await parseJsonBody(req);
      if (!filename || !dataUrl) {
        return sendJson(res, 400, { error: 'filename and dataUrl are required' });
      }

      const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
      if (!match) {
        return sendJson(res, 400, { error: 'Invalid dataUrl' });
      }

      const safeName = sanitizeFilename(filename);
      const extFromType = match[1].split('/')[1] || 'png';
      const finalName = safeName.includes('.') ? safeName : `${safeName}.${extFromType}`;
      const buffer = Buffer.from(match[2], 'base64');

      ensureUploadDir();
      fs.writeFileSync(path.join(UPLOAD_DIR, finalName), buffer);

      return sendJson(res, 201, {
        photo: {
          name: finalName,
          url: `/photos/${finalName}`,
        },
      });
    } catch (error) {
      const status = error.message === 'Payload too large' ? 413 : 400;
      return sendJson(res, status, { error: error.message });
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Photo storage app running at http://localhost:${PORT}`);
});
