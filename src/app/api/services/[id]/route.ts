if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            portfolioItems: true
          }
        }
      }
    });

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = updateServiceSchema.parse(body);

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    });

    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Check for slug uniqueness if slug is being updated
    if (validatedData.slug && validatedData.slug !== existingService.slug) {
      const existingSlug = await prisma.service.findUnique({
        where: { slug: validatedData.slug }
      });

      if (existingSlug) {
        return NextResponse.json(
          { error: 'A service with this slug already exists' },
          { status: 409 }
        );
      }
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error('Failed to update service:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            portfolioItems: true
          }
        }
      }
    });

    if (!existingService) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Check if service has associated portfolio items
    if (existingService._count.portfolioItems > 0) {
      return NextResponse.json(
        { error: 'Cannot delete service with associated portfolio items' },
        { status: 409 }
      );
    }

    await prisma.service.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}