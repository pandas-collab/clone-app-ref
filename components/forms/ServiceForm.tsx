if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.keyFeatures.filter(feature => feature.trim()).length === 0) {
      newErrors.keyFeatures = 'At least one key feature is required';
    }

    if (formData.metaTitle && formData.metaTitle.length > 60) {
      newErrors.metaTitle = 'Meta title should be 60 characters or less';
    }

    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description should be 160 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: prev.slug === generateSlug(prev.title) || !prev.slug ? generateSlug(value) : prev.slug,
      metaTitle: prev.metaTitle === prev.title || !prev.metaTitle ? value : prev.metaTitle
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (field: 'keyFeatures' | 'benefits', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'keyFeatures' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'keyFeatures' | 'benefits', index: number) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      handleInputChange('featuredImage', data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrors(prev => ({ ...prev, featuredImage: 'Failed to upload image' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, saveAndContinue = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Filter out empty array items
      const cleanedData = {
        ...formData,
        keyFeatures: formData.keyFeatures.filter(feature => feature.trim()),
        benefits: formData.benefits.filter(benefit => benefit.trim())
      };

      if (onSubmit) {
        await onSubmit(cleanedData);
      } else {
        const url = initialData?.id 
          ? `/api/services/${initialData.id}` 
          : '/api/services';
        
        const method = initialData?.id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedData),
        });

        if (!response.ok) {
          throw new Error('Failed to save service');
        }

        if (!saveAndContinue) {
          router.push('/admin/services');
        }
      }
    } catch (error) {
      console.error('Error saving service:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to save service. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.push('/admin/services');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter service title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="url-friendly-name"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="cloud-solutions">Cloud Solutions</option>
                <option value="data-analytics">Data Analytics</option>
                <option value="consulting">Consulting</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the service"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description
              </label>
              <textarea
                id="longDescription"
                value={formData.longDescription}
                onChange={(e) => handleInputChange('longDescription', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed description of the service"
              />
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Key Features</h3>
          
          {formData.keyFeatures.map((feature, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleArrayChange('keyFeatures', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Feature ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeArrayItem('keyFeatures', index)}
                disabled={formData.keyFeatures.length <= 1}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('keyFeatures')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Feature
          </button>
          {errors.keyFeatures && <p className="text-red-500 text-sm mt-1">{errors.keyFeatures}</p>}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Benefits</h3>
          
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2 mb-3">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Benefit ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeArrayItem('benefits', index)}
                disabled={formData.benefits.length <= 1}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => addArrayItem('benefits')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Benefit
          </button>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Featured Image</h3>
          
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-3"
            />
            {formData.featuredImage && (
              <div className="mb-3">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
            {errors.featuredImage && <p className="text-red-500 text-sm">{errors.featuredImage}</p>}
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">SEO Metadata</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title ({formData.metaTitle.length}/60)
              </label>
              <input
                type="text"
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.metaTitle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="SEO title for search engines"
              />
              {errors.metaTitle && <p className="text-red-500 text-sm mt-1">{errors.metaTitle}</p>}
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description ({formData.metaDescription.length}/160)
              </label>
              <textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.metaDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="SEO description for search engines"
              />
              {errors.metaDescription && <p className="text-red-500 text-sm mt-1">{errors.metaDescription}</p>}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Publication Status</h3>
          
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="mr-2"
              />
              Draft
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="published"
                checked={formData.status === 'published'}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="mr-2"
              />
              Published
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          {errors.submit && (
            <p className="text-red-500 text-sm w-full">{errors.submit}</p>
          )}
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save & Continue'}
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : (initialData?.id ? 'Update Service' : 'Create Service')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}