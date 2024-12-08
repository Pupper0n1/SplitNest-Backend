// routes/group.routes.ts
import { Router } from "../deps.ts";
import { GroupController } from "../controllers/groupController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const groupRouter = new Router();

// Apply auth middleware to all group routes
groupRouter.use(authMiddleware);

groupRouter
  .post("/", GroupController.create)
  .get("/", GroupController.getAll)
  .get("/:id", GroupController.getById)
  .put("/:id", GroupController.update)
  .delete("/:id", GroupController.delete)
  .post("/:id/members", GroupController.addMember) // Add member to group
  .delete("/:id/members/:userId", GroupController.removeMember); // Remove member from group

export default groupRouter;
