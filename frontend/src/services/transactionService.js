import api from '../api';

/**
 * transactionService.js
 * Service layer for Borrow, Return, and Transaction history.
 */

const transactionService = {
  // GET /transactions
  getAllTransactions: async (skip = 0, limit = 100) => {
    const response = await api.get('/transactions/', { params: { skip, limit } });
    return response.data;
  },

  // POST /transactions/borrow
  borrowBook: async (book_id, borrower_id) => {
    const response = await api.post('/transactions/borrow', { book_id, borrower_id });
    return response.data;
  },

  // POST /transactions/return/{book_id}
  returnBook: async (book_id) => {
    const response = await api.post(`/transactions/return/${book_id}`);
    return response.data;
  },
};

export default transactionService;
