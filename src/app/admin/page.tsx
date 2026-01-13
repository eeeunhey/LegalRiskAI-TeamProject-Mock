'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Shield, Home, ArrowLeft, Users, FileText, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '@/contexts';
import { useEffect } from 'react';

export default function AdminPage() {
    const router = useRouter();
    const { isAuthenticated, isAdmin, user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
            }
        }
    }, [isAuthenticated, loading, router]);

    // Show 403 for non-admin users
    if (!loading && isAuthenticated && !isAdmin) {
        return (
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
                <div className="text-center">
                    {/* 403 Illustration */}
                    <div className="relative mb-8">
                        <div className="text-[150px] font-bold text-orange-100 dark:text-orange-900/30 leading-none select-none">
                            403
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <Shield className="w-12 h-12 text-orange-500" />
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        접근 권한이 없습니다
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                        이 페이지는 관리자만 접근할 수 있습니다.
                        관리자 권한이 필요하면 시스템 관리자에게 문의해주세요.
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
                        현재 로그인: <span className="font-medium">{user?.email}</span> (일반 사용자)
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-500 transition-colors shadow-lg"
                        >
                            <Home className="w-5 h-5" />
                            대시보드로 이동
                        </Link>
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            이전 페이지
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show admin dashboard for admins
    if (isAdmin) {
        const adminMenus = [
            { icon: Users, title: '사용자 관리', description: '사용자 계정 관리 및 권한 설정', count: 156 },
            { icon: FileText, title: '리포트 관리', description: '생성된 분석 리포트 관리', count: 42 },
            { icon: BarChart3, title: '통계 대시보드', description: '플랫폼 사용 통계 및 분석', count: null },
            { icon: Settings, title: '시스템 설정', description: 'AI 모델 및 시스템 환경 설정', count: null },
        ];

        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">관리자 페이지</h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                        시스템 관리 및 사용자 관리 기능에 접근할 수 있습니다.
                    </p>
                </div>

                {/* Admin Info Card */}
                <div className="mb-8 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-purple-100">관리자로 로그인됨</p>
                            <p className="text-2xl font-bold">{user?.name}</p>
                            <p className="text-purple-200 text-sm">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Admin Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {adminMenus.map((menu, idx) => {
                        const Icon = menu.icon;
                        return (
                            <div
                                key={idx}
                                className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-lg transition-all cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {menu.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    {menu.description}
                                </p>
                                {menu.count !== null && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                                        {menu.count}개
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Notice */}
                <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        ⚠️ 이것은 목업 관리자 페이지입니다. 실제 기능은 구현되어 있지 않습니다.
                    </p>
                </div>
            </div>
        );
    }

    // Loading state
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
