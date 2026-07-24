import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { portfolioSchema, caseStudySchema } from '@/lib/validations';

interface RouteParams {
  params: { id: string }
}

// GET /api/portfolio/[id] - Get single portfolio item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    // Check if user can access unpublished items
    const canAccessUnpublished = session?.user?.role === 'admin';

    const whereClause: any = { id };
    if (!canAccessUnpublished) {
      whereClause.published = true;
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: whereClause,
      include: {
        images_rel: {
          orderBy: { order: 'asc' }
        },
        caseStudy: {
          include: {
            metrics: {
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        testimonials: {
          where: canAccessUnpublished ? {} : { approvedAt: { not: null } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    // Check if published for public access
    if (!canAccessUnpublished && !portfolio.published) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(portfolio);

  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

// PUT /api/portfolio/[id] - Update portfolio item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    // Validate input
    const portfolioData = portfolioSchema.parse(body);
    const { caseStudy, metrics, images: imageUrls, ...mainData } = body;

    // Update with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update main portfolio
      const portfolio = await tx.portfolio.update({
        where: { id },
        data: {
          ...mainData,
          images: imageUrls || [],
        },
        include: {
          caseStudy: {
            include: {
              metrics: true
            }
          },
          images_rel: true
        }
      });

      // Handle case study updates
      if (caseStudy) {
        const caseStudyData = caseStudySchema.parse(caseStudy);

        // Delete existing metrics
        if (portfolio.caseStudy) {
          await tx.caseStudyMetric.deleteMany({
            where: { caseStudyId: portfolio.caseStudy.id }
          });
        }

        // Update or create case study
        const updatedCaseStudy = await tx.caseStudy.upsert({
          where: { portfolioId: id },
          create: {
            portfolioId: id,
            technologies: caseStudyData.technologies,
          },
          update: {
            technologies: caseStudyData.technologies,
          }
        });

        // Create new metrics
        if (metrics && Array.isArray(metrics)) {
          await tx.caseStudyMetric.createMany({
            data: metrics.map((metric: any) => ({
              caseStudyId: updatedCaseStudy.id,
              name: metric.name,
              value: metric.value,
            }))
          });
        }
      }

      // Handle image updates
      if (imageUrls && Array.isArray(imageUrls)) {
        // Delete existing images
        await tx.portfolioImage.deleteMany({
          where: { portfolioId: id }
        });

        // Create new images
        await tx.portfolioImage.createMany({
          data: imageUrls.map((url: string, index: number) => ({
            portfolioId: id,
            url,
            order: index,
          }))
        });
      }

      return tx.portfolio.findUnique({
        where: { id },
        include: {
          images_rel: {
            orderBy: { order: 'asc' }
          },
          caseStudy: {
            include: {
              metrics: {
                orderBy: { createdAt: 'desc' }
              }
            }
          },
          testimonials: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    });

    return NextResponse.json(result);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues
        },
        { status: 400 }
      );
    }

    console.error('Portfolio update error:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}

// DELETE /api/portfolio/[id] - Delete portfolio item


// Update portfolio item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();

    // Validate required fields
    const {
      title,
      description,
      category,
      technologies,
      images,
      clientName,
      projectUrl,
      githubUrl,
      featured,
      caseStudy,
      testimonial
    } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category' },
        { status: 400 }
      );
    }

    // Update portfolio item in database (placeholder - replace with actual DB logic)
    const updatedPortfolio = {
      id,
      title,
      description,
      category,
      technologies: technologies || [],
      images: images || [],
      clientName: clientName || null,
      projectUrl: projectUrl || null,
      githubUrl: githubUrl || null,
      featured: featured || false,
      caseStudy: caseStudy || null,
      testimonial: testimonial || null,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item' },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Delete with cascade (Prisma handles related records)
    await prisma.$transaction(async (tx) => {
      // Delete metrics first
      const caseStudy = await tx.caseStudy.findUnique({
        where: { portfolioId: id }
      });

      if (caseStudy) {
        await tx.caseStudyMetric.deleteMany({
          where: { caseStudyId: caseStudy.id }
        });
        await tx.caseStudy.delete({
          where: { id: caseStudy.id }
        });
      }

      // Delete images
      await tx.portfolioImage.deleteMany({
        where: { portfolioId: id }
      });

      // Delete testimonials
      await tx.clientTestimonial.deleteMany({
        where: { portfolioId: id }
      });

      // Delete portfolio
      await tx.portfolio.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Portfolio deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    );
  }
}
