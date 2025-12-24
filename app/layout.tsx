'use client';

import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/lib/theme-provider';
import { SessionProvider } from '@/lib/session-provider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const plusJakarta = Plus_Jakarta_Sans({ 
                                        subsets: ['latin'],
    variable: '--font-plus-jakarta' 
});

export const metadata: Metadata = {
    title: 'ClientFlow Lite - Design Management Platform',
    description: 'Manage client projects, generate requirements, and automate workflows',
    viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
          <html lang="en" suppressHydrationWarning>
                <body 
                          className={`${inter.variable} ${plusJakarta.variable} font-inter antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50`}
                        >
                        <SessionProvider>
                                  <ThemeProvider>
                                              <QueryClientProvider client={queryClient}>
                                                {children}
                                                            <Toaster position="top-right" richColors />
                                              </QueryClientProvider>QueryClientProvider>
                                  </ThemeProvider>ThemeProvider>
                        </SessionProvider>SessionProvider>
                </body>body>
          </html>html>
        );
}</html>
