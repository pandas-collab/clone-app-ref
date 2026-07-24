import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { sendFollowUpEmail, sendNurtureEmail } from '../../../../../lib/email';
import { EmailTemplateType, ActivityType } from '../../../../../types/database';

interface RouteParams {
  params: {
    id: string;
  };
}

// POST: Send email to lead
export async function POST(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const leadId = params.id;
    const body = await request.json();

    const { message, templateType, sentBy } = body;

    if (!message && !templateType) {
      return NextResponse.json(
        { success: false, error: 'Message or template type is required' },
        { status: 400 }
      );
    }

    // Get lead data
    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    let emailSent = false;

    // Send appropriate email type
    if (templateType) {
      emailSent = await sendNurtureEmail(lead as any, templateType as EmailTemplateType, message);
    } else {
      emailSent = await sendFollowUpEmail(lead as any, message, sentBy);
    }

    if (emailSent) {
      // Update last contacted date
      await prisma.lead.update({
        where: { id: leadId },
        data: {
          lastContactedAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Log activity
      await prisma.leadActivity.create({
        data: {
          leadId,
          type: ActivityType.EMAIL_SENT,
          description: `Email sent: ${templateType || 'Follow-up'}`,
          performedBy: sentBy,
          timestamp: new Date(),
          metadata: { templateType, messagePreview: message?.substring(0, 100) }
        }
      });

      return NextResponse.json({
        success: true,
        message: 'Email sent successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
