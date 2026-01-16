'use client';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // For now, we are enforcing a light theme across the entire application
    // based on the user's latest request for a design similar to Locaweb.
    // The 'dark' class logic has been removed.
    if (typeof window !== 'undefined') {
        document.documentElement.className = '';
    }

    return <>{children}</>;
}
