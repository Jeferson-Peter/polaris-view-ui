import axios, { AxiosError } from 'axios';
import {jwtDecode, JwtPayload } from 'jwt-decode';
import {api, handleApiError} from '@/services/api'

// URL da API (substitua pelo URL real da sua API)

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export const login = async (username: string, password: string): Promise<User> => {
    try {
        const response = await api.post<LoginResponse>(`auth/login/`, { username, password });
        const { access, refresh } = response.data;
        setTokens(access, refresh);
        return jwtDecode(access);
    } catch (error) {
        handleApiError(error);
        throw new Error("Index failed");
    }
};

export const register = async (userData: { username: string; password: string; email: string }): Promise<void> => {
    try {
        await api.post(`$auth/register/`, userData);
    } catch (error) {
        handleApiError(error);
    }
};

export const logout = async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    const accessToken = getAccessToken();
    try {
        await api.post(
            `/auth/logout/`,
            { refresh: refreshToken },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        clearTokens();
    } catch (error) {
        handleApiError(error);
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    const accessToken = getAccessToken();
    if (!accessToken) {
        return null;
    }
    try {
        const response = await api.get<User>(`auth/user/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        if ((error as AxiosError).response?.status === 401) {
            await refreshToken();
            return getCurrentUser();
        }
        handleApiError(error);
    }
    return null;
};

export const refreshToken = async (): Promise<string> => {
    const refreshToken = getRefreshToken();
    try {
        const response = await api.post(`auth/token/refresh/`, { refresh: refreshToken });
        const newAccessToken = response.data.access;
        setAccessToken(newAccessToken);
        setRefreshToken(response.data.refresh);
        return newAccessToken;
    } catch (error) {
        handleApiError(error);
        throw new Error("Failed to refresh token");
    }
};

export const getAccessToken = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem('access');
    }
    return null;
};

export const getRefreshToken = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem('refresh');
    }
    return null;
};

export const setAccessToken = (token: string): void => {
    localStorage.setItem('access', token);
};

export const setRefreshToken = (token: string): void => {
    localStorage.setItem('refresh', token);
};

export const setTokens = (access: string, refresh: string): void => {
    setAccessToken(access);
    setRefreshToken(refresh);
};

export const clearTokens = (): void => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
};

export const setAuthHeader = (token: string): void => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const isTokenExpired = (token: string): boolean => {
    const decoded = jwtDecode<JwtPayload>(token);
    if (!decoded.exp) {
        return true;
    }
    const now = Date.now().valueOf() / 1000;
    return decoded.exp < now;
};