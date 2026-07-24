import React from 'react';

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Job Applications</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No applications found.</p>
      </div>
    </div>
  );
}
