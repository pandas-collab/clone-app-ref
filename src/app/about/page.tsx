import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              We are a team of passionate professionals dedicated to delivering
              exceptional digital solutions that drive business growth.
            </p>
            <p className="text-gray-600">
              With years of experience in web development, design, and digital marketing,
              we help businesses establish a strong online presence.
            </p>
          </div>
          <div>
            <img
              src="/images/about-us.jpg"
              alt="About Us"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Mission</h3>
            <p className="text-gray-600">
              To empower businesses through innovative digital solutions.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Vision</h3>
            <p className="text-gray-600">
              To be the leading partner for digital transformation.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Values</h3>
            <p className="text-gray-600">
              Quality, integrity, and customer success drive everything we do.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
