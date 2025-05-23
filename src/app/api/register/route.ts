import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { z } from "zod";
import { db } from "@/lib/db";

// Schema for request validation
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedFields = userSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user in DB
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove password from response
    const { password: _, ...result } = user;

    return NextResponse.json(
      { message: "User created successfully", user: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
