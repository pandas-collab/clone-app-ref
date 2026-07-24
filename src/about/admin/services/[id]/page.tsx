'use client'

import { useParams } from 'next/navigation'

export default function ServiceDetailPage() {
  const params = useParams()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Service Details</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Service ID: {params.id}</p>
        </div>
      </div>
    </div>
  )
}
