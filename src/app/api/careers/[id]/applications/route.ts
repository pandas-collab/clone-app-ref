import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const applicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  coverLetter: z.string().min(1, 'Cover letter is required'),
  resumeUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Verify career exists
    const career = await prisma.career.findUnique({
      where: { id: params.id }
    })

    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { careerId: params.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.application.count({
        where: { careerId: params.id }
      })
    ])

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Applications GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify career exists and is published
    const career = await prisma.career.findUnique({
      where: { id: params.id }
    })

    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    if (career.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'This position is not accepting applications' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = applicationSchema.parse(body)

    // Check if user already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        careerId: params.id,
        email: validatedData.email
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 400 }
      )
    }

    const application = await prisma.application.create({
      data: {
        ...validatedData,
        careerId: params.id,
        status: 'PENDING'
      }
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Application POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
