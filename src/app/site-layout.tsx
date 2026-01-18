'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';

export function SiteLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const noLayoutPages = [
      '/login', 
      '/signup', 
      '/forgot-password', 
      '/reset-password',
      '/admin/login'
    ];
    
    const isClientArea = pathname.startsWith('/area-do-cliente');
    const isAdminArea = pathname.startsWith('/admin') && pathname !== '/admin/login';

    if (isClientArea || isAdminArea) {
        return <>{children}</>;
    }
    
    if (noLayoutPages.includes(pathname)) {
        return (
             <div className="relative flex min-h-screen flex-col bg-background">
                <main className="flex-1">{children}</main>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
