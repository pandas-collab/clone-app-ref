import { Metadata } from 'next'

export { default } from './page'
export { generateMetadata } from './page'

export const metadata: Metadata = {
  title: 'Page',
  description: 'Default page component'
}

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Page</h1>
        <p className="text-gray-600">This is a default page component.</p>
      </div>
    </div>
  )
}