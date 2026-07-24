if (status === 'loading') return;
    
    if (!session?.user || session.user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }

    if (!serviceId) {
      setError('Service ID is required');
      setLoading(false);
      return;
    }

    fetchService();
  }, [session, status, serviceId, router]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/services/${serviceId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Service not found');
        }
        throw new Error('Failed to fetch service');
      }

      const data = await response.json();
      setService(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!service || !serviceId) return;

    try {
      setDeleting(true);
      setError(null);

      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete service');
      }

      router.push('/admin/services?message=Service deleted successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">Error</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/admin/services')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-4">Service Not Found</h2>
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/admin/services')}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Back to Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">Delete Service</h3>
                <p className="text-sm text-red-700">This action cannot be undone.</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Service Details</h4>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <span className="text-sm text-gray-900 text-right max-w-xs">{service.name}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">Category:</span>
                  <span className="text-sm text-gray-900">{service.category}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">Price:</span>
                  <span className="text-sm text-gray-900">${service.price}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-600">Slug:</span>
                  <span className="text-sm text-gray-900">{service.slug}</span>
                </div>
                
                {service.description && (
                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-600 block mb-2">Description:</span>
                    <p className="text-sm text-gray-900 leading-relaxed">{service.description}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this service? This action will permanently remove the service and all associated data. This cannot be undone.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={deleting}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {deleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Service'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}