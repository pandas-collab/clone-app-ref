import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return mock services data
    const services = [
      { id: 1, title: 'Cloud Platforms', description: 'Cloud solutions' },
      { id: 2, title: 'Data & Analytics', description: 'Data insights' },
    ];

    return NextResponse.json(services);
  } catch (error) {
    console.error('Services API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json(
      { message: 'Service created successfully', data: body },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
