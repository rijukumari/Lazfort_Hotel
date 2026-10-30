import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ERPProvider } from './context/ERPContext';
import { SuperAdminUserProvider } from './context/SuperAdminUserContext';
import { AppRouter } from './router';

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ERPProvider>
            <SuperAdminUserProvider>
              <ToastProvider>
                <AppRouter />
              </ToastProvider>
            </SuperAdminUserProvider>
          </ERPProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

