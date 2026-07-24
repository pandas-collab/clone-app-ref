'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function DeleteCareerPage() {
  const params = useParams()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/about/admin/careers" className="text-indigo-600 mb-4 inline-block">
          <- Back to Careers
        </Link>
        <h1 className="text-3xl font-bold mb-8">Delete Career Position</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <h3 className="text-red-800 font-medium">Are you sure?</h3>
            <p className="text-red-700 mt-2">This action cannot be undone.</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">
              Delete Position
            </button>
            <Link href="/about/admin/careers" className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
