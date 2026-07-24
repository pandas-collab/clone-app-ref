import React from 'react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-4">
            We are a team of passionate professionals dedicated to delivering
            exceptional results for our clients.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4">
            To provide innovative solutions that drive business growth and
            create lasting value for our clients.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li>Excellence in everything we do</li>
          <li>Innovation and creativity</li>
          <li>Client-first approach</li>
          <li>Integrity and transparency</li>
        </ul>
      </div>
    </div>
  );
}
