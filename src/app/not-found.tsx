'use client';

import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
            <div className="text-center">
                {/* 404 Illustration */}
                <div className="relative mb-8">
                    <div className="text-[150px] font-bold text-gray-100 dark:text-slate-800 leading-none select-none">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                            <FileQuestion className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    페이지를 찾을 수 없습니다
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
                    URL을 확인하시거나 아래 버튼을 통해 이동해주세요.
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
                        onClick={() => window.history.back()}
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
