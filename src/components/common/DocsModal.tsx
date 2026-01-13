'use client';

import { X, BookOpen, Database, Workflow, Code, ArrowRight, CheckCircle } from 'lucide-react';
import { useEffect } from 'react';

interface DocsModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName: string;
    featureDescription: string;
}

// Feature documentation data
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
        overview: '입력된 분쟁 텍스트를 분석하여 Consumer(소비자), Contract(계약), Administrative(행정) 등의 유형으로 자동 분류합니다. 자연어 처리(NLP)와 멀티클래스 분류 모델을 사용하여 텍스트의 법적 성격을 판단합니다.',
        inputDescription: '분쟁과 관련된 자유형식 텍스트 (계약서 내용, 분쟁 상황 설명, 상대방 주장 등)',
        outputDescription: '분류 레이블(Consumer/Contract/Administrative 등), 각 유형별 확률 점수, 핵심 키워드, AI 판단 근거 설명',
        aiModel: 'LegalRisk-CLASSIFY-v1.0 (BERT 기반 멀티클래스 분류 모델)',
        implementationSteps: [
            '사용자가 분쟁 텍스트 입력',
            '텍스트 전처리 (토큰화, 정규화)',
            'AI 모델에 텍스트 전달',
            '각 유형별 확률 점수 계산',
            '최고 점수 유형을 top_label로 선정',
            '키워드 추출 및 판단 근거 생성',
            '결과를 dispute_classifications 테이블에 저장',
            'UI에 바 차트, 키워드, 설명 표시',
        ],
        dbTables: [
            { name: 'cases', purpose: '입력된 원본 텍스트와 케이스 메타데이터 저장' },
            { name: 'analysis_runs', purpose: '분석 실행 기록 (시작/종료 시간, 상태, 모델명)' },
            { name: 'dispute_classifications', purpose: '분류 결과 저장 (top_label, scores, keywords, explanation)' },
        ],
        dataFlow: [
            '사용자 → 텍스트 입력',
            'cases 테이블 → 케이스 생성',
            'analysis_runs 테이블 → 분석 실행 기록 시작',
            'AI Model → 분류 수행',
            'dispute_classifications 테이블 → 결과 저장',
            'analysis_runs 테이블 → 분석 완료 기록',
            'UI → 결과 시각화 표시',
        ],
        erdDescription: 'cases(1) → analysis_runs(N): 하나의 케이스에 여러 분석 실행 가능\nanalysis_runs(1) → dispute_classifications(1): 각 분석 실행당 하나의 분류 결과\n\n분류 결과는 run_id를 통해 분석 실행과 연결되며, 이를 통해 어떤 케이스에서 어떤 모델로 분석했는지 추적 가능합니다.',
    },
    risk: {
        title: '법적 위험도 예측 AI',
        subtitle: 'Legal Risk Prediction AI',
        overview: '분쟁 텍스트 내 법적 표현의 강도, 위협 수준, 소송 가능성 등을 분석하여 0-100 사이의 리스크 점수와 예상 승소 확률을 산출합니다.',
        inputDescription: '상대방으로부터 받은 경고 서신, 통보문, 분쟁 관련 문서',
        outputDescription: '리스크 점수(0-100), 리스크 레벨(low/medium/high), 예상 승소확률(%), 핵심 리스크 요인 목록',
        aiModel: 'LegalRisk-RISK-v1.0 (회귀 + 분류 하이브리드 모델)',
        implementationSteps: [
            '텍스트에서 법적 표현 패턴 추출',
            '위협적 표현 강도 분석',
            '구체적 금액/조항 언급 여부 확인',
            '법적 조치 언급 빈도 계산',
            '종합 리스크 점수 산출',
            '과거 유사 사례 기반 승소 확률 예측',
            '주요 리스크 요인 추출 및 설명 생성',
            '결과를 legal_risk_predictions 테이블에 저장',
        ],
        dbTables: [
            { name: 'cases', purpose: '분석 대상 원본 텍스트 저장' },
            { name: 'analysis_runs', purpose: 'RISK 유형 분석 실행 기록' },
            { name: 'legal_risk_predictions', purpose: '위험도 점수, 승소율, 리스크 요인 저장' },
        ],
        dataFlow: [
            '사용자 → 분쟁 텍스트 입력',
            'cases 테이블 → 케이스 생성',
            'analysis_runs 테이블 → RISK 분석 실행 시작',
            'AI Model → 위험도 분석 수행',
            'legal_risk_predictions 테이블 → 결과 저장',
            'UI → 게이지 차트, 프로그레스 바, 요인 목록 표시',
        ],
        erdDescription: 'legal_risk_predictions 테이블은 run_id를 PK이자 FK로 사용하여 analysis_runs와 1:1 관계를 형성합니다.\n\nrisk_score는 정수(0-100), risk_level은 enum(low/medium/high), risk_factors는 JSON 배열로 저장됩니다.',
    },
    emotion: {
        title: '감정 격화 단계 분석 AI',
        subtitle: 'Emotion Escalation Analysis AI',
        overview: '분쟁 당사자의 커뮤니케이션에서 감정 상태를 분석하고, 갈등이 어느 단계까지 격화되었는지 진단합니다. 시계열 분석을 통해 감정 변화 추이도 파악합니다.',
        inputDescription: '상대방과의 대화 내용, 이메일, 문자 메시지, 통화 녹취록 등',
        outputDescription: '현재 갈등 단계(초기/격화/위협/소송임박), 공격성 지수(0-100), 격화 속도(slow/normal/fast), 감정 추이 그래프, 감정 키워드',
        aiModel: 'LegalRisk-EMOTION-v1.0 (감성분석 + 시계열 예측 모델)',
        implementationSteps: [
            '텍스트 시간순 정렬 (가능한 경우)',
            '각 메시지별 감정 점수 계산',
            '공격적 표현 패턴 탐지',
            '감정 변화 추이 분석',
            '현재 갈등 단계 판정',
            '격화 속도 예측',
            '핵심 감정 키워드 추출',
            '결과를 emotion_escalations 테이블에 저장',
        ],
        dbTables: [
            { name: 'cases', purpose: '분석 대상 대화 내용 저장' },
            { name: 'analysis_runs', purpose: 'EMOTION 유형 분석 실행 기록' },
            { name: 'emotion_escalations', purpose: '단계, 공격성, 추이 데이터, 키워드 저장' },
        ],
        dataFlow: [
            '사용자 → 대화 내용 입력',
            'cases 테이블 → 케이스 생성',
            'analysis_runs 테이블 → EMOTION 분석 실행 시작',
            'AI Model → 감정 분석 수행',
            'emotion_escalations 테이블 → 결과 저장',
            'UI → 프로그레스 바(단계), 라인 차트(추이), 키워드 칩 표시',
        ],
        erdDescription: 'trend 필드는 JSONB 형식으로 시계열 데이터를 저장합니다: [{t: "T-3", value: 62}, {t: "T-2", value: 74}, ...]\n\nemotion_keywords는 문자열 배열로 저장되며, stage는 한글 enum 값을 사용합니다.',
    },
    similar: {
        title: '유사 판례 매칭 AI',
        subtitle: 'Similar Case Matching AI',
        overview: '입력된 사건의 핵심 쟁점을 추출하고, 대법원/하급심 판례 데이터베이스에서 유사한 사례를 찾아 비교 분석합니다. 판결 결과와 승소 당사자 정보도 제공합니다.',
        inputDescription: '분쟁 사건의 상황 설명, 당사자 관계, 주요 쟁점',
        outputDescription: '쟁점 비교 테이블(입력 쟁점 vs 매칭 쟁점), Top 3 유사 판례(유사도, 요약, 승소자, 상세 판결문)',
        aiModel: 'LegalRisk-SIMILAR-v1.0 (Semantic Search + 유사도 계산 모델)',
        implementationSteps: [
            '입력 텍스트에서 핵심 쟁점 추출',
            '쟁점을 벡터로 임베딩',
            '판례 DB에서 유사 벡터 검색',
            '유사도 점수 계산 및 정렬',
            'Top 3 판례 선정',
            '쟁점 매칭 테이블 생성',
            '각 판례의 요약, 승소자, 상세 내용 구성',
            '결과를 similar_case_matches 테이블에 저장',
        ],
        dbTables: [
            { name: 'cases', purpose: '입력 사건 정보 저장' },
            { name: 'analysis_runs', purpose: 'SIMILAR 유형 분석 실행 기록' },
            { name: 'similar_case_matches', purpose: '쟁점 비교, 매칭 판례 정보 저장' },
        ],
        dataFlow: [
            '사용자 → 사건 내용 입력',
            'cases 테이블 → 케이스 생성',
            'analysis_runs 테이블 → SIMILAR 분석 실행 시작',
            'AI Model → 쟁점 추출 및 유사 판례 검색',
            'similar_case_matches 테이블 → 결과 저장',
            'UI → 쟁점 비교 테이블, 판례 카드 목록, 상세 모달 표시',
        ],
        erdDescription: 'issue_compare와 top_matches는 JSONB 형식으로 복잡한 구조를 저장합니다.\n\nissue_compare: [{input_issue: "...", matched_issue: "..."}, ...]\ntop_matches: [{case_title: "...", similarity: 0.95, summary: "...", winner: "...", detail: "..."}, ...]',
    },
    strategy: {
        title: '조기 종재 전략 추천 AI',
        subtitle: 'Early Resolution Strategy AI',
        overview: '분쟁 상황을 종합적으로 분석하여 조기 해결을 위한 최적의 전략과 시나리오를 추천합니다. 각 전략의 난이도, 예상 효과, 실행 체크리스트를 제공합니다.',
        inputDescription: '분쟁 상황, 상대방과의 관계, 원하는 해결 방향, 제약 조건',
        outputDescription: '예상 승소 확률, 전략 요약(핵심 포인트, 집중 사항), 추천 시나리오 목록(제목, 난이도, 효과, 설명, 다음 액션)',
        aiModel: 'LegalRisk-STRATEGY-v1.0 (의사결정 트리 + 시나리오 생성 모델)',
        implementationSteps: [
            '사건 상황 종합 분석',
            '가능한 해결 경로 탐색',
            '각 경로별 성공 확률 계산',
            '난이도와 효과 평가',
            '최적 시나리오 3개 선정',
            '각 시나리오별 실행 체크리스트 생성',
            '핵심 조언 및 주의사항 도출',
            '결과를 strategy_recommendations 테이블에 저장',
        ],
        dbTables: [
            { name: 'cases', purpose: '분석 대상 사건 정보 저장' },
            { name: 'analysis_runs', purpose: 'STRATEGY 유형 분석 실행 기록' },
            { name: 'strategy_recommendations', purpose: '승소율, 요약, 시나리오 목록 저장' },
        ],
        dataFlow: [
            '사용자 → 사건 상황 입력',
            'cases 테이블 → 케이스 생성',
            'analysis_runs 테이블 → STRATEGY 분석 실행 시작',
            'AI Model → 전략 분석 및 시나리오 생성',
            'strategy_recommendations 테이블 → 결과 저장',
            'UI → 승소율 바, 요약 카드, 시나리오 목록, 상세 모달 표시',
        ],
        erdDescription: 'summary와 scenarios는 JSONB 형식으로 저장됩니다.\n\nsummary: {key_takeaway: "...", focus_points: [...]}\nscenarios: [{title: "...", difficulty: "easy", effect: "high", description: "...", next_actions: [...]}, ...]',
    },
    reports: {
        title: '통합 분석 리포트',
        subtitle: 'Integrated Analysis Report',
        overview: '여러 AI 분석 결과를 하나의 종합 리포트로 통합합니다. 분류, 위험도, 감정, 유사 판례, 전략 분석 결과를 체계적으로 정리하여 의사결정에 활용할 수 있습니다.',
        inputDescription: '포함할 분석 실행(run_id) 목록 선택',
        outputDescription: 'PDF/미리보기 형태의 통합 리포트 (목차, 각 분석별 섹션, 면책 조항)',
        aiModel: '리포트 생성 엔진 (템플릿 기반)',
        implementationSteps: [
            '포함할 분석 결과 선택',
            '각 분석 결과 데이터 조회',
            '리포트 템플릿에 데이터 바인딩',
            '목차 및 섹션 구성',
            '시각화 자료 포함',
            '면책 조항 추가',
            'PDF 변환 (선택)',
            '결과를 reports 테이블에 저장',
        ],
        dbTables: [
            { name: 'reports', purpose: '리포트 메타데이터 (상태, 포함된 분석 목록)' },
            { name: 'analysis_runs', purpose: '포함된 분석 실행 정보 조회' },
            { name: '각 결과 테이블', purpose: '실제 분석 결과 데이터 조회' },
        ],
        dataFlow: [
            '사용자 → 리포트 생성 요청',
            'reports 테이블 → 리포트 레코드 생성 (draft 상태)',
            '각 결과 테이블 → 포함된 분석 결과 조회',
            '리포트 엔진 → 템플릿 렌더링',
            'reports 테이블 → 상태 업데이트 (final)',
            'audit_logs 테이블 → 리포트 생성 기록',
            'UI → 미리보기 모달, PDF 다운로드 버튼 표시',
        ],
        erdDescription: 'reports 테이블은 included_run_ids를 UUID 배열로 저장하여 여러 분석 실행을 참조합니다.\n\ncases(1) → reports(N): 한 케이스에서 여러 리포트 생성 가능\nreports ↔ analysis_runs: M:N 관계 (included_run_ids 배열을 통해)',
    },
};

export default function DocsModal({ isOpen, onClose, featureName, featureDescription }: DocsModalProps) {
    const docs = featureDocumentation[featureName] || featureDocumentation.classify;

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-white" />
                        <div>
                            <h2 className="text-lg font-semibold text-white">{docs.title}</h2>
                            <p className="text-primary-100 text-sm">{docs.subtitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 space-y-8">
                    {/* Overview Section */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            기능 개요
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-slate-900 p-4 rounded-xl">
                            {docs.overview}
                        </p>
                    </section>

                    {/* Input/Output Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">📥 입력 (Input)</h4>
                            <p className="text-green-700 dark:text-green-400 text-sm">{docs.inputDescription}</p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">📤 출력 (Output)</h4>
                            <p className="text-purple-700 dark:text-purple-400 text-sm">{docs.outputDescription}</p>
                        </div>
                    </section>

                    {/* AI Model */}
                    <section className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                        <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">🤖 AI 모델</h4>
                        <code className="text-yellow-700 dark:text-yellow-400 text-sm font-mono">{docs.aiModel}</code>
                    </section>

                    {/* Implementation Steps */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                <Code className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            구현 단계
                        </h3>
                        <div className="space-y-2">
                            {docs.implementationSteps.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg">
                                    <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{idx + 1}</span>
                                    </div>
                                    <span className="text-gray-700 dark:text-gray-300 text-sm">{step}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Database Tables */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                                <Database className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                            </div>
                            관련 DB 테이블
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-100 dark:bg-slate-900">
                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 rounded-l-lg">테이블명</th>
                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 rounded-r-lg">용도</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {docs.dbTables.map((table, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 dark:border-slate-700">
                                            <td className="px-4 py-3">
                                                <code className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded text-sm font-mono">
                                                    {table.name}
                                                </code>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm">{table.purpose}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Data Flow */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                                <Workflow className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                            </div>
                            데이터 흐름 (Data Flow)
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 dark:bg-slate-900 rounded-xl">
                            {docs.dataFlow.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <span className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 shadow-sm">
                                        {step}
                                    </span>
                                    {idx < docs.dataFlow.length - 1 && (
                                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ERD Description */}
                    <section>
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            ERD 상세 설명
                        </h3>
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                            <pre className="text-indigo-700 dark:text-indigo-300 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                                {docs.erdDescription}
                            </pre>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex items-center justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-500 transition-colors"
                    >
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
