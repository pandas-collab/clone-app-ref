import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const careerUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  department: z.string().min(1, 'Department is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  type: z.string().min(1, 'Type is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  requirements: z.string().min(1, 'Requirements are required').optional(),
  responsibilities: z.string().min(1, 'Responsibilities are required').optional(),
  salaryRange: z.string().optional(),
  benefits: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']).optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const career = await prisma.career.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    })

    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(career)
  } catch (error) {
    console.error('Career GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = careerUpdateSchema.parse(body)

    // Check if career exists
    const existingCareer = await prisma.career.findUnique({
      where: { id: params.id }
    })

    if (!existingCareer) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    const career = await prisma.career.update({
      where: { id: params.id },
      data: validatedData
    })

    return NextResponse.json(career)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Career PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if career exists
    const existingCareer = await prisma.career.findUnique({
      where: { id: params.id }
    })

    if (!existingCareer) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    // Delete related applications first
    await prisma.application.deleteMany({
      where: { careerId: params.id }
    })

    await prisma.career.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Career DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
