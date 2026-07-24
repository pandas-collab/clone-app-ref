import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { services, portfolioItems } from '@/lib/mockData';
import {
  Cloud,
  Database,
  Shield,
  Bot,
  Settings,
  BarChart3,
  Building2,
  Zap,
  CheckCircle,
  ArrowRight,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';

const iconMap = {
  'Cloud Migration Services': Cloud,
  'Data Analytics Platform': Database,
  'Enterprise Resource Planning': Building2,
  'Digital Transformation': Zap,
  'Cybersecurity Solutions': Shield,
  'AI & Machine Learning': Bot,
  'DevOps Automation': Settings,
  'Business Intelligence': BarChart3,
};

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const service = services.find(s => s.slug === params.slug);

  if (!service) {
    return {
      title: 'Service Not Found - Bourntec',
    };
  }

  return {
    title: `${service.title} - Bourntec Services`,
    description: service.description,
  };
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const service = services.find(s => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const IconComponent = iconMap[service.title] || Settings;

  // Find related case studies
  const relatedCaseStudies = portfolioItems
    .filter(item =>
      item.services?.some(serviceId => serviceId === service.id) ||
      item.technologies?.some(tech =>
        service.keyFeatures?.some(feature =>
          feature.toLowerCase().includes(tech.toLowerCase())
        )
      )
    )
    .slice(0, 3);

  // Find related services (exclude current)
  const relatedServices = services
    .filter(s => s.id !== service.id && s.category === service.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-blue-600">Services</Link>
            <span>/</span>
            <span className="text-gray-900">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="p-4 bg-blue-800 rounded-xl mr-6">
                <IconComponent className="h-8 w-8" />
              </div>
              <div>
                <span className="text-blue-200 text-sm font-medium">
                  {service.category}
                </span>
                <h1 className="text-4xl font-bold mt-2">
                  {service.title}
                </h1>
              </div>
            </div>
            <p className="text-xl text-blue-100 leading-relaxed">
              {service.longDescription || service.description}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Service Overview
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {service.longDescription || service.description}
                </p>
              </div>
            </section>


          {/* Key Benefits */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {service.benefits?.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </section>
            {/* Key Features */}
            {service.keyFeatures && service.keyFeatures.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">

          {/* Key Benefits */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {service.benefits?.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </section>
                  Key Features
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {service.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Business Benefits
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {service.benefits.map((benefit, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {benefit}
                          </h3>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Case Studies */}
            {relatedCaseStudies.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Related Case Studies
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedCaseStudies.map((caseStudy) => (
                    <Card key={caseStudy.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {caseStudy.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {caseStudy.description}
                        </p>
                        <Link
                          href={`/portfolio/${caseStudy.slug}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Case Study
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact CTA */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Interested in This Service?
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Let's discuss how we can help you implement this solution for your business.
              </p>
              <Link href="/contact">
                <Button className="w-full">
                  Contact Us
                </Button>
              </Link>
            </Card>

            {/* Service Stats */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-6">
                Why Choose Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">50+ Projects</div>
                    <div className="text-sm text-gray-600">Successfully delivered</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Expert Team</div>
                    <div className="text-sm text-gray-600">Certified professionals</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Proven Results</div>
                    <div className="text-sm text-gray-600">Measurable outcomes</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Related Services
                </h3>
                <div className="space-y-3">
                  {relatedServices.map((relatedService) => {
                    const RelatedIcon = iconMap[relatedService.title] || Settings;
                    return (
                      <Link
                        key={relatedService.id}
                        href={`/services/${relatedService.slug}`}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <RelatedIcon className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {relatedService.title}
                            </div>
                            <div className="text-xs text-gray-600 line-clamp-1">
                              {relatedService.description}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all services
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}
