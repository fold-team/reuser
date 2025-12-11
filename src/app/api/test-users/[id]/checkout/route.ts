import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        organizationId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const testUser = await prisma.testUser.update({
      where: { id },
      data: {
        isCheckedOut: true,
        checkedOutBy: { connect: { id: user.id } },
        checkedOutAt: new Date(),
      },
    });

    return NextResponse.json(testUser);
  } catch (error) {
    console.error("Error checking out test user:", error);
    return NextResponse.json(
      { error: "Failed to checkout test user" },
      { status: 500 },
    );
  }
}
