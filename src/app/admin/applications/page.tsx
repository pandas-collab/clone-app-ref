'use client';

import React, { useState, useEffect } from 'react';

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      // TODO: Fetch applications from API
      setApplications([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Applications</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Applications Management</h2>
        </div>

        <div className="p-6">
          {applications.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No applications found.</p>
          ) : (
            <div className="space-y-4">
              {applications.map((application: any) => (
                <div key={application.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{application.name}</h3>
                  <p className="text-gray-600">{application.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
