import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { MobileSidebar } from '../components/layout/MobileSidebar';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  // If user is not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-ivory dark:bg-primary-900 transition-colors">
      {/* Desktop / Tablet STICKY Collapsible Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen flex-shrink-0 z-40">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Mobile Slide-in Drawer */}
      <MobileSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Header */}
        <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Page Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Luxury Dashboard Footer */}
        <footer className="border-t border-border dark:border-border-dark py-6 px-4 sm:px-8 text-center text-xs text-charcoal-muted dark:text-gray-400 bg-white/40 dark:bg-surface-dark/40 mt-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-serif font-bold text-primary dark:text-white">
                LAZFORT ERP GRAND LUXE
              </span>
              <span>• Sovereign Resort & Hotel Suite</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Session Authenticated
              </span>
              <span>•</span>
              <span className="text-accent font-medium">Clearance Verified</span>
              <span>•</span>
              <span>v2.5.0 Enterprise</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;

