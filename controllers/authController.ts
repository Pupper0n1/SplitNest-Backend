// controllers/authController.ts
import { Context, env } from "../deps.ts";
import prisma from "../client.ts";
import { hash, compare } from "../deps.ts";
import { create } from "../deps.ts";
import { validate, required, isEmail } from "../deps.ts";
import { jwtKey } from "../utils/jwtkey.ts";

export class AuthController {
  static async signup(ctx: Context) {
    const body = ctx.request.body({ type: "json" });
    const { firstName, lastName, email, password, phoneNum } = await body.value;

    // Validation for required fields only
    const [passes, errors] = await validate(
      { email, password, firstName, lastName },
      {
        email: [required, isEmail],
        password: required,
        firstName: required,
        lastName: required,
      }
    );

    if (!passes) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Invalid data. Please provide all required fields.",
        errors,
      };
      return;
    }

    const hashedPassword = await hash(password);

    try {
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          hashedPassword,
          phoneNum: phoneNum || null,
        },
      });

      // Generate JWT token
      const jwt = await create(
        { alg: "HS512", typ: "JWT" },
        { userId: user.userId, email: user.email },
        jwtKey
      );

      ctx.response.status = 201;
      ctx.response.body = {
        message: "User created successfully",
        user: {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token: jwt,
      };
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        // Handle unique constraint error for email
        ctx.response.status = 400;
        ctx.response.body = {
          message: "User already exists with this email",
          user: {
            firstName,
            lastName,
            email,
            phoneNum: phoneNum || null,
          },
        };
      } else {
        // Handle other errors
        ctx.response.status = 400;
        ctx.response.body = {
          message: "User creation failed",
          error: error.message,
        };
      }
    }
  }

  static async login(ctx: Context) {
    const body = ctx.request.body({ type: "json" });
    const { email, password } = await body.value;
    console.log("Login request received:", { email });

    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log("User not found");
        ctx.response.status = 401;
        ctx.response.body = { message: "Invalid email or password" };
        return;
      }

      // Check if password matches
      const isPasswordValid = await compare(password, user.hashedPassword);
      if (!isPasswordValid) {
        console.log("Invalid password");
        ctx.response.status = 401;
        ctx.response.body = { message: "Invalid email or password" };
        return;
      }

      console.log("Password is valid");

      // Generate JWT token
      const jwt = await create(
        { alg: "HS512", typ: "JWT" },
        { userId: user.userId, email: user.email },
        jwtKey
      );

      ctx.response.status = 200;
      ctx.response.body = {
        message: "Login successful",
        user: {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
        token: jwt,
      };
    } catch (error) {
      console.error("Error during login:", error);
      ctx.response.status = 500;
      ctx.response.body = {
        message: "An error occurred during login",
        error: error.message,
      };
    }
  }
}
