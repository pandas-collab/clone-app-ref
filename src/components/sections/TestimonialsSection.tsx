import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface FeaturedTestimonial {
  id: string;
  clientName: string;
  clientLogo: string;
  quote: string;
  rating: number;
  featured: boolean;
  position?: string;
  company?: string;
}

// Mock data for featured testimonials
const featuredTestimonials: FeaturedTestimonial[] = [
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

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what industry leaders say about our solutions and services.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {featuredTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="p-8">
                {/* Rating Stars */}
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-100 mb-6 leading-relaxed text-lg italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Client Info */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.clientName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.clientName}</div>
                    <div className="text-gray-300 text-sm">
                      {testimonial.position}  {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Client Logos Section */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-semibold mb-8 text-gray-200">
            Trusted by Leading Organizations
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
            <div className="bg-white/20 px-8 py-4 rounded-lg backdrop-blur-sm">
              <div className="text-white font-bold text-lg">TechCorp</div>
            </div>
            <div className="bg-white/20 px-8 py-4 rounded-lg backdrop-blur-sm">
              <div className="text-white font-bold text-lg">DataDrive</div>
            </div>
            <div className="bg-white/20 px-8 py-4 rounded-lg backdrop-blur-sm">
              <div className="text-white font-bold text-lg">GlobalEnt</div>
            </div>
            <div className="bg-white/20 px-8 py-4 rounded-lg backdrop-blur-sm">
              <div className="text-white font-bold text-lg">InnovaCorp</div>
            </div>
            <div className="bg-white/20 px-8 py-4 rounded-lg backdrop-blur-sm">
              <div className="text-white font-bold text-lg">FutureTech</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-4 text-white">
            Ready to Join Our Success Stories?
          </h3>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover how our solutions can transform your business. View our portfolio of successful projects and case studies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/portfolio">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4">
                View Case Studies
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white/50 text-white hover:bg-white/10 px-8 py-4">
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
