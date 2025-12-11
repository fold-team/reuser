import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const testUser = await prisma.testUser.update({
      where: { id },
      data: {
        isCheckedOut: false,
        checkedOutBy: { disconnect: true },
        checkedOutAt: undefined,
      },
    });

    return NextResponse.json(testUser);
  } catch (error) {
    console.error("Error checking in test user:", error);
    return NextResponse.json(
      { error: "Failed to check in test user" },
      { status: 500 },
    );
  }
}
