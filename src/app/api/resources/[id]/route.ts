import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await prisma.content.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id }
        ],
        type: 'resource',
        status: 'published'
      }
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Resource fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
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
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const existing = await prisma.content.findFirst({
      where: { id: params.id, type: 'resource' }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    const resource = await prisma.content.update({
      where: { id: params.id },
      data: {
        title: data.title,
        content: data.content,
        description: data.description,
        category: data.category,
        status: data.status,
        tags: data.tags,
        metadata: {
          ...existing.metadata,
          ...data.metadata
        }
      }
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Resource update error:', error);
    return NextResponse.json(
      { error: 'Failed to update resource' },
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
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const resource = await prisma.content.findFirst({
      where: { id: params.id, type: 'resource' }
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    await prisma.content.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Resource deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}

// Special endpoint for tracking downloads
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();

    if (action === 'download') {
      const resource = await prisma.content.findFirst({
        where: { id: params.id, type: 'resource' }
      });

      if (!resource) {
        return NextResponse.json(
          { error: 'Resource not found' },
          { status: 404 }
        );
      }

      // Increment download count
      await prisma.content.update({
        where: { id: params.id },
        data: {
          metadata: {
            ...resource.metadata,
            downloadCount: (resource.metadata?.downloadCount || 0) + 1,
            lastDownloaded: new Date().toISOString()
          }
        }
      });

      return NextResponse.json({ message: 'Download tracked' });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Resource patch error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
