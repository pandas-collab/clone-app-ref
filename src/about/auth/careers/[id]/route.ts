import { NextRequest, NextResponse } from 'next/server';

const mockCareers = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for a senior full stack developer...',
    requirements: ['5+ years experience', 'React/Node.js', 'TypeScript'],
    benefits: ['Health insurance', 'Remote work', '401k matching'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'Join our DevOps team to manage cloud infrastructure...',
    requirements: ['AWS/Azure experience', 'Kubernetes', 'CI/CD pipelines'],
    benefits: ['Health insurance', 'Stock options', 'Learning budget'],
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z'
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const career = mockCareers.find(c => c.id === params.id);

    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ career });
  } catch (error) {
    console.error('Get career error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const careerIndex = mockCareers.findIndex(c => c.id === params.id);

    if (careerIndex === -1) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    mockCareers[careerIndex] = {
      ...mockCareers[careerIndex],
      ...body,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      message: 'Career updated successfully',
      career: mockCareers[careerIndex]
    });
  } catch (error) {
    console.error('Update career error:', error);
    return NextResponse.json(
      { error: 'Failed to update career' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerIndex = mockCareers.findIndex(c => c.id === params.id);

    if (careerIndex === -1) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      );
    }

    mockCareers.splice(careerIndex, 1);

    return NextResponse.json({
      message: 'Career deleted successfully'
    });
  } catch (error) {
    console.error('Delete career error:', error);
    return NextResponse.json(
      { error: 'Failed to delete career' },
      { status: 500 }
    );
  }
}
