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
    const isArchived = searchParams.get("isArchived");

    const whereClause: Record<string, unknown> = {};
    if (categoryId) whereClause.categoryId = parseInt(categoryId);
    if (isArchived !== null) whereClause.isArchived = isArchived === "true";

    const menuItems = await prisma.menuItem.findMany({
      where: whereClause,
      include: {
        category: true,
        ingredients: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error("[MENU_GET]", error);
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
    const { name, price, categoryId, imageUrl, ingredients } = body;

    if (!name || price === undefined || !categoryId) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        price,
        categoryId: parseInt(categoryId),
        imageUrl,
        ingredients: ingredients ? {
          create: ingredients.map((ing: { name: string }) => ({ name: ing.name }))
        } : undefined,
      },
      include: {
        category: true,
        ingredients: true,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("[MENU_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
