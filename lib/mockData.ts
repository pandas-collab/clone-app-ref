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
    solution: 'We built a sophisticated trading platform using React and Node.js with WebSocket connections for real-time data, advanced charting libraries, and secure payment processing. The platform includes both web and mobile applications.',
    results: 'The platform now handles over 10,000 concurrent users, processes trades in under 100ms, and has achieved 99.9% uptime. User adoption increased by 200% within the first quarter.',
    metrics: [
      { label: 'Concurrent Users', value: '10,000+' },
      { label: 'Trade Execution Speed', value: '<100ms' },
      { label: 'Platform Uptime', value: '99.9%' },
      { label: 'User Adoption Growth', value: '200%' }
    ],
    testimonial: {
      content: 'The platform performance is outstanding. Our traders love the speed and reliability of the new system.',
      author: 'Robert Martinez',
      position: 'CTO, InvestPro'
    },
    featuredImage: '/images/portfolio/trading-platform.jpg',
    gallery: [
      '/images/portfolio/trading-platform-1.jpg',
      '/images/portfolio/trading-platform-2.jpg',
      '/images/portfolio/trading-platform-3.jpg'
    ],
    status: 'draft',
    createdAt: new Date('2024-01-22T09:00:00Z'),
    updatedAt: new Date('2024-02-01T10:30:00Z')
  }
];

export const mockCareers: CareerData[] = [
  {
    id: '1',
    title: 'Senior Full Stack Developer',
    slug: 'senior-full-stack-developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'full-time',
    remote: true,
    salaryRange: '$120,000 - $160,000',
    description: 'We are seeking an experienced Full Stack Developer to join our growing engineering team. You will be responsible for developing and maintaining web applications using modern technologies.',
    requirements: [
      '5+ years of experience in full stack development',
      'Proficiency in React, Node.js, and TypeScript',
      'Experience with databases (PostgreSQL, MongoDB)',
      'Knowledge of cloud platforms (AWS, GCP)',
      'Strong problem-solving skills'
    ],
    responsibilities: [
      'Develop and maintain web applications',
      'Collaborate with design and product teams',
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Mentor junior developers'
    ],
    benefits: [
      'Competitive salary and equity',
      'Flexible working hours',
      'Remote work options',
      'Health insurance',
      'Professional development budget'
    ],
    status: 'active',
    applicationCount: 24,
    createdAt: new Date('2024-01-15T09:00:00Z'),
    updatedAt: new Date('2024-02-01T14:20:00Z')
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    department: 'Design',
    location: 'New York, NY',
    type: 'full-time',
    remote: false,
    salaryRange: '$80,000 - $110,000',
    description: 'Join our design team to create intuitive and engaging user experiences for our digital products. You will work closely with product managers and developers to bring designs to life.',
    requirements: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma, Sketch, or Adobe Creative Suite',
      'Strong portfolio demonstrating design process',
      'Understanding of user-centered design principles',
      'Experience with prototyping tools'
    ],
    responsibilities: [
      'Create user interface designs and prototypes',
      'Conduct user research and usability testing',
      'Collaborate with development teams',
      'Maintain design systems and style guides',
      'Present design concepts to stakeholders'
    ],
    benefits: [
      'Creative work environment',
      'Latest design tools and software',
      'Conference and workshop attendance',
      'Flexible PTO policy',
      'Team building activities'
    ],
    status: 'active',
    applicationCount: 18,
    createdAt: new Date('2024-01-20T11:30:00Z'),
    updatedAt: new Date('2024-01-28T16:45:00Z')
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    slug: 'devops-engineer',
    department: 'Infrastructure',
    location: 'Austin, TX',
    type: 'full-time',
    remote: true,
    salaryRange: '$100,000 - $140,000',
    description: 'We are looking for a DevOps Engineer to help us scale our infrastructure and improve our deployment processes. You will work on automation, monitoring, and security.',
    requirements: [
      '4+ years of DevOps or infrastructure experience',
      'Experience with AWS, Docker, and Kubernetes',
      'Knowledge of CI/CD pipelines',
      'Scripting skills (Python, Bash)',
      'Understanding of security best practices'
    ],
    responsibilities: [
      'Manage cloud infrastructure',
      'Implement CI/CD pipelines',
      'Monitor system performance',
      'Ensure security compliance',
      'Automate deployment processes'
    ],
    benefits: [
      'Cutting-edge technology stack',
      'Learning and development opportunities',
      'Stock options',
      '401(k) matching',
      'Unlimited vacation policy'
    ],
    status: 'paused',
    applicationCount: 12,
    createdAt: new Date('2024-01-25T13:15:00Z'),
    updatedAt: new Date('2024-01-30T10:00:00Z')
  }
];

export const mockApplications: ApplicationData[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Full Stack Developer',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    coverLetter: 'I am excited to apply for the Senior Full Stack Developer position. With over 6 years of experience in full stack development, I have worked extensively with React, Node.js, and TypeScript. My recent project involved building a scalable e-commerce platform that serves over 100,000 users.',
    resumeUrl: '/documents/resumes/john-smith-resume.pdf',
    portfolioUrl: 'https://johnsmith.dev',
    linkedinUrl: 'https://linkedin.com/in/johnsmith',
    status: 'reviewing',
    createdAt: new Date('2024-01-28T14:30:00Z'),
    updatedAt: new Date('2024-02-01T09:15:00Z')
  },
  {
    id: '2',
    jobId: '1',
    jobTitle: 'Senior Full Stack Developer',
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@email.com',
    phone: '+1 (555) 234-5678',
    coverLetter: 'As a passionate full stack developer with 5 years of experience, I am thrilled about the opportunity to join your team. I have successfully delivered multiple React and Node.js projects and have experience with cloud platforms including AWS and Google Cloud.',
    resumeUrl: '/documents/resumes/emily-johnson-resume.pdf',
    portfolioUrl: 'https://emilyjohnson.portfolio.com',
    status: 'shortlisted',
    createdAt: new Date('2024-01-30T16:45:00Z'),
    updatedAt: new Date('2024-02-02T11:30:00Z')
  },
  {
    id: '3',
    jobId: '2',
    jobTitle: 'UI/UX Designer',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    phone: '+1 (555) 345-6789',
    coverLetter: 'I am a creative UI/UX designer with 4 years of experience in creating user-centered designs. My portfolio includes projects for both startups and established companies, focusing on mobile-first design and accessibility.',
    resumeUrl: '/documents/resumes/michael-brown-resume.pdf',
    portfolioUrl: 'https://michaelbrown.design',
    linkedinUrl: 'https://linkedin.com/in/michaelbrown',
    status: 'pending',
    createdAt: new Date('2024-02-01T10:20:00Z'),
    updatedAt: new Date('2024-02-01T10:20:00Z')
  }
];

// Utility functions for working with mock data
export const getServiceById = (id: string): ServiceData | undefined => {
  return mockServices.find(service => service.id === id);
};

export const getServiceBySlug = (slug: string): ServiceData | undefined => {
  return mockServices.find(service => service.slug === slug);
};

export const getPortfolioById = (id: string): PortfolioData | undefined => {
  return mockPortfolio.find(item => item.id === id);
};

export const getPortfolioBySlug = (slug: string): PortfolioData | undefined => {
  return mockPortfolio.find(item => item.slug === slug);
};

export const getCareerById = (id: string): CareerData | undefined => {
  return mockCareers.find(job => job.id === id);
};

export const getCareerBySlug = (slug: string): CareerData | undefined => {
  return mockCareers.find(job => job.slug === slug);
};

export const getApplicationById = (id: string): ApplicationData | undefined => {
  return mockApplications.find(app => app.id === id);
};

export const getApplicationsByJobId = (jobId: string): ApplicationData[] => {
  return mockApplications.filter(app => app.jobId === jobId);
};

export const filterServicesByCategory = (category: string): ServiceData[] => {
  return mockServices.filter(service => service.category === category);
};

export const filterPortfolioByIndustry = (industry: string): PortfolioData[] => {
  return mockPortfolio.filter(item => item.industry === industry);
};

export const filterCareersByDepartment = (department: string): CareerData[] => {
  return mockCareers.filter(job => job.department === department);
};

export const filterApplicationsByStatus = (status: ApplicationData['status']): ApplicationData[] => {
  return mockApplications.filter(app => app.status === status);
};

// Constants for form options
export const SERVICE_CATEGORIES = [
  'Development',
  'Design',
  'Consulting',
  'Marketing',
  'Support'
];

export const PORTFOLIO_INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Real Estate',
  'Manufacturing',
  'Entertainment'
];

export const JOB_DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'Infrastructure',
  'Operations',
  'Human Resources'
];

export const JOB_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'freelance'
] as const;

export const APPLICATION_STATUSES = [
  'pending',
  'reviewing',
  'shortlisted',
  'rejected',
  'hired'
] as const;

export const JOB_STATUSES = [
  'active',
  'paused',
  'closed'
] as const;

export const CONTENT_STATUSES = [
  'published',
  'draft'
] as const;