import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.content.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id }
        ],
        type: 'news'
      }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Only show published articles to non-authenticated users
    const session = await getServerSession(authOptions);
    if (article.status !== 'published' && !session?.user) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
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
      where: { id: params.id, type: 'news' }
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Article not found' },
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

    const article = await prisma.content.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug,
        content: data.content,
        description: data.description,
        category: data.category,
        status: data.status,
        author: data.author,
        featured: data.featured,
        tags: data.tags,
        metadata: {
          ...data.metadata,
          readTime: data.content ? calculateReadTime(data.content) : existing.metadata?.readTime
        },
        publishedAt: data.status === 'published' && existing.status !== 'published'
          ? new Date()
          : existing.publishedAt
      }
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error('News update error:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
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

    const article = await prisma.content.findFirst({
      where: { id: params.id, type: 'news' }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    await prisma.content.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('News deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}
