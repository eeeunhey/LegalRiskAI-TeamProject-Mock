'use client';

import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="text-[150px] font-bold text-orange-100 leading-none select-none">
                        403
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center">
                            <ShieldAlert className="w-12 h-12 text-orange-500" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    접근 권한이 없습니다
                </h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    요청하신 페이지에 접근할 수 있는 권한이 확인되지 않았습니다.
                    관리자 계정으로 로그인되어 있는지 확인해주세요.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/login"
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-500 transition-colors shadow-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        로그인 페이지로
                    </Link>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        대시보드로 이동
                    </Link>
                </div>
            </div>
        </div>
    );
}
