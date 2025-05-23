import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Schema for request validation
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number()
    .int()
    .min(3, "Age must be at least 3 years")
    .max(12, "Age must be 12 years or less"),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    const validatedFields = profileSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { message: "Invalid request data", errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, age } = validatedFields.data;

    // Create profile in DB
    const profile = await db.profile.create({
      data: {
        name,
        age,
        type: 'autism', // Default type
        userId: session.user.id,
        preferences: JSON.stringify({}), // Convert empty JSON object to string for SQLite
      },
    });

    // Create initial progress items for the new profile
    await createInitialProgressItems(profile.id);

    return NextResponse.json(
      { message: "Profile created successfully", profile },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

async function createInitialProgressItems(profileId: string) {
  // Communication skills
  const communicationSkills = [
    { category: "communication", skill: "active_listening", level: 1, points: 0, description: "Actively paying attention to others" },
    { category: "communication", skill: "clear_expression", level: 1, points: 0, description: "Expressing thoughts and ideas clearly" },
    { category: "communication", skill: "question_asking", level: 1, points: 0, description: "Asking relevant and thoughtful questions" },
  ];

  // Social skills
  const socialSkills = [
    { category: "social", skill: "empathy", level: 1, points: 0, description: "Understanding others' feelings" },
    { category: "social", skill: "turn_taking", level: 1, points: 0, description: "Taking turns in conversation" },
    { category: "social", skill: "cooperation", level: 1, points: 0, description: "Working together with others" },
  ];

  // Problem-solving skills
  const problemSolvingSkills = [
    { category: "problem_solving", skill: "critical_thinking", level: 1, points: 0, description: "Analyzing information to solve problems" },
    { category: "problem_solving", skill: "creativity", level: 1, points: 0, description: "Finding creative solutions" },
    { category: "problem_solving", skill: "persistence", level: 1, points: 0, description: "Continuing to try despite challenges" },
  ];

  const allSkills = [...communicationSkills, ...socialSkills, ...problemSolvingSkills];

  // Create progress items for all skills
  for (const skill of allSkills) {
    await db.progressItem.create({
      data: {
        profileId,
        category: skill.category,
        skill: skill.skill,
        level: skill.level,
        points: skill.points,
        // description field doesn't exist in the ProgressItem model
      },
    });
  }
}
