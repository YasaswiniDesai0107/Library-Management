import api from '../api';

/**
 * borrowerService.js
 * Service layer for all Borrower-related API calls.
 */

const borrowerService = {
  // GET /borrowers
  getAllBorrowers: async (skip = 0, limit = 100) => {
    const response = await api.get('/borrowers/', { params: { skip, limit } });
    return response.data;
  },

  // POST /borrowers
  createBorrower: async (borrowerData) => {
    const response = await api.post('/borrowers/', borrowerData);
    return response.data;
  },

  // PUT /borrowers/{id}
  updateBorrower: async (id, borrowerData) => {
    const response = await api.put(`/borrowers/${id}`, borrowerData);
    return response.data;
  },

  // DELETE /borrowers/{id}
  deleteBorrower: async (id) => {
    const response = await api.delete(`/borrowers/${id}`);
    return response.data;
  },
};

export default borrowerService;
