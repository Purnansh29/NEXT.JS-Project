// components/ui/Toast.js
'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#18181b',
          color: '#fafafa',
          borderRadius: '12px',
          border: '1px solid #27272a',
          fontSize: '13px',
          padding: '12px 16px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#18181b',
          },
        },
        error: {
          iconTheme: {
            primary: '#f43f5e',
            secondary: '#18181b',
          },
        },
      }}
    />
  );
}
