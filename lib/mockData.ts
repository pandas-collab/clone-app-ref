export interface ServiceData {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  keyFeatures: string[];
  benefits: string[];
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioData {
  id: string;
  title: string;
  slug: string;
  clientName: string;
  clientLogo: string;
  industry: string;
  servicesUsed: string[];
  challenge: string;
  solution: string;
  results: string;
  metrics: {
    label: string;
    value: string;
  }[];
  testimonial: {
    content: string;
    author: string;
    position: string;
  };
  featuredImage: string;
  gallery: string[];
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

export interface CareerData {
  id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  remote: boolean;
  salaryRange: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  status: 'active' | 'paused' | 'closed';
  applicationCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplicationData {
  id: string;
  jobId: string;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeUrl: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super-admin';
  avatar?: string;
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: string;
}

export interface RecentActivity {
  id: string;
  type: 'service' | 'portfolio' | 'career' | 'application' | 'user';
  action: 'created' | 'updated' | 'deleted' | 'published' | 'archived';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export const mockAdminUsers: AdminUser[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'super-admin',
    avatar: '/images/avatars/admin.jpg',
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    email: 'manager@company.com',
    name: 'Manager User',
    role: 'admin',
    avatar: '/images/avatars/manager.jpg',
    isActive: true,
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date('2024-01-15T00:00:00Z').toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const mockDashboardMetrics: DashboardMetric[] = [
  {
    id: '1',
    title: 'Total Services',
    value: '12',
    change: 8.2,
    changeType: 'increase',
    icon: 'services'
  },
  {
    id: '2',
    title: 'Portfolio Projects',
    value: '34',
    change: 12.5,
    changeType: 'increase',
    icon: 'portfolio'
  },
  {
    id: '3',
    title: 'Open Positions',
    value: '8',
    change: -2.1,
    changeType: 'decrease',
    icon: 'careers'
  },
  {
    id: '4',
    title: 'Job Applications',
    value: '156',
    change: 15.3,
    changeType: 'increase',
    icon: 'applications'
  }
];

export const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'service',
    action: 'created',
    title: 'New service added',
    description: 'Cloud Infrastructure service was created',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    user: 'Admin User'
  },
  {
    id: '2',
    type: 'portfolio',
    action: 'updated',
    title: 'Portfolio project updated',
    description: 'E-commerce Platform project details were modified',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: 'Manager User'
  },
  {
    id: '3',
    type: 'career',
    action: 'published',
    title: 'Job position published',
    description: 'Senior Frontend Developer position is now live',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: 'Admin User'
  },
  {
    id: '4',
    type: 'application',
    action: 'created',
    title: 'New application received',
    description: 'Application for Full Stack Developer position',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    user: 'System'
  }
];

export const mockServices: ServiceData[] = [
  {
    id: '1',
    title: 'Web Development',
    slug: 'web-development',
    description: 'Custom web applications built with modern technologies for optimal performance and user experience.',
    longDescription: 'Our web development services encompass full-stack development using cutting-edge technologies like React, Next.js, Node.js, and TypeScript. We create scalable, performant web applications that meet your business objectives and provide exceptional user experiences across all devices.',
    category: 'Development',
    keyFeatures: [
      'Responsive Design',
      'Performance Optimization',
      'SEO-Friendly Architecture',
      'Modern Tech Stack',
      'Scalable Solutions'
    ],
    benefits: [
      'Increased online presence',
      'Better user engagement',
      'Higher conversion rates',
      'Improved search rankings',
      'Future-proof technology'
    ],
    metaTitle: 'Professional Web Development Services | Custom Web Applications',
    metaDescription: 'Expert web development services using React, Next.js, and modern technologies. Build scalable, high-performance web applications.',
    featuredImage: '/images/services/web-development.jpg',
    status: 'published',
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updatedAt: new Date('2024-01-20T14:30:00Z')
  },
  {
    id: '2',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    description: 'Native and cross-platform mobile applications for iOS and Android with seamless user experiences.',
    longDescription: 'We specialize in creating mobile applications that deliver exceptional performance on both iOS and Android platforms. Using React Native and native development approaches, we build apps that are fast, intuitive, and aligned with your business goals.',
    category: 'Development',
    keyFeatures: [
      'Cross-Platform Compatibility',
      'Native Performance',
      'Intuitive UI/UX',
      'Offline Functionality',
      'Push Notifications'
    ],
    benefits: [
      'Reach mobile audiences',
      'Improve customer loyalty',
      'Generate new revenue streams',
      'Enhance brand visibility',
      'Provide 24/7 accessibility'
    ],
    metaTitle: 'Mobile App Development Services | iOS & Android Apps',
    metaDescription: 'Professional mobile app development for iOS and Android. Native and cross-platform solutions for your business.',
    featuredImage: '/images/services/mobile-development.jpg',
    status: 'published',
    createdAt: new Date('2024-01-10T10:00:00Z'),
    updatedAt: new Date('2024-01-25T16:45:00Z')
  },
  {
    id: '3',
    title: 'UI/UX Design',
    slug: 'ui-ux-design',
    description: 'User-centered design solutions that create intuitive and engaging digital experiences.',
    longDescription: 'Our UI/UX design services focus on creating user-centered designs that not only look great but also provide intuitive navigation and optimal user experiences. We conduct thorough user research and testing to ensure our designs meet both user needs and business objectives.',
    category: 'Design',
    keyFeatures: [
      'User Research & Analysis',
      'Wireframing & Prototyping',
      'Visual Design',
      'Usability Testing',
      'Design Systems'
    ],
    benefits: [
      'Improved user satisfaction',
      'Higher conversion rates',
      'Reduced bounce rates',
      'Better brand perception',
      'Increased user retention'
    ],
    metaTitle: 'Professional UI/UX Design Services | User Experience Design',
    metaDescription: 'Expert UI/UX design services focused on user-centered design. Create intuitive and engaging digital experiences.',
    featuredImage: '/images/services/ui-ux-design.jpg',
    status: 'draft',
    createdAt: new Date('2024-01-18T12:00:00Z'),
    updatedAt: new Date('2024-01-22T09:15:00Z')
  }
];

export const mockPortfolio: PortfolioData[] = [
  {
    id: '1',
    title: 'E-commerce Platform Redesign',
    slug: 'ecommerce-platform-redesign',
    clientName: 'TechCorp Solutions',
    clientLogo: '/images/clients/techcorp-logo.png',
    industry: 'Technology',
    servicesUsed: ['Web Development', 'UI/UX Design', 'E-commerce Solutions'],
    challenge: 'TechCorp Solutions had an outdated e-commerce platform with poor user experience, resulting in high cart abandonment rates and low conversion. The existing system was not mobile-responsive and lacked modern payment integrations.',
    solution: 'We completely redesigned and rebuilt their e-commerce platform using React and Next.js, implementing a modern, mobile-first design with streamlined checkout process, multiple payment options, and advanced product filtering capabilities.',
    results: 'The new platform resulted in a 65% increase in conversion rates, 40% reduction in cart abandonment, and 85% improvement in mobile user engagement. The site now processes 3x more transactions daily.',
    metrics: [
      { label: 'Conversion Rate Increase', value: '65%' },
      { label: 'Cart Abandonment Reduction', value: '40%' },
      { label: 'Mobile Engagement Boost', value: '85%' },
      { label: 'Daily Transaction Growth', value: '3x' }
    ],
    testimonial: {
      content: 'The team delivered an exceptional platform that exceeded our expectations. Our sales have tripled since the launch.',
      author: 'Sarah Johnson',
      position: 'CEO, TechCorp Solutions'
    },
    featuredImage: '/images/portfolio/ecommerce-redesign.jpg',
    gallery: [
      '/images/portfolio/ecommerce-redesign-1.jpg',
      '/images/portfolio/ecommerce-redesign-2.jpg',
      '/images/portfolio/ecommerce-redesign-3.jpg'
    ],
    status: 'published',
    createdAt: new Date('2024-01-12T14:00:00Z'),
    updatedAt: new Date('2024-01-28T11:20:00Z')
  },
  {
    id: '2',
    title: 'Healthcare Management System',
    slug: 'healthcare-management-system',
    clientName: 'MedCare Clinic',
    clientLogo: '/images/clients/medcare-logo.png',
    industry: 'Healthcare',
    servicesUsed: ['Web Development', 'Database Design', 'Security Implementation'],
    challenge: 'MedCare Clinic needed a comprehensive patient management system to streamline appointments, medical records, and billing processes. The existing paper-based system was inefficient and prone to errors.',
    solution: 'We developed a secure, HIPAA-compliant web application with patient portal, appointment scheduling, electronic health records, and integrated billing system. The solution includes role-based access control and automated notifications.',
    results: 'The system reduced administrative workload by 50%, improved patient satisfaction scores by 30%, and eliminated appointment scheduling conflicts. Patient data retrieval time decreased from hours to seconds.',
    metrics: [
      { label: 'Administrative Workload Reduction', value: '50%' },
      { label: 'Patient Satisfaction Increase', value: '30%' },
      { label: 'Scheduling Conflicts', value: '0%' },
      { label: 'Data Retrieval Speed', value: '99% faster' }
    ],
    testimonial: {
      content: 'This system has revolutionized our clinic operations. We can now focus more on patient care instead of paperwork.',
      author: 'Dr. Michael Chen',
      position: 'Director, MedCare Clinic'
    },
    featuredImage: '/images/portfolio/healthcare-system.jpg',
    gallery: [
      '/images/portfolio/healthcare-system-1.jpg',
      '/images/portfolio/healthcare-system-2.jpg',
      '/images/portfolio/healthcare-system-3.jpg'
    ],
    status: 'published',
    createdAt: new Date('2024-01-08T16:30:00Z'),
    updatedAt: new Date('2024-01-30T13:45:00Z')
  },
  {
    id: '3',
    title: 'Financial Trading Platform',
    slug: 'financial-trading-platform',
    clientName: 'InvestPro',
    clientLogo: '/images/clients/investpro-logo.png',
    industry: 'Finance',
    servicesUsed: ['Web Development', 'Mobile App Development', 'Real-time Data Integration'],
    challenge: 'InvestPro required a high-performance trading platform capable of handling real-time market data, executing trades instantly, and providing advanced charting tools for professional traders.',
    solution: 'We built a sophisticated trading platform using React and Node.js with WebSocket connections for real-time data, advanced charting libraries, and secure payment processing.',
    results: 'The platform now handles over 10,000 concurrent users with 99.9% uptime and sub-millisecond trade execution times.',
    metrics: [
      { label: 'Concurrent Users', value: '10,000+' },
      { label: 'Platform Uptime', value: '99.9%' },
      { label: 'Trade Execution Speed', value: '<1ms' },
      { label: 'User Satisfaction', value: '98%' }
    ],
    testimonial: {
      content: 'The platform performance is outstanding. Our traders love the speed and reliability.',
      author: 'Robert Kim',
      position: 'CTO, InvestPro'
    },
    featuredImage: '/images/portfolio/trading-platform.jpg',
    gallery: [
      '/images/portfolio/trading-platform-1.jpg',
      '/images/portfolio/trading-platform-2.jpg',
      '/images/portfolio/trading-platform-3.jpg'
    ],
    status: 'published',
    createdAt: new Date('2024-01-05T09:00:00Z'),
    updatedAt: new Date('2024-02-01T10:30:00Z')
  }
];

export const getAdminUserByEmail = (email: string): AdminUser | undefined => {
  if (!email || typeof email !== 'string') {
    return undefined;
  }
  return mockAdminUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const getDashboardMetrics = (): DashboardMetric[] => {
  return [...mockDashboardMetrics];
};

export const getRecentActivity = (limit?: number): RecentActivity[] => {
  const activities = [...mockRecentActivity].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  if (limit && typeof limit === 'number' && limit > 0) {
    return activities.slice(0, limit);
  }
  
  return activities;
};

export const getActivityByType = (type: RecentActivity['type']): RecentActivity[] => {
  if (!type) {
    return [];
  }
  return mockRecentActivity.filter(activity => activity.type === type);
};

export const isValidAdminUser = (email: string, password: string): boolean => {
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return false;
  }
  
  const user = getAdminUserByEmail(email);
  return user?.isActive === true;
};

export const updateUserLastLogin = (email: string): AdminUser | null => {
  if (!email || typeof email !== 'string') {
    return null;
  }
  
  const userIndex = mockAdminUsers.findIndex(
    user => user.email.toLowerCase() === email.toLowerCase()
  );
  
  if (userIndex !== -1) {
    mockAdminUsers[userIndex].lastLogin = new Date().toISOString();
    return { ...mockAdminUsers[userIndex] };
  }
  
  return null;
};
