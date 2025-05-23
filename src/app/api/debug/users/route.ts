import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// This is a development-only endpoint and should be removed in production
export async function GET(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { message: "This endpoint is only available in development mode" },
      { status: 403 }
    );
  }

  try {
    // Get all users (excluding passwords)
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users", error: String(error) },
      { status: 500 }
    );
  }
}
