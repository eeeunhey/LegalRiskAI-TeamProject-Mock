'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Scale, Brain, Lock } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Header */}
            <header className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Scale className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">LegalRisk AI</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                    >
                        로그인
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-5 py-2.5 bg-white text-indigo-900 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors"
                    >
                        대시보드 실행
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 container mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fadeIn">
                    <span className="flex h-2 w-2 rounded-full bg-green-400"></span>
                    <span className="text-sm text-gray-300 font-medium">v1.0.0 정식 출시</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight max-w-4xl">
                    법적 리스크 분석의 <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">새로운 차원</span>
                </h1>

                <p className="text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed">
                    최첨단 AI 기술로 법적 분쟁 가능성을 사전에 예측하고,
                    <br className="hidden md:block" />
                    빅데이터 기반의 최적화된 대응 전략을 제안합니다.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Link
                        href="/dashboard"
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:from-purple-500 hover:to-indigo-500 transition-all shadow-xl shadow-purple-500/30 flex items-center justify-center gap-2 group"
                    >
                        무료로 시작하기
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/about"
                        className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
                    >
                        서비스 소개
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl w-full text-left">
                    {[
                        {
                            icon: Brain,
                            title: "AI 심층 분석",
                            desc: "자연어 처리(NLP) 기술로 복잡한 법률 문서를 신속하게 분석합니다."
                        },
                        {
                            icon: Shield,
                            title: "위험도 예측",
                            desc: "판례 데이터를 학습한 AI가 승소 확률과 리스크 점수를 산출합니다."
                        },
                        {
                            icon: Lock,
                            title: "엔터프라이즈 보안",
                            desc: "모든 데이터는 암호화되어 안전하게 처리되며 외부 유출을 방지합니다."
                        }
                    ].map((feature, idx) => (
                        <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6">
                                <feature.icon className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
