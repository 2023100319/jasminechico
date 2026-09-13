import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam);
    if (isNaN(id)) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const body = await req.json();
    const { name, price, categoryId, imageUrl, isArchived, ingredients } = body;

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (categoryId) updateData.categoryId = parseInt(categoryId);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isArchived !== undefined) updateData.isArchived = isArchived;

    // Handle ingredients update (delete all and recreate for simplicity)
    if (ingredients) {
      await prisma.menuIngredient.deleteMany({
        where: { menuItemId: id },
      });
      updateData.ingredients = {
        create: ingredients.map((ing: { name: string }) => ({ name: ing.name })),
      };
    }

    const menuItem = await prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        ingredients: true,
      },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("[MENU_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const { id: idParam } = await params;
        const id = parseInt(idParam);
        if (isNaN(id)) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        const menuItem = await prisma.menuItem.delete({
            where: { id }
        });

        return NextResponse.json(menuItem);
    } catch (error) {
        console.error("[MENU_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
