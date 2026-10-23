import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const AuthLayout = ({children}) => {
    return (
        <>
            <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
                <ThemeToggle />
            </div>
            {children}
        </>
    );
};

export default AuthLayout;