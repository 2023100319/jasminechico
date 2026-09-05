import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const categories = await prisma.menuCategory.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[MENU_CATEGORIES_GET]", error);
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
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const category = await prisma.menuCategory.create({
      data: { name },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[MENU_CATEGORIES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
