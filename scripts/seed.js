// scripts/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.progressItem.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('Deleted existing data');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    },
  });

  console.log(`Created demo user: ${user.email}`);

  // Create profiles
  const profiles = await Promise.all([
    prisma.profile.create({
      data: {
        userId: user.id,
        name: 'Alex',
        age: 8,
        type: 'autism',
        interests: 'Space, dinosaurs, trains',
        preferences: 'Needs clear instructions, prefers visual aids',
      },
    }),
    prisma.profile.create({
      data: {
        userId: user.id,
        name: 'Jamie',
        age: 10,
        type: 'adhd',
        interests: 'Sports, video games, art',
        preferences: 'Needs frequent breaks, prefers interactive activities',
      },
    }),
    prisma.profile.create({
      data: {
        userId: user.id,
        name: 'Sam',
        age: 7,
        type: 'social_skills',
        interests: 'Music, animals, reading',
        preferences: 'Enjoys role-playing, needs practice with turn-taking',
      },
    }),
  ]);

  console.log(`Created ${profiles.length} profiles`);

  // Create chat sessions
  for (const profile of profiles) {
    const chatSession = await prisma.chatSession.create({
      data: {
        userId: user.id,
        profileId: profile.id,
        topicFocus: ['communication', 'social', 'problem_solving'][Math.floor(Math.random() * 3)],
      },
    });

    // Create sample chat messages
    const messages = [
      { role: 'user', content: 'Hello! How are you today?' },
      { role: 'assistant', content: `Hi ${profile.name}! I'm doing great. I'm here to chat with you. What would you like to talk about today?` },
      { role: 'user', content: 'I want to talk about my day at school.' },
      { role: 'assistant', content: `That sounds interesting! What happened at school today, ${profile.name}?` },
    ];

    for (const message of messages) {
      await prisma.chatMessage.create({
        data: {
          sessionId: chatSession.id,
          content: message.content,
          role: message.role,
        },
      });
    }

    console.log(`Created chat session with ${messages.length} messages for ${profile.name}`);

    // Create progress items
    const skills = [
      { category: 'communication', skill: 'turn_taking', level: 2 },
      { category: 'social', skill: 'expressing_emotions', level: 1 },
      { category: 'problem_solving', skill: 'following_instructions', level: 3 },
    ];

    for (const skill of skills) {
      await prisma.progressItem.create({
        data: {
          profileId: profile.id,
          category: skill.category,
          skill: skill.skill,
          level: skill.level,
          points: skill.level * 100,
        },
      });
    }

    console.log(`Created ${skills.length} progress items for ${profile.name}`);

    // Create achievements
    const achievements = [
      {
        title: 'First Chat',
        description: 'Completed your first chat session!',
        category: 'communication',
        icon: 'chat'
      },
      {
        title: 'Sharing Feelings',
        description: 'Practiced sharing your feelings in conversation',
        category: 'social',
        icon: 'heart'
      },
    ];

    for (const achievement of achievements) {
      await prisma.achievement.create({
        data: {
          profileId: profile.id,
          title: achievement.title,
          description: achievement.description,
          category: achievement.category,
          icon: achievement.icon,
        },
      });
    }

    console.log(`Created ${achievements.length} achievements for ${profile.name}`);
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
