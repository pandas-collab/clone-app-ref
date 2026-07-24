import React from 'react';

export default function AboutPage() {
  const values = [
    { icon: "", title: "Mission", description: "Delivering exceptional digital solutions" },
    { icon: "", title: "Vision", description: "Leading innovation in technology" },
    { icon: "", title: "Values", description: "Quality, integrity, and excellence" }
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
