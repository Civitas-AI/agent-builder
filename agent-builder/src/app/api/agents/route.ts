import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    // Get current session/user
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    const userId = session.user.id;
    const body = await request.json();
    
    // Extract data from the request body
    const { name, prompt, routeDetails } = body;
    
    // Validate required fields
    if (!name || !prompt) {
      return NextResponse.json(
        { message: 'Name and prompt are required fields' },
        { status: 400 }
      );
    }
    
    // Create the agent with user association
    const agent = await prisma.agent.create({
      data: {
        name,
        prompt,
        type: body.type,
        userId: userId, // Associate with current user
        routeDetails: {
          create: routeDetails.map((detail: any) => ({
            route: detail.route,
            prompt: detail.prompt,
          })),
        },
      },
      // Include the routeDetails in the response
      include: {
        routeDetails: true,
      },
    });
    
    return NextResponse.json({
      message: 'Agent created successfully',
      agent,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating agent:', error);
    
    return NextResponse.json(
      { message: 'Failed to create agent', error: (error as Error).message },
      { status: 500 }
    );
  }
}