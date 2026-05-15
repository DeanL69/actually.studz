import { VercelRequest, VercelResponse } from "@vercel/node";

// Import the server handler
import server from "../dist/server/index.js";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    // Convert Vercel request to a standard Request object
    const url = new URL(
      req.url || "/",
      `http://${req.headers.host || "localhost"}`
    );

    const request = new Request(url, {
      method: req.method,
      headers: req.headers as HeadersInit,
      body:
        req.method !== "GET" && req.method !== "HEAD" && req.body
          ? JSON.stringify(req.body)
          : undefined,
    });

    // Handle the request with the server
    const response = await server.fetch(request, {}, {});

    // Set response status and headers
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send the response body
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
