import { createContext, useEffect, useContext, ReactNode } from 'react';
import { refreshToken, getAccessToken, isTokenExpired } from '@/services/authService';
import { useAuth } from "@/contexts/AuthContext";
import {jwtDecode, JwtPayload} from "jwt-decode";

interface TokenRefreshContextType {
    checkAndRefreshToken: () => void;
}

const TokenRefreshContext = createContext<TokenRefreshContextType | undefined>(undefined);

export const TokenRefreshProvider = ({ children }: { children: ReactNode }) => {
    const { logout } = useAuth();
    const REFRESH_INTERVAL = 15 * 60 * 1000;

    const checkAndRefreshToken = async () => {
        const token = getAccessToken();
        if (token && isTokenExpiringSoon(token, 15 * 60)) {
            try {
                await refreshToken();
                console.log('Token refreshed automatically');
            } catch (error) {
                console.error('Failed to refresh token');
                logout();
            }
        }
    };

    useEffect(() => {
        const intervalId = setInterval(checkAndRefreshToken, REFRESH_INTERVAL);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <TokenRefreshContext.Provider value={{ checkAndRefreshToken }}>
            {children}
        </TokenRefreshContext.Provider>
    );
};

export const useTokenRefresh = () => {
    const context = useContext(TokenRefreshContext);
    if (!context) {
        throw new Error('useTokenRefresh must be used within a TokenRefreshProvider');
    }
    return context;
};

// Helper to check if the token is expiring soon
const isTokenExpiringSoon = (token: string, thresholdInSeconds: number): boolean => {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) return true;
    const now = Date.now().valueOf() / 1000;
    return decoded.exp < now + thresholdInSeconds;
};
