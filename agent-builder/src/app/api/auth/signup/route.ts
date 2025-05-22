import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod"; // You'll need to install: npm install zod

// Define validation schema
const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    // Return success response (exclude password)
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { error: "Failed to create user account" },
      { status: 500 }
    );
  }
} 