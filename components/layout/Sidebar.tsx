import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface SidebarItem {
  id: string;
  name: string;
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  iconActive?: React.ComponentType<any>;
  count?: number;
  badge?: number;
}

interface SidebarProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
  className?: string;
}

const navigationItems: SidebarItem[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    label: 'Dashboard',
    href: '/admin',
    icon: HomeIcon,
    iconActive: HomeIcon
  },
  {
    id: 'users',
    name: 'Users',
    label: 'Users', 
    href: '/admin/users',
    icon: UserGroupIcon,
    iconActive: UserGroupIcon
  }
];

const sidebarItems = navigationItems;

const bottomItems: SidebarItem[] = [
  {
    id: 'settings',
    name: 'Settings',
    label: 'Settings',
    href: '/admin/settings',
    icon: Cog6ToothIcon,
    iconActive: Cog6ToothIcon
  }
];

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen = true, 
  isCollapsed = false,
  onClose, 
  onToggleCollapse,
  className = '' 
}) => {
  const pathname = usePathname();

  const handleSignOut = () => {
    // Handle sign out logic
    console.log('Signing out...');
  };

  const handleLogout = handleSignOut;

  const isItemActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const isActiveRoute = isItemActive;

  const renderNavigationItem = (item: SidebarItem) => {
    const isActive = isItemActive(item.href);
    const IconComponent = isActive ? (item.iconActive || item.icon) : item.icon;

    return (
      <Link
        key={item.id || item.name}
        href={item.href}
        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
          isActive
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
        onClick={onClose}
        title={isCollapsed ? (item.label || item.name) : undefined}
      >
        <IconComponent
          className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${
            isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-600'
          }`}
          aria-hidden="true"
        />
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{item.label || item.name}</span>
            {((item.count && item.count > 0) || (item.badge && item.badge > 0)) && (
              <span className={`ml-auto inline-block py-0.5 px-2 text-xs rounded-full ${
                isActive 
                  ? 'bg-blue-200 text-blue-800' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {item.badge && item.badge > 99 ? '99+' : (item.badge || item.count)}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  const renderSidebarItem = renderNavigationItem;

  if (!isOpen && !isCollapsed) {
    return null;
  }

  return (
    <div className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      {/* Logo/Brand Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        {!isCollapsed && (
          <Link href="/admin" className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/images/logo.png"
                alt="Admin Panel"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  if (target.nextElementSibling) {
                    target.nextElementSibling.classList.remove('hidden');
                  } else {
                    target.src = '/images/placeholder.png';
                  }
                }}
              />
              <div className="hidden h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">AP</span>
              </div>
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">Admin</span>
          </Link>
        )}
        
        {onToggleCollapse && (
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
        )}

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
        {!isCollapsed && (
          <div className="pt-6 mt-6 border-t border-gray-200">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Settings
            </p>
            <div className="mt-2 space-y-1">
              {bottomItems.map(renderNavigationItem)}
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="pt-6 mt-6 border-t border-gray-200">
            <div className="space-y-1">
              {bottomItems.map(renderNavigationItem)}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-2">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors duration-200 ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}
          title={isCollapsed ? 'Sign Out' : undefined}
        >
          <ArrowRightOnRectangleIcon className={`h-5 w-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* User Section */}
      {!isCollapsed && (
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-700">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@bourntec.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
