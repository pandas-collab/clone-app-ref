'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  CogIcon,
  BriefcaseIcon,
  PhotoIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
  navigation?: Array<{
    name: string;
    href: string;
    icon: any;
    current: boolean;
  }>;
}

export default function Sidebar({ collapsed = false, onToggle, className = '', navigation }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const defaultNavigationItems = [
    { href: '/admin', label: 'Dashboard', icon: HomeIcon },
    { href: '/admin/services', label: 'Services', icon: CogIcon },
    { href: '/admin/portfolio', label: 'Portfolio', icon: PhotoIcon },
    { href: '/admin/careers', label: 'Jobs', icon: BriefcaseIcon },
    { href: '/admin/applications', label: 'Applications', icon: DocumentTextIcon },
  ];

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  const handleLogout = () => {
    // Logout functionality
    console.log('Logging out...');
    window.location.href = '/admin/login';
  };

  const handleLinkClick = (href: string) => {
    try {
      if (!href.startsWith('/admin')) {
        console.warn('Sidebar navigation attempted to external URL:', href);
        return;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Use passed navigation prop or fall back to default
  const navItems = navigation || defaultNavigationItems.map(item => ({
    name: item.label,
    href: item.href,
    icon: item.icon,
    current: false
  }));

  return (
    <div className={`bg-gray-900 text-white h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!isCollapsed && <h2 className="text-lg font-semibold">Admin Panel</h2>}
        <button
          onClick={handleToggle}
          className="p-1 rounded hover:bg-gray-800"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.current;
          
          return (
            <Link
              key={item.name || item.href}
              href={item.href}
              onClick={() => handleLinkClick(item.href)}
              className={`flex items-center px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-800 text-white border-r-2 border-blue-400'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-5 h-5 mr-3" />
              {!isCollapsed && <span>{item.name || item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User Menu */}
      <div className="absolute bottom-0 w-full border-t border-gray-700">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <UserCircleIcon className="w-5 h-5 mr-3" />
            {!isCollapsed && <span>Admin User</span>}
          </button>

          {showUserMenu && !isCollapsed && (
            <div className="absolute bottom-full left-0 right-0 bg-gray-800 border-t border-gray-700">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
