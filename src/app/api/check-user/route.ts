import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    // Get email from request body
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required", exists: false },
        { status: 400 }
      );
    }

    // Log for debugging
    console.log(`Checking if user exists with email: ${email}`);

    // Check if user exists in database
    const user = await db.user.findUnique({
      where: { email },
      select: { id: true }, // Only fetch the ID to verify existence
    });

    console.log(`User exists: ${!!user}`);

    // Return result
    return NextResponse.json(
      { exists: !!user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { message: "Error checking user", exists: false },
      { status: 500 }
    );
  }
}
