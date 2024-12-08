// routes/item.routes.ts
import { Router } from "../deps.ts";
import { ItemController } from "../controllers/itemController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const itemRouter = new Router();

// Apply auth middleware to all item routes
itemRouter.use(authMiddleware);

itemRouter
  .post("/", ItemController.create)
  .get("/bill/:billId", ItemController.getByBillId)
  .put("/:id", ItemController.update)
  .delete("/:id", ItemController.delete);

export default itemRouter;
