'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, ResultCard } from '@/components/common';
import { User, Mail, Shield, Clock, Settings, FileText } from 'lucide-react';

export default function MyPage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <p className="text-gray-500">로그인이 필요한 페이지입니다.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-8 h-8 text-primary-600" />
                    마이페이지
                </h1>
                <p className="text-gray-500 mt-1">계정 정보 및 활동 내역을 관리합니다.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <Card className="h-full">
                        <div className="flex flex-col items-center text-center py-6">
                            <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                                <User className="w-12 h-12 text-primary-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 text-sm mb-4">{user.email}</p>

                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-primary-50 text-primary-700'
                                }`}>
                                <Shield className="w-3 h-3 mr-1" />
                                {user.role === 'admin' ? '관리자' : '일반 회원'}
                            </span>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> 이메일
                                </span>
                                <span className="text-gray-900 font-medium">{user.email}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> 가입일
                                </span>
                                <span className="text-gray-900">2026. 01. 13</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-6">
                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            최근 활동 내역
                        </h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-5 h-5 text-primary-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-gray-900 font-medium text-sm">분쟁 위험도 분석 리포트 생성 #{100 + item}</h4>
                                        <p className="text-gray-500 text-xs mt-1">2026. 01. {13 - item} 14:30</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-lg">완료</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-400" />
                            계정 설정
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button className="p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-left group">
                                <span className="block text-sm font-medium text-gray-900 group-hover:text-primary-600">비밀번호 변경</span>
                                <span className="text-xs text-gray-500">주기적인 변경으로 계정을 보호하세요.</span>
                            </button>
                            <button className="p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-left group">
                                <span className="block text-sm font-medium text-gray-900 group-hover:text-primary-600">알림 설정</span>
                                <span className="text-xs text-gray-500">분석 완료 알림을 설정합니다.</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
