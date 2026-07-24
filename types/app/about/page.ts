import { Metadata } from 'next'

// Page Props
export interface PageProps {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}

// Generate Metadata Props
export interface GenerateMetadataProps {
  params: {}
  searchParams: { [key: string]: string | string[] | undefined }
}

// Page Component Type
export type PageComponent = (props: PageProps) => Promise<JSX.Element> | JSX.Element

// Generate Metadata Function Type
export type GenerateMetadataFunction = (
  props: GenerateMetadataProps
) => Promise<Metadata> | Metadata

// About Page Specific Types
export interface AboutPageData {
  title: string
  description: string
  mission: string
  vision: string
  values: string[]
  teamMembers: TeamMember[]
  companyHistory: CompanyHistory[]
  achievements: Achievement[]
}

export interface TeamMember {
  id: string
  name: string
  position: string
  bio: string
  image?: string
  email?: string
  linkedin?: string
  twitter?: string
}

export interface CompanyHistory {
  year: number
  title: string
  description: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  category: 'award' | 'milestone' | 'recognition'
}

// Component Props
export interface AboutHeroProps {
  title: string
  description: string
  backgroundImage?: string
}

export interface MissionVisionProps {
  mission: string
  vision: string
  values: string[]
}

export interface TeamSectionProps {
  teamMembers: TeamMember[]
}

export interface CompanyTimelineProps {
  history: CompanyHistory[]
}

export interface AchievementsProps {
  achievements: Achievement[]
}

// API Response Types
export interface AboutPageResponse {
  success: boolean
  data: AboutPageData
  message?: string
}

export interface TeamMemberResponse {
  success: boolean
  data: TeamMember[]
  message?: string
}

// Form Types
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface NewsletterSubscription {
  email: string
  firstName?: string
  lastName?: string
}

// Layout Types
export interface AboutLayoutProps {
  children: React.ReactNode
}

// SEO Types
export interface AboutSEOData {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  canonical?: string
}

// Error Types
export interface AboutPageError {
  code: string
  message: string
  details?: string
}