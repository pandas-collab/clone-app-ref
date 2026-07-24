import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Export leads data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build filter conditions
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (format === 'csv') {
      // Generate CSV
      const csvHeader = 'ID,Name,Email,Company,Phone,Status,Score,Source,Created,Message\n';
      const csvRows = leads.map(lead =>
        `"${lead.id}","${lead.name}","${lead.email}","${lead.company || ''}","${lead.phone || ''}","${lead.status}",${lead.score},"${lead.source}","${lead.createdAt.toISOString()}","${lead.message.replace(/"/g, '""')}"`
      ).join('\n');

      const csvContent = csvHeader + csvRows;

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Return JSON format
    return NextResponse.json({
      success: true,
      data: leads,
      exportedAt: new Date().toISOString(),
      totalRecords: leads.length
    });

  } catch (error) {
    console.error('Leads export error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to export leads' },
      { status: 500 }
    );
  }
}
