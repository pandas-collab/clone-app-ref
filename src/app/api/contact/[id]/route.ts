import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { ActivityType } from '../../../../types/database';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET: Get individual lead with activities
export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const leadId = params.id;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        activities: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lead
    });

  } catch (error) {
    console.error('Lead fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

// DELETE: Delete lead (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const leadId = params.id;

    // Soft delete by updating status
    await prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'closed',
        updatedAt: new Date(),
        metadata: {
          deletedAt: new Date().toISOString(),
          deletedBy: 'admin' // You might want to get this from auth
        }
      }
    });

    // Log activity
    await prisma.leadActivity.create({
      data: {
        leadId,
        type: ActivityType.STATUS_CHANGED,
        description: 'Lead deleted (closed)',
        performedBy: 'admin',
        timestamp: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('Lead deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
