export type RouteSegment = 'delete'

export interface PageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export interface GenerateStaticParamsResult {
  id: string
}

export interface GenerateMetadataResult {
  title: string
  description?: string
  robots?: string
}

export interface ServiceDeletePageContext {
  params: {
    id: string
  }
}

export interface ServiceDeleteConfirmation {
  serviceId: string
  confirmed: boolean
  timestamp: Date
}

export interface DeleteServiceRequest {
  id: string
  adminId: string
  reason?: string
}

export interface DeleteServiceResponse {
  success: boolean
  message: string
  deletedService?: {
    id: string
    title: string
    deletedAt: Date
  }
  error?: string
}

export interface ServiceDeleteFormData {
  confirmation: boolean
  reason?: string
  adminPassword?: string
}

export interface AdminDeletePermissions {
  canDelete: boolean
  requiresConfirmation: boolean
  requiresReason: boolean
}

export default interface Page {
  (props: PageProps): Promise<JSX.Element>
}

export interface LayoutProps {
  children: React.ReactNode
  params: {
    id: string
  }
}