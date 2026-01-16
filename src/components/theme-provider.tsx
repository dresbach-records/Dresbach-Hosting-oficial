'use client';

import { usePathname } from 'next/navigation';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isClientArea = pathname.startsWith('/area-do-cliente');
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    const themeClass = isClientArea || isAuthPage ? '' : 'dark';

    // We need to wrap the children in a div and apply the theme class to the html tag
    // This is because the theme is controlled by a class on the html tag in globals.css
    if (typeof window !== 'undefined') {
        document.documentElement.className = themeClass;
    }

    return <>{children}</>;
}
