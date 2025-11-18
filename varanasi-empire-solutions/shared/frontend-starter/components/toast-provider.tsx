'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        success: {
          duration: 4000,
          style: {
            background: 'hsl(142.1 71.8% 29.6%)',
            color: '#ffffff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: 'hsl(0 84.2% 60.2%)',
            color: '#ffffff',
          },
        },
        loading: {
          duration: Infinity,
        },
      }}
    />
  );
}

export default ToastProvider;
