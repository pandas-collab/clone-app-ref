import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function AboutPage() {
  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Bourntec</h1>

            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Bourntec is a leading technology solutions provider dedicated to helping businesses
                transform and thrive in the digital age. With years of experience and expertise,
                we deliver innovative IT solutions that drive growth and efficiency.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To empower businesses through innovative technology solutions that drive
                  digital transformation and sustainable growth.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To be the trusted technology partner that enables organizations to
                  achieve their full potential in the digital era.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
