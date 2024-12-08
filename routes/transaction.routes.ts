// routes/transaction.routes.ts
import { Router } from "../deps.ts";
import { TransactionController } from "../controllers/transactionController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const transactionRouter = new Router();

// Apply auth middleware to all transaction routes
transactionRouter.use(authMiddleware);

transactionRouter
  .post("/", TransactionController.create)
  .get("/bill/:billId", TransactionController.getByBillId)
  .put("/bill/:billId/user/:userId", TransactionController.update)
  .delete("/bill/:billId/user/:userId", TransactionController.delete);

export default transactionRouter;
