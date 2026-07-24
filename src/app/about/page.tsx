import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 mb-6">
            We are a leading technology consulting company specializing in cloud platforms,
            data analytics, enterprise applications, and digital engineering solutions.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To deliver innovative technology solutions that drive business transformation
                and create lasting value for our clients.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To be the trusted technology partner that enables organizations to thrive
                in the digital age.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
