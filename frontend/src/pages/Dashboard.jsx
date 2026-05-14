import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ArrowRightLeft,
  ArrowDownLeft,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';
import bookService from '../services/bookService';
import borrowerService from '../services/borrowerService';
import transactionService from '../services/transactionService';
import toast from 'react-hot-toast';

/**
 * Dashboard.jsx (Updated for Step-3)
 * Displays real statistics and recent transaction activity.
 */

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalBorrowers: 0,
    totalTransactions: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [books, borrowers, transactions] = await Promise.all([
        bookService.getAllBooks(0, 1000),
        borrowerService.getAllBorrowers(0, 1000),
        transactionService.getAllTransactions(0, 5) // Get latest 5
      ]);

      const available = books.filter(b => b.availability_status).length;
      
      setStats({
        totalBooks: books.length,
        availableBooks: available,
        totalBorrowers: borrowers.length,
        totalTransactions: transactions.length,
      });
      setRecentTransactions(transactions);
    } catch (error) {
      toast.error('Failed to load real-time stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Books', value: stats.totalBooks, icon: BookOpen, color: 'bg-indigo-600' },
    { label: 'Available Now', value: stats.availableBooks, icon: CheckCircle2, color: 'bg-emerald-600' },
    { label: 'Active Borrowers', value: stats.totalBorrowers, icon: Users, color: 'bg-purple-600' },
    { label: 'Total Logs', value: stats.totalTransactions, icon: History, color: 'bg-orange-600' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">Real-time library metrics and transaction history.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`${stat.color} p-4 rounded-2xl text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{loading ? '...' : stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View History <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-0">
            {recentTransactions.length === 0 ? (
              <div className="p-10 text-center text-slate-400 italic">No recent activity detected.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentTransactions.map((t, idx) => (
                  <div key={idx} className="px-8 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${t.return_date ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {t.return_date ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {t.borrower?.borrower_name} {t.return_date ? 'returned' : 'borrowed'}
                        </p>
                        <p className="text-xs text-slate-500">"{t.book?.title}"</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                      {new Date(t.borrow_date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="bg-primary-600 rounded-3xl p-8 text-white shadow-xl shadow-primary-200">
            <h3 className="text-xl font-bold mb-2">Librarian Tools</h3>
            <p className="text-primary-100 text-sm mb-6">Quickly manage your daily tasks and catalog updates.</p>
            <div className="space-y-3">
              <Link to="/books" className="flex items-center justify-center gap-2 w-full py-3 bg-white text-primary-600 rounded-2xl font-bold text-sm shadow-sm hover:bg-primary-50 transition-colors">
                Manage Books
              </Link>
              <Link to="/borrowers" className="flex items-center justify-center gap-2 w-full py-3 bg-primary-700 text-white rounded-2xl font-bold text-sm hover:bg-primary-800 transition-colors">
                Register Member
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">System Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">API Gateway</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">DB Connection</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
