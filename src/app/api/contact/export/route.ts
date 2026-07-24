import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { ExportConfiguration, LeadStatus, LeadPriority } from '../../../../types/database';

// GET: Export leads data
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    const format = searchParams.get('format') || 'csv';
    const status = searchParams.get('status')?.split(',') as LeadStatus[] | undefined;
    const priority = searchParams.get('priority')?.split(',') as LeadPriority[] | undefined;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const assignedTo = searchParams.get('assignedTo');

    // Build where clause
    const where: any = {};

    if (status && status.length > 0) {
      where.status = { in: status };
    }

    if (priority && priority.length > 0) {
      where.priority = { in: priority };
    }

    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    // Fetch leads
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    if (format === 'csv') {
      const csvContent = generateCSV(leads);

      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads_export_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else {
      // Return JSON for Excel processing on frontend
      return NextResponse.json({
        success: true,
        data: leads,
        format: 'excel'
      });
    }

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}

function generateCSV(leads: any[]): string {
  const headers = [
    'ID', 'Name', 'Email', 'Phone', 'Company', 'Message',
    'Source', 'Status', 'Priority', 'Score', 'Assigned To',
    'Created At', 'Last Contacted', 'Updated At'
  ];

  const rows = leads.map(lead => [
    lead.id,
    lead.name,
    lead.email,
    lead.phone || '',
    lead.company || '',
    `"${lead.message.replace(/"/g, '""')}"`,
    lead.source,
    lead.status,
    lead.priority,
    lead.score,
    lead.assignedTo || '',
    lead.createdAt.toISOString(),
    lead.lastContactedAt?.toISOString() || '',
    lead.updatedAt.toISOString()
  ]);

  return [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');
}
