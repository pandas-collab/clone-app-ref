import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerId = params.id

    // Mock career data - replace with database query
    const career = {
      id: careerId,
      title: 'Software Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'We are looking for a talented software developer to join our team.',
      requirements: [
        '3+ years of experience in software development',
        'Proficiency in JavaScript/TypeScript',
        'Experience with React and Node.js'
      ],
      responsibilities: [
        'Develop and maintain web applications',
        'Collaborate with cross-functional teams',
        'Write clean, maintainable code'
      ],
      salary: '$80,000 - $120,000',
      benefits: [
        'Health insurance',
        'Flexible working hours',
        'Professional development budget'
      ],
      postedAt: '2024-01-01T00:00:00Z',
      isActive: true
    }

    if (!career) {
      return NextResponse.json(
        { error: 'Career not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ career })

  } catch (error) {
    console.error('Get career error:', error)
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

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const careerId = params.id
    const body = await request.json()

    // Validate required fields
    const { title, department, location, type, description } = body

    if (!title || !department || !location || !type || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Mock career update - replace with database logic
    const updatedCareer = {
      id: careerId,
      ...body,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Career updated successfully',
      career: updatedCareer
    })

  } catch (error) {
    console.error('Update career error:', error)
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

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const careerId = params.id

    // Mock career deletion - replace with database logic
    console.log(`Deleting career: ${careerId}`)

    return NextResponse.json({
      success: true,
      message: 'Career deleted successfully'
    })

  } catch (error) {
    console.error('Delete career error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
