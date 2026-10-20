const { createServer } = require("node:http");
const { readFile } = require("node:fs/promises");
const path = require("node:path");

const host = "127.0.0.1";
const port = 6767;
const indexPath = path.join(__dirname, "index.html");

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(
      new URL(request.url, `http://${host}`).pathname,
    );
  } catch {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  if (pathname !== "/" && pathname !== "/index.html") {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  try {
    const page = await readFile(indexPath);
    response.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Length": page.length,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    response.end(page);
  } catch (error) {
    console.error("Unable to read index.html:", error);
    response.writeHead(500);
    response.end("Internal server error");
  }
});

server.listen(port, host, () => {
  console.log(`Misión Meiosis is available at http://localhost:${port}`);
});
