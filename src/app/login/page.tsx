'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scale, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

const mockUsers = [
    { email: 'admin@legalrisk.ai', password: 'admin123', name: '관리자', role: 'admin' },
    { email: 'user@legalrisk.ai', password: 'user123', name: '홍길동', role: 'user' },
];

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const found = mockUsers.find(u => u.email === email && u.password === password);

        if (found) {
            router.push('/dashboard');
        } else {
            setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 mb-4 shadow-lg">
                        <Scale className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        LegalRisk <span className="text-primary-600">AI</span>
                    </h1>
                    <p className="text-gray-500 mt-2">계정에 로그인하세요</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="이메일을 입력하세요"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호를 입력하세요"
                                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-400 hover:to-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    로그인 중...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    로그인
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">또는</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-center text-sm text-gray-500 mb-3">테스트 계정으로 로그인</p>
                        <button
                            onClick={() => { setEmail('admin@legalrisk.ai'); setPassword('admin123'); }}
                            className="w-full py-2 px-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 text-sm hover:bg-purple-100 transition-colors"
                        >
                            👑 관리자 계정 자동 입력
                        </button>
                        <button
                            onClick={() => { setEmail('user@legalrisk.ai'); setPassword('user123'); }}
                            className="w-full py-2 px-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm hover:bg-gray-100 transition-colors"
                        >
                            👤 일반 사용자 계정 자동 입력
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        계정이 없으신가요?{' '}
                        <Link href="/signup" className="text-primary-600 hover:text-primary-500 font-medium">
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
