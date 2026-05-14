import React, { useState, useEffect } from 'react';
import { 
  History, 
  ArrowRightLeft, 
  User, 
  BookOpen, 
  Calendar,
  CheckCircle,
  Clock,
  Search,
  Download
} from 'lucide-react';
import transactionService from '../services/transactionService';
import toast from 'react-hot-toast';

/**
 * Transactions.jsx
 * Displays the complete borrow/return history.
 */

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Active';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = ['ID,Book,Borrower,Borrow Date,Return Date,Status'];
    const rows = transactions.map(t => (
      `${t.transaction_id},"${t.book?.title}","${t.borrower?.borrower_name}",${t.borrow_date},${t.return_date || 'N/A'},${t.return_date ? 'Returned' : 'Borrowed'}`
    ));
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "library_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exporting transaction history...');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Transaction History</h1>
          <p className="text-slate-500 text-sm mt-1">Full audit log of all book borrows and returns.</p>
        </div>
        <button onClick={exportToCSV} className="btn-secondary">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card py-4 flex items-center gap-4">
          <div className="p-3 bg-primary-100 text-primary-600 rounded-lg">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Total Transactions</p>
            <p className="text-xl font-bold text-slate-900">{transactions.length}</p>
          </div>
        </div>
        <div className="card py-4 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Ongoing Borrows</p>
            <p className="text-xl font-bold text-slate-900">
              {transactions.filter(t => !t.return_date).length}
            </p>
          </div>
        </div>
        <div className="card py-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium uppercase">Completed Returns</p>
            <p className="text-xl font-bold text-slate-900">
              {transactions.filter(t => t.return_date).length}
            </p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Book</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Borrower</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500 italic">No transactions recorded yet.</td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.transaction_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">#{t.transaction_id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-semibold text-slate-900">{t.book?.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700">{t.borrower?.borrower_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>Out: {formatDate(t.borrow_date)}</span>
                        </div>
                        {t.return_date && (
                          <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                            <CheckCircle className="w-3 h-3" />
                            <span>In: {formatDate(t.return_date)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {t.return_date ? (
                        <span className="badge-green">Returned</span>
                      ) : (
                        <span className="badge-red animate-pulse">Borrowed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
