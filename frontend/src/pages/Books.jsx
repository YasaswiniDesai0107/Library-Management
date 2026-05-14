import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Search,
  Filter,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import bookService from '../services/bookService';
import toast from 'react-hot-toast';

/**
 * Books.jsx
 * Book management page with CRUD operations.
 */

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null); // For editing
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Book Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your library catalog and availability.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add New Book
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title, author, or ISBN..." 
            className="form-input pl-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="btn-secondary w-full sm:w-auto">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Books Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Book Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">ISBN</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading catalog...</p>
                    </div>
                  </td>
                </tr>
              ) : books.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <BookOpen className="w-12 h-12 text-slate-200" />
                      <p className="text-lg font-medium text-slate-900">No books found</p>
                      <p className="text-sm">Get started by adding your first book to the library.</p>
                      <button onClick={() => handleOpenModal()} className="btn-primary mt-2">Add Book</button>
                    </div>
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book.book_id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center text-primary-700 shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{book.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{book.category || 'Uncategorized'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-600">{book.isbn || 'N/A'}</code>
                    </td>
                    <td className="px-6 py-4">
                      {book.availability_status ? (
                        <span className="badge-green">Available</span>
                      ) : (
                        <span className="badge-red">Borrowed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(book)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(book.book_id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
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

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-700">{books.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button disabled className="p-1.5 rounded border border-slate-200 bg-white text-slate-400 disabled:opacity-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled className="p-1.5 rounded border border-slate-200 bg-white text-slate-400 disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">{currentBook ? 'Edit Book' : 'Add New Book'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="form-label">Book Title *</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="e.g. The Great Gatsby" 
                />
              </div>
              
              <div>
                <label className="form-label">Author *</label>
                <input 
                  type="text" 
                  name="author"
                  required
                  value={formData.author}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="e.g. F. Scott Fitzgerald" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Category</label>
                  <input 
                    type="text" 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-input" 
                    placeholder="e.g. Fiction" 
                  />
                </div>
                <div>
                  <label className="form-label">ISBN</label>
                  <input 
                    type="text" 
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="form-input" 
                    placeholder="e.g. 978-0..." 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="availability"
                  name="availability_status"
                  checked={formData.availability_status}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500" 
                />
                <label htmlFor="availability" className="text-sm font-medium text-slate-700">Available on library shelf</label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary px-8">
                  {currentBook ? 'Save Changes' : 'Create Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
