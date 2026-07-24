import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { JobStatus } from '@/types/database';
import { z } from 'zod';

// Validation schemas
const UpdateJobSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
  department: z.string().min(1, 'Department is required').max(100).optional(),
  location: z.string().min(1, 'Location is required').max(100).optional(),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'HYBRID']).optional(),
  description: z.string().min(1, 'Description is required').optional(),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed').optional(),
  benefits: z.array(z.string()).optional(),
  status: z.nativeEnum(JobStatus).optional()
});

// GET /api/careers/[id] - Get specific job posting
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job ID is required'
        },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';

    // Build where clause - non-admin users can only see published jobs
    const where: any = { id: jobId };
    if (!isAdmin) {
      where.status = JobStatus.PUBLISHED;
    }

    const job = await prisma.jobPosting.findFirst({
      where,
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!job) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job posting not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
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
      }
    });

  } catch (error) {
    console.error('Error fetching job posting:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch job posting'
      },
      { status: 500 }
    );
  }
}

// PUT /api/careers/[id] - Update job posting (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job ID is required'
        },
        { status: 400 }
      );
    }

    // Check if job exists
    const existingJob = await prisma.jobPosting.findUnique({
      where: { id: jobId }
    });

    if (!existingJob) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job posting not found'
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateJobSchema.parse(body);

    const updatedJob = await prisma.jobPosting.update({
      where: { id: jobId },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedJob,
      message: 'Job posting updated successfully'
    });

  } catch (error) {
    console.error('Error updating job posting:', error);

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
        error: 'Failed to update job posting'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/careers/[id] - Delete job posting (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const jobId = params.id;

    if (!jobId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job ID is required'
        },
        { status: 400 }
      );
    }

    // Check if job exists and has applications
    const existingJob = await prisma.jobPosting.findUnique({
      where: { id: jobId },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });

    if (!existingJob) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job posting not found'
        },
        { status: 404 }
      );
    }

    // Warn if job has applications
    if (existingJob._count.applications > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete job posting with ${existingJob._count.applications} applications. Please close the posting instead.`,
          details: { applicationCount: existingJob._count.applications }
        },
        { status: 409 }
      );
    }

    await prisma.jobPosting.delete({
      where: { id: jobId }
    });

    return NextResponse.json({
      success: true,
      message: 'Job posting deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting job posting:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete job posting'
      },
      { status: 500 }
    );
  }
}
