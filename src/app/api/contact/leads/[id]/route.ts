import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { sendEmailNotification } from '@/lib/email';

const prisma = new PrismaClient();

const leadUpdateSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'closed']).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

// GET - Get individual lead
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: params.id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lead
    });

  } catch (error) {
    console.error('Lead retrieval error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve lead' },
      { status: 500 }
    );
  }
}

// PUT - Update lead status and information
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = leadUpdateSchema.parse(body);

    // Get current lead to check for status changes
    const currentLead = await prisma.lead.findUnique({
      where: { id: params.id }
    });

    if (!currentLead) {
      return NextResponse.json(
        { success: false, message: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update lead
    const updatedLead = await prisma.lead.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      }
    });

    // Add note if provided
    if (validatedData.notes) {
      await prisma.leadNote.create({
        data: {
          leadId: params.id,
          content: validatedData.notes,
          type: 'status_change',
          createdBy: 'system' // In real app, this would be the current user
        }
      });
    }

    // Send notification if status changed
    if (validatedData.status && validatedData.status !== currentLead.status) {
      await sendEmailNotification({
        type: 'status_change',
        lead: updatedLead,
        to: process.env.ADMIN_EMAIL || 'admin@company.com',
        previousStatus: currentLead.status,
        newStatus: validatedData.status,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: 'Lead updated successfully'
    });

  } catch (error) {
    console.error('Lead update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE - Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete associated notes first
    await prisma.leadNote.deleteMany({
      where: { leadId: params.id }
    });

    // Delete the lead
    await prisma.lead.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('Lead deletion error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
