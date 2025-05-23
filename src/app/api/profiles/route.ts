import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const profiles = await db.profile.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ profiles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching profiles" },
      { status: 500 }
    );
  }
}
