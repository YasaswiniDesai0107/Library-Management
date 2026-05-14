import React from 'react';
import { Menu, Bell, User, ChevronDown } from 'lucide-react';

/**
 * Navbar.jsx
 * Top navigation bar with user info and sidebar toggle.
 */

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Left: Sidebar Toggle & Breadcrumbs (Placeholder) */}
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
          <span className="hover:text-primary-600 cursor-pointer">Admin</span>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-900">Dashboard</span>
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-1"></div>

        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs border border-primary-200">
            AD
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-none">Admin User</p>
            <p className="text-[10px] text-slate-500 leading-none mt-1">Librarian</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
