import { createContext, useContext, useEffect, useState } from 'react';

const AdminThemeContext = createContext(null);

const STORAGE_KEY = 'admin-theme'; 

export function AdminThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
        } catch {
            return 'light';
        }
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            console.error("Theme storage failed", e);
        }

        return () => {
            document.documentElement.removeAttribute('data-bs-theme');
        };
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

    return (
        <AdminThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </AdminThemeContext.Provider>
    );
}

export function useAdminTheme() {
    const ctx = useContext(AdminThemeContext);
    if (!ctx) throw new Error('useAdminTheme must be used inside an AdminThemeProvider');
    return ctx;
}