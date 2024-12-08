// middleware/authMiddleware.ts
import { Context, Status, verify } from "../deps.ts";
import prisma from "../client.ts";
import { env } from "../deps.ts";

const jwtKey = env.JWT_SECRET;
export async function authMiddleware(
  ctx: Context,
  next: () => Promise<unknown>
) {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader) {
    ctx.throw(Status.Unauthorized, "Authorization header is missing");
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = await verify(token, jwtKey, "HS512");

    // Attach user to context
    ctx.state.user = await prisma.user.findUnique({
      where: { userId: payload.id },
    });

    if (!ctx.state.user) {
      ctx.throw(Status.Unauthorized, "User not found");
    }

    await next();
  } catch (err) {
    ctx.throw(Status.Unauthorized, "Invalid token");
  }
}
