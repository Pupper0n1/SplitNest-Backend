// controllers/userController.ts
import { Context, Status } from "../deps.ts";
import prisma from "../client.ts";
import { validate, required, isEmail } from "../deps.ts";

export class UserController {
  // Get all users
  static async getAll(ctx: Context) {
    const users = await prisma.user.findMany({
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNum: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    ctx.response.status = Status.OK;
    ctx.response.body = users;
  }

  // Get a single user by ID
  static async getById(ctx: Context) {
    const { id } = ctx.params;
    const user = await prisma.user.findUnique({
      where: { userId: Number(id) },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNum: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      ctx.throw(Status.NotFound, "User not found");
    }

    ctx.response.status = Status.OK;
    ctx.response.body = user;
  }
  static async getMe(ctx: Context) {
    const userId = ctx.state.user.userId;
    const user = await prisma.user.findUnique({
      where: { userId },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNum: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      ctx.throw(Status.NotFound, "User not found");
    }

    ctx.response.status = Status.OK;
    ctx.response.body = user;
  }
  // Update a user
  static async update(ctx: Context) {
    const { id } = ctx.params;
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;

    const [passes, errors] = await validate(data, {
      email: [isEmail],
    });

    if (!passes) {
      ctx.throw(Status.BadRequest, errors);
    }

    try {
      const user = await prisma.user.update({
        where: { userId: Number(id) },
        data,
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "User updated", user };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Delete a user
  static async delete(ctx: Context) {
    const { id } = ctx.params;

    try {
      await prisma.user.delete({
        where: { userId: Number(id) },
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "User deleted" };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  static async getSummary(ctx: Context) {
    const { userId } = ctx.params;
    const user = await prisma.user.findUnique({
      where: { userId: Number(userId) },
      select: { email: true },
    });

    if (!user) {
      ctx.throw(Status.NotFound, "User not found");
    }

    // Fetch all transactions related to this user
    const transactions = await prisma.transaction.findMany({
      where: { userId: Number(userId) },
      orderBy: { date: "desc" },
      take: 10,
      select: {
        billId: true,
        userId: true,
        payee: true,
        amountPerPerson: true,
        status: true,
        date: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    let totalOwe = 0;
    let totalOwedToUser = 0;

    for (const t of transactions) {
      if (t.payee === user.email) {
        // The user is the payee, so others owe this user
        totalOwedToUser += t.amountPerPerson;
      } else {
        // The user owes someone else
        totalOwe += t.amountPerPerson;
      }
    }

    ctx.response.status = Status.OK;
    ctx.response.body = {
      totalOwe,
      totalOwedToUser,
      recentTransactions: transactions,
    };
  }
}
