import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");

    const whereClause: any = {};
    if (categoryId) whereClause.categoryId = parseInt(categoryId);

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: whereClause,
      include: {
        category: true,
        updatedBy: {
          select: { name: true },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(inventoryItems);
  } catch (error) {
    console.error("[INVENTORY_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, stock, supplier, expiry, status, categoryId } = body;

    if (!name || !stock || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        name,
        stock,
        supplier,
        expiry: expiry ? new Date(expiry) : null,
        status: status || "GOOD",
        categoryId: parseInt(categoryId),
        updatedById: parseInt(session.user.id),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(inventoryItem);
  } catch (error) {
    console.error("[INVENTORY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
