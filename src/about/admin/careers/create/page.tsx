'use client'

import Link from 'next/link'

export default function CreateCareerPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/about/admin/careers" className="text-indigo-600 mb-4 inline-block">
          <- Back to Careers
        </Link>
        <h1 className="text-3xl font-bold mb-8">Create New Career Position</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea rows={4} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"></textarea>
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
              Create Position
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
