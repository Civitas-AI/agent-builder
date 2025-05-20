import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";

// Type augmentation for NextAuth User and Session to include 'id'
declare module "next-auth" {
  interface User {
    id: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma), // Use Prisma for user, account, session, etc. storage

  providers: [
    CredentialsProvider({
      // The name to display on the sign-in form (e.g., "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign-in page.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials?.email || !credentials.password) {
          console.log("Missing credentials");
          return null; // Or throw an Error
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (user && user.password) { // Check if user exists and has a password set
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            // Any object returned will be saved in `user` property of the JWT and session
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
        }
        console.log("Invalid credentials for email:", credentials.email);
        return null; // If user not found or password doesn't match
      },
    }),
    // ...add more providers here as needed
  ],

  // Use JWT strategy for sessions
  session: {
    strategy: "jwt",
  },

  // Callbacks for JWT and Session handling
  callbacks: {
    async jwt({ token, user }) {
      // When a user signs in, add the user ID to the token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client from the token
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },

  // Custom pages
  pages: {
    signIn: "/login", // Custom login page path
  },

  // A secret to sign and encrypt tokens
  secret: process.env.AUTH_SECRET,
};

// For App Router (app/api/auth/[...nextauth]/route.ts):
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
