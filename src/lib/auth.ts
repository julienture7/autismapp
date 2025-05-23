import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: true,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Debug: Missing credentials");
          return null;
        }

        try {
          console.log(`Debug: Searching for user with email: ${credentials.email}`);

          const user = await db.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          console.log("Debug: User found:", user ? "Yes" : "No");

          if (!user || !user.password) {
            console.log("Debug: User not found or missing password");
            return null;
          }

          console.log("Debug: Comparing passwords");
          const isPasswordValid = await compare(credentials.password, user.password);
          console.log("Debug: Password valid:", isPasswordValid);

          if (!isPasswordValid) {
            console.log("Debug: Password invalid");
            return null;
          }

          console.log("Debug: Authentication successful");
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Debug: Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      console.log("Debug: Session callback", { tokenExists: !!token });
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      console.log("Debug: JWT callback", {
        userExists: !!user,
        accountExists: !!account,
        tokenEmail: token?.email
      });

      // Initial sign in
      if (user) {
        console.log("Debug: Initial sign in, returning user data in token");
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }

      // For subsequent requests, try to get the user from the database
      try {
        console.log("Debug: Looking up user in database for token refresh");
        const dbUser = await db.user.findFirst({
          where: {
            email: token.email,
          },
        });

        console.log("Debug: Database user found for token:", !!dbUser);

        if (!dbUser) {
          return token;
        }

        return {
          ...token,
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
        };
      } catch (error) {
        console.error("Debug: Error in JWT callback:", error);
        return token;
      }
    },
  },
};
