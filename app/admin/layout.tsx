if (!session?.user) {
    redirect('/admin/login')
  }

  // Verify user has admin role (assuming role is stored in session)
  const userRole = session.user.role || 'user'
  if (userRole !== 'admin' && userRole !== 'editor') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
          <Sidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 ml-64">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Admin Dashboard
                  </h1>
                </div>
                
                {/* User menu */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-2"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {session.user.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <span className="hidden md:block font-medium">
                        {session.user.name || 'Admin'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1">
            <div className="px-6 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout