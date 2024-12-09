import { Router } from "../deps.ts";
import { SummaryController } from "../controllers/summaryController.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";

const summaryRouter = new Router();

// Apply auth middleware
summaryRouter.use(authMiddleware);

// Define summary routes
summaryRouter
  .get("/:userId/summary", SummaryController.getUserSummary) // Get user summary
  .post("/:userId/summary", SummaryController.setUserSummary); // Set or update summary

export default summaryRouter;
