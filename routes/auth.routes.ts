// auth.routes.ts
import { Router } from "../deps.ts";
import { AuthController } from "../controllers/authController.ts";

// Define a blueprint for authentication routes
const authRouter = new Router();

authRouter
  .post("/signup", AuthController.signup)
  .post("/login", AuthController.login);

export default authRouter;
