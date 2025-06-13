import type { Context, Next } from "hono"

import { state } from "./state"

/**
 * Middleware to check for OpenAI-style API key in the Authorization header.
 * Returns 401 Unauthorized if the key is missing or invalid.
 */
export async function apiKeyMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("authorization")
  const expected = state.apiToken

  if (!expected) {
    return c.json(
      {
        error: {
          message: "Server misconfiguration: API key not set.",
          type: "invalid_request_error",
        },
      },
      500,
    )
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json(
      {
        error: {
          message: "Missing or invalid Authorization header.",
          type: "invalid_request_error",
        },
      },
      401,
    )
  }

  const token = authHeader.slice("Bearer ".length).trim()
  if (token !== expected) {
    return c.json(
      {
        error: {
          message: "Incorrect API key provided.",
          type: "invalid_request_error",
        },
      },
      401,
    )
  }

  await next()
}
