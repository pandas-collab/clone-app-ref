import type { Metadata, ResolvingMetadata } from 'next'
import type { NextPage } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export type PageProps = Props

export type GenerateMetadata = (
  props: Props,
  parent: ResolvingMetadata
) => Promise<Metadata>

export interface Career {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  salary?: {
    min?: number
    max?: number
    currency: string
  }
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  updatedAt: string
  applications?: Application[]
}

export interface Application {
  id: string
  careerId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  coverLetter?: string
  resumeUrl?: string
  portfolioUrl?: string
  status: 'pending' | 'reviewed' | 'interviewing' | 'rejected' | 'accepted'
  submittedAt: string
  updatedAt: string
}

export interface DeleteCareerPageProps {
  params: {
    id: string
  }
}

export interface DeleteCareerFormData {
  confirmation: string
}

export interface DeleteCareerResponse {
  success: boolean
  message: string
  redirectUrl?: string
}

export interface DeleteCareerError {
  field?: string
  message: string
  code?: string
}

export interface DeleteCareerState {
  career: Career | null
  isLoading: boolean
  isDeleting: boolean
  error: DeleteCareerError | null
  showConfirmation: boolean
}

export interface DeleteCareerContextValue {
  state: DeleteCareerState
  actions: {
    loadCareer: (id: string) => Promise<void>
    deleteCareer: (id: string, confirmation: string) => Promise<DeleteCareerResponse>
    setShowConfirmation: (show: boolean) => void
    clearError: () => void
  }
}

export type DeleteCareerPageComponent = NextPage<DeleteCareerPageProps>