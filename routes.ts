// routes.ts
import { Router } from "./deps.ts";
import authRouter from "./routes/auth.routes.ts";
import userRouter from "./routes/user.routes.ts";
import groupRouter from "./routes/group.routes.ts";
import billRouter from "./routes/bill.routes.ts";
import transactionRouter from "./routes/transaction.routes.ts";
import itemRouter from "./routes/item.routes.ts";

const router = new Router();

// Register the routers
router.use("/auth", authRouter.routes(), authRouter.allowedMethods());
router.use("/users", userRouter.routes(), userRouter.allowedMethods());
router.use("/groups", groupRouter.routes(), groupRouter.allowedMethods());
router.use("/bills", billRouter.routes(), billRouter.allowedMethods());
router.use(
  "/transactions",
  transactionRouter.routes(),
  transactionRouter.allowedMethods()
);
router.use("/items", itemRouter.routes(), itemRouter.allowedMethods());

export default router;
