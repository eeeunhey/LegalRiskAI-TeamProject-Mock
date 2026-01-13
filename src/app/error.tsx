'use client';

import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="text-[150px] font-bold text-red-100 leading-none select-none">
                        500
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    서버 오류가 발생했습니다
                </h1>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                    문제가 지속되면 관리자에게 문의해주세요.
                </p>

                {error?.message && (
                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left max-w-md mx-auto">
                        <p className="text-sm text-red-600 font-mono break-all">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-500 transition-colors shadow-lg"
                    >
                        <RefreshCw className="w-5 h-5" />
                        다시 시도
                    </button>
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
