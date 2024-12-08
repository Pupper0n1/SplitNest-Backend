// controllers/itemController.ts
import { Context, Status } from "../deps.ts";
import prisma from "../client.ts";

export class ItemController {
  // Create a new item
  static async create(ctx: Context) {
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;

    try {
      const item = await prisma.item.create({
        data: {
          ...data,
          date: new Date(data.date),
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        },
      });
      ctx.response.status = Status.Created;
      ctx.response.body = { message: "Item created", item };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Get items by billId
  static async getByBillId(ctx: Context) {
    const { billId } = ctx.params;

    const items = await prisma.item.findMany({
      where: { billId: Number(billId) },
    });

    ctx.response.status = Status.OK;
    ctx.response.body = items;
  }

  // Update an item
  static async update(ctx: Context) {
    const { id } = ctx.params;
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;

    try {
      const item = await prisma.item.update({
        where: { id: Number(id) },
        data,
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Item updated", item };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Delete an item
  static async delete(ctx: Context) {
    const { id } = ctx.params;

    try {
      await prisma.item.delete({
        where: { id: Number(id) },
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Item deleted" };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }
}
