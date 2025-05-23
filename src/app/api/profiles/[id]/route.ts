import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // In Next.js 14+, params should be destructured directly
    const { id } = params;

    // Get the profile with related data
    const profile = await db.profile.findFirst({
      where: {
        id,
        userId: session.user.id, // Ensure the profile belongs to the logged-in user
      },
      include: {
        progressItems: true,
        achievements: true,
        chatSessions: {
          orderBy: {
            startedAt: "desc",
          },
          take: 5, // Get only the 5 most recent sessions
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile not found or you don't have permission to view it" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching the profile" },
      { status: 500 }
    );
  }
}
