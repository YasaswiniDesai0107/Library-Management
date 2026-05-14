import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  Library 
} from 'lucide-react';

/**
 * Sidebar.jsx
 * Navigation sidebar with links to different app modules.
 */

const Sidebar = ({ isOpen }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Books', path: '/books', icon: BookOpen },
    { name: 'Borrowers', path: '/borrowers', icon: Users },
    { name: 'History', path: '/transactions', icon: Library },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-slate-900 text-slate-300 z-50 transition-all duration-300 overflow-hidden ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Library className="w-8 h-8 text-primary-500 shrink-0" />
        {isOpen && (
          <span className="ml-3 font-bold text-white text-lg tracking-tight truncate">
            Library MS
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                : 'hover:bg-slate-800 hover:text-white'}
            `}
          >
            <item.icon className={`w-5 h-5 shrink-0 ${isOpen ? '' : 'mx-auto'}`} />
            {isOpen && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section (Optional) */}
      <div className="absolute bottom-6 left-0 w-full px-3">
        <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-slate-800 transition-all duration-200 group">
          <Settings className={`w-5 h-5 shrink-0 ${isOpen ? '' : 'mx-auto'}`} />
          {isOpen && <span className="font-medium group-hover:text-white">Settings</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
