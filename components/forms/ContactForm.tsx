if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    // Optional field validations
    if (formData.phone && !/^[\+]?[\d\s\-\(\)\.]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.email && formData.email.length > 100) {
      newErrors.email = 'Email must be less than 100 characters';
    }

    if (formData.name && formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    if (formData.company && formData.company.length > 100) {
      newErrors.company = 'Company name must be less than 100 characters';
    }

    if (formData.subject && formData.subject.length > 200) {
      newErrors.subject = 'Subject must be less than 200 characters';
    }

    if (formData.message && formData.message.length > 2000) {
      newErrors.message = 'Message must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit contact form');
      }

      setSubmitStatus('success');
      setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        budget: '',
        timeline: '',
        source: ''
      });

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(
        error instanceof Error 
          ? error.message 
          : 'Failed to send message. Please try again or contact us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
  const errorClassName = "border-red-500 focus:ring-red-500";

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`${inputClassName} ${errors.name ? errorClassName : ''}`}
              placeholder="Enter your full name"
              maxLength={50}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${inputClassName} ${errors.email ? errorClassName : ''}`}
              placeholder="Enter your email address"
              maxLength={100}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`${inputClassName} ${errors.phone ? errorClassName : ''}`}
              placeholder="Enter your phone number"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={`${inputClassName} ${errors.company ? errorClassName : ''}`}
              placeholder="Enter your company name"
              maxLength={100}
              disabled={isSubmitting}
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company}</p>
            )}
          </div>
        </div>

        {/* Project Information Section */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className={`${inputClassName} ${errors.subject ? errorClassName : ''}`}
            placeholder="Brief description of your project or inquiry"
            maxLength={200}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleInputChange}
            className={`${inputClassName} ${errors.message ? errorClassName : ''} resize-vertical`}
            placeholder="Please provide detailed information about your project, requirements, and any specific questions you have..."
            maxLength={2000}
            disabled={isSubmitting}
          />
          <div className="mt-1 flex justify-between items-center">
            {errors.message ? (
              <p className="text-sm text-red-600">{errors.message}</p>
            ) : (
              <span className="text-sm text-gray-500">Minimum 20 characters</span>
            )}
            <span className="text-sm text-gray-400">
              {formData.message.length}/2000
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
              Project Budget
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className={inputClassName}
              disabled={isSubmitting}
            >
              {budgetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
              Project Timeline
            </label>
            <select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className={inputClassName}
              disabled={isSubmitting}
            >
              {timelineOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
            How did you hear about us?
          </label>
          <select
            id="source"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
            className={inputClassName}
            disabled={isSubmitting}
          >
            {sourceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Status Messages */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-green-800">Message Sent Successfully!</h3>
                <p className="mt-1 text-sm text-green-700">{submitMessage}</p>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error Sending Message</h3>
                <p className="mt-1 text-sm text-red-700">{submitMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 active:bg-blue-800'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending Message...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </div>

        {/* Privacy Notice */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            By submitting this form, you agree to our privacy policy. We respect your privacy and will never share your information with third parties.
          </p>
        </div>
      </form>
    </div>
  );
}