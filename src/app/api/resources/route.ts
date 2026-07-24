import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const category = searchParams.get('category');
    const fileType = searchParams.get('file_type');

    const skip = (page - 1) * limit;
    const where: any = {
      type: 'resource',
      status: 'published'
    };

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (fileType) {
      where.metadata = {
        path: ['fileType'],
        equals: fileType
      };
    }

    const [resources, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          category: true,
          tags: true,
          metadata: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.content.count({ where })
    ]);

    return NextResponse.json({
      resources,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Resources fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const data = await request.json();

    if (!data.title || !data.metadata?.filePath) {
      return NextResponse.json(
        { error: 'Title and file path are required' },
        { status: 400 }
      );
    }

    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check for existing slug
    const existing = await prisma.content.findFirst({
      where: { slug, type: 'resource' }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Resource with this slug already exists' },
        { status: 400 }
      );
    }

    const resource = await prisma.content.create({
      data: {
        title: data.title,
        slug,
        content: data.content || '',
        description: data.description,
        type: 'resource',
        category: data.category,
        status: data.status || 'published',
        tags: data.tags,
        metadata: {
          filePath: data.metadata.filePath,
          fileName: data.metadata.fileName,
          fileSize: data.metadata.fileSize,
          fileType: data.metadata.fileType,
          downloadCount: 0,
          ...data.metadata
        }
      }
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Resource creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
