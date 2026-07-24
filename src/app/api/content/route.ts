import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ContentSchema = z.object({
  title: z.string().min(1),
  content: z.string(),
  type: z.enum(['page', 'article', 'resource']),
  slug: z.string().min(1),
  published: z.boolean().optional(),
  metadata: z.object({
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
  }).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const published = searchParams.get('published');

    const where: any = {};
    if (type) where.type = type;
    if (published) where.published = published === 'true';

    const content = await prisma.content.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Content GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = ContentSchema.parse(body);

    const content = await prisma.content.create({
      data: {
        ...validatedData,
        published: validatedData.published ?? false,
      },
    });

    return NextResponse.json({ success: true, data: content }, { status: 201 });
  } catch (error) {
    console.error('Content POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Content ID required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = ContentSchema.partial().parse(body);

    const content = await prisma.content.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error('Content PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Content ID required' },
        { status: 400 }
      );
    }

    await prisma.content.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Content deleted' });
  } catch (error) {
    console.error('Content DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
