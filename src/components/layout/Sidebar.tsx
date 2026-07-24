if (!href.startsWith('/admin')) {
        console.warn('Sidebar navigation attempted to external URL:', href);
        return;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className={`bg-white shadow-sm border-r border-gray-200 ${className}`}>
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.current;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => handleLinkClick(item.href)}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                  ${isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`
                    flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200
                    ${isActive 
                      ? 'text-blue-500' 
                      : 'text-gray-400 group-hover:text-gray-500'
                    }
                  `}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">A</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">Admin User</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}