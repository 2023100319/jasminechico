import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import type { Role } from "@/types";

export async function GET(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: Role })?.role;
    if (!session || (role !== "OWNER" && role !== "ADMIN" && role !== "SUPERVISOR")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ACTIVE";

    const users = await prisma.user.findMany({
      where: {
        status: status as any,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        status: true,
        lastActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: Role })?.role;
    if (!session || (role !== "OWNER" && role !== "ADMIN" && role !== "SUPERVISOR")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, username, password, role: newRole } = body;

    if (!name || !username || !password || !newRole) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return new NextResponse("Username already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: newRole,
      },
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
    console.error("[USERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
