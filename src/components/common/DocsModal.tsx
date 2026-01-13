'use client';

import { X, BookOpen, Database, Workflow, Code, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

interface DocsModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName: string;
    featureDescription: string;
}

export const featureDocumentation: Record<string, {
    title: string;
    subtitle: string;
    overview: string;
    inputDescription: string;
    outputDescription: string;
    aiModel: string;
    implementationSteps: string[];
    dbTables: { name: string; purpose: string }[];
    dataFlow: string[];
    erdDescription: string;
}> = {
    classify: {
        title: '분쟁 유형 분류 AI',
        subtitle: 'Dispute Classification AI',
        overview: '입력된 분쟁 텍스트를 분석하여 Consumer, Contract, Administrative 등의 유형으로 자동 분류합니다.',
        inputDescription: '분쟁과 관련된 자유형식 텍스트',
        outputDescription: '분류 레이블, 각 유형별 확률 점수, 핵심 키워드, AI 판단 근거 설명',
        aiModel: 'LegalRisk-CLASSIFY-v1.0 (BERT 기반)',
        implementationSteps: ['텍스트 입력', '전처리', 'AI 모델 분석', '결과 저장', 'UI 표시'],
        dbTables: [{ name: 'cases', purpose: '원본 텍스트 저장' }, { name: 'analysis_runs', purpose: '분석 실행 기록' }, { name: 'dispute_classifications', purpose: '분류 결과' }],
        dataFlow: ['사용자 입력', 'DB 저장', 'AI 분석', '결과 표시'],
        erdDescription: 'cases(1) → analysis_runs(N) → dispute_classifications(1)',
    },
    risk: {
        title: '법적 위험도 예측 AI',
        subtitle: 'Legal Risk Prediction AI',
        overview: '분쟁 텍스트 내 법적 표현의 강도를 분석하여 리스크 점수와 승소 가능성을 산출합니다.',
        inputDescription: '경고 서신, 통보문, 분쟁 관련 문서',
        outputDescription: '리스크 점수(0-100), 리스크 레벨, 예상 승소확률, 리스크 요인',
        aiModel: 'LegalRisk-RISK-v1.0',
        implementationSteps: ['텍스트 분석', '위협 수준 계산', '승소율 예측', '결과 저장'],
        dbTables: [{ name: 'legal_risk_predictions', purpose: '위험도 결과 저장' }],
        dataFlow: ['텍스트 입력', 'AI 분석', '결과 표시'],
        erdDescription: 'analysis_runs(1) → legal_risk_predictions(1)',
    },
    emotion: {
        title: '감정 격화 단계 분석 AI',
        subtitle: 'Emotion Escalation Analysis AI',
        overview: '분쟁 당사자의 커뮤니케이션에서 감정 상태와 격화 단계를 진단합니다.',
        inputDescription: '대화 내용, 이메일, 문자 메시지',
        outputDescription: '갈등 단계, 공격성 지수, 격화 속도, 감정 키워드',
        aiModel: 'LegalRisk-EMOTION-v1.0',
        implementationSteps: ['감정 분석', '추이 계산', '단계 판정', '결과 저장'],
        dbTables: [{ name: 'emotion_escalations', purpose: '감정 분석 결과' }],
        dataFlow: ['텍스트 입력', 'AI 분석', '결과 표시'],
        erdDescription: 'analysis_runs(1) → emotion_escalations(1)',
    },
    similar: {
        title: '유사 판례 매칭 AI',
        subtitle: 'Similar Case Matching AI',
        overview: '입력된 사건의 핵심 쟁점을 추출하고 유사한 판례를 찾아 비교 분석합니다.',
        inputDescription: '분쟁 사건의 상황 설명',
        outputDescription: '쟁점 비교 테이블, Top 3 유사 판례',
        aiModel: 'LegalRisk-SIMILAR-v1.0',
        implementationSteps: ['쟁점 추출', '유사도 검색', '판례 매칭', '결과 저장'],
        dbTables: [{ name: 'similar_case_matches', purpose: '유사 판례 매칭 결과' }],
        dataFlow: ['텍스트 입력', 'AI 검색', '결과 표시'],
        erdDescription: 'analysis_runs(1) → similar_case_matches(1)',
    },
    strategy: {
        title: '조기 종재 전략 추천 AI',
        subtitle: 'Early Resolution Strategy AI',
        overview: '분쟁 상황을 분석하여 조기 해결을 위한 최적의 전략을 추천합니다.',
        inputDescription: '분쟁 상황, 관계, 해결 방향',
        outputDescription: '예상 승소 확률, 전략 요약, 추천 시나리오',
        aiModel: 'LegalRisk-STRATEGY-v1.0',
        implementationSteps: ['상황 분석', '경로 탐색', '시나리오 생성', '결과 저장'],
        dbTables: [{ name: 'strategy_recommendations', purpose: '전략 추천 결과' }],
        dataFlow: ['텍스트 입력', 'AI 분석', '결과 표시'],
        erdDescription: 'analysis_runs(1) → strategy_recommendations(1)',
    },
};

export default function DocsModal({ isOpen, onClose, featureName }: DocsModalProps) {
    const docs = featureDocumentation[featureName] || featureDocumentation.classify;

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) { document.addEventListener('keydown', handleEscape); document.body.style.overflow = 'hidden'; }
        return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = 'unset'; };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-fadeIn">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-white" />
                        <div><h2 className="text-lg font-semibold text-white">{docs.title}</h2><p className="text-primary-100 text-sm">{docs.subtitle}</p></div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-auto p-6 space-y-6">
                    <section><h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3"><BookOpen className="w-5 h-5 text-blue-600" />기능 개요</h3><p className="text-gray-600 bg-gray-50 p-4 rounded-xl">{docs.overview}</p></section>
                    <section className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl"><h4 className="font-semibold text-green-800 mb-2">📥 입력</h4><p className="text-green-700 text-sm">{docs.inputDescription}</p></div>
                        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl"><h4 className="font-semibold text-purple-800 mb-2">📤 출력</h4><p className="text-purple-700 text-sm">{docs.outputDescription}</p></div>
                    </section>
                    <section className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl"><h4 className="font-semibold text-yellow-800 mb-2">🤖 AI 모델</h4><code className="text-yellow-700 text-sm">{docs.aiModel}</code></section>
                    <section><h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3"><Code className="w-5 h-5 text-orange-600" />구현 단계</h3>
                        <div className="flex flex-wrap gap-2">{docs.implementationSteps.map((step, idx) => (<span key={idx} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">{idx + 1}. {step}</span>))}</div>
                    </section>
                    <section><h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3"><Database className="w-5 h-5 text-cyan-600" />관련 DB 테이블</h3>
                        <div className="space-y-2">{docs.dbTables.map((table, idx) => (<div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"><code className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-sm">{table.name}</code><span className="text-gray-600 text-sm">{table.purpose}</span></div>))}</div>
                    </section>
                    <section><h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3"><Workflow className="w-5 h-5 text-pink-600" />데이터 흐름</h3>
                        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-xl">{docs.dataFlow.map((step, idx) => (<span key={idx} className="flex items-center gap-2"><span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">{step}</span>{idx < docs.dataFlow.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400" />}</span>))}</div>
                    </section>
                    <section><h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3"><Database className="w-5 h-5 text-indigo-600" />ERD</h3><div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl"><code className="text-indigo-700 text-sm">{docs.erdDescription}</code></div></section>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end"><button onClick={onClose} className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-500">닫기</button></div>
            </div>
        </div>
    );
}
