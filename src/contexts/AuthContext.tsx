import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  User,
} from '@/services/authService';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const abortController = new AbortController(); // To cancel pending requests

    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        if (!abortController.signal.aborted) {
          setUser(userData);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Failed to load user:', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      abortController.abort(); // Clean up the request if the component is unmounted
    };
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await loginService(username, password);
      await delay(1000);
      const userData = await getCurrentUser();
      console.log("login: ", userData);
      setUser(userData);
      await router.push('/dashboard'); // Redirect after login
    } catch (error) {
      console.error('Index failed:', error);
      throw error
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
      await router.push('/login'); // Redirect after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
