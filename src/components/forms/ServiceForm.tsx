if (formData.title && !serviceId) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, serviceId]);

  // Auto-generate meta title from title
  useEffect(() => {
    if (formData.title && !formData.metaTitle) {
      setFormData(prev => ({ ...prev, metaTitle: formData.title }));
    }
  }, [formData.title, formData.metaTitle]);

  // Set image preview from existing data
  useEffect(() => {
    if (formData.featuredImage) {
      setImagePreview(formData.featuredImage);
    }
  }, [formData.featuredImage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayFieldChange = (
    fieldName: 'keyFeatures' | 'benefits',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (fieldName: 'keyFeatures' | 'benefits') => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeArrayField = (fieldName: 'keyFeatures' | 'benefits', index: number) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, featuredImage: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, featuredImage: 'Image size must be less than 5MB' }));
      return;
    }

    setUploadingImage(true);
    setErrors(prev => ({ ...prev, featuredImage: '' }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'service');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, featuredImage: data.url }));
      setImagePreview(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, featuredImage: 'Failed to upload image' }));
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.longDescription.trim()) {
      newErrors.longDescription = 'Long description is required';
    } else if (formData.longDescription.length < 200) {
      newErrors.longDescription = 'Long description must be at least 200 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.keyFeatures.filter(f => f.trim()).length === 0) {
      newErrors.keyFeatures = 'At least one key feature is required';
    }

    if (formData.benefits.filter(b => b.trim()).length === 0) {
      newErrors.benefits = 'At least one benefit is required';
    }

    if (!formData.metaTitle.trim()) {
      newErrors.metaTitle = 'Meta title is required';
    }

    if (!formData.metaDescription.trim()) {
      newErrors.metaDescription = 'Meta description is required';
    } else if (formData.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description must be 160 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, saveAndContinue = false) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up array fields
      const cleanedData = {
        ...formData,
        keyFeatures: formData.keyFeatures.filter(f => f.trim()),
        benefits: formData.benefits.filter(b => b.trim())
      };

      if (onSubmit) {
        await onSubmit(cleanedData);
      } else {
        const url = serviceId ? `/api/services/${serviceId}` : '/api/services';
        const method = serviceId ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save service');
        }

        if (!saveAndContinue) {
          router.push('/admin/services');
        } else {
          // Show success message or handle save and continue logic
          alert('Service saved successfully!');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors(prev => ({ 
        ...prev, 
        submit: error instanceof Error ? error.message : 'Failed to save service' 
      }));
    } finally {
      setIsSubmitting(false);
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
    <form className="space-y-8" onSubmit={(e) => handleSubmit(e, false)}>
      {/* Basic Information */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter service title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.slug ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="service-slug"
            />
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Content</h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Brief description for cards and previews (minimum 50 characters)"
            />
            <p className="mt-1 text-sm text-gray-500">{formData.description.length} characters</p>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Long Description *
            </label>
            <textarea
              id="longDescription"
              name="longDescription"
              value={formData.longDescription}
              onChange={handleInputChange}
              rows={8}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.longDescription ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Detailed description for the service page (minimum 200 characters)"
            />
            <p className="mt-1 text-sm text-gray-500">{formData.longDescription.length} characters</p>
            {errors.longDescription && <p className="mt-1 text-sm text-red-600">{errors.longDescription}</p>}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Key Features</h3>
          <button
            type="button"
            onClick={() => addArrayField('keyFeatures')}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Add Feature
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.keyFeatures.map((feature, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={(e) => handleArrayFieldChange('keyFeatures', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Feature ${index + 1}`}
              />
              {formData.keyFeatures.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('keyFeatures', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800 focus:outline-none"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.keyFeatures && <p className="mt-2 text-sm text-red-600">{errors.keyFeatures}</p>}
      </div>

      {/* Benefits */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Benefits</h3>
          <button
            type="button"
            onClick={() => addArrayField('benefits')}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + Add Benefit
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => handleArrayFieldChange('benefits', index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Benefit ${index + 1}`}
              />
              {formData.benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('benefits', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800 focus:outline-none"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.benefits && <p className="mt-2 text-sm text-red-600">{errors.benefits}</p>}
      </div>

      {/* Featured Image */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Featured Image</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              id="featuredImage"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploadingImage && <p className="mt-1 text-sm text-blue-600">Uploading...</p>}
            {errors.featuredImage && <p className="mt-1 text-sm text-red-600">{errors.featuredImage}</p>}
          </div>

          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative w-48 h-32">
                <Image
                  src={imagePreview}
                  alt="Featured image preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">SEO Settings</h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title *
            </label>
            <input
              type="text"
              id="metaTitle"
              name="metaTitle"
              value={formData.metaTitle}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.metaTitle ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="SEO title for search engines"
            />
            {errors.metaTitle && <p className="mt-1 text-sm text-red-600">{errors.metaTitle}</p>}
          </div>

          <div>
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description *
            </label>
            <textarea
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.metaDescription ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="SEO description for search engines (max 160 characters)"
            />
            <p className="mt-1 text-sm text-gray-500">{formData.metaDescription.length}/160 characters</p>
            {errors.metaDescription && <p className="mt-1 text-sm text-red-600">{errors.metaDescription}</p>}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Publishing</h3>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            className="px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (serviceId ? 'Update Service' : 'Create Service')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ServiceForm;