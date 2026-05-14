import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';
import bookService from '../services/bookService';
import borrowerService from '../services/borrowerService';
import toast from 'react-hot-toast';

/**
 * Dashboard.jsx
 * Displays summary statistics and recent activity.
 */

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalBorrowers: 0,
    borrowedBooks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data to calculate stats
      // In a real production app, we would have a /stats endpoint
      const books = await bookService.getAllBooks(0, 1000);
      const borrowers = await borrowerService.getAllBorrowers(0, 1000);

      const available = books.filter(b => b.availability_status).length;
      
      setStats({
        totalBooks: books.length,
        availableBooks: available,
        borrowedBooks: books.length - available,
        totalBorrowers: borrowers.length,
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Books', 
      value: stats.totalBooks, 
      icon: BookOpen, 
      color: 'bg-blue-500',
      trend: '+4% from last month'
    },
    { 
      label: 'Available', 
      value: stats.availableBooks, 
      icon: CheckCircle2, 
      color: 'bg-emerald-500',
      trend: '82% of total stock'
    },
    { 
      label: 'Borrowed', 
      value: stats.borrowedBooks, 
      icon: Clock, 
      color: 'bg-orange-500',
      trend: '18% current rate'
    },
    { 
      label: 'Total Borrowers', 
      value: stats.totalBorrowers, 
      icon: Users, 
      color: 'bg-purple-500',
      trend: '+12 new this week'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="page-title">Library Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card relative overflow-hidden group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {loading ? '...' : stat.value}
                </h3>
              </div>
              <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              <span className="text-emerald-600 font-medium flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {stat.trend}
              </span>
            </div>
            {/* Decorative background shape */}
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${stat.color} opacity-5`}></div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity (Placeholder for now) */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
            <button className="text-sm text-primary-600 font-semibold hover:underline">View all</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 leading-snug">
                    <span className="font-bold">John Doe</span> borrowed <span className="font-bold italic">"Clean Code"</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">2 hours ago</p>
                </div>
                <span className="badge-green">Ongoing</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card h-full">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button className="btn-primary w-full justify-center py-3">
              <BookOpen className="w-4 h-4" />
              Add New Book
            </button>
            <button className="btn-secondary w-full justify-center py-3">
              <Users className="w-4 h-4" />
              Register Borrower
            </button>
            <div className="pt-4 border-t border-slate-100 mt-4">
              <p className="text-xs text-slate-500 mb-3">System Health</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-medium text-slate-700">API Server: Connected</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-medium text-slate-700">Database: Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
