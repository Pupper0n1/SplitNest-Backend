import { env } from "../deps.ts";

export const jwtKey = await crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(env.JWT_SECRET),
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"]
);
