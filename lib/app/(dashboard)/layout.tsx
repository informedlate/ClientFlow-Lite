'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, signOut } = useAuth();
    const router = useRouter();

  const handleLogout = async () => {
        try {
                await signOut();
                router.push('/login');
        } catch (error) {
                console.error('Logout error:', error);
        }
  };

  return (
        <div className="flex h-screen bg-slate-900">
          {/* Sidebar */}
              <aside className="w-64 bg-slate-800 border-r border-slate-700 overflow-y-auto">
                      <div className="p-6">
                                <h1 className="text-2xl font-bold text-white">ClientFlow</h1>h1>
                                <p className="text-slate-400 text-sm mt-1">Design Client Manager</p>p>
                      </div>div>
              
                      <nav className="px-4 py-6 space-y-2">
                                <a href="/dashboard" className="flex items-center px-4 py-2 rounded text-slate-300 hover:bg-slate-700 hover:text-white transition">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-8m-4 8h8" />
                                            </svg>svg>
                                            Dashboard
                                </a>a>
                      
                                <a href="/dashboard/clients" className="flex items-center px-4 py-2 rounded text-slate-300 hover:bg-slate-700 hover:text-white transition">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>svg>
                                            Clients
                                </a>a>
                      
                                <a href="/dashboard/documents" className="flex items-center px-4 py-2 rounded text-slate-300 hover:bg-slate-700 hover:text-white transition">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>svg>
                                            Documents
                                </a>a>
                      
                                <a href="/dashboard/analytics" className="flex items-center px-4 py-2 rounded text-slate-300 hover:bg-slate-700 hover:text-white transition">
                                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>svg>
                                            Analytics
                                </a>a>
                      </nav>nav>
              
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-700 border-t border-slate-600">
                                <div className="flex items-center justify-between">
                                            <div>
                                                          <p className="text-sm font-medium text-white">{user?.email || 'User'}</p>p>
                                                          <p className="text-xs text-slate-400">Account</p>p>
                                            </div>div>
                                            <button
                                                            onClick={handleLogout}
                                                            className="p-2 rounded hover:bg-slate-600 transition"
                                                            title="Logout"
                                                          >
                                                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                          </svg>svg>
                                            </button>button>
                                </div>div>
                      </div>div>
              </aside>aside>
        
          {/* Main Content */}
              <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                      <header className="bg-slate-800 border-b border-slate-700 px-8 py-4">
                                <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-semibold text-white">Welcome to ClientFlow</h2>h2>
                                            <div className="flex items-center gap-4">
                                                          <button className="p-2 rounded hover:bg-slate-700 transition">
                                                                          <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                                                          </svg>svg>
                                                          </button>button>
                                                          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                                                          <span className="text-white font-semibold text-sm">
                                                                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                                                                          </span>span>
                                                          </div>div>
                                            </div>div>
                                </div>div>
                      </header>header>
              
                {/* Content Area */}
                      <div className="flex-1 overflow-auto">
                                <div className="p-8">
                                  {children}
                                </div>div>
                      </div>div>
              </main>main>
        </div>div>
      );
}</div>
