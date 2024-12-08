// routes/bill.routes.ts
import { Router } from "../deps.ts";
import { BillController } from "../controllers/billController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const billRouter = new Router();

// Apply auth middleware to all bill routes
billRouter.use(authMiddleware);

billRouter
  .post("/", BillController.create)
  .get("/", BillController.getAll)
  .get("/:id", BillController.getById)
  .put("/:id", BillController.update)
  .delete("/:id", BillController.delete)
  .post("/:id/assign", BillController.assignUsers); // Assign users to a bill

export default billRouter;
