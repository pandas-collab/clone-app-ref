import { NextRequest, NextResponse } from 'next/server'

export async function GET(
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

    // Mock career data
    const careers = {
      "1": {
        id: "1",
        title: "Senior Full Stack Developer",
        department: "Engineering",
        location: "Remote / San Francisco, CA",
        type: "Full-time",
        experience: "Senior Level",
        salary: "$120,000 - $180,000",
        description: "We are seeking a talented Senior Full Stack Developer to join our growing engineering team. You will work on cutting-edge web applications and help shape our technical architecture.",
        responsibilities: [
          "Develop and maintain web applications using modern frameworks",
          "Collaborate with cross-functional teams to define and implement features",
          "Write clean, maintainable, and well-documented code",
          "Participate in code reviews and technical discussions",
          "Mentor junior developers and contribute to team growth"
        ],
        requirements: [
          "5+ years of experience in full-stack development",
          "Proficiency in React, Node.js, and TypeScript",
          "Experience with databases (PostgreSQL, MongoDB)",
          "Knowledge of cloud platforms (AWS, GCP, or Azure)",
          "Strong problem-solving skills and attention to detail"
        ],
        benefits: [
          "Competitive salary and equity package",
          "Comprehensive health, dental, and vision insurance",
          "Flexible working hours and remote work options",
          "Professional development opportunities",
          "Modern office with great amenities"
        ],
        postedAt: "2024-01-10T00:00:00Z",
        status: "active"
      },
      "2": {
        id: "2",
        title: "UX/UI Designer",
        department: "Design",
        location: "New York, NY",
        type: "Full-time",
        experience: "Mid Level",
        salary: "$80,000 - $120,000",
        description: "Join our design team to create beautiful and intuitive user experiences. You'll work closely with product managers and engineers to bring ideas to life.",
        responsibilities: [
          "Design user interfaces for web and mobile applications",
          "Conduct user research and usability testing",
          "Create wireframes, prototypes, and design systems",
          "Collaborate with developers to ensure design implementation",
          "Stay up-to-date with design trends and best practices"
        ],
        requirements: [
          "3+ years of experience in UX/UI design",
          "Proficiency in Figma, Sketch, or similar design tools",
          "Understanding of user-centered design principles",
          "Experience with design systems and component libraries",
          "Strong portfolio showcasing design process and outcomes"
        ],
        benefits: [
          "Competitive salary and performance bonuses",
          "Health and wellness benefits",
          "Flexible PTO and work-from-home options",
          "Access to design conferences and training",
          "Creative and collaborative work environment"
        ],
        postedAt: "2024-01-08T00:00:00Z",
        status: "active"
      }
    }

    const career = careers[careerId as keyof typeof careers]

    if (!career) {
      return NextResponse.json(
        { error: "Career not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      career
    })

  } catch (error) {
    console.error('Error fetching career:', error)
    return NextResponse.json(
      { error: "Failed to fetch career details" },
      { status: 500 }
    )
  }
}
