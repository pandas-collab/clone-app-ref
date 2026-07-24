import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { calculateLeadScore } from '@/lib/utils';

const prisma = new PrismaClient();

const scoreUpdateSchema = z.object({
  criteria: z.object({
    hasCompany: z.boolean(),
    hasPhone: z.boolean(),
    messageLength: z.number(),
    source: z.string(),
    budget: z.string().optional(),
    timeline: z.string().optional(),
    servicesCount: z.number(),
    engagementLevel: z.number().optional(),
    companySize: z.string().optional(),
  })
});

// POST - Update lead score
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = scoreUpdateSchema.parse(body);

    // Calculate new score
    const newScore = calculateLeadScore(validatedData.criteria);

    // Update lead score
    const updatedLead = await prisma.lead.update({
      where: { id: params.id },
      data: {
        score: newScore,
        updatedAt: new Date(),
      }
    });

    // Add scoring note
    await prisma.leadNote.create({
      data: {
        leadId: params.id,
        content: `Lead score updated to ${newScore} based on new criteria evaluation`,
        type: 'score_update',
        createdBy: 'system'
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedLead,
      newScore,
      message: 'Lead score updated successfully'
    });

  } catch (error) {
    console.error('Lead score update error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation error', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to update lead score' },
      { status: 500 }
    );
  }
}
