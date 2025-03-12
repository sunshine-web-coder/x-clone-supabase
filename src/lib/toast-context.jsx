'use client';

import React, { createContext, useContext, useState } from 'react';
import { X } from 'lucide-react';

// Create context
const ToastContext = createContext(null);

// Toast component
function Toast({ message, type, onClose }) {
  return (
    <div className={`flex items-center justify-between p-3 mb-3 rounded-md shadow-md ${
      type === 'success' ? 'bg-green-100 text-green-800' : 
      type === 'error' ? 'bg-red-100 text-red-800' : 
      'bg-blue-100 text-blue-800'
    }`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 p-1 rounded-full hover:bg-gray-200">
        <X size={16} />
      </button>
    </div>
  );
}

// Provider component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prevToasts => [...prevToasts, newToast]);

    // Auto-remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);

    return id;
  };

  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col">
        {toasts.map(toast => (
          <Toast 
            key={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={() => removeToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}