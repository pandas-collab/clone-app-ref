if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const renderNavigationItem = (item: SidebarItem) => {
    const isActive = isItemActive(item.href);
    const IconComponent = isActive ? item.iconActive : item.icon;

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
          isActive
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
        onClick={onClose}
      >
        <IconComponent
          className={`mr-3 h-5 w-5 flex-shrink-0 ${
            isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'
          }`}
          aria-hidden="true"
        />
        <span className="truncate">{item.name}</span>
        {item.count && item.count > 0 && (
          <span className={`ml-auto inline-block py-0.5 px-2 text-xs rounded-full ${
            isActive 
              ? 'bg-blue-200 text-blue-800' 
              : 'bg-gray-200 text-gray-800'
          }`}>
            {item.count}
          </span>
        )}
      </Link>
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`flex flex-col w-64 bg-white border-r border-gray-200 ${className}`}>
      {/* Logo/Brand Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <Link href="/admin" className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-auto"
              src="/images/logo.png"
              alt="Admin Panel"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">AP</span>
            </div>
          </div>
          <span className="ml-2 text-lg font-semibold text-gray-900">Admin</span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map(renderNavigationItem)}
        </div>

        {/* Settings Section */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Settings
          </p>
          <div className="mt-2 space-y-1">
            <Link
              href="/admin/settings"
              className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                pathname.startsWith('/admin/settings')
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Cog6ToothIcon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  pathname.startsWith('/admin/settings') 
                    ? 'text-blue-700' 
                    : 'text-gray-400 group-hover:text-gray-600'
                }`}
                aria-hidden="true"
              />
              <span className="truncate">Settings</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
              <UserGroupIcon className="h-4 w-4 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-400 hover:text-gray-600"
            title="Sign out"
            aria-label="Sign out"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {onClose && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Sidebar;