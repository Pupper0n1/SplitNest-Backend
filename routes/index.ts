import summaryRouter from "./summary.routes.ts";
import transactionRouter from "./transaction.routes.ts";
import groupRouter from "./group.routes.ts";
import billRouter from "./bill.routes.ts";
import { Router } from "../deps.ts";
import authRouter from "./auth.routes.ts";

const mainRouter = new Router();

mainRouter
  .use(
    "/api/transactions",
    transactionRouter.routes(),
    transactionRouter.allowedMethods()
  )
  .use("/api/groups", groupRouter.routes(), groupRouter.allowedMethods())
  .use("/api/bills", billRouter.routes(), billRouter.allowedMethods())
  .use("/api/users", summaryRouter.routes(), summaryRouter.allowedMethods())
  .use("/api/auth", authRouter.routes(), authRouter.allowedMethods());

export default mainRouter;
