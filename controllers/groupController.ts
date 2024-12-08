// controllers/groupController.ts
import { Context, Status } from "../deps.ts";
import prisma from "../client.ts";

export class GroupController {
  // Create a new group
  static async create(ctx: Context) {
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;

    // You can add validation if needed

    try {
      const group = await prisma.group.create({
        data,
      });
      ctx.response.status = Status.Created;
      ctx.response.body = { message: "Group created", group };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Get all groups
  static async getAll(ctx: Context) {
    const groups = await prisma.group.findMany();
    ctx.response.status = Status.OK;
    ctx.response.body = groups;
  }

  // Get a group by ID
  static async getById(ctx: Context) {
    const { id } = ctx.params;
    const group = await prisma.group.findUnique({
      where: { groupId: Number(id) },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!group) {
      ctx.throw(Status.NotFound, "Group not found");
    }

    ctx.response.status = Status.OK;
    ctx.response.body = group;
  }

  // Update a group
  static async update(ctx: Context) {
    const { id } = ctx.params;
    const body = ctx.request.body({ type: "json" });
    const data = await body.value;

    try {
      const group = await prisma.group.update({
        where: { groupId: Number(id) },
        data,
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Group updated", group };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Delete a group
  static async delete(ctx: Context) {
    const { id } = ctx.params;

    try {
      await prisma.group.delete({
        where: { groupId: Number(id) },
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Group deleted" };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Add a member to a group
  static async addMember(ctx: Context) {
    const { id } = ctx.params; // groupId
    const body = ctx.request.body({ type: "json" });
    const { userId } = await body.value;

    try {
      const groupMember = await prisma.groupMember.create({
        data: {
          groupId: Number(id),
          userId,
        },
      });
      ctx.response.status = Status.Created;
      ctx.response.body = { message: "Member added to group", groupMember };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }

  // Remove a member from a group
  static async removeMember(ctx: Context) {
    const { id, userId } = ctx.params; // groupId and userId

    try {
      await prisma.groupMember.deleteMany({
        where: {
          groupId: Number(id),
          userId: Number(userId),
        },
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { message: "Member removed from group" };
    } catch (error) {
      ctx.throw(Status.BadRequest, error.message);
    }
  }
}
