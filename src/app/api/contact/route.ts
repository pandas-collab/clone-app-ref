import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import {
  Lead,
  ContactFormData,
  LeadStatus,
  LeadPriority,
  LeadScoringCriteria,
  ActivityType,
  ApiResponse,
  LeadListResponse,
  ExportConfiguration
} from '../../../types/database';
import {
  sendNewLeadNotification,
  sendLeadConfirmation,
  sendFollowUpEmail,
  sendNurtureEmail
} from '../../../lib/email';
import { z } from 'zod';

// Validation schemas
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  source: z.string().default('website'),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional()
});

const leadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']).optional(),
  priority: z.enum(['hot', 'warm', 'cold']).optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional()
});

// Lead scoring configuration
const scoringCriteria: LeadScoringCriteria = {
  companyEmail: 10,
  phoneProvided: 5,
  messageLengthBonus: 5,
  keywordMatches: {
    'enterprise': 15,
    'budget': 10,
    'urgent': 12,
    'asap': 12,
    'project': 8,
    'partnership': 10,
    'investment': 15,
    'scale': 8,
    'growth': 8
  },
  sourceWeights: {
    'organic': 10,
    'paid': 8,
    'referral': 15,
    'direct': 12,
    'social': 6,
    'email': 7
  }
};

// Calculate lead score
function calculateLeadScore(formData: ContactFormData): { score: number; priority: LeadPriority } {
  let score = 0;

  // Company email bonus
  if (formData.email && !formData.email.includes('@gmail.') && !formData.email.includes('@yahoo.') &&
      !formData.email.includes('@hotmail.') && !formData.email.includes('@outlook.')) {
    score += scoringCriteria.companyEmail;
  }

  // Phone provided bonus
  if (formData.phone && formData.phone.trim().length > 0) {
    score += scoringCriteria.phoneProvided;
  }

  // Message length bonus
  if (formData.message && formData.message.length > 100) {
    score += scoringCriteria.messageLengthBonus;
  }

  // Keyword matching
  const messageWords = formData.message.toLowerCase().split(/\s+/);
  Object.entries(scoringCriteria.keywordMatches).forEach(([keyword, points]) => {
    if (messageWords.some(word => word.includes(keyword))) {
      score += points;
    }
  });

  // Source weighting
  const source = formData.utm_source || formData.source || 'direct';
  score += scoringCriteria.sourceWeights[source] || 0;

  // Company name provided
  if (formData.company && formData.company.trim().length > 0) {
    score += 7;
  }

  // Determine priority based on score
  let priority: LeadPriority;
  if (score >= 40) {
    priority = LeadPriority.HOT;
  } else if (score >= 20) {
    priority = LeadPriority.WARM;
  } else {
    priority = LeadPriority.COLD;
  }

  return { score: Math.min(score, 100), priority };
}

// Create activity log entry
async function createActivity(leadId: string, type: ActivityType, description: string, performedBy?: string) {
  try {
    await prisma.leadActivity.create({
      data: {
        leadId,
        type,
        description,
        performedBy,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
}

// Sanitize input data
function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    return data.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  return data;
}

// POST: Submit contact form
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const sanitizedData = sanitizeInput(body);

    // Validate input
    const validationResult = contactFormSchema.safeParse(sanitizedData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const formData: ContactFormData = validationResult.data;

    // Calculate lead score and priority
    const { score, priority } = calculateLeadScore(formData);

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
        source: formData.source,
        status: LeadStatus.NEW,
        score,
        priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          utm_source: formData.utm_source,
          utm_medium: formData.utm_medium,
          utm_campaign: formData.utm_campaign,
          userAgent: request.headers.get('user-agent'),
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
        }
      }
    });

    // Create initial activity log
    await createActivity(lead.id, ActivityType.CREATED, `Lead created from ${formData.source}`);

    // Send notifications asynchronously
    Promise.all([
      sendNewLeadNotification(lead as Lead),
      sendLeadConfirmation(lead as Lead)
    ]).catch(error => {
      console.error('Failed to send email notifications:', error);
    });

    const response: ApiResponse<Lead> = {
      success: true,
      data: lead as Lead,
      message: 'Contact form submitted successfully'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Contact form submission error:', error);

    const errorResponse: ApiResponse = {
      success: false,
      error: 'Internal server error',
      message: 'Failed to process contact form submission'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// GET: List leads with filtering and pagination
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as LeadStatus | null;
    const priority = searchParams.get('priority') as LeadPriority | null;
    const assignedTo = searchParams.get('assignedTo');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count
    const totalCount = await prisma.lead.count({ where });

    // Get leads with pagination
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        activities: {
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      }
    });

    const response: LeadListResponse = {
      success: true,
      data: leads as Lead[],
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      filters: {
        status: status || undefined,
        priority: priority || undefined,
        search: search || undefined
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Lead listing error:', error);

    const errorResponse: ApiResponse = {
      success: false,
      error: 'Failed to fetch leads'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT: Update lead status and information
export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('id');

    if (!leadId) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validationResult = leadUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Get current lead data
    const currentLead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!currentLead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: {
        ...updateData,
        updatedAt: new Date(),
        lastContactedAt: updateData.status === 'contacted' ? new Date() : currentLead.lastContactedAt
      }
    });

    // Log activities for changes
    if (updateData.status && updateData.status !== currentLead.status) {
      await createActivity(
        leadId,
        ActivityType.STATUS_CHANGED,
        `Status changed from ${currentLead.status} to ${updateData.status}`,
        updateData.assignedTo
      );
    }

    if (updateData.assignedTo && updateData.assignedTo !== currentLead.assignedTo) {
      await createActivity(
        leadId,
        ActivityType.ASSIGNED,
        `Lead assigned to ${updateData.assignedTo}`,
        updateData.assignedTo
      );
    }

    const response: ApiResponse<Lead> = {
      success: true,
      data: updatedLead as Lead,
      message: 'Lead updated successfully'
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Lead update error:', error);

    const errorResponse: ApiResponse = {
      success: false,
      error: 'Failed to update lead'
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
