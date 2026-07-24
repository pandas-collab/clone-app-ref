'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Service {
  id: string
  name: string
  category: string
  description: string
  details: string
  price: string
  features: string[]
  isActive: boolean
}

export default function EditServicePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session || session.user?.role !== 'admin') {
      router.push('/admin/login')
      return
    }

    fetchService()
  }, [session, status, router, params.id])

  const fetchService = async () => {
    try {
      setLoading(true)

      // Mock service data - replace with actual API call
      const mockService: Service = {
        id: params.id,
        name: 'Web Development',
        category: 'Development',
        description: 'Custom web application development',
        details: 'We create modern, responsive web applications using the latest technologies.',
        price: 'Starting at $5,000',
        features: [
          'Responsive design',
          'Modern UI/UX',
          'SEO optimization',
          'Performance optimization'
        ],
        isActive: true
      }

      setService(
echo 'Fix completed successfully'
