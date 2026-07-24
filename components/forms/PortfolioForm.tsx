if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }

    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }

    if (formData.servicesUsed.length === 0) {
      newErrors.servicesUsed = 'At least one service must be selected';
    }

    if (!formData.challenge.trim()) {
      newErrors.challenge = 'Challenge description is required';
    }

    if (!formData.solution.trim()) {
      newErrors.solution = 'Solution description is required';
    }

    if (!formData.results.trim()) {
      newErrors.results = 'Results description is required';
    }

    if (formData.metrics.filter(metric => metric.trim()).length === 0) {
      newErrors.metrics = 'At least one metric is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((
    field: keyof PortfolioFormData,
    value: any
  ) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when title changes
      if (field === 'title' && !portfolioId) {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors, generateSlug, portfolioId]);

  const handleServiceToggle = useCallback((service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesUsed: prev.servicesUsed.includes(service)
        ? prev.servicesUsed.filter(s => s !== service)
        : [...prev.servicesUsed, service]
    }));
  }, []);

  const handleMetricChange = useCallback((index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.map((metric, i) => i === index ? value : metric)
    }));
  }, []);

  const addMetric = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      metrics: [...prev.metrics, '']
    }));
  }, []);

  const removeMetric = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index)
    }));
  }, []);

  const handleLogoUpload = useCallback(async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'image');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      const { url } = await response.json();
      setFormData(prev => ({ ...prev, clientLogo: url }));
      setLogoPreview(url);
    } catch (error) {
      console.error('Logo upload error:', error);
      setErrors(prev => ({
        ...prev,
        clientLogo: 'Failed to upload logo. Please try again.'
      }));
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent, saveAndContinue = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const cleanedData = {
        ...formData,
        metrics: formData.metrics.filter(metric => metric.trim())
      };

      if (onSubmit) {
        await onSubmit(cleanedData);
      } else {
        const url = portfolioId 
          ? `/api/portfolio/${portfolioId}` 
          : '/api/portfolio';
        
        const method = portfolioId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save portfolio');
        }
      }

      if (!saveAndContinue) {
        router.push('/admin/portfolio');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save portfolio'
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, onSubmit, portfolioId, router]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter project title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="url-friendly-slug"
              />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
            </div>

            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.clientName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter client name"
              />
              {errors.clientName && <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>}
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                id="industry"
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.industry ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select industry</option>
                {INDUSTRY_OPTIONS.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
              {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
            </div>
          </div>

          {/* Client Logo Upload */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Logo
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {logoPreview ? (
                  <div className="mb-4">
                    <Image
                      src={logoPreview}
                      alt="Client logo preview"
                      width={120}
                      height={60}
                      className="mx-auto object-contain"
                    />
                  </div>
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>{logoPreview ? 'Change logo' : 'Upload logo'}</span>
                    <input
                      id="logo-upload"
                      name="logo-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file);
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
            {errors.clientLogo && <p className="mt-1 text-sm text-red-600">{errors.clientLogo}</p>}
          </div>
        </div>

        {/* Services Used */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Services Used *</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {SERVICE_OPTIONS.map(service => (
              <label key={service} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.servicesUsed.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{service}</span>
              </label>
            ))}
          </div>
          {errors.servicesUsed && <p className="mt-1 text-sm text-red-600">{errors.servicesUsed}</p>}
        </div>

        {/* Project Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Details</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="challenge" className="block text-sm font-medium text-gray-700 mb-2">
                Challenge *
              </label>
              <textarea
                id="challenge"
                rows={4}
                value={formData.challenge}
                onChange={(e) => handleInputChange('challenge', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.challenge ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the client's challenge or problem..."
              />
              {errors.challenge && <p className="mt-1 text-sm text-red-600">{errors.challenge}</p>}
            </div>

            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-2">
                Solution *
              </label>
              <textarea
                id="solution"
                rows={4}
                value={formData.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.solution ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe how you solved the challenge..."
              />
              {errors.solution && <p className="mt-1 text-sm text-red-600">{errors.solution}</p>}
            </div>

            <div>
              <label htmlFor="results" className="block text-sm font-medium text-gray-700 mb-2">
                Results *
              </label>
              <textarea
                id="results"
                rows={4}
                value={formData.results}
                onChange={(e) => handleInputChange('results', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.results ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the outcomes and impact..."
              />
              {errors.results && <p className="mt-1 text-sm text-red-600">{errors.results}</p>}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Key Metrics *</h2>
          
          <div className="space-y-3">
            {formData.metrics.map((metric, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={metric}
                  onChange={(e) => handleMetricChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 25% increase in conversions"
                />
                {formData.metrics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMetric(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={addMetric}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              + Add Metric
            </button>
          </div>
          {errors.metrics && <p className="mt-1 text-sm text-red-600">{errors.metrics}</p>}
        </div>

        {/* Testimonial */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Client Testimonial</h2>
          
          <textarea
            rows={4}
            value={formData.testimonial}
            onChange={(e) => handleInputChange('testimonial', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Client feedback or testimonial (optional)..."
          />
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Publication Status</h2>
          
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Draft</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Published</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push('/admin/portfolio')}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="px-4 py-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save & Return'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}