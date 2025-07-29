import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import { apiKeyMiddleware } from "./lib/api-key-middleware"
import { completionRoutes } from "./routes/chat-completions/route"
import { embeddingRoutes } from "./routes/embeddings/route"
import { messageRoutes } from "./routes/messages/route"
import { modelRoutes } from "./routes/models/route"

export const server = new Hono()

server.use(logger())
server.use(cors({ origin: "*" }))

// API key middleware for all API endpoints except root
server.use("/*", apiKeyMiddleware)

server.get("/", (c) => c.text("Server running"))

server.route("/chat/completions", completionRoutes)
server.route("/models", modelRoutes)
server.route("/embeddings", embeddingRoutes)
server.route("/messages", messageRoutes)

// Compatibility with tools that expect v1/ prefix
server.route("/v1/chat/completions", completionRoutes)
server.route("/v1/models", modelRoutes)
server.route("/v1/embeddings", embeddingRoutes)
server.route("/v1/messages", messageRoutes)
