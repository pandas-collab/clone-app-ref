'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  description: string
  features: string[]
  price: string
  status: string
}

export default function ServiceEditPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [''],
    price: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/unauthorized')
      return
    }

    if (params.id) {
      fetchService()
    }
  }, [session, status, router, params.id])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/services/${params.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch service')
      }

      const data = await response.json()
      setService(data)
      setFormData({
        name: data.name,
        description: data.description,
        features: data.features.length > 0 ? data.features : [''],
        price: data.price || '',
        status: data.status
      })
    } catch (error) {
      console.error('Fetch error:', error)
      setError('Failed to load service')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const cleanFeatures = formData.features.filter(feature => feature.trim() !== '')

      const response = await fetch(`/api/admin/services/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          features: cleanFeatures
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update service')
      }

      setSuccess('Service updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
echo 'Fix completed successfully'
