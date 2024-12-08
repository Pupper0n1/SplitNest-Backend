// controllers/transactionController.ts
import { Context, Status } from "../deps.ts";
import prisma from "../client.ts";

export class TransactionController {
  // Create a new transaction
  static async create(ctx: Context) {
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;

    try {
      const transaction = await prisma.transaction.create({
        data: {
          ...data,
          date: new Date(data.date),
        },
      });
      ctx.response.status = Status.Created;
      ctx.response.body = { message: "Transaction created", transaction };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Get transactions by billId
  static async getByBillId(ctx: Context) {
    const { billId } = ctx.params;

    const transactions = await prisma.transaction.findMany({
      where: { billId: Number(billId) },
    });

    ctx.response.status = Status.OK;
    ctx.response.body = transactions;
  }

  // Update a transaction
  static async update(ctx: Context) {
    const { billId, userId } = ctx.params;
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;

    try {
      const transaction = await prisma.transaction.update({
        where: {
          billId_userId: {
            billId: Number(billId),
            userId: Number(userId),
          },
        },
        data,
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Transaction updated", transaction };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Delete a transaction
  static async delete(ctx: Context) {
    const { billId, userId } = ctx.params;

    try {
      await prisma.transaction.delete({
        where: {
          billId_userId: {
            billId: Number(billId),
            userId: Number(userId),
          },
        },
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Transaction deleted" };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }
}
