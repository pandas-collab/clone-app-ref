if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const validatedData = serviceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description || '',
        image: validatedData.image || '',
        price: validatedData.price || null,
        features: validatedData.features || [],
        published: validatedData.published || false
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

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Service with this slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}