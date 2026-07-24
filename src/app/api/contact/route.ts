import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { sendEmailNotification } from '@/lib/email';
import { calculateLeadScore } from '@/lib/utils';

const prisma = new PrismaClient();

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  source: z.string().default('contact_form'),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  services: z.array(z.string()).optional().default([]),
});

const leadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']),
  notes: z.string().optional(),
});

// POST - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Calculate initial lead score
    const score = calculateLeadScore({
      hasCompany: !!validatedData.company,
      hasPhone: !!validatedData.phone,
      messageLength: validatedData.message.length,
      source: validatedData.source,
      budget: validatedData.budget,
      timeline: validatedData.timeline,
      servicesCount: validatedData.services?.length || 0,
    });

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company,
        phone: validatedData.phone,
        message: validatedData.message,
        source: validatedData.source,
        status: 'new',
        score: score,
        budget: validatedData.budget,
        timeline: validatedData.timeline,
        services: validatedData.services,
      },
    });

    // Send email notification
    await sendEmailNotification({
      type: 'new_lead',
      lead: lead,
      to: process.env.ADMIN_EMAIL || 'admin@company.com',
    });

    // Send welcome email to lead
    await sendEmailNotification({
      type: 'lead_welcome',
      lead: lead,
      to: lead.email,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        leadId: lead.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact form submission error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// GET - Retrieve leads with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const minScore = searchParams.get('minScore');

    // Build filter conditions
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (source) {
      where.source = source;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    if (minScore) {
      where.score = { gte: parseInt(minScore) };
    }

    // Get leads with pagination
    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: { notes: true }
          }
        }
      }),
      prisma.lead.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      }
    });

  } catch (error) {
    console.error('Leads retrieval error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve leads' },
      { status: 500 }
    );
  }
}
