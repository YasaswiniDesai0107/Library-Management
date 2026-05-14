import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

/**
 * main.jsx
 * Entry point for the React application.
 * Wraps the App with necessary providers:
 * - BrowserRouter for routing
 * - Toaster for global notifications
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Global Toast Configuration */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
          },
        }}
      />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
