import { NextRequest, NextResponse } from 'next/server'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const jobApplications = applications.filter(app => app.jobId === jobId)

    return NextResponse.json({
      success: true,
      data: jobApplications,
      count: jobApplications.length
    })
  } catch (error) {
    console.error('Error fetching applications:', error)
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
    const jobId = params.id

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { name, email, phone, resume, coverLetter } = body

    // Validation
    if (!name || !email || !resume) {
      return NextResponse.json(
        { error: 'Name, email, and resume are required' },
        { status: 400 }
      )
    }

    const newApplication: JobApplication = {
      id: Date.now().toString(),
      jobId,
      name,
      email,
      phone: phone || '',
      resume,
      coverLetter: coverLetter || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    applications.push(newApplication)

    return NextResponse.json({
      success: true,
      data: newApplication
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
