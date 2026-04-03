const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const host = "127.0.0.1";
const port = 4173;

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

http
  .createServer((request, response) => {
    const requestPath = decodeURIComponent(request.url.split("?")[0]);
    const safePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
    const filePath = path.join(root, safePath);

    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, file) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      const extension = path.extname(filePath).toLowerCase();
      response.writeHead(200, {
        "Content-Type": mimeTypes[extension] || "application/octet-stream",
      });
      response.end(file);
    });
  })
  .listen(port, host);

console.log(`Local server running at http://${host}:${port}`);
