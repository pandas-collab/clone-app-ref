import type { Metadata, ResolvingMetadata } from 'next'
import type { FC } from 'react'

export type PageProps = {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}

export type GenerateMetadata = (
  props: PageProps,
  parent: ResolvingMetadata,
) => Promise<Metadata>

export type Page = FC<PageProps>

export interface ApplicationsPageProps extends PageProps {}

export interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  resume?: string
  coverLetter?: string
  careerId: string
  careerTitle?: string
  status: 'pending' | 'reviewed' | 'approved' | 'rejected'
  submittedAt: Date
  updatedAt: Date
}

export interface ApplicationsFilters {
  status?: string
  career?: string
  search?: string
  page?: string
  limit?: string
}

export interface ApplicationsResponse {
  applications: Application[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApplicationsListProps {
  applications: Application[]
  total: number
  currentPage: number
  totalPages: number
}

export interface ApplicationFiltersProps {
  filters: ApplicationsFilters
  onFiltersChange: (filters: ApplicationsFilters) => void
  careers: Array<{ id: string; title: string }>
}

export interface ApplicationTableRowProps {
  application: Application
  onStatusChange: (id: string, status: Application['status']) => void
}

export type ApplicationStatus = Application['status']

export interface StatusUpdateRequest {
  status: ApplicationStatus
}

export interface StatusUpdateResponse {
  success: boolean
  message: string
  application?: Application
}