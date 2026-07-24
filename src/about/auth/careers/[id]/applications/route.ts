import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../[...nextauth]/route'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const applicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  resume: z.string().url('Resume must be a valid URL'),
  coverLetter: z.string().optional(),
  linkedIn: z.string().url().optional(),
  portfolio: z.string().url().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerId = params.id

    if (!careerId) {
      return NextResponse.json(
        { error: 'Career ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = applicationSchema.parse(body)

    // Check if career exists
    const career = await prisma.career.findUnique({
      where: { id: careerId }
    })

    if (!career) {
      return NextResponse.json(
        { error: 'Career position not found' },
        { status: 404 }
      )
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        ...validatedData,
        careerId,
        status: 'PENDING'
      }
    })

    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        applicationId: application.id
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Application submission error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const careerId = params.id

    const applications = await prisma.application.findMany({
      where: { careerId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(applications)

  } catch (error) {
    console.error('Applications fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
