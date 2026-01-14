'use client';

import Link from 'next/link';
import { AlertTriangle, FileQuestion, ArrowRight, ShieldAlert } from 'lucide-react';

export default function ErrorGalleryPage() {
    const errors = [
        {
            code: '404',
            title: 'Page Not Found',
            description: '존재하지 않는 페이지에 접근했을 때 표시되는 화면입니다.',
            icon: FileQuestion,
            color: 'text-gray-500',
            bg: 'bg-gray-100',
            href: '/errors/404'
        },
        {
            code: '500',
            title: 'Server Error',
            description: '서버 내부 오류가 발생했을 때 표시되는 화면입니다.',
            icon: AlertTriangle,
            color: 'text-red-500',
            bg: 'bg-red-100',
            href: '/errors/500'
        },
        {
            code: '403',
            title: 'Forbidden',
            description: '접근 권한이 없는 페이지에 접속했을 때 표시되는 화면입니다.',
            icon: ShieldAlert,
            color: 'text-orange-500',
            bg: 'bg-orange-100',
            href: '/errors/403'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">에러 페이지 갤러리</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    서비스 운영 중 발생할 수 있는 다양한 에러 상황에 대한 사용자 경험(UX)을 미리 확인하고 점검할 수 있는 페이지입니다.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {errors.map((error) => {
                    const Icon = error.icon;
                    return (
                        <Link
                            key={error.code}
                            href={error.href}
                            className="group block bg-white rounded-2xl border border-gray-200 p-8 hover:border-primary-500 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className={`w-16 h-16 rounded-2xl ${error.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-8 h-8 ${error.color}`} />
                                </div>
                                <div className="text-4xl font-bold text-gray-200 group-hover:text-primary-100 transition-colors">
                                    {error.code}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                                {error.title}
                            </h3>
                            <p className="text-gray-500 mb-6 min-h-[48px]">
                                {error.description}
                            </p>

                            <div className="flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
                                미리보기
                                <ArrowRight className="w-5 h-5 ml-1" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
