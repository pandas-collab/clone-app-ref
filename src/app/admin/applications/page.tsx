'use client';
import React, { useState, useEffect } from 'react';

interface JobApplication {
  id: string;
  name: string;
  email: string;
  position: string;
  status: string;
  submittedAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching applications
    setTimeout(() => {
      setApplications([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          position: 'Frontend Developer',
          status: 'pending',
          submittedAt: '2023-12-01'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {applications.map((application) => (
            <li key={application.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{application.name}</h3>
                  <p className="text-sm text-gray-600">{application.email}</p>
                  <p className="text-sm text-gray-600">{application.position}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {application.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{application.submittedAt}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
