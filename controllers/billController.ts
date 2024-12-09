import { Context, Status } from "../deps.ts";
import prisma from "../client.ts";

export class BillController {
  // Create a new bill
  static async create(ctx: Context) {
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;
    const userId = ctx.state.user.userId; // From auth middleware

    if (!data.title || !data.amount || !data.date) {
      ctx.throw(Status.BadRequest, "Title, amount, and date are required.");
    }

    try {
      const bill = await prisma.bill.create({
        data: {
          title: data.title,
          description: data.description || null,
          amount: data.amount,
          location: data.location || null,
          date: new Date(data.date),
          updatedAt: new Date(),
          User: {
            connect: { userId }, // Connect the bill to the authenticated user
          },
        },
      });

      ctx.response.status = Status.Created;
      ctx.response.body = { message: "Bill created", bill };
    } catch (error) {
      console.error("Error creating bill:", error);
      ctx.throw(Status.BadRequest, "Failed to create bill.");
    }
  }

  // Get all bills for the authenticated user
  static async getAll(ctx: Context) {
    const userId = ctx.state.user.userId;
    const page = Number(ctx.request.url.searchParams.get("page")) || 1;
    const limit = Number(ctx.request.url.searchParams.get("limit")) || 10;

    try {
      const bills = await prisma.bill.findMany({
        where: { userId },
        include: {
          Item: true,
          Transaction: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: "desc" },
      });

      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Bills retrieved successfully", bills };
    } catch (error) {
      console.error("Error fetching bills:", error);
      ctx.throw(Status.BadRequest, "Failed to fetch bills.");
    }
  }

  // Get a bill by ID
  static async getById(ctx: Context) {
    const id = Number(ctx.params.id);

    if (!id) {
      ctx.throw(Status.BadRequest, "Bill ID is required.");
    }

    try {
      const bill = await prisma.bill.findUnique({
        where: { billId: id },
        include: {
          Item: true,
          Transaction: true,
          BillAssignee: true,
        },
      });

      if (!bill) {
        ctx.throw(Status.NotFound, "Bill not found.");
      }

      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Bill retrieved successfully", bill };
    } catch (error) {
      console.error("Error fetching bill:", error);
      ctx.throw(Status.BadRequest, "Failed to fetch bill.");
    }
  }

  // Update a bill
  static async update(ctx: Context) {
    const id = Number(ctx.params.id);

    if (!id) {
      ctx.throw(Status.BadRequest, "Bill ID is required.");
    }

    const body = ctx.request.body({ type: "json" });
    const data = await body.value;

    try {
      const existingBill = await prisma.bill.findUnique({
        where: { billId: id },
      });

      if (!existingBill) {
        ctx.throw(Status.NotFound, "Bill not found.");
      }

      const bill = await prisma.bill.update({
        where: { billId: id },
        data: {
          ...(data.title && { title: data.title }),
          ...(data.amount && { amount: data.amount }),
          ...(data.description && { description: data.description }),
          ...(data.location && { location: data.location }),
          ...(data.date && { date: new Date(data.date) }),
        },
      });

      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Bill updated successfully", bill };
    } catch (error) {
      console.error("Error updating bill:", error);
      ctx.throw(Status.BadRequest, "Failed to update bill.");
    }
  }

  // Delete a bill
  static async delete(ctx: Context) {
    const id = Number(ctx.params.id);

    if (!id) {
      ctx.throw(Status.BadRequest, "Bill ID is required.");
    }

    try {
      const existingBill = await prisma.bill.findUnique({
        where: { billId: id },
      });

      if (!existingBill) {
        ctx.throw(Status.NotFound, "Bill not found.");
      }

      await prisma.bill.delete({ where: { billId: id } });

      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Bill deleted successfully" };
    } catch (error) {
      console.error("Error deleting bill:", error);
      ctx.throw(Status.BadRequest, "Failed to delete bill.");
    }
  }

  // Assign users to a bill
  static async assignUsers(ctx: Context) {
    const id = Number(ctx.params.id);
    const body = ctx.request.body({ type: "json" });
    const { userIds }: { userIds: number[] } = await body.value;

    if (!id || !userIds || userIds.length === 0) {
      ctx.throw(Status.BadRequest, "Bill ID and user IDs are required.");
    }

    try {
      const uniqueUserIds = [...new Set(userIds)];

      // Prevent duplicate assignments
      const existingAssignments = await prisma.billAssignee.findMany({
        where: { billId: id, userId: { in: uniqueUserIds } },
      });

      const newAssignments = uniqueUserIds.filter(
        (userId) =>
          !existingAssignments.some(
            (assignment) => assignment.userId === userId
          )
      );

      const assignments = await Promise.all(
        newAssignments.map((userId) =>
          prisma.billAssignee.create({
            data: { billId: id, userId },
          })
        )
      );

      ctx.response.status = Status.Created;
      ctx.response.body = { message: "Users assigned to bill", assignments };
    } catch (error) {
      console.error("Error assigning users to bill:", error);
      ctx.throw(Status.BadRequest, "Failed to assign users to bill.");
    }
  }
}
