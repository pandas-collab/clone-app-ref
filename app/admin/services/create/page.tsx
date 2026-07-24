if (!data.title || !data.description || !data.category) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create service');
      }

      const service = await response.json();
      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      console.error('Error creating service:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAndContinue = async (data: ServiceCreateData) => {
    if (!data.title || !data.description || !data.category) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create service');
      }

      const service = await response.json();
      router.push(`/admin/services/${service.id}`);
      router.refresh();
    } catch (err) {
      console.error('Error creating service:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/services');
  };

  const initialData: ServiceCreateData = {
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    category: '',
    keyFeatures: [''],
    benefits: [''],
    metaTitle: '',
    metaDescription: '',
    featuredImage: '',
    status: 'draft',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <div className="flex items-center">
                <a
                  href="/admin"
                  className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  Admin
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <a
                  href="/admin/services"
                  className="ml-4 text-gray-400 hover:text-gray-500 transition-colors duration-200"
                >
                  Services
                </a>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <span className="ml-4 text-gray-500 font-medium">Create New Service</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Service</h1>
          <p className="mt-2 text-gray-600">
            Add a new service to your website. Fill in all the required information to create a comprehensive service listing.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white shadow-sm rounded-lg">
          <ServiceForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onSaveAndContinue={handleSaveAndContinue}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitButtonText="Create Service"
          />
        </div>
      </div>
    </div>
  );
}