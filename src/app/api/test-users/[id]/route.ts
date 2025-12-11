import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { firstName, lastName, email, password, description } =
      await request.json();

    const testUser = await prisma.testUser.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        password,
        description,
      },
    });
    return NextResponse.json(testUser);
  } catch (error) {
    console.error("Error updating test user:", error);
    return NextResponse.json(
      { error: "Failed to update test user" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.testUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting test user:", error);
    return NextResponse.json(
      { error: "Failed to delete test user" },
      { status: 500 },
    );
  }
}
