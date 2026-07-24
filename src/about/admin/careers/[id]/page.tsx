'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Career {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  status: 'active' | 'inactive' | 'draft'
  postedAt: string
}

export default function CareerDetailsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [career, setCareer] = useState<Career | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (status === 'authenticated') {
      loadCareer()
    }
  }, [status, router, params.id])

  const loadCareer = async () => {
    try {
      setLoading(true)

      // Mock career data
      const mockCareers: Record<string, Career> = {
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
        }
      }

      const careerData = mockCareers[params.id]
      if (careerData) {
        setCareer(careerData)
      }
    } catch (error) {
      console.error('Error loading career:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading career details...</p>
        </div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Career Not Found</h2>
          <Link
            href="/admin/careers"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
          >
            Back to Careers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin/careers"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <- Back to Careers
        </Link>

        <div className="bg-white shadow rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{career.title}</h1>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>{career.department}</span>
              <span></span>
              <span>{career.location}</span>
              <span></span>
              <span>{career.type}</span>
              <span></span>
              <span>{career.experience}</span>
            </div>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
              <p className="text-gray-700">{career.description}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {career.responsibilities.map((responsibility, index) => (
                  <li key={index}>{responsibility}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {career.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Benefits</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {career.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </section>

            <div className="flex gap-4 pt-6 border-t">
              <Link
                href={`/admin/careers/${career.id}/edit`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Edit Position
              </Link>
              <Link
                href={`/admin/careers/${career.id}/delete`}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete Position
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
