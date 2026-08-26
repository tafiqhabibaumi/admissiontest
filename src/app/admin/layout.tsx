'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileEdit,
  ShoppingCart,
  Settings,
  ExternalLink,
  LogOut,
  BookOpen,
  Menu,
  X,
  Loader2,
  ShieldAlert
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Authentication check for all /admin routes
  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsCheckingAuth(false);
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const hasSessionCookie = typeof document !== 'undefined' ? document.cookie.includes('admin_session=') : false;

    if (!token && !hasSessionCookie) {
      setIsAuthenticated(false);
      setIsCheckingAuth(false);
      router.replace('/admin/login');
    } else {
      setIsAuthenticated(true);
      setIsCheckingAuth(false);
    }
  }, [pathname, router]);

  // If on login page, render children directly without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-white space-y-4 p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold">এডমিন সিকিউরিটি ভেরিফাই করা হচ্ছে...</p>
          <p className="text-xs text-slate-500 mt-0.5">অনুগ্রহ করে অপেক্ষা করুন</p>
        </div>
      </div>
    );
  }

  // If not authenticated, prevent any admin render
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    document.cookie = 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;';
    router.replace('/admin/login');
  };

  const navItems = [
    { href: '/admin', label: 'ওভারভিউ ও সেলস', icon: LayoutDashboard },
    { href: '/admin/content', label: 'কনটেন্ট এডিটর (Full)', icon: FileEdit },
    { href: '/admin/orders', label: 'অর্ডার ও ডেলিভারি', icon: ShoppingCart },
    { href: '/admin/settings', label: 'পেমেন্ট ও পিক্সেল সেটিংস', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span className="font-bold text-sm">এডমিন প্যানেল</span>
        </div>
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`w-full md:w-64 bg-slate-950/95 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0 ${
          mobileNavOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white font-serif">BUET Suggestion</h2>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Admin Control
              </span>
            </div>
          </div>

          {/* Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-indigo-300 hover:bg-slate-900 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>লাইভ ওয়েবসাইট দেখুন</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
