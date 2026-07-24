import { NextRequest, NextResponse } from 'next/server'

interface ApplicationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  coverLetter: string
  resume?: File
}

interface JobApplication {
  id: string
  jobId: string
  name: string
  email: string
  phone: string
  resume: string
  coverLetter: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

// Mock database - replace with your actual database
let applications: JobApplication[] = []

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerId = params.id
    const jobId = params.id

    if (!careerId || !jobId) {
      return NextResponse.json(
        { error: "Career ID is required" },
        { status: 400 }
      )
    }

    // Try to parse as JSON first, fallback to FormData
    let applicationData: ApplicationData
    let name: string
    let email: string
    let phone: string
    let resume: string
    let coverLetter: string

    const contentType = request.headers.get('content-type')
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (from source branch)
      const formData = await request.formData()

      applicationData = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        coverLetter: formData.get('coverLetter') as string,
        resume: formData.get('resume') as File
      }

      name = `${applicationData.firstName} ${applicationData.lastName}`
      email = applicationData.email
      phone = applicationData.phone || ''
      resume = applicationData.resume ? 'resume_uploaded' : ''
      coverLetter = applicationData.coverLetter || ''

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
    } else {
      // Handle JSON (from integration branch)
      const body = await request.json()
      name = body.name
      email = body.email
      phone = body.phone || ''
      resume = body.resume
      coverLetter = body.coverLetter || ''

      // Validation
      if (!name || !email || !resume) {
        return NextResponse.json(
          { error: 'Name, email, and resume are required' },
          { status: 400 }
        )
      }
    }

    // Create new application using integration branch structure
    const newApplication: JobApplication = {
      id: Date.now().toString(),
      jobId,
      name,
      email,
      phone,
      resume,
      coverLetter,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    applications.push(newApplication)

    // Here you would typically save to database
    console.log('New application received:', {
      careerId,
      applicant: name,
      email: email,
      timestamp: new Date().toISOString()
    })

    // Generate application ID for source branch compatibility
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId,
      careerId,
      data: newApplication
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
    const jobId = params.id

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Filter applications for this job
    const jobApplications = applications.filter(app => app.jobId === jobId)

    // Mock applications data for source branch compatibility
    const mockApplications = [
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
      applications: mockApplications,
      careerId,
      data: jobApplications,
      count: jobApplications.length
    })

  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}
