import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { portfolioSchema, caseStudySchema } from '@/lib/validations';

// GET /api/portfolio - Get all portfolio items with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const limit = searchParams.get('limit');

    // Build where clause
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (featured !== null) {
      where.featured = featured === 'true';
    }

    if (published !== null) {
      where.published = published === 'true';
    }

    const portfolios = await prisma.portfolio.findMany({
      where,
      include: {
        images_rel: {
          orderBy: { order: 'asc' },
          take: limit ? parseInt(limit) : undefined,
        },
        caseStudy: {
          select: {
            id: true,
            technologies: true,
          }
        },
        testimonials: {
          where: { featured: true },
          take: 1,
          select: {
            id: true,
            clientName: true,
            rating: true,
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined,
    });

    // Get unique categories and tags for filtering
    const allPortfolios = await prisma.portfolio.findMany({
      where: { published: true },
    });

    const categories = [...new Set(allPortfolios.map(p => p.category))];
    const totalCount = await prisma.portfolio.count({
      where: { published: true }
    });
    const featuredCount = await prisma.portfolio.count({
      where: { published: true, featured: true }
    });

    return NextResponse.json({
      portfolios,
      metadata: {
        categories,
        totalCount,
        featuredCount,
      }
    });

  } catch (error) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
}

// POST /api/portfolio - Create new portfolio item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate main portfolio data
    const portfolioData = portfolioSchema.parse(body);

    // Extract case study and other related data
    const { caseStudy, metrics, images: imageUrls, ...mainData } = body;

    // Create portfolio with transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create main portfolio record
      const portfolio = await tx.portfolio.create({
        data: {
          ...mainData,
          images: imageUrls || [],
        }
      });

      // Create case study if provided
      if (caseStudy) {
        const caseStudyData = caseStudySchema.parse(caseStudy);
        const createdCaseStudy = await tx.caseStudy.create({
          data: {
            portfolioId: portfolio.id,
            technologies: caseStudyData.technologies,
          }
        });

        // Create metrics if provided
        if (metrics && Array.isArray(metrics)) {
          await tx.caseStudyMetric.createMany({
            data: metrics.map((metric: any) => ({
              caseStudyId: createdCaseStudy.id,
              name: metric.name,
              value: metric.value,
            }))
          });
        }
      }

      // Create portfolio images if provided
      if (imageUrls && Array.isArray(imageUrls)) {
        await tx.portfolioImage.createMany({
          data: imageUrls.map((url: string, index: number) => ({
            portfolioId: portfolio.id,
            url,
            order: index,
          }))
        });
      }

      return tx.portfolio.findUnique({
        where: { id: portfolio.id },
        include: {
          images_rel: {
            orderBy: { order: 'asc' }
          },
          caseStudy: {
            include: {
              metrics: true
            }
          },
          testimonials: true
        }
      });
    });

    return NextResponse.json(result, { status: 201 });

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

    console.error('Portfolio creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
}
