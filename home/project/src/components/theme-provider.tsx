'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Enforce a dark theme across the entire application by adding the 'dark' class
    // to the html element.
    useEffect(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
    }, []);

    return <>{children}</>;
}
