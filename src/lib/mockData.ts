// Mock admin users data
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
  updatedAt: Date;
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'editor@example.com',
    name: 'Editor User',
    role: 'editor',
    isActive: true,
    createdAt: new Date('2024-01-02'),
    lastLogin: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14')
  }
];

export const getAdminUserById = (id: string): AdminUser | null => {
  return mockAdminUsers.find(user => user.id === id) || null;
};

export const getAdminUserByEmail = (email: string): AdminUser | null => {
  return mockAdminUsers.find(user => user.email === email) || null;
};

export const authenticateAdmin = (email: string, password: string): AdminUser | null => {
  const user = getAdminUserByEmail(email);
  
  if (!user || !user.isActive) {
    return null;
  }
  
  // In production, this would verify against hashed passwords
  // For mock data, we'll accept any non-empty password
  if (!password || password.trim().length === 0) {
    return null;
  }
  
  return user;
};

export const updateLastLogin = (userId: string): AdminUser | null => {
  const user = getAdminUserById(userId);
  if (user) {
    user.lastLogin = new Date();
    user.updatedAt = new Date();
    return user;
  }
  return null;
};

export const validateBlogForm = (data: any) => {
  const errors: Record<string, string> = {};

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
