import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

interface Application {
  id: string
  careerId: string
  name: string
  email: string
  phone: string
  resume: string
  coverLetter: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

// Mock database
let applications: Application[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerId = params.id
    const careerApplications = applications.filter(app => app.careerId === careerId)

    return NextResponse.json({
      success: true,
      data: careerApplications
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const careerId = params.id
    const body = await request.json()

    const newApplication: Application = {
      id: Date.now().toString(),
      careerId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      resume: body.resume,
      coverLetter: body.coverLetter,
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
    return NextResponse.json(
      { success: false, error: 'Failed to create application' },
      { status: 500 }
    )
  }
}
