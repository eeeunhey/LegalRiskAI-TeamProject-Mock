'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, AlertTriangle, TrendingUp, Search, Lightbulb, LayoutDashboard, FileText, LogIn, Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import { useRef, useEffect } from 'react';

const menuItems = [
    { href: '/dashboard', label: '통합 대시보드', icon: LayoutDashboard },
    { href: '/classify', label: '분쟁 유형', icon: Scale },
    { href: '/risk', label: '위험도 예측', icon: AlertTriangle },
    { href: '/emotion', label: '감정 분석', icon: TrendingUp },
    { href: '/similar', label: '유사 판례', icon: Search },
    { href: '/simulation', label: '사건 시뮬레이션', icon: Scale },
    { href: '/strategy', label: '조기 종재', icon: Lightbulb },
];

export default function Navigation() {
    const pathname = usePathname();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/dashboard" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                            <Scale className="w-6 h-6 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-gray-900">LegalRisk</span>
                            <span className="text-xl font-light text-primary-600 ml-1">AI</span>
                        </div>
                    </Link>

                    <div className="hidden xl:flex items-center gap-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                                    <Icon className="w-4 h-4" />{item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-2">
                        {isAuthenticated ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary-600" />
                                    </div>
                                    <span className="hidden md:block text-sm text-gray-700 font-medium max-w-[100px] truncate">
                                        {user?.name}
                                    </span>
                                    <div className={`hidden md:flex text-[10px] px-1.5 py-0.5 rounded-full ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {isAdmin ? '관리자' : '회원'}
                                    </div>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50 animate-fadeIn origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/mypage"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                <User className="w-4 h-4 text-gray-400" />
                                                마이페이지
                                            </Link>

                                            {isAdmin && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
                                                >
                                                    <Shield className="w-4 h-4" />
                                                    관리자 페이지
                                                </Link>
                                            )}
                                        </div>

                                        <div className="border-t border-gray-100 py-1">
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setShowUserMenu(false);
                                                }}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                로그아웃
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors shadow-md hover:shadow-lg transform active:scale-95">
                                <LogIn className="w-4 h-4" /><span className="hidden sm:inline">로그인</span>
                            </Link>
                        )}

                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="xl:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                        >
                            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="xl:hidden border-t border-gray-200 bg-white animate-slideIn max-h-[calc(100vh-64px)] overflow-y-auto shadow-inner">
                    <div className="px-4 py-3 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href} onClick={() => setShowMobileMenu(false)} className={`flex items-center gap-3 px-3 py-3 rounded-xl text-md font-medium ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                                    <Icon className="w-5 h-5" />{item.label}
                                </Link>
                            );
                        })}

                        <div className="border-t border-gray-100 my-2 pt-2">
                            {isAuthenticated ? (
                                <div className="space-y-1">
                                    <div className="px-3 py-3 flex items-center gap-3 bg-gray-50 rounded-xl mb-2">
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                                            <User className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className={`text-xs px-2 py-1 rounded-full ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'}`}>
                                                {isAdmin ? '관리자' : '회원'}
                                            </span>
                                        </div>
                                    </div>

                                    <Link href="/mypage" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-md font-medium text-gray-700 hover:bg-gray-100">
                                        <User className="w-5 h-5" />마이페이지
                                    </Link>

                                    {isAdmin && (
                                        <Link href="/admin" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-md font-medium text-purple-600 hover:bg-purple-50">
                                            <Shield className="w-5 h-5" />관리자 페이지
                                        </Link>
                                    )}

                                    <button onClick={() => { logout(); setShowMobileMenu(false); }} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-md font-medium text-red-600 hover:bg-red-50 text-left">
                                        <LogOut className="w-5 h-5" />로그아웃
                                    </button>
                                </div>
                            ) : (
                                <Link href="/login" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-md font-medium text-gray-600 hover:bg-gray-100">
                                    <LogIn className="w-5 h-5" />로그인
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
