if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const renderSidebarItem = (item: SidebarItem) => {
    const isActive = isActiveRoute(item.href);
    const IconComponent = item.icon;

    return (
      <Link
        key={item.id}
        href={item.href}
        className={`
          flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
          ${isActive 
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
          ${isCollapsed ? 'justify-center' : 'justify-start'}
        `}
        title={isCollapsed ? item.label : undefined}
      >
        <IconComponent className={`flex-shrink-0 h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {item.badge > 99 ? '99+' : item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <div className={`
      bg-white shadow-lg border-r border-gray-200 flex flex-col transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center">
            <img
              src="/images/logo.png"
              alt="BournTec Logo"
              className="h-8 w-auto"
              onError={(e) => {
                e.currentTarget.src = '/images/placeholder.png';
              }}
            />
            <span className="ml-2 text-lg font-semibold text-gray-900">Admin</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {sidebarItems.map(renderSidebarItem)}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-2 space-y-1">
        {bottomItems.map(renderSidebarItem)}
        
        <button
          onClick={handleLogout}
          className={`
            w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 
            hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <ArrowRightOnRectangleIcon className={`flex-shrink-0 h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* User Info (when expanded) */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-700">A</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">admin@bourntec.com</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}