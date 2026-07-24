import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Retrieve content (news, resources, pages)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (id) {
      // Get specific content by ID
      let content;
      switch (type) {
        case 'news':
          content = await prisma.article.findUnique({
            where: { id: parseInt(id) }
          });
          break;
        case 'resource':
          content = await prisma.resource.findUnique({
            where: { id: parseInt(id) }
          });
          break;
        case 'page':
          content = await prisma.page.findUnique({
            where: { id: parseInt(id) }
          });
          break;
        default:
          return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
      }

      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }

      return NextResponse.json(content);
    } else {
      // Get all content by type
      let contents;
      switch (type) {
        case 'news':
          contents = await prisma.article.findMany({
            orderBy: { createdAt: 'desc' }
          });
          break;
        case 'resource':
          contents = await prisma.resource.findMany({
            orderBy: { createdAt: 'desc' }
          });
          break;
        case 'page':
          contents = await prisma.page.findMany({
            orderBy: { createdAt: 'desc' }
          });
          break;
        default:
          return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
      }

      return NextResponse.json(contents);
    }
  } catch (error) {
    console.error('Content GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    let newContent;
    switch (type) {
      case 'news':
        newContent = await prisma.article.create({
          data: {
            title: data.title,
            content: data.content,
            slug: data.slug,
            excerpt: data.excerpt,
            published: data.published || false
          }
        });
        break;
      case 'resource':
        newContent = await prisma.resource.create({
          data: {
            title: data.title,
            description: data.description,
            fileUrl: data.fileUrl,
            category: data.category
          }
        });
        break;
      case 'page':
        newContent = await prisma.page.create({
          data: {
            title: data.title,
            content: data.content,
            slug: data.slug,
            published: data.published || false
          }
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error('Content POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update existing content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, ...data } = body;

    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }

    let updatedContent;
    switch (type) {
      case 'news':
        updatedContent = await prisma.article.update({
          where: { id: parseInt(id) },
          data: {
            title: data.title,
            content: data.content,
            slug: data.slug,
            excerpt: data.excerpt,
            published: data.published
          }
        });
        break;
      case 'resource':
        updatedContent = await prisma.resource.update({
          where: { id: parseInt(id) },
          data: {
            title: data.title,
            description: data.description,
            fileUrl: data.fileUrl,
            category: data.category
          }
        });
        break;
      case 'page':
        updatedContent = await prisma.page.update({
          where: { id: parseInt(id) },
          data: {
            title: data.title,
            content: data.content,
            slug: data.slug,
            published: data.published
          }
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Content PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }

    switch (type) {
      case 'news':
        await prisma.article.delete({
          where: { id: parseInt(id) }
        });
        break;
      case 'resource':
        await prisma.resource.delete({
          where: { id: parseInt(id) }
        });
        break;
      case 'page':
        await prisma.page.delete({
          where: { id: parseInt(id) }
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Content DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
