import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 min-h-screen flex items-center">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-20"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Company Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Transforming Business Through
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 block mt-2">
              Innovative Technology
            </span>
          </h1>

          {/* Value Proposition */}
          <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            We empower organizations with cutting-edge solutions in Cloud Platforms,
            Data & Analytics, Enterprise Applications, and Digital Engineering to drive
            sustainable growth and competitive advantage.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl mb-3"></div>
              <h3 className="text-lg font-semibold mb-2">Accelerated Innovation</h3>
              <p className="text-gray-300 text-sm">Fast-track your digital transformation journey</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl mb-3"></div>
              <h3 className="text-lg font-semibold mb-2">Proven Expertise</h3>
              <p className="text-gray-300 text-sm">Industry-leading solutions and best practices</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl mb-3"></div>
              <h3 className="text-lg font-semibold mb-2">Measurable Results</h3>
              <p className="text-gray-300 text-sm">ROI-focused implementations with clear metrics</p>
            </div>
          </div>

          {/* Call-to-Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                Get Started Today
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button
                variant="outline"
                size="lg"
                className="border-white/50 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
              >
                View Our Work
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <p className="text-gray-300 text-sm mb-4">Trusted by industry leaders</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="bg-white/20 px-6 py-2 rounded-full text-white font-medium">Fortune 500</div>
              <div className="bg-white/20 px-6 py-2 rounded-full text-white font-medium">Startups</div>
              <div className="bg-white/20 px-6 py-2 rounded-full text-white font-medium">Enterprise</div>
              <div className="bg-white/20 px-6 py-2 rounded-full text-white font-medium">SMBs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
