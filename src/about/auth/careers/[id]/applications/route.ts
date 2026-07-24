import { NextRequest, NextResponse } from 'next/server'

interface ApplicationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  coverLetter: string
  resume?: File
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerId = params.id

    if (!careerId) {
      return NextResponse.json(
        { error: "Career ID is required" },
        { status: 400 }
      )
    }

    const formData = await request.formData()

    const applicationData: ApplicationData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      coverLetter: formData.get('coverLetter') as string,
      resume: formData.get('resume') as File
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'coverLetter']
    for (const field of requiredFields) {
      if (!applicationData[field as keyof ApplicationData]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(applicationData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Here you would typically save to database
    console.log('New application received:', {
      careerId,
      applicant: `${applicationData.firstName} ${applicationData.lastName}`,
      email: applicationData.email,
      timestamp: new Date().toISOString()
    })

    // Simulate successful submission
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId,
      careerId
    }, { status: 201 })

  } catch (error) {
    console.error('Application submission error:', error)
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerId = params.id

    // Mock applications data
    const applications = [
      {
        id: "app_001",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "(555) 123-4567",
        appliedAt: "2024-01-15T10:30:00Z",
        status: "pending"
      },
      {
        id: "app_002",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
        phone: "(555) 987-6543",
        appliedAt: "2024-01-14T14:20:00Z",
        status: "reviewed"
      }
    ]

    return NextResponse.json({
      success: true,
      applications,
      careerId
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}
