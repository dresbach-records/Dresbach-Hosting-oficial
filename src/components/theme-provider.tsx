'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // For now, we are enforcing a light theme across the entire application
    // by ensuring no 'dark' class is present on the html element.
    // This effect runs only on the client, after the initial render,
    // to avoid hydration mismatches.
    useEffect(() => {
        document.documentElement.className = '';
    }, []);

    return <>{children}</>;
}
