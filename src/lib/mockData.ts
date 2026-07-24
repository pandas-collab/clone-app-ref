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

// Featured Services Data
export const featuredServices = [
  {
    id: '1',
    title: 'Cloud Platforms',
    description: 'Comprehensive cloud migration, architecture design, and optimization services for AWS, Azure, and Google Cloud Platform.',
    icon: '',
    slug: 'cloud-platforms',
    featured: true
  },
  {
    id: '2',
    title: 'Data & Analytics',
    description: 'Advanced data engineering, business intelligence, machine learning, and AI solutions to unlock insights from your data.',
    icon: '',
    slug: 'data-analytics',
    featured: true
  },
  {
    id: '3',
    title: 'Enterprise Applications',
    description: 'Custom enterprise software development, ERP implementations, CRM solutions, and application modernization.',
    icon: '',
    slug: 'enterprise-applications',
    featured: true
  },
  {
    id: '4',
    title: 'Digital Engineering',
    description: 'Full-stack development, DevOps, microservices architecture, and modern application development practices.',
    icon: '',
    slug: 'digital-engineering',
    featured: true
  }
];

// Featured Testimonials Data
export const featuredTestimonials = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    clientLogo: '/images/placeholder.png',
    quote: 'Bourntec Solutions transformed our legacy systems into a modern, scalable cloud infrastructure. Their expertise in cloud migration saved us 40% in operational costs while improving performance significantly.',
    rating: 5,
    featured: true,
    position: 'CTO',
    company: 'TechCorp Industries'
  },
  {
    id: '2',
    clientName: 'Michael Chen',
    clientLogo: '/images/placeholder.png',
    quote: 'The data analytics platform they built for us provides real-time insights that drive our business decisions. The ROI was evident within the first quarter of implementation.',
    rating: 5,
    featured: true,
    position: 'VP of Operations',
    company: 'DataDrive Solutions'
  },
  {
    id: '3',
    clientName: 'Emily Rodriguez',
    clientLogo: '/images/placeholder.png',
    quote: 'Outstanding digital engineering services. They delivered a complex enterprise application on time and under budget. Their team\'s technical expertise and project management skills are top-notch.',
    rating: 5,
    featured: true,
    position: 'Head of Digital Innovation',
    company: 'Global Enterprises Ltd'
  }
];

// Featured News Data
export const featuredNews = [
  {
    id: '1',
    title: 'Cloud Migration Best Practices for 2024',
    excerpt: 'Discover the latest strategies and methodologies for successful cloud migration projects.',
    publishedAt: '2023-12-15T00:00:00Z',
    featuredImage: '/images/placeholder.png',
    slug: 'cloud-migration-best-practices-2024'
  },
  {
    id: '2',
    title: 'Data Analytics Trends Shaping Business Intelligence',
    excerpt: 'Explore how modern analytics platforms are revolutionizing decision-making processes.',
    publishedAt: '2023-12-12T00:00:00Z',
    featuredImage: '/images/placeholder.png',
    slug: 'data-analytics-trends-business-intelligence'
  },
  {
    id: '3',
    title: 'Enterprise Application Modernization Guide',
    excerpt: 'Learn how to modernize legacy applications for improved performance and scalability.',
    publishedAt: '2023-12-10T00:00:00Z',
    featuredImage: '/images/placeholder.png',
    slug: 'enterprise-application-modernization-guide'
  }
];
