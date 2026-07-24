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
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    onToggle?.();
  };

  const handleLogout = () => {
    // Logout functionality
    console.log('Logging out...');
    window.location.href = '/admin/login';
  };

  const navigationItems = [
    { href: '/admin', label: 'Dashboard', icon: HomeIcon },
    { href: '/admin/services', label: 'Services', icon: CogIcon },
    { href: '/admin/portfolio', label: 'Portfolio', icon: PhotoIcon },
    { href: '/admin/careers', label: 'Jobs', icon: BriefcaseIcon },
    { href: '/admin/applications', label: 'Applications', icon: DocumentTextIcon },
  ];

  return (
    <div className={`bg-gray-900 text-white h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
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
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <item.icon className="w-5 h-5 mr-3" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
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
