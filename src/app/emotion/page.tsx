'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, FileText, Zap, Flame, Gauge, Activity } from 'lucide-react';
import { Card, ResultCard, ChipGroup, Badge, UtilityButtons, ModalWithTabs, ERDModal, Toast, DocsModal } from '@/components/common';
import { LineChart, ProgressBar } from '@/components/charts';
import { db } from '@/lib/db/store';
import { getSchema } from '@/lib/db/schemas';
import { EmotionEscalation } from '@/types';

const sampleText = `상대방에게 세 번째 경고를 보냅니다.
저희의 요청을 계속 무시하고 계시는데, 이는 완전히 부당합니다.
합의를 하든가 법적으로 끝까지 가든가 선택하세요.
저희는 그동안 모든 이의제기를 기각당해 왔습니다.
더 이상 참을 수 없으며, 강경대응하겠습니다.
귀하의 책임을 분명히 인정하고 발생한 모든 손해를 배상해야 합니다.
필요하다면 고소도 불사하겠습니다.`;

export default function EmotionPage() {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<EmotionEscalation | null>(null);
    const [highlightEnabled, setHighlightEnabled] = useState(false);
    const [showMockModal, setShowMockModal] = useState(false);
    const [showDbModal, setShowDbModal] = useState(false);
    const [showSampleModal, setShowSampleModal] = useState(false);
    const [showErdModal, setShowErdModal] = useState(false);
    const [showDocsModal, setShowDocsModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Load existing data on mount
    useEffect(() => {
        const existingResults = db.getAllEmotionEscalations();
        if (existingResults.length > 0) {
            setResult(existingResults[0]);
        }
    }, []);

    // Words to highlight
    const highlightWords = ['부당', '강경대응', '고소', '손해', '책임', '끝까지', '참을 수 없', '기각', '이의제기', '경고'];

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

        const caseRecord = db.createCase('감정 격화 분석', inputText);
        const run = db.createAnalysisRun(caseRecord.case_id, 'EMOTION', inputText);

        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const response = await fetch('/mock/emotion.json');
            const data = await response.json();

            const resultData: EmotionEscalation = {
                ...data,
                run_id: run.run_id,
            };
            db.saveEmotionEscalation(resultData);
            db.completeAnalysisRun(run.run_id, true, Date.now() - startTime);
            db.logAction('VIEW_RESULT', run.run_id, { analysis_type: 'EMOTION' });

            setResult(resultData);
        } catch (error) {
            db.completeAnalysisRun(run.run_id, false, Date.now() - startTime);
            setToastMessage('분석 중 오류가 발생했습니다.');
            setShowToast(true);
        }

        setIsLoading(false);
    };

    // Highlight text
    const getHighlightedText = () => {
        if (!highlightEnabled || !inputText) return inputText;

        let highlighted = inputText;
        highlightWords.forEach(word => {
            const regex = new RegExp(`(${word})`, 'gi');
            highlighted = highlighted.replace(regex, '[[HIGHLIGHT]]$1[[/HIGHLIGHT]]');
        });

        return highlighted.split('[[HIGHLIGHT]]').map((part, i) => {
            if (part.includes('[[/HIGHLIGHT]]')) {
                const [highlightedText, rest] = part.split('[[/HIGHLIGHT]]');
                return (
                    <span key={i}>
                        <span className="bg-red-100 text-red-700 px-1 rounded font-medium">{highlightedText}</span>
                        {rest}
                    </span>
                );
            }
            return part;
        });
    };

    const getSpeedLabel = (speed: string) => {
        switch (speed) {
            case 'fast': return { text: 'Fast', variant: 'danger' as const };
            case 'normal': return { text: 'Normal', variant: 'warning' as const };
            default: return { text: 'Slow', variant: 'success' as const };
        }
    };

    const schema = getSchema('emotion_escalations');
    const sampleRecords = db.getAllEmotionEscalations();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">감정 격화 단계 분석 AI</h1>
                </div>
                <p className="text-gray-500">
                    분쟁 당사자의 감정 상태와 격화 추이를 분석하여 현재 단계를 진단합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <Card className="h-fit">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary-600" />
                            분쟁 내용 입력
                        </h3>

                        {/* Highlight Toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm text-gray-500">강조 표시</span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={highlightEnabled}
                                    onChange={(e) => setHighlightEnabled(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-10 h-6 rounded-full transition-colors ${highlightEnabled ? 'bg-red-500' : 'bg-gray-300'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow ${highlightEnabled ? 'translate-x-5' : 'translate-x-1'}`} />
                                </div>
                            </div>
                        </label>
                    </div>

                    {highlightEnabled && inputText ? (
                        <div className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 overflow-auto whitespace-pre-wrap">
                            {getHighlightedText()}
                        </div>
                    ) : (
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="상대방과의 대화 내용, 이메일, 문자 메시지 등을 입력해주세요..."
                            className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                    )}

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
                        className="w-full mt-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:from-red-400 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                분석 중...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                격화 단계 진단
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
                            onViewDocs={() => setShowDocsModal(true)}
                        />
                    </div>

                    {result ? (
                        <>
                            {/* Current Stage */}
                            <ResultCard title="현재 갈등 단계 (Current Conflict Stage)">
                                <div className="py-4">
                                    <ProgressBar currentStage={result.stage} />
                                    <div className="mt-6 text-center">
                                        <span className="text-2xl font-bold text-red-500">{result.stage}</span>
                                    </div>
                                </div>
                            </ResultCard>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Aggression Score */}
                                <Card className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Flame className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm text-gray-500">공격성 지수</span>
                                    </div>
                                    <div className="text-4xl font-bold text-gray-900">{result.aggression_score}</div>
                                    <div className="text-gray-400 text-sm">/ 100</div>
                                </Card>

                                {/* Escalation Speed */}
                                <Card className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Gauge className="w-5 h-5 text-red-500" />
                                        <span className="text-sm text-gray-500">심화 속도</span>
                                    </div>
                                    <div className="text-4xl font-bold text-gray-900 capitalize">{result.escalation_speed}</div>
                                    <div className="mt-2">
                                        <Badge variant={getSpeedLabel(result.escalation_speed).variant}>
                                            {getSpeedLabel(result.escalation_speed).text}
                                        </Badge>
                                    </div>
                                </Card>
                            </div>

                            {/* Trend Chart */}
                            <ResultCard
                                title="감정 추이 트렌드"
                                headerAction={
                                    <Activity className="w-5 h-5 text-red-500" />
                                }
                            >
                                <LineChart data={result.trend} height={200} color="#ef4444" />
                            </ResultCard>

                            {/* Emotion Keywords */}
                            <ResultCard title="감정 격화 키워드">
                                <ChipGroup chips={result.emotion_keywords} color="danger" />
                            </ResultCard>
                        </>
                    ) : (
                        <Card className="flex flex-col items-center justify-center py-16 text-center">
                            <TrendingUp className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-500 mb-2">분석 대기 중</h3>
                            <p className="text-gray-400 text-sm">
                                좌측에 분쟁 내용을 입력하고 분석을 실행하세요.
                            </p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ModalWithTabs
                isOpen={showMockModal}
                onClose={() => setShowMockModal(false)}
                title="목업 데이터 (emotion.json)"
                jsonData={result}
                tableData={result ? [result] : []}
                schema={schema}
            />

            <ModalWithTabs
                isOpen={showDbModal}
                onClose={() => setShowDbModal(false)}
                title="DB 테이블: emotion_escalations"
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

            <DocsModal
                isOpen={showDocsModal}
                onClose={() => setShowDocsModal(false)}
                featureName="emotion"
                featureDescription="감정 격화 단계 분석 AI"
            />

            {showToast && (
                <Toast
                    message={toastMessage}
                    type="info"
                    onClose={() => setShowToast(false)}
                />
            )}
        </div>
    );
}
