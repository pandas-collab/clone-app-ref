if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (!data.slug || data.slug.trim().length < 3) {
    errors.slug = 'Slug must be at least 3 characters long';
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validatePortfolioForm = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (!data.clientName || data.clientName.trim().length < 2) {
    errors.clientName = 'Client name is required';
  }

  if (!data.industry) {
    errors.industry = 'Industry is required';
  }

  if (!data.challenge || data.challenge.trim().length < 20) {
    errors.challenge = 'Challenge description must be at least 20 characters long';
  }

  if (!data.solution || data.solution.trim().length < 20) {
    errors.solution = 'Solution description must be at least 20 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};