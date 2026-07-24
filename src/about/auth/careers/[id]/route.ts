import { NextRequest, NextResponse } from 'next/server'

interface Career {
  id: string
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  description: string
  requirements: string[]
  benefits: string[]
  salary?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Mock database - replace with your actual database
let careers: Career[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'full-time',
    description: 'We are looking for a skilled Frontend Developer...',
    requirements: ['React', 'TypeScript', '3+ years experience'],
    benefits: ['Health insurance', 'Remote work', 'Flexible hours'],
    salary: '$80,000 - $120,000',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export async function GET(
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

    const career = careers.find(c => c.id === careerId)

    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: career
    })
  } catch (error) {
    console.error('Error fetching career:', error)
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
    const careerId = params.id

    if (!careerId) {
      return NextResponse.json(
        { error: 'Career ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const careerIndex = careers.findIndex(c => c.id === careerId)

    if (careerIndex === -1) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    careers[careerIndex] = {
      ...careers[careerIndex],
      ...body,
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      data: careers[careerIndex]
    })
  } catch (error) {
    console.error('Error updating career:', error)
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
    const careerId = params.id

    if (!careerId) {
      return NextResponse.json(
        { error: 'Career ID is required' },
        { status: 400 }
      )
    }

    const careerIndex = careers.findIndex(c => c.id === careerId)

    if (careerIndex === -1) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    careers.splice(careerIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Career deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting career:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
