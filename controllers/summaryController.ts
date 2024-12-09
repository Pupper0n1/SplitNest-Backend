import { Context, Status } from "../deps.ts";
import prisma from "../client.ts";
import { create } from "djwt";

export class SummaryController {
  // Get summary for a user
  static async getUserSummary(ctx: Context) {
    const { userId } = ctx.params;

    try {
      // Fetch recent transactions
      const recentTransactions = await prisma.transaction.findMany({
        where: { userId: Number(userId) },
        orderBy: { date: "desc" },
        take: 10,
      });

      // Calculate total amounts
      let totalOwe = 0;
      let totalOwedToUser = 0;

      for (const txn of recentTransactions) {
        if (txn.status === "PENDING") {
          totalOwe += txn.amountPerPerson;
        }
        if (txn.status === "COMPLETED") {
          totalOwedToUser += txn.amountPerPerson;
        }
      }

      ctx.response.status = Status.OK;
      ctx.response.body = {
        totalOwe,
        totalOwedToUser,
        recentTransactions,
      };
    } catch (error) {
      ctx.throw(Status.InternalServerError, error.message);
    }
  }

  // Set or update a transaction summary
  static async setUserSummary(ctx: Context) {
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;

    try {
      // Validate payload
      if (!data.userId || !Array.isArray(data.transactions)) {
        ctx.throw(Status.BadRequest, "Invalid data format");
      }

      // Create or update transactions in bulk
      const transactions = await Promise.all(
        data.transactions.map(async (txn: any) => {
          return await prisma.transaction.upsert({
            where: {
              billId_userId: {
                billId: txn.billId,
                userId: data.userId,
              },
            },
            update: {
              ...txn,
              updatedAt: new Date(),
            },
            create: {
              ...txn,
              userId: data.userId,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          });
        })
      );

      ctx.response.status = Status.Created;
      ctx.response.body = {
        message: "User summary updated",
        transactions,
      };
    } catch (error) {
      ctx.throw(Status.InternalServerError, error.message);
    }
  }
}
