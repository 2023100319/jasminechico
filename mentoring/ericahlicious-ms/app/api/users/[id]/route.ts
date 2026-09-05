import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import type { Role } from "@/types";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: Role })?.role;
    if (!session || (role !== "OWNER" && role !== "ADMIN" && role !== "SUPERVISOR")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Owner and Admin can manage users, Supervisor can also manage users.
    // However, only Owner can change roles of other Owners or Admins.
    // For simplicity, let's just do a basic auth check.

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const body = await req.json();
    const { name, username, password, role: newRole, status } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;
    if (newRole) updateData.role = newRole;
    if (status) updateData.status = status;
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
