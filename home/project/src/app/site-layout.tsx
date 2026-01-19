'use client';

import { usePathname } from 'next/navigation';
import { Wrench } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const MaintenanceBanner = () => (
    <div className="bg-red-200 text-red-900 p-3 text-center text-sm font-medium z-50 relative animate-blink">
        <div className="container flex flex-col sm:flex-row items-center justify-center gap-2">
            <Wrench className="h-5 w-5 flex-shrink-0" />
            <p>
                <strong>Aviso:</strong> Site em manutenção. Pode haver falhas e instabilidades.
                <span className="hidden sm:inline"> Se precisar de ajuda, </span>
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-red-800 whitespace-nowrap">
                    nos chame no WhatsApp
                </a>.
            </p>
        </div>
    </div>
);


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
                <MaintenanceBanner />
                <main className="flex-1">{children}</main>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <MaintenanceBanner />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
