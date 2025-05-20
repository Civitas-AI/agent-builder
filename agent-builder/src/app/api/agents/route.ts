import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
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
    
    // Create the agent and its associated route details in a single transaction
    const agent = await prisma.agent.create({
      data: {
        name,
        prompt,
        routeDetails: {
          create: routeDetails.map((detail: { route: string; prompt: string }) => ({
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