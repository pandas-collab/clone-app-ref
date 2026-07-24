if (data.company && data.company.trim().length > 0) {
    score += 15;
  }
  
  // Phone provided (higher engagement likelihood)
  if (data.phone && data.phone.trim().length > 0) {
    score += 10;
  }
  
  // Budget mentioned
  if (data.budget) {
    const budgetRanges = {
      'under-5k': 5,
      '5k-15k': 15,
      '15k-50k': 25,
      'over-50k': 35
    };
    score += budgetRanges[data.budget as keyof typeof budgetRanges] || 0;
  }
  
  // Timeline urgency
  if (data.timeline) {
    const timelineScores = {
      'asap': 20,
      '1-month': 15,
      '3-months': 10,
      '6-months': 5,
      'planning': 2
    };
    score += timelineScores[data.timeline as keyof typeof timelineScores] || 0;
  }
  
  // Multiple services (larger project potential)
  if (data.services && Array.isArray(data.services) && data.services.length > 1) {
    score += data.services.length * 5;
  }
  
  // Message length (more detailed = higher interest)
  if (data.message && data.message.length > 200) {
    score += 5;
  }
  
  return Math.min(score, 100); // Cap at 100
}

// Determine lead status based on score
function getLeadStatus(score: number): string {
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input data
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;
    
    // Calculate lead score and status
    const leadScore = calculateLeadScore(validatedData);
    const leadStatus = getLeadStatus(leadScore);
    
    // Check for duplicate submissions (same email within last hour)
    const recentSubmission = await prisma.contact.findFirst({
      where: {
        email: validatedData.email,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
        }
      }
    });

    if (recentSubmission) {
      return NextResponse.json(
        {
          error: 'Duplicate submission detected. Please wait before submitting another message.'
        },
        { status: 429 }
      );
    }

    // Get client IP for tracking
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';

    // Save to database
    const contact = await prisma.contact.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        subject: validatedData.subject,
        message: validatedData.message,
        source: validatedData.source || 'website',
        budget: validatedData.budget || null,
        timeline: validatedData.timeline || null,
        services: validatedData.services || [],
        leadScore,
        status: leadStatus,
        ipAddress: clientIP,
        userAgent: request.headers.get('user-agent') || null
      }
    });

    // Send notification emails
    try {
      // Send confirmation email to user
      await sendEmail({
        to: validatedData.email,
        subject: 'Thank you for contacting us',
        template: 'contact-confirmation',
        data: {
          name: validatedData.name,
          subject: validatedData.subject,
          message: validatedData.message
        }
      });

      // Send notification to admin
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@company.com';
      await sendEmail({
        to: adminEmail,
        subject: `New ${leadStatus.toUpperCase()} Lead: ${validatedData.subject}`,
        template: 'new-lead-notification',
        data: {
          ...validatedData,
          leadScore,
          leadStatus,
          contactId: contact.id,
          submittedAt: contact.createdAt.toISOString()
        }
      });

      // For hot leads, send urgent notification
      if (leadStatus === 'hot') {
        const urgentEmail = process.env.URGENT_LEADS_EMAIL || adminEmail;
        await sendEmail({
          to: urgentEmail,
          subject: `🔥 URGENT: High-Value Lead - ${validatedData.subject}`,
          template: 'urgent-lead-notification',
          data: {
            ...validatedData,
            leadScore,
            contactId: contact.id
          }
        });
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Continue execution - don't fail the API call due to email issues
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      contactId: contact.id,
      leadScore,
      status: leadStatus
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search');

    // Verify admin authentication (basic check)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Build where clause
    const where: any = {};
    
    if (status && ['hot', 'warm', 'cold', 'contacted', 'converted', 'closed'].includes(status)) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get total count for pagination
    const totalCount = await prisma.contact.count({ where });

    // Get contacts
    const contacts = await prisma.contact.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder as 'asc' | 'desc'
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        subject: true,
        message: true,
        source: true,
        budget: true,
        timeline: true,
        services: true,
        leadScore: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Calculate statistics
    const stats = await prisma.contact.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      contacts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {} as Record<string, number>)
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { contactId, status, notes } = await request.json();

    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!contactId) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['hot', 'warm', 'cold', 'contacted', 'converted', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status provided' },
        { status: 400 }
      );
    }

    // Update contact
    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: {
        ...(status && { status }),
        ...(notes && { notes }),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      contact: updatedContact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}