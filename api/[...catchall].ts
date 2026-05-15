import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

// Dynamic import to avoid issues at build time
let serverHandler: any = null;

async function getServerHandler() {
  if (!serverHandler) {
    try {
      const serverModule = await import("../dist/server/index.js");
      serverHandler = serverModule.default;
    } catch (error) {
      console.error("Failed to load server handler:", error);
      throw error;
    }
  }
  return serverHandler;
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/assets/") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".json") ||
    pathname.endsWith(".mjs")
  );
}

function tryServeStaticFile(pathname: string, res: VercelResponse): boolean {
  try {
    const clientDir = path.join(process.cwd(), "dist", "client");
    const filePath = path.join(clientDir, pathname);

    // Security check - prevent directory traversal
    if (!filePath.startsWith(clientDir)) {
      return false;
    }

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath);
      const ext = path.extname(filePath);

      // Set appropriate content type
      const contentTypes: Record<string, string> = {
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".woff2": "font/woff2",
        ".woff": "font/woff",
      };

      const contentType = contentTypes[ext] || "application/octet-stream";
      res.setHeader("Content-Type", contentType);

      // Cache static assets
      if (ext === ".js" || ext === ".mjs" || ext === ".css") {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }

      res.send(content);
      return true;
    }
  } catch (error) {
    console.error("Error serving static file:", error);
  }
  return false;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const pathname = new URL(req.url || "/", "http://localhost").pathname;

    // Try to serve static files for known asset paths
    if (isStaticAsset(pathname)) {
      if (tryServeStaticFile(pathname, res)) {
        return;
      }
    }

    // For everything else, use the SSR handler
    const handler = await getServerHandler();

    // Build the full URL
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
    const url = new URL(req.url || "/", `${protocol}://${host}`);

    // Create a Request object
    const request = new Request(url, {
      method: req.method,
      headers: new Headers(req.headers as Record<string, string>),
      body: ["GET", "HEAD"].includes(req.method || "GET")
        ? undefined
        : JSON.stringify(req.body),
    });

    // Call the server handler
    const response = await handler.fetch(request, {}, {});

    // Set status and headers
    res.status(response.status);
    for (const [key, value] of response.headers.entries()) {
      res.setHeader(key, value);
    }

    // Send response body
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
