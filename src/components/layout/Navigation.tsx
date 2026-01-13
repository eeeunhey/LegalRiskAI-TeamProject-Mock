'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, AlertTriangle, TrendingUp, Search, Lightbulb, LayoutDashboard, FileText, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
    { href: '/dashboard', label: '통합 대시보드', icon: LayoutDashboard },
    { href: '/classify', label: '분쟁 유형', icon: Scale },
    { href: '/risk', label: '위험도 예측', icon: AlertTriangle },
    { href: '/emotion', label: '감정 분석', icon: TrendingUp },
    { href: '/similar', label: '유사 판례', icon: Search },
    { href: '/strategy', label: '조기 종재', icon: Lightbulb },
    { href: '/reports', label: '리포트', icon: FileText },
];

export default function Navigation() {
    const pathname = usePathname();
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                            <Scale className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-gray-900">LegalRisk</span>
                            <span className="text-xl font-light text-primary-600 ml-1">AI</span>
                        </div>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1">
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
                        <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
                            <LogIn className="w-4 h-4" /><span className="hidden sm:inline">로그인</span>
                        </Link>
                        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden text-gray-600 hover:text-gray-900 p-2">
                            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {showMobileMenu && (
                <div className="lg:hidden border-t border-gray-200 bg-white animate-slideIn">
                    <div className="px-2 py-3 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link key={item.href} href={item.href} onClick={() => setShowMobileMenu(false)} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                                    <Icon className="w-5 h-5" />{item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
