import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Lazy load pages for better performance
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Borrowers from './pages/Borrowers';

/**
 * App.jsx
 * Main application component.
 * Defines the application routing structure using React Router.
 */

function App() {
  return (
    <Routes>
      {/* All application routes are wrapped in the MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Default route redirects to dashboard */}
        <index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="books" element={<Books />} />
        <Route path="borrowers" element={<Borrowers />} />
        
        {/* 404 Fallback - can be improved with a dedicated 404 component */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
