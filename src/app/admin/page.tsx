'use client';

import Link from 'next/link';
import { Shield, Home, ArrowLeft, Users, FileText, BarChart3, Settings } from 'lucide-react';

export default function AdminPage() {
    const adminMenus = [
        { icon: Users, title: '사용자 관리', description: '사용자 계정 관리 및 권한 설정', count: 156 },
        { icon: FileText, title: '리포트 관리', description: '생성된 분석 리포트 관리', count: 42 },
        { icon: BarChart3, title: '통계 대시보드', description: '플랫폼 사용 통계 및 분석', count: null },
        { icon: Settings, title: '시스템 설정', description: 'AI 모델 및 시스템 환경 설정', count: null },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">관리자 페이지</h1>
                </div>
                <p className="text-gray-500">
                    시스템 관리 및 사용자 관리 기능에 접근할 수 있습니다.
                </p>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl text-white">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-purple-100">관리자 페이지</p>
                        <p className="text-2xl font-bold">시스템 관리</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminMenus.map((menu, idx) => {
                    const Icon = menu.icon;
                    return (
                        <div
                            key={idx}
                            className="p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                                <Icon className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {menu.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3">
                                {menu.description}
                            </p>
                            {menu.count !== null && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                    {menu.count}개
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                    ⚠️ 이것은 목업 관리자 페이지입니다. 실제 기능은 구현되어 있지 않습니다.
                </p>
            </div>
        </div>
    );
}
