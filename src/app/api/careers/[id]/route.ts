import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const career = await prisma.career.findUnique({
      where: { id: params.id },
      include: {
        applications: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    if (!career) {
      return NextResponse.json(
        { error: 'Career position not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ career });
  } catch (error) {
    console.error('Career fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch career position' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, requirements, location, type, salary, published } = body;

    const career = await prisma.career.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(requirements && { requirements }),
        ...(location && { location }),
        ...(type && { type }),
        ...(salary && { salary }),
        ...(published !== undefined && { published })
      }
    });

    return NextResponse.json({ career });
  } catch (error) {
    console.error('Career update error:', error);
    return NextResponse.json(
      { error: 'Failed to update career position' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await prisma.career.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Career deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete career position' },
      { status: 500 }
    );
  }
}
