if (!session) {
      redirect('/admin/login');
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-64">
            <div className="p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Admin layout error:', error);
    redirect('/admin/login');
  }
}

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Content management system for the website',
  robots: 'noindex, nofollow',
};