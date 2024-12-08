import { Application } from "./deps.ts";
import router from "./routes.ts";
import { env, oakCors } from "./deps.ts";
import { logger } from "./middleware/loggerMiddleware.ts";

const HOST = env.LOCAL_HOST || "127.0.0.1"; // Default to localhost if not provided
const PORT = parseInt(env.LOCAL_PORT || "8000", 10); // Default to port 8000 if not provided

const app = new Application();

// Middleware to handle errors
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Internal Server Error" };
  }
});

// Use the router
app.use(oakCors()); // Enable CORS if needed
app.use(logger); // Log requests, payloads, and responses
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server is running on http://${HOST}:${PORT}`);
await app.listen({ hostname: HOST, port: PORT });
