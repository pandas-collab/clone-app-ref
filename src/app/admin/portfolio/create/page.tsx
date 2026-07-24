import React from 'react';

export default function CreatePortfolioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Portfolio Item</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Portfolio title"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Portfolio Item
          </button>
        </form>
      </div>
    </div>
  );
}
