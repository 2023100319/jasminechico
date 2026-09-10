import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const transactions = await prisma.transaction.findMany({
      include: {
        generatedBy: {
          select: { name: true },
        },
      },
      orderBy: {
        generatedAt: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("[TRANSACTIONS_GET]", error);
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
    const { filename } = body;

    if (!filename) {
      return new NextResponse("Filename is required", { status: 400 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        filename,
        generatedById: parseInt(session.user.id ?? "0"),
      },
      include: {
        generatedBy: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("[TRANSACTIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
