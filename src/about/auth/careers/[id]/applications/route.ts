import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerId = params.id;

    if (!careerId) {
      return NextResponse.json(
        { error: 'Career ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, resume, coverLetter } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create application record
    const application = {
      id: Date.now().toString(),
      careerId,
      name,
      email,
      resume,
      coverLetter,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Application submitted successfully',
      application
    }, { status: 201 });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerId = params.id;

    if (!careerId) {
      return NextResponse.json(
        { error: 'Career ID is required' },
        { status: 400 }
      );
    }

    // Mock applications data
    const applications = [
      {
        id: '1',
        careerId,
        name: 'John Doe',
        email: 'john@example.com',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({ applications });

  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
