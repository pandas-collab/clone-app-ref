import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all content with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status') || 'published';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const whereClause: any = { status };
    if (type) {
      whereClause.type = type;
    }

    const content = await prisma.content.findMany({
      where: whereClause,
      take: limit,
      skip: skip,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const total = await prisma.content.count({
      where: whereClause
    });

    return NextResponse.json({
      content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Content fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST - Create new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, type, status = 'draft', metadata, authorId } = body;

    if (!title || !slug || !content || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newContent = await prisma.content.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        type,
        status,
        metadata,
        authorId,
        publishedAt: status === 'published' ? new Date() : null
      }
    });

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error('Content creation error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Content with this slug already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

// PUT - Update content
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, slug, content, excerpt, type, status, metadata, authorId } = body;

    const updatedContent = await prisma.content.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        type,
        status,
        metadata,
        authorId,
        publishedAt: status === 'published' && !await prisma.content.findFirst({
          where: { id, publishedAt: { not: null } }
        }) ? new Date() : undefined
      }
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Content update error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// DELETE - Delete content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Content ID is required' },
        { status: 400 }
      );
    }

    await prisma.content.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Content deletion error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
