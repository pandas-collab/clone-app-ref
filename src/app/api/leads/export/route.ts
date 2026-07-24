import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build query filters
    const where: any = {};
    if (status) where.status = status;
    if (dateFrom) where.createdAt = { gte: new Date(dateFrom) };
    if (dateTo) {
      if (where.createdAt) {
        where.createdAt.lte = new Date(dateTo);
      } else {
        where.createdAt = { lte: new Date(dateTo) };
      }
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      // Generate CSV format
      const csvHeader = 'ID,Name,Email,Company,Phone,Status,Score,Source,Created At\n';
      const csvRows = leads.map(lead =>
        `${lead.id},"${lead.name}","${lead.email}","${lead.company || ''}","${lead.phone || ''}","${lead.status}",${lead.score},"${lead.source}","${lead.createdAt.toISOString()}"`
      ).join('\n');

      const csvContent = csvHeader + csvRows;

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="leads_export.csv"',
        },
      });
    }

    // Default JSON format
    return NextResponse.json({
      success: true,
      leads,
      totalCount: leads.length,
      filters: { status, dateFrom, dateTo },
    });

  } catch (error) {
    console.error('Lead export error:', error);
    return NextResponse.json(
      { success: false, error: 'Export failed' },
      { status: 500 }
    );
  }
}
