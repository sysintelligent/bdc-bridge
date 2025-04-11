'use client'

import React from 'react';
import { LayoutDashboard, AppWindow, Settings } from 'lucide-react';
import { NavItem } from './ui/nav-item';

const Sidebar: React.FC = () => {
  const menuItems = [
    { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { text: 'Applications', icon: AppWindow, path: '/applications' },
    { text: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r bg-background md:flex">
      <div className="h-16 w-full border-b" />
      <nav className="flex-1 overflow-auto p-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavItem 
              key={item.text} 
              href={item.path} 
              icon={item.icon}
            >
              {item.text}
            </NavItem>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar; 