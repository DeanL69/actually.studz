import type { VercelRequest, VercelResponse } from "@vercel/node";

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

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
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
