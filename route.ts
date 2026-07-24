if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = serviceSchema.parse(body);

    // Generate slug from title if not provided
    const slug = validatedData.slug || validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingService = await prisma.service.findUnique({
      where: { slug }
    });

    if (existingService) {
      return NextResponse.json(
        { error: 'A service with this slug already exists' },
        { status: 409 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        slug,
        image: validatedData.image || '',
        price: validatedData.price,
        features: validatedData.features || [],
        category: validatedData.category || 'general',
        isActive: validatedData.isActive ?? true
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid service data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}