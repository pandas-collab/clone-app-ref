'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function CareerDetailPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/about/admin/careers" className="text-indigo-600 mb-4 inline-block">
          <- Back to Careers
        </Link>
        <h1 className="text-3xl font-bold mb-8">Career Details</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Career ID: {params.id}</p>
        </div>
      </div>
    </div>
  )
}
