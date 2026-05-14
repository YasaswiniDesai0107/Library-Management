import api from '../api';

/**
 * bookService.js
 * Service layer for all Book-related API calls.
 */

const bookService = {
  // GET /books
  getAllBooks: async (skip = 0, limit = 100) => {
    const response = await api.get('/books/', { params: { skip, limit } });
    return response.data;
  },

  // GET /books/{id}
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // POST /books
  createBook: async (bookData) => {
    const response = await api.post('/books/', bookData);
    return response.data;
  },

  // PUT /books/{id}
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // DELETE /books/{id}
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  // GET /books/search/find
  searchBooks: async (params) => {
    const response = await api.get('/books/search/find', { params });
    return response.data;
  },
};

export default bookService;
