import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerId = params.id
    const body = await request.json()

    // Validate required fields
    const { name, email, phone, resume, coverLetter } = body

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Mock application creation - replace with database logic
    const application = {
      id: Date.now().toString(),
      careerId,
      name,
      email,
      phone,
      resume: resume || '',
      coverLetter: coverLetter || '',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      application
    })

  } catch (error) {
    console.error('Application submission error:', error)
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
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const careerId = params.id

    // Mock applications data - replace with database query
    const applications = [
      {
        id: '1',
        careerId,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        status: 'pending',
        submittedAt: '2024-01-15T10:30:00Z'
      }
    ]

    return NextResponse.json({ applications })

  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
