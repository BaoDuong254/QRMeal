/**
 * API Proxy Route Handler
 * Proxies all requests to the backend Fastify server while keeping the backend URL hidden
 * This route handles all HTTP methods (GET, POST, PUT, DELETE, etc.)
 */

import { NextRequest, NextResponse } from "next/server";

// Backend URL - only accessible server-side
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4008";

/**
 * Forward headers from client to backend, excluding hop-by-hop headers
 */
function getForwardHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {};

  // Copy relevant headers, excluding hop-by-hop headers
  const headersToExclude = new Set([
    "host",
    "connection",
    "keep-alive",
    "transfer-encoding",
    "upgrade",
    "content-length",
  ]);

  request.headers.forEach((value, key) => {
    if (!headersToExclude.has(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  return headers;
}

/**
 * Generic handler for all HTTP methods
 */
async function handleRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const path = resolvedParams.path?.join("/") || "";

  // Build backend URL
  const url = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/${path}${url.search}`;

  try {
    // Forward request to backend
    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers: getForwardHeaders(request),
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.text() : undefined,
      // Disable redirect following to handle it manually
      redirect: "manual",
    });

    // Handle redirects
    if (backendResponse.status >= 300 && backendResponse.status < 400) {
      const location = backendResponse.headers.get("location");
      if (location) {
        return NextResponse.redirect(location, backendResponse.status);
      }
    }

    // Get response body
    const body = await backendResponse.arrayBuffer();

    // Forward response from backend to client
    const response = new NextResponse(body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
    });

    // Copy response headers, excluding hop-by-hop headers
    const headersToExclude = new Set(["connection", "keep-alive", "transfer-encoding", "upgrade", "content-encoding"]);

    backendResponse.headers.forEach((value, key) => {
      if (!headersToExclude.has(key.toLowerCase())) {
        response.headers.set(key, value);
      }
    });

    // Add CORS headers if needed
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        message: "Failed to connect to backend server",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 }
    );
  }
}

// Export handlers for all HTTP methods
export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const OPTIONS = handleRequest;
export const HEAD = handleRequest;
