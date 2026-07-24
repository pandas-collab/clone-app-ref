import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>

        <div className="prose max-w-none">
          <p className="text-lg text-gray-600 mb-6">
            We are a leading technology consulting company specializing in cloud platforms,
            digital transformation, and innovative software solutions.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To empower businesses with cutting-edge technology solutions that drive growth,
                efficiency, and innovation in the digital age.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600">
                To be the trusted partner for businesses seeking to transform and thrive
                in an increasingly digital world.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We stay at the forefront of technology to deliver cutting-edge solutions.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We maintain the highest standards in everything we do.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Partnership</h3>
                <p className="text-gray-600">
                  We work closely with our clients to achieve their goals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
