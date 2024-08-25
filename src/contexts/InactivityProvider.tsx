import { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import {useRouter} from "next/router";

interface InactivityContextType {
    resetLastActivity: () => void;
}

const InactivityContext = createContext<InactivityContextType | undefined>(undefined);

export const InactivityProvider = ({ children }: { children: ReactNode }) => {
    const { logout } = useAuth();
    const [lastActivity, setLastActivity] = useState<number>(Date.now());
    const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutes
    const router = useRouter()

    const resetLastActivity = () => {
        setLastActivity(Date.now());
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentTime = Date.now();
            if (currentTime - lastActivity >= INACTIVITY_LIMIT) {
                logout();
                router.push('/login')
            }
        }, 60 * 1000); // Check every 1 minute

        // Reset activity on user interaction
        const events = ['mousemove', 'keydown'];
        events.forEach(event => document.addEventListener(event, resetLastActivity));

        return () => {
            clearInterval(intervalId);
            events.forEach(event => document.removeEventListener(event, resetLastActivity));
        };
    }, [lastActivity, logout]);

    return (
        <InactivityContext.Provider value={{ resetLastActivity }}>
            {children}
        </InactivityContext.Provider>
    );
};

export const useInactivity = () => {
    const context = useContext(InactivityContext);
    if (!context) {
        throw new Error('useInactivity must be used within an InactivityProvider');
    }
    return context;
};
