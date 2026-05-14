import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

/**
 * MainLayout.jsx
 * The primary layout wrapper for the application.
 * Includes the Sidebar, Navbar, and an Outlet for nested routes.
 */

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Fixed or Static based on screen size */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Navigation Bar */}
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 p-6 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Simple Footer */}
        <footer className="py-4 px-6 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Library Management System. Step-2 Frontend Integration.
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
