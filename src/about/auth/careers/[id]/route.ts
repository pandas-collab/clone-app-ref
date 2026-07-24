import { NextRequest, NextResponse } from 'next/server'

interface Career {
  id: string
  title: string
  description: string
  requirements: string[]
  location: string
  type: 'full-time' | 'part-time' | 'contract'
  salary: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

// Mock database
let careers: Career[] = [
  {
    id: '1',
    title: 'Software Engineer',
    description: 'We are looking for a skilled software engineer...',
    requirements: ['React', 'Node.js', '3+ years experience'],
    location: 'Remote',
    type: 'full-time',
    salary: '$80,000 - $120,000',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const career = careers.find(c => c.id === params.id)

    if (!career) {
      return NextResponse.json(
        { success: false, error: 'Career not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: career
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch career' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const careerIndex = careers.findIndex(c => c.id === params.id)

    if (careerIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Career not found' },
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
    return NextResponse.json(
      { success: false, error: 'Failed to update career' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerIndex = careers.findIndex(c => c.id === params.id)

    if (careerIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Career not found' },
        { status: 404 }
      )
    }

    careers.splice(careerIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Career deleted successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete career' },
      { status: 500 }
    )
  }
}
