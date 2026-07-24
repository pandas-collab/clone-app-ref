import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { JobStatus, JobPosting } from '@/types/database';
import { z } from 'zod';

// Validation schemas
const CreateJobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  department: z.string().min(1, 'Department is required').max(100),
  location: z.string().min(1, 'Location is required').max(100),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'HYBRID']),
  description: z.string().min(1, 'Description is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  benefits: z.array(z.string()).optional().default([]),
  status: z.nativeEnum(JobStatus).optional().default(JobStatus.DRAFT)
});

const QuerySchema = z.object({
  department: z.string().optional(),
  location: z.string().optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'HYBRID']).optional(),
  status: z.nativeEnum(JobStatus).optional(),
  page: z.string().transform((val) => parseInt(val) || 1).optional().default('1'),
  limit: z.string().transform((val) => Math.min(parseInt(val) || 10, 50)).optional().default('10')
});

// GET /api/careers - List all job postings with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams.entries()));

    const { department, location, type, status, page, limit } = query;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where: any = {};
    if (department) where.department = { contains: department, mode: 'insensitive' };
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (type) where.type = type;
    if (status) where.status = status;

    // For public access, only show published jobs unless admin
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';

    if (!isAdmin) {
      where.status = JobStatus.PUBLISHED;
    }

    const [jobs, totalCount] = await Promise.all([
      prisma.jobPosting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { applications: true }
          }
        }
      }),
      prisma.jobPosting.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        jobs: jobs.map(job => ({
          id: job.id,
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type,
          description: job.description,
          requirements: job.requirements,
          benefits: job.benefits,
          status: job.status,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
          applicationCount: job._count.applications
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Error fetching job postings:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid query parameters',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch job postings'
      },
      { status: 500 }
    );
  }
}

// POST /api/careers - Create new job posting (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. Admin access required.'
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CreateJobSchema.parse(body);

    const jobPosting = await prisma.jobPosting.create({
      data: {
        ...validatedData,
        createdById: session.user.id
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: jobPosting,
        message: 'Job posting created successfully'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating job posting:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid job posting data',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create job posting'
      },
      { status: 500 }
    );
  }
}
