'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    FileQuestion,
    ShieldX,
    AlertTriangle,
    ServerCrash,
    WifiOff,
    Clock,
    Home,
    AlertCircle
} from 'lucide-react';

interface ErrorDemo {
    code: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
}

const errorDemos: ErrorDemo[] = [
    { code: '400', title: 'Bad Request', description: '잘못된 요청입니다.', icon: AlertCircle, color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { code: '401', title: 'Unauthorized', description: '인증이 필요합니다.', icon: ShieldX, color: 'text-orange-500', bgColor: 'bg-orange-100' },
    { code: '403', title: 'Forbidden', description: '접근 권한이 없습니다.', icon: ShieldX, color: 'text-red-500', bgColor: 'bg-red-100' },
    { code: '404', title: 'Not Found', description: '페이지를 찾을 수 없습니다.', icon: FileQuestion, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { code: '408', title: 'Request Timeout', description: '요청 시간이 초과되었습니다.', icon: Clock, color: 'text-purple-500', bgColor: 'bg-purple-100' },
    { code: '500', title: 'Internal Server Error', description: '서버 내부 오류가 발생했습니다.', icon: ServerCrash, color: 'text-red-600', bgColor: 'bg-red-100' },
    { code: '502', title: 'Bad Gateway', description: '게이트웨이 오류입니다.', icon: WifiOff, color: 'text-gray-500', bgColor: 'bg-gray-100' },
    { code: '503', title: 'Service Unavailable', description: '서비스를 사용할 수 없습니다.', icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-100' },
];

export default function ErrorsPage() {
    const [selectedError, setSelectedError] = useState<ErrorDemo | null>(null);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">에러 페이지 데모</h1>
                </div>
                <p className="text-gray-500">
                    다양한 HTTP 상태 코드에 대한 에러 페이지 예시입니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {errorDemos.map((error) => {
                    const Icon = error.icon;
                    return (
                        <button
                            key={error.code}
                            onClick={() => setSelectedError(error)}
                            className={`p-6 rounded-xl border text-left transition-all hover:scale-105 hover:shadow-lg
                ${selectedError?.code === error.code
                                    ? 'border-primary-500 bg-primary-50'
                                    : 'border-gray-200 bg-white'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-lg ${error.bgColor} flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 ${error.color}`} />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{error.code}</div>
                            <div className="text-sm font-medium text-gray-700 mb-2">{error.title}</div>
                            <p className="text-xs text-gray-500">{error.description}</p>
                        </button>
                    );
                })}
            </div>

            {selectedError && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">에러 페이지 미리보기: {selectedError.code}</h2>
                        <button onClick={() => setSelectedError(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>

                    <div className="p-12 bg-gray-50">
                        <div className="text-center max-w-md mx-auto">
                            <div className="relative mb-8">
                                <div className={`text-[120px] font-bold leading-none select-none ${selectedError.code.startsWith('4') ? 'text-gray-100' : 'text-red-100'
                                    }`}>
                                    {selectedError.code}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className={`w-20 h-20 rounded-full ${selectedError.bgColor} flex items-center justify-center`}>
                                        <selectedError.icon className={`w-10 h-10 ${selectedError.color}`} />
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{selectedError.title}</h3>
                            <p className="text-gray-500 mb-6">{selectedError.description}</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-500 transition-colors">
                                    <Home className="w-4 h-4" />홈으로 이동
                                </button>
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                                    이전 페이지
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">실제 에러 페이지 테스트</h3>
                <div className="flex flex-wrap gap-3">
                    <Link href="/this-page-does-not-exist" className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors">
                        404 페이지 보기 →
                    </Link>
                </div>
            </div>
        </div>
    );
}
