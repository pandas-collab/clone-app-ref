'use client'

import { useParams } from 'next/navigation'

export default function DeletePortfolioPage() {
  const params = useParams()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Delete Portfolio Item</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Delete portfolio item {params.id}</p>
        </div>
      </div>
    </div>
  )
}
