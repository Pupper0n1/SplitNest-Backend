// controllers/billController.ts
import { Context, Status } from "../deps.ts";
import prisma from "../client.ts";

export class BillController {
  // Create a new bill
  static async create(ctx: Context) {
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;
    const userId = ctx.state.user.userId; // From auth middleware

    try {
      const bill = await prisma.bill.create({
        data: {
          ...data,
          userId,
          date: new Date(data.date),
        },
      });
      ctx.response.status = Status.Created;
      ctx.response.body = { message: "Bill created", bill };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Get all bills for the authenticated user
  static async getAll(ctx: Context) {
    const userId = ctx.state.user.userId;

    const bills = await prisma.bill.findMany({
      where: { userId },
      include: {
        items: true,
        transactions: true,
        assignedUsers: true,
      },
    });

    ctx.response.status = Status.OK;
    ctx.response.body = bills;
  }

  // Get a bill by ID
  static async getById(ctx: Context) {
    const { id } = ctx.params;

    const bill = await prisma.bill.findUnique({
      where: { billId: Number(id) },
      include: {
        items: true,
        transactions: true,
        assignedUsers: true,
      },
    });

    if (!bill) {
      ctx.throw(Status.NotFound, "Bill not found");
    }

    ctx.response.status = Status.OK;
    ctx.response.body = bill;
  }

  // Update a bill
  static async update(ctx: Context) {
    const { id } = ctx.params;
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;

    try {
      const bill = await prisma.bill.update({
        where: { billId: Number(id) },
        data,
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Bill updated", bill };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Delete a bill
  static async delete(ctx: Context) {
    const { id } = ctx.params;

    try {
      await prisma.bill.delete({
        where: { billId: Number(id) },
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Bill deleted" };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Assign users to a bill
  static async assignUsers(ctx: Context) {
    const { id } = ctx.params; // billId
    const body = ctx.request.body({ type: "json" });
    const { userIds } = await body.value; // Array of userIds

    try {
      const assignments = await Promise.all(
        userIds.map((userId: number) =>
          prisma.billAssignee.create({
            data: {
              billId: Number(id),
              userId,
            },
          })
        )
      );
      ctx.response.status = Status.Created;
      ctx.response.body = { message: "Users assigned to bill", assignments };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }
}
