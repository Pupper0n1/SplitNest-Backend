// routes/user.routes.ts
import { Router } from "../deps.ts";
import { UserController } from "../controllers/userController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const userRouter = new Router();

userRouter.prefix("/users");

// Apply auth middleware to all user routes
userRouter.use(authMiddleware);

userRouter
  .get("/", UserController.getAll)
  .get("/:id", UserController.getById)
  .get("/:userId/summary", UserController.getSummary)
  .put("/:id", UserController.update)
  .get("/me", UserController.getMe)
  .delete("/:id", UserController.delete);

export default userRouter;
