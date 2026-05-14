import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  User, 
  Mail, 
  Phone,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import borrowerService from '../services/borrowerService';
import toast from 'react-hot-toast';

/**
 * Borrowers.jsx
 * Borrower management page with CRUD operations.
 */

const Borrowers = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBorrower, setCurrentBorrower] = useState(null);
  const [formData, setFormData] = useState({
    borrower_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchBorrowers();
  }, []);

  const fetchBorrowers = async () => {
    setLoading(true);
    try {
      const data = await borrowerService.getAllBorrowers();
      setBorrowers(data);
    } catch (error) {
      toast.error('Failed to load borrowers');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenModal = (borrower = null) => {
    if (borrower) {
      setCurrentBorrower(borrower);
      setFormData({
        borrower_name: borrower.borrower_name,
        email: borrower.email,
        phone: borrower.phone || ''
      });
    } else {
      setCurrentBorrower(null);
      setFormData({
        borrower_name: '',
        email: '',
        phone: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBorrower) {
        await borrowerService.updateBorrower(currentBorrower.borrower_id, formData);
        toast.success('Borrower updated successfully');
      } else {
        await borrowerService.createBorrower(formData);
        toast.success('Borrower registered successfully');
      }
      setIsModalOpen(false);
      fetchBorrowers();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this borrower?')) {
      try {
        await borrowerService.deleteBorrower(id);
        toast.success('Borrower removed successfully');
        fetchBorrowers();
      } catch (error) {
        toast.error('Failed to remove borrower');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Borrower Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage library members and contact information.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Register Borrower
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="form-input pl-10"
          />
        </div>
      </div>

      {/* Borrowers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <p>Loading members...</p>
            </div>
          </div>
        ) : borrowers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
            <div className="flex flex-col items-center gap-3">
              <User className="w-12 h-12 text-slate-200" />
              <p className="text-lg font-medium text-slate-900">No borrowers found</p>
              <button onClick={() => handleOpenModal()} className="btn-primary mt-2">Register Now</button>
            </div>
          </div>
        ) : (
          borrowers.map((borrower) => (
            <div key={borrower.borrower_id} className="card group relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors duration-300">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-none">{borrower.borrower_name}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 uppercase tracking-wider font-medium">Member #{borrower.borrower_id}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="truncate">{borrower.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{borrower.phone || 'No phone provided'}</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button 
                  onClick={() => handleOpenModal(borrower)}
                  className="flex-1 btn-secondary justify-center py-2 text-xs"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit Profile
                </button>
                <button 
                  onClick={() => handleDelete(borrower.borrower_id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{currentBorrower ? 'Edit Member' : 'Register New Member'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  name="borrower_name"
                  required
                  value={formData.borrower_name}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="e.g. Alice Johnson" 
                />
              </div>
              
              <div>
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="e.g. alice@example.com" 
                />
              </div>

              <div>
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="e.g. +1 555-000-000" 
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary px-8">
                  {currentBorrower ? 'Update Profile' : 'Register Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Borrowers;
