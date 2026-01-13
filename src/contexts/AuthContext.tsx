'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'admin' | 'user' | 'guest';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers: { email: string; password: string; user: User }[] = [
    {
        email: 'admin@legalrisk.ai',
        password: 'admin123',
        user: {
            id: 'admin-001',
            email: 'admin@legalrisk.ai',
            name: '관리자',
            role: 'admin',
        },
    },
    {
        email: 'user@legalrisk.ai',
        password: 'user123',
        user: {
            id: 'user-001',
            email: 'user@legalrisk.ai',
            name: '홍길동',
            role: 'user',
        },
    },
];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const found = mockUsers.find(u => u.email === email && u.password === password);

        if (found) {
            setUser(found.user);
            localStorage.setItem('user', JSON.stringify(found.user));
            setLoading(false);
            return { success: true };
        }

        setLoading(false);
        return { success: false, error: '이메일 또는 비밀번호가 올바르지 않습니다.' };
    };

    const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Check if email already exists
        if (mockUsers.find(u => u.email === email)) {
            setLoading(false);
            return { success: false, error: '이미 등록된 이메일입니다.' };
        }

        // Create new user
        const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            name,
            role: 'user',
        };

        mockUsers.push({ email, password, user: newUser });
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        setLoading(false);
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAdmin: user?.role === 'admin',
                login,
                signup,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
