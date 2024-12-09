// middleware/authMiddleware.ts
import { Context, Status, verify } from "../deps.ts";
import prisma from "../client.ts";
import { env } from "../deps.ts";
import { jwtKey } from "../utils/jwtkey.ts";

export async function authMiddleware(
  ctx: Context,
  next: () => Promise<unknown>
) {
  console.log("JWT_SECRET in AuthMiddleware:", env.JWT_SECRET);

  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader) {
    ctx.throw(Status.Unauthorized, "Authorization header is missing");
  }

  const token = authHeader.replace("Bearer ", "");
  console.log("Token in AuthMiddleware:", token);

  try {
    const payload = await verify(token, jwtKey);
    console.log("Payload in AuthMiddleware:", payload);

    // Attach user to context
    ctx.state.user = await prisma.user.findUnique({
      where: { userId: payload.userId as number },
    });

    if (!ctx.state.user) {
      ctx.throw(Status.Unauthorized, "User not found");
    }

    await next();
  } catch (err) {
    console.error(err);
    ctx.throw(Status.Unauthorized, "Invalid token");
  }
}
