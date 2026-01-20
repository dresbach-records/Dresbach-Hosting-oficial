'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import CountdownPage from './countdown'; 

// The date for the countdown to end. Timezone is America/Sao_Paulo (BRT, -03:00)
const countdownEndDate = new Date('2025-01-01T00:00:00-03:00');

export function SiteLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    // Check if the current date is before the countdown ends
    const isCountdownActive = isClient && (new Date() < countdownEndDate);
    
    const noLayoutPages = [
      '/login', 
      '/signup', 
      '/forgot-password', 
      '/reset-password',
      '/admin/login'
    ];
    
    const isClientArea = pathname.startsWith('/area-do-cliente');
    const isAdminArea = pathname.startsWith('/admin') && pathname !== '/admin/login';
    const isApiRoute = pathname.startsWith('/api');

    // These pages should always be accessible, even during countdown
    const accessibleDuringCountdown = isClientArea || isAdminArea || noLayoutPages.includes(pathname) || isApiRoute;

    if (isCountdownActive && !accessibleDuringCountdown) {
        return <CountdownPage />;
    }
    
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

    // Default layout for normal operation
    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
