'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, FileText, Zap, Target, CheckCircle, X, ArrowRight, FileCheck } from 'lucide-react';
import { Card, ResultCard, DifficultyBadge, EffectBadge, UtilityButtons, ModalWithTabs, ERDModal, Toast, DocsModal } from '@/components/common';
import { SimpleProgress } from '@/components/charts/ProgressBar';
import { db } from '@/lib/db/store';
import { getSchema } from '@/lib/db/schemas';
import { StrategyRecommendation, Scenario } from '@/types';

const sampleText = `상가 건물 임대차 분쟁입니다.
임대인이 리모델링을 이유로 계약 갱신을 거부하고 있습니다.
저는 5년간 해당 상가에서 음식점을 운영해왔고, 약 3천만원의 권리금을 지불했습니다.
건물에 안전 문제는 없으며, 임대인은 단순히 건물 가치 상승을 위한 리모델링을 계획하고 있습니다.
계약 만료까지 2개월 남았고, 새로운 임차인을 구하기 어려운 상황입니다.
원만한 합의를 원하지만, 필요시 법적 대응도 고려하고 있습니다.`;

export default function StrategyPage() {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<StrategyRecommendation | null>(null);
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [compareMode, setCompareMode] = useState(false);
    const [compareList, setCompareList] = useState<Scenario[]>([]);
    const [showMockModal, setShowMockModal] = useState(false);
    const [showDbModal, setShowDbModal] = useState(false);
    const [showSampleModal, setShowSampleModal] = useState(false);
    const [showErdModal, setShowErdModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Load existing data on mount
    useEffect(() => {
        const existingResults = db.getAllStrategyRecommendations();
        if (existingResults.length > 0) {
            setResult(existingResults[0]);
        }
    }, []);

    const handleSampleInput = () => {
        setInputText(sampleText);
    };

    const handleAnalyze = async () => {
        if (inputText.trim().length < 30) {
            setToastMessage('최소 30자 이상 입력해주세요.');
            setShowToast(true);
            return;
        }

        setIsLoading(true);

        const caseRecord = db.createCase('조기 종재 전략', inputText);
        const run = db.createAnalysisRun(caseRecord.case_id, 'STRATEGY', inputText);

        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 1800));

        try {
            const response = await fetch('/mock/strategy.json');
            const data = await response.json();

            const resultData: StrategyRecommendation = {
                ...data,
                run_id: run.run_id,
            };
            db.saveStrategyRecommendation(resultData);
            db.completeAnalysisRun(run.run_id, true, Date.now() - startTime);
            db.logAction('VIEW_RESULT', run.run_id, { analysis_type: 'STRATEGY' });

            setResult(resultData);
        } catch (error) {
            db.completeAnalysisRun(run.run_id, false, Date.now() - startTime);
            setToastMessage('분석 중 오류가 발생했습니다.');
            setShowToast(true);
        }

        setIsLoading(false);
    };

    const toggleCompare = (scenario: Scenario) => {
        if (compareList.includes(scenario)) {
            setCompareList(compareList.filter(s => s !== scenario));
        } else if (compareList.length < 2) {
            setCompareList([...compareList, scenario]);
        } else {
            setToastMessage('최대 2개까지 비교할 수 있습니다.');
            setShowToast(true);
        }
    };

    const generateTemplate = () => {
        const templateContent = `[법적 조치 사전 통보서]

수신: [상대방 이름/회사명]
발신: [본인 이름]
일자: ${new Date().toLocaleDateString('ko-KR')}

제목: ${selectedScenario?.title}에 관한 통보

안녕하세요.

본 서신은 귀하와의 분쟁 해결을 위한 ${selectedScenario?.title} 절차의 일환으로 발송됩니다.

1. 분쟁 개요
[분쟁 내용 요약]

2. 요청 사항
${selectedScenario?.next_actions.map((action, idx) => `  ${idx + 1}) ${action}`).join('\n')}

3. 응답 기한
본 서신 수령일로부터 14일 이내

4. 후속 조치 안내
상기 기한 내 회신이 없을 경우, 법적 절차를 진행할 예정임을 알려드립니다.

감사합니다.

[서명]`;

        navigator.clipboard.writeText(templateContent);
        setToastMessage('템플릿이 클립보드에 복사되었습니다.');
        setShowToast(true);
    };

    const schema = getSchema('strategy_recommendations');
    const sampleRecords = db.getAllStrategyRecommendations();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <Lightbulb className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">조기 종재 전략 추천 AI</h1>
                </div>
                <p className="text-gray-500">
                    분쟁의 조기 해결을 위한 최적의 전략과 시나리오를 추천합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <Card className="h-fit">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary-600" />
                        사건 내용 입력
                    </h3>

                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="분쟁 상황, 상대방과의 관계, 원하는 해결 방향 등을 상세히 입력해주세요..."
                        className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    />

                    <div className="flex items-center justify-between mt-4">
                        <button
                            onClick={handleSampleInput}
                            className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
                        >
                            샘플 텍스트 입력
                        </button>
                        <span className="text-sm text-gray-400">
                            {inputText.length}자
                        </span>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || inputText.trim().length < 30}
                        className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                분석 중...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                해결책 제안받기
                            </>
                        )}
                    </button>
                </Card>

                {/* Result Panel */}
                <div className="space-y-6">
                    {/* Utility Buttons */}
                    <div className="flex justify-end">
                        <UtilityButtons
                            onViewMockData={() => setShowMockModal(true)}
                            onViewDbTable={() => setShowDbModal(true)}
                            onViewSampleRecords={() => setShowSampleModal(true)}
                            onViewERD={() => setShowErdModal(true)}
                        />
                    </div>

                    {result ? (
                        <>
                            {/* Win Probability */}
                            <ResultCard title="예상 승소 확률">
                                <SimpleProgress
                                    value={result.expected_win_probability}
                                    label="AI 예측 승소율"
                                    color="success"
                                    size="lg"
                                />
                            </ResultCard>

                            {/* Strategy Summary */}
                            <ResultCard
                                title="전략 요약"
                                headerAction={<Target className="w-5 h-5 text-cyan-600" />}
                            >
                                <div className="space-y-4">
                                    <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                                        <p className="text-gray-700 leading-relaxed">
                                            {result.summary.key_takeaway}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-2">핵심 포커스 포인트</h4>
                                        <ul className="space-y-2">
                                            {result.summary.focus_points.map((point, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                    <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </ResultCard>

                            {/* Scenarios */}
                            <ResultCard
                                title="추천 시나리오"
                                headerAction={
                                    <button
                                        onClick={() => setCompareMode(!compareMode)}
                                        className={`text-sm px-3 py-1 rounded-lg transition-colors ${compareMode
                                            ? 'bg-cyan-100 text-cyan-700'
                                            : 'bg-gray-100 text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {compareMode ? '비교 모드 ON' : '전략 비교'}
                                    </button>
                                }
                            >
                                <div className="space-y-4">
                                    {result.scenarios.map((scenario, idx) => (
                                        <div
                                            key={idx}
                                            className={`
                        p-4 rounded-xl border transition-all
                        ${compareList.includes(scenario)
                                                    ? 'bg-cyan-50 border-cyan-300'
                                                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                                }
                      `}
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <h4 className="text-gray-900 font-medium">{scenario.title}</h4>
                                                <div className="flex items-center gap-2">
                                                    <DifficultyBadge difficulty={scenario.difficulty} />
                                                    <EffectBadge effect={scenario.effect} />
                                                </div>
                                            </div>

                                            <p className="text-gray-500 text-sm mb-3">
                                                {scenario.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                {compareMode ? (
                                                    <button
                                                        onClick={() => toggleCompare(scenario)}
                                                        className={`text-sm ${compareList.includes(scenario)
                                                            ? 'text-cyan-600'
                                                            : 'text-gray-500 hover:text-gray-900'
                                                            }`}
                                                    >
                                                        {compareList.includes(scenario) ? '✓ 선택됨' : '비교에 추가'}
                                                    </button>
                                                ) : <div />}
                                                <button
                                                    onClick={() => setSelectedScenario(scenario)}
                                                    className="flex items-center gap-1 text-sm text-cyan-600 hover:text-cyan-500 transition-colors"
                                                >
                                                    상세 가이드 보기
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Compare Button */}
                                {compareMode && compareList.length === 2 && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-cyan-200">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3">전략 비교</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            {compareList.map((s, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <p className="font-medium text-gray-900">{s.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">난이도:</span>
                                                        <DifficultyBadge difficulty={s.difficulty} />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500">효과:</span>
                                                        <EffectBadge effect={s.effect} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </ResultCard>

                            {/* Disclaimer */}
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-700">
                                    {result.disclaimer}
                                </p>
                            </div>
                        </>
                    ) : (
                        <Card className="flex flex-col items-center justify-center py-16 text-center">
                            <Lightbulb className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-500 mb-2">분석 대기 중</h3>
                            <p className="text-gray-400 text-sm">
                                좌측에 사건 내용을 입력하고 분석을 실행하세요.
                            </p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Scenario Detail Modal */}
            {selectedScenario && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedScenario(null)} />
                    <div className="relative bg-white rounded-2xl border border-gray-200 max-w-lg w-full mx-4 max-h-[85vh] overflow-hidden animate-fadeIn shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <Lightbulb className="w-5 h-5 text-cyan-600" />
                                <h2 className="text-lg font-semibold text-gray-900">전략 상세 가이드</h2>
                            </div>
                            <button
                                onClick={() => setSelectedScenario(null)}
                                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-auto max-h-[calc(85vh-140px)]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{selectedScenario.title}</h3>
                                <div className="flex items-center gap-2">
                                    <DifficultyBadge difficulty={selectedScenario.difficulty} />
                                    <EffectBadge effect={selectedScenario.effect} />
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6">{selectedScenario.description}</p>

                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-500 mb-4">실행 체크리스트</h4>
                                <ul className="space-y-3">
                                    {selectedScenario.next_actions.map((action, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs text-gray-500">{idx + 1}</span>
                                            </div>
                                            <span className="text-gray-700 text-sm">{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <button
                                onClick={generateTemplate}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                                <FileCheck className="w-4 h-4" />
                                문서 템플릿 생성
                            </button>
                            <button
                                onClick={() => setSelectedScenario(null)}
                                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ModalWithTabs
                isOpen={showMockModal}
                onClose={() => setShowMockModal(false)}
                title="목업 데이터 (strategy.json)"
                jsonData={result}
                tableData={result ? [result] : []}
                schema={schema}
            />

            <ModalWithTabs
                isOpen={showDbModal}
                onClose={() => setShowDbModal(false)}
                title="DB 테이블: strategy_recommendations"
                jsonData={schema}
                tableData={sampleRecords}
                schema={schema}
            />

            <ModalWithTabs
                isOpen={showSampleModal}
                onClose={() => setShowSampleModal(false)}
                title="샘플 레코드"
                jsonData={sampleRecords}
                tableData={sampleRecords}
                schema={schema}
            />

            <ERDModal
                isOpen={showErdModal}
                onClose={() => setShowErdModal(false)}
            />

            {showToast && (
                <Toast
                    message={toastMessage}
                    type="success"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}
