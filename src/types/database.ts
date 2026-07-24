// Lead and contact form related types

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  message: string
  source: string
  status: LeadStatus
  score: number
  createdAt: Date
  updatedAt: Date
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  CLOSED = 'closed'
}

export interface LeadScore {
  id: string
  leadId: string
  score: number
  factors: ScoreFactor[]
  calculatedAt: Date
}

export interface ScoreFactor {
  name: string
  value: number
  weight: number
}

export interface EmailNotification {
  id: string
  leadId: string
  type: NotificationType
  recipient: string
  subject: string
  body: string
  sentAt: Date
  status: EmailStatus
}

export enum NotificationType {
  LEAD_CREATED = 'lead_created',
  LEAD_UPDATED = 'lead_updated',
  FOLLOW_UP = 'follow_up'
}

export enum EmailStatus {
  PENDING = 'pending',
  SENT = 'sent',
  FAILED = 'failed'
}
