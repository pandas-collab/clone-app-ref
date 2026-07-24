import { Metadata } from 'next';
import HeroSection from '@/components/sections/HeroSection';
import ServicesGrid from '@/components/sections/ServicesGrid';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

export const metadata: Metadata = {
  title: 'Bourntec Solutions - Digital Transformation & Technology Services',
  description: 'Leading technology consulting firm specializing in Cloud Platforms, Data & Analytics, Enterprise Applications, and Digital Engineering solutions.',
  keywords: 'technology consulting, cloud platforms, data analytics, enterprise applications, digital engineering',
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Services Overview Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive technology solutions to help businesses transform,
              innovate, and stay ahead in today's digital landscape.
            </p>
          </div>
          <ServicesGrid />
        </div>
      </section>

      {/* Featured Testimonials */}
      <TestimonialsSection />

      {/* Recent News/Insights Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Latest Insights
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Stay updated with our latest thoughts on technology trends and industry insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* News Article 1 */}
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Cloud Migration Best Practices for 2024
                </h3>
                <p className="text-gray-600 mb-4">
                  Discover the latest strategies and methodologies for successful cloud migration projects.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Dec 15, 2023</span>
                  <a
                    href="/services"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Read More ->
                  </a>
                </div>
              </div>
            </article>

            {/* News Article 2 */}
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-500 to-teal-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Data Analytics Trends Shaping Business Intelligence
                </h3>
                <p className="text-gray-600 mb-4">
                  Explore how modern analytics platforms are revolutionizing decision-making processes.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Dec 12, 2023</span>
                  <a
                    href="/services"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Read More ->
                  </a>
                </div>
              </div>
            </article>

            {/* News Article 3 */}
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Enterprise Application Modernization Guide
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn how to modernize legacy applications for improved performance and scalability.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Dec 10, 2023</span>
                  <a
                    href="/services"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Read More ->
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
