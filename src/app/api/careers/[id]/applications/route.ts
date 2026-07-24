import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, email, phone, coverLetter, resume } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone are required' },
        { status: 400 }
      );
    }

    const career = await prisma.career.findUnique({
      where: { id: params.id }
    });

    if (!career) {
      return NextResponse.json(
        { error: 'Career position not found' },
        { status: 404 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        name,
        email,
        phone,
        coverLetter: coverLetter || '',
        resume: resume || '',
        careerId: params.id,
        status: 'pending'
      }
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
