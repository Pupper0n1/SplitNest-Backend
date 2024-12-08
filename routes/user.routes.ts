// routes/user.routes.ts
import { Router } from "../deps.ts";
import { UserController } from "../controllers/userController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const userRouter = new Router();

// Apply auth middleware to all user routes
userRouter.use(authMiddleware);

userRouter
  .get("/", UserController.getAll)
  .get("/:id", UserController.getById)
  .put("/:id", UserController.update)
  .delete("/:id", UserController.delete);

export default userRouter;
