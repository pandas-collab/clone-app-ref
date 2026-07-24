import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ApplicationStatus, JobStatus } from '@/types/database';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

// Validation schemas
const CreateApplicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address').max(100),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20),
  coverLetter: z.string().min(10, 'Cover letter must be at least 10 characters').max(5000)
});

const QuerySchema = z.object({
  status: z.nativeEnum(ApplicationStatus).optional(),
  page: z.string().transform((val) => parseInt(val) || 1).optional().default('1'),
  limit: z.string().transform((val) => Math.min(parseInt(val) || 20, 100)).optional().default('20')
});

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 3;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
}

async function saveResumeFile(file: File): Promise<string> {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit.');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const fileExtension = file.name.split('.').pop() || 'pdf';
  const uniqueFilename = `resume-${randomUUID()}.${fileExtension}`;

  // Ensure upload directory exists
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'resumes');
  await mkdir(uploadDir, { recursive: true });

  const filePath = join(uploadDir, uniqueFilename);
  await writeFile(filePath, buffer);

  return `/uploads/resumes/${uniqueFilename}`;
}

// GET /api/careers/[id]/applications - List applications for job (admin only)
export async function GET(
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
    const job = await prisma.jobPosting.findUnique({
      where: { id: jobId }
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

    const { searchParams } = new URL(request.url);
    const query = QuerySchema.parse(Object.fromEntries(searchParams.entries()));
    const { status, page, limit } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { jobId };
    if (status) where.status = status;

    const [applications, totalCount] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: { submittedAt: 'desc' },
        include: {
          job: {
            select: { title: true, department: true }
          }
        }
      }),
      prisma.jobApplication.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: {
        applications: applications.map(app => ({
          id: app.id,
          jobId: app.jobId,
          firstName: app.firstName,
          lastName: app.lastName,
          email: app.email,
          phone: app.phone,
          coverLetter: app.coverLetter,
          resumeUrl: app.resumeUrl,
          status: app.status,
          submittedAt: app.submittedAt,
          job: app.job
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit
        },
        jobInfo: {
          id: job.id,
          title: job.title,
          department: job.department
        }
      }
    });

  } catch (error) {
    console.error('Error fetching job applications:', error);

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
        error: 'Failed to fetch job applications'
      },
      { status: 500 }
    );
  }
}

// POST /api/careers/[id]/applications - Submit job application
export async function POST(
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

    // Rate limiting check
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again in 15 minutes.'
        },
        { status: 429 }
      );
    }

    // Check if job exists and is accepting applications
    const job = await prisma.jobPosting.findUnique({
      where: { id: jobId }
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

    if (job.status !== JobStatus.PUBLISHED) {
      return NextResponse.json(
        {
          success: false,
          error: 'This job posting is not accepting applications'
        },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const applicationData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      coverLetter: formData.get('coverLetter') as string
    };

    // Validate application data
    const validatedData = CreateApplicationSchema.parse(applicationData);

    // Check for duplicate application
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        email: validatedData.email
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          success: false,
          error: 'You have already applied for this position'
        },
        { status: 409 }
      );
    }

    // Handle resume file upload
    const resumeFile = formData.get('resume') as File | null;
    if (!resumeFile || resumeFile.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume file is required'
        },
        { status: 400 }
      );
    }

    let resumeUrl: string;
    try {
      resumeUrl = await saveResumeFile(resumeFile);
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to upload resume'
        },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        ...validatedData,
        jobId,
        resumeUrl,
        status: ApplicationStatus.SUBMITTED,
        submittedAt: new Date()
      },
      include: {
        job: {
          select: { title: true, department: true }
        }
      }
    });

    // Send confirmation email (optional - integrate with email service)
    // await sendApplicationConfirmationEmail(application);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: application.id,
          jobTitle: application.job.title,
          department: application.job.department,
          status: application.status,
          submittedAt: application.submittedAt
        },
        message: 'Application submitted successfully. You will hear back from us soon!'
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error submitting job application:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid application data',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit application'
      },
      { status: 500 }
    );
  }
}
