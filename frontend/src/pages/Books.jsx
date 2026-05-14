import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import bookService from '../services/bookService';
import borrowerService from '../services/borrowerService';
import transactionService from '../services/transactionService';
import toast from 'react-hot-toast';

/**
 * Books.jsx (Updated for Step-3)
 * Book management page with Search, Filter, and Borrow/Return functionality.
 */

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Selected data
  const [currentBook, setCurrentBook] = useState(null);
  const [borrowers, setBorrowers] = useState([]);
  const [selectedBorrowerId, setSelectedBorrowerId] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    availability_status: true
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (error) {
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      try {
        const results = await bookService.searchBooks({ title: query });
        setBooks(results);
      } catch (error) {
        console.error('Search failed');
      }
    } else if (query.trim() === '') {
      fetchBooks();
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOpenModal = (book = null) => {
    if (book) {
      setCurrentBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        category: book.category || '',
        isbn: book.isbn || '',
        availability_status: book.availability_status
      });
    } else {
      setCurrentBook(null);
      setFormData({
        title: '',
        author: '',
        category: '',
        isbn: '',
        availability_status: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBook) {
        await bookService.updateBook(currentBook.book_id, formData);
        toast.success('Book updated successfully');
      } else {
        await bookService.createBook(formData);
        toast.success('Book added successfully');
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  // --- BORROW / RETURN LOGIC ---

  const openBorrowModal = async (book) => {
    setCurrentBook(book);
    try {
      const allBorrowers = await borrowerService.getAllBorrowers();
      setBorrowers(allBorrowers);
      setIsBorrowModalOpen(true);
    } catch (error) {
      toast.error('Failed to load borrowers list');
    }
  };

  const handleBorrow = async () => {
    if (!selectedBorrowerId) {
      toast.error('Please select a borrower');
      return;
    }
    try {
      await transactionService.borrowBook(currentBook.book_id, selectedBorrowerId);
      toast.success('Book borrowed successfully!');
      setIsBorrowModalOpen(false);
      setSelectedBorrowerId('');
      fetchBooks();
    } catch (error) {
      toast.error(error.message || 'Borrow failed');
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await transactionService.returnBook(bookId);
      toast.success('Book returned successfully!');
      fetchBooks();
    } catch (error) {
      toast.error(error.message || 'Return failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        toast.error('Failed to delete book');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title text-3xl">Books Catalog</h1>
          <p className="text-slate-500 text-sm mt-1">Step-3: Now with Borrow/Return and Advanced Search.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add New Book
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchQuery}
            onChange={handleSearch}
            className="form-input pl-10"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none">
            <select 
              className="form-input min-w-[150px]"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Tech">Tech</option>
              <option value="Science">Science</option>
            </select>
          </div>
          <button onClick={fetchBooks} className="p-2 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-slate-50 transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="card p-0 overflow-hidden border-none shadow-xl shadow-slate-200/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Book Details</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : books.length === 0 ? (
                <tr><td colSpan="4" className="py-20 text-center text-slate-400">No books found matching your criteria.</td></tr>
              ) : (
                books.map((book) => (
                  <tr key={book.book_id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${book.availability_status ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{book.title}</p>
                          <p className="text-xs text-slate-500 font-medium">By {book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-tight">
                        {book.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {book.availability_status ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-bold">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          Available
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-orange-600 text-sm font-bold">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          Borrowed
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Borrow/Return Buttons */}
                        {book.availability_status ? (
                          <button 
                            onClick={() => openBorrowModal(book)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold hover:bg-primary-600 hover:text-white transition-all shadow-sm"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            Borrow
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleReturn(book.book_id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          >
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            Return
                          </button>
                        )}
                        
                        {/* Edit/Delete Icons */}
                        <button onClick={() => handleOpenModal(book)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(book.book_id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Borrow Modal */}
      {isBorrowModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={() => setIsBorrowModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 animate-slide-up">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Borrow Book</h3>
            <p className="text-sm text-slate-500 mb-6">Lending <span className="font-bold text-slate-900">"{currentBook?.title}"</span> to a library member.</p>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Select Borrower *</label>
                <select 
                  className="form-input py-3"
                  value={selectedBorrowerId}
                  onChange={(e) => setSelectedBorrowerId(e.target.value)}
                >
                  <option value="">-- Choose Member --</option>
                  {borrowers.map(b => (
                    <option key={b.borrower_id} value={b.borrower_id}>{b.borrower_name} ({b.email})</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button onClick={() => setIsBorrowModalOpen(false)} className="flex-1 btn-secondary justify-center py-3">Cancel</button>
                <button onClick={handleBorrow} className="flex-1 btn-primary justify-center py-3">Confirm Borrow</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal (Existing) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{currentBook ? 'Update Book' : 'New Catalog Entry'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div><label className="form-label">Title</label><input name="title" required value={formData.title} onChange={handleInputChange} className="form-input" /></div>
              <div><label className="form-label">Author</label><input name="author" required value={formData.author} onChange={handleInputChange} className="form-input" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Category</label><input name="category" value={formData.category} onChange={handleInputChange} className="form-input" /></div>
                <div><label className="form-label">ISBN</label><input name="isbn" value={formData.isbn} onChange={handleInputChange} className="form-input" /></div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary px-8">Save Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
