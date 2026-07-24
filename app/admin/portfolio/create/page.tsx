if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create portfolio item');
      }

      const portfolioItem = await response.json();

      if (saveAndContinue) {
        // Stay on the form but redirect to edit mode
        router.push(`/admin/portfolio/${portfolioItem.id}`);
      } else {
        // Return to portfolio list
        router.push('/admin/portfolio');
      }
    } catch (err) {
      console.error('Error creating portfolio item:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/portfolio');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <button
            onClick={() => router.push('/admin')}
            className="hover:text-blue-600 transition-colors"
          >
            Admin
          </button>
          <span>/</span>
          <button
            onClick={() => router.push('/admin/portfolio')}
            className="hover:text-blue-600 transition-colors"
          >
            Portfolio
          </button>
          <span>/</span>
          <span className="text-gray-900">Create New</span>
        </nav>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Create New Portfolio Item</h1>
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error creating portfolio item
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-6">
          <PortfolioForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitButtonText="Create Portfolio Item"
            showSaveAndContinue={true}
          />
        </div>
      </div>
    </div>
  );
}