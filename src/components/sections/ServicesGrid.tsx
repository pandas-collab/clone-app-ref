import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FeaturedService {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  featured: boolean;
}

// Mock data for featured services
const featuredServices: FeaturedService[] = [
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

export default function ServicesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {featuredServices.map((service) => (
        <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div className="p-8 text-center">
            {/* Service Icon */}
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-200">
              {service.icon}
            </div>

            {/* Service Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
              {service.title}
            </h3>

            {/* Service Description */}
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
              {service.description}
            </p>

            {/* Learn More Button */}
            <Link href={`/services/${service.slug}`}>
              <Button
                variant="outline"
                className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200"
              >
                Learn More
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Hover Accent */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
        </Card>
      ))}
    </div>
  );
}
