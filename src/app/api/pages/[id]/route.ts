import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.content.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id }
        ],
        type: 'page'
      }
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Only show published pages to non-authenticated users
    const session = await getServerSession(authOptions);
    if (page.status !== 'published' && !session?.user) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Page fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
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
      where: { id: params.id, type: 'page' }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Update slug if title changed
    let slug = existing.slug;
    if (data.title && data.title !== existing.title) {
      slug = data.slug || data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const page = await prisma.content.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug,
        content: data.content,
        description: data.description,
        status: data.status,
        metadata: {
          ...existing.metadata,
          template: data.template,
          parent: data.parent,
          order: data.order,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          showInMenu: data.showInMenu,
          ...data.metadata
        },
        publishedAt: data.status === 'published' && existing.status !== 'published'
          ? new Date()
          : existing.publishedAt
      }
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Page update error:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
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

    const page = await prisma.content.findFirst({
      where: { id: params.id, type: 'page' }
    });

    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }

    // Check for child pages
    const childPages = await prisma.content.count({
      where: {
        type: 'page',
        metadata: {
          path: ['parent'],
          equals: params.id
        }
      }
    });

    if (childPages > 0) {
      return NextResponse.json(
        { error: 'Cannot delete page with child pages' },
        { status: 400 }
      );
    }

    await prisma.content.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Page deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
