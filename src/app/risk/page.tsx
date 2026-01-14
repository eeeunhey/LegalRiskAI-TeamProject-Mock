'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, FileText, Zap, AlertCircle, Info } from 'lucide-react';
import { Card, ResultCard, Badge, UtilityButtons, ModalWithTabs, ERDModal, Toast, DocsModal } from '@/components/common';
import { GaugeChart } from '@/components/charts';
import { SimpleProgress } from '@/components/charts/ProgressBar';
import { db } from '@/lib/db/store';
import { getSchema } from '@/lib/db/schemas';
import { LegalRiskPrediction } from '@/types';

const sampleText = `귀하에게 본 서신을 통해 공식적으로 통보합니다.
귀사의 계약 5조 위반으로 인해 저희는 약 5천만원의 손해를 입었습니다.
본 문제가 14일 이내에 해결되지 않을 경우, 민사 및 형사 소송을 제기할 것입니다.
저희는 이미 법률 대리인을 선임하였으며, 모든 법적 조치를 취할 준비가 되어 있습니다.
일방적인 계약 해지에 대한 정당한 보상을 요구하며, 귀하의 조속한 회신을 기다립니다.`;

export default function RiskPage() {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<LegalRiskPrediction | null>(null);
    const [selectedFactor, setSelectedFactor] = useState<string | null>(null);
    const [showMockModal, setShowMockModal] = useState(false);
    const [showDbModal, setShowDbModal] = useState(false);
    const [showSampleModal, setShowSampleModal] = useState(false);
    const [showErdModal, setShowErdModal] = useState(false);
    const [showDocsModal, setShowDocsModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Load existing data on mount or auto-load mock if empty
    useEffect(() => {
        const loadInitialData = async () => {
            const existingResults = db.getAllRiskPredictions();
            if (existingResults.length > 0) {
                setResult(existingResults[0]);
            } else {
                try {
                    const response = await fetch('/mock/risk.json');
                    const data = await response.json();

                    const caseRecord = db.createCase('복구된 위험 분석', '자동 복구된 샘플 데이터입니다.', 'contract');
                    const run = db.createAnalysisRun(caseRecord.case_id, 'RISK', 'Sample Text');

                    const resultData: LegalRiskPrediction = {
                        ...data,
                        run_id: run.run_id,
                    };

                    db.saveRiskPrediction(resultData);
                    db.completeAnalysisRun(run.run_id, true, 0);
                    setResult(resultData);
                } catch (e) {
                    console.error("Failed to restore initial data", e);
                }
            }
        };
        loadInitialData();
    }, []);

    // Risk factor explanations
    const factorExplanations: Record<string, string> = {
        '일방적 계약 해지 주장': '상대방이 계약의 일방적 해지를 주장하고 있어, 계약 불이행에 대한 책임 소재 분쟁이 예상됩니다.',
        '손해배상액(5천만원) 특정': '구체적인 금액을 명시한 손해배상 청구는 소송 의지가 강함을 나타냅니다.',
        '민/형사 소송 위협 표현': '법적 조치를 명시적으로 언급한 것은 협상보다 소송을 선호할 가능성을 시사합니다.',
        '특정 조항(Article 5) 위반 언급': '구체적인 조항을 인용하여 계약 위반을 주장하므로, 법적 근거가 있음을 암시합니다.',
        '법률대리인 선임 의사 표현': '이미 변호사를 선임했다는 것은 소송 준비가 진행 중임을 의미합니다.',
    };

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

        const caseRecord = db.createCase('법적 위험도 예측', inputText);
        const run = db.createAnalysisRun(caseRecord.case_id, 'RISK', inputText);

        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const response = await fetch('/mock/risk.json');
            const data = await response.json();

            const resultData: LegalRiskPrediction = {
                ...data,
                run_id: run.run_id,
            };
            db.saveRiskPrediction(resultData);
            db.completeAnalysisRun(run.run_id, true, Date.now() - startTime);
            db.logAction('VIEW_RESULT', run.run_id, { analysis_type: 'RISK' });

            setResult(resultData);
        } catch (error) {
            db.completeAnalysisRun(run.run_id, false, Date.now() - startTime);
            setToastMessage('분석 중 오류가 발생했습니다.');
            setShowToast(true);
        }

        setIsLoading(false);
    };

    const schema = getSchema('legal_risk_predictions');
    const sampleRecords = db.getAllRiskPredictions();

    const getLevelLabel = (level: string) => {
        switch (level) {
            case 'high': return { text: 'High Risk', variant: 'danger' as const };
            case 'medium': return { text: 'Medium Risk', variant: 'warning' as const };
            default: return { text: 'Low Risk', variant: 'success' as const };
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                        <AlertTriangle className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">법적 위험도 예측 AI</h1>
                </div>
                <p className="text-gray-500">
                    텍스트 내 법적 표현 강도를 분석하여 리스크 점수와 승소 가능성을 예측합니다.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <Card className="h-fit">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary-600" />
                        분쟁 내용 입력
                    </h3>

                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="상대방으로부터 받은 경고 서신, 통보문, 분쟁 상황 등을 입력해주세요..."
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
                        className="w-full mt-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-400 hover:to-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                분석 중...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                위험도 예측
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
                            {/* Risk Score Gauge */}
                            <ResultCard
                                title="리스크 점수"
                                headerAction={
                                    <Badge variant={getLevelLabel(result.risk_level).variant}>
                                        {getLevelLabel(result.risk_level).text}
                                    </Badge>
                                }
                            >
                                <div className="flex justify-center py-4">
                                    <GaugeChart value={result.risk_score} size={200} />
                                </div>
                            </ResultCard>

                            {/* Win Probability */}
                            <ResultCard title="승소 가능성">
                                <SimpleProgress
                                    value={result.win_probability}
                                    label="예상 승소율"
                                    color="success"
                                    size="lg"
                                />
                            </ResultCard>

                            {/* Risk Factors */}
                            <ResultCard title="핵심 리스크 요인">
                                <div className="space-y-3">
                                    {result.risk_factors.map((factor, idx) => (
                                        <div
                                            key={idx}
                                            className={`
                        p-4 rounded-lg border transition-all cursor-pointer
                        ${selectedFactor === factor
                                                    ? 'bg-red-50 border-red-300'
                                                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                                }
                      `}
                                            onClick={() => setSelectedFactor(selectedFactor === factor ? null : factor)}
                                        >
                                            <div className="flex items-start gap-3">
                                                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedFactor === factor ? 'text-red-500' : 'text-orange-500'}`} />
                                                <div className="flex-1">
                                                    <p className="text-gray-900 text-sm font-medium">{factor}</p>
                                                    {selectedFactor === factor && factorExplanations[factor] && (
                                                        <p className="text-gray-500 text-sm mt-2 animate-fadeIn">
                                                            {factorExplanations[factor]}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ResultCard>

                            {/* Notes */}
                            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-600">
                                    {result.notes}
                                </p>
                            </div>
                        </>
                    ) : (
                        <Card className="flex flex-col items-center justify-center py-16 text-center">
                            <AlertTriangle className="w-16 h-16 text-gray-300 mb-4" />
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
                title="목업 데이터 (risk.json)"
                jsonData={result}
                tableData={result ? [result] : []}
                schema={schema}
            />

            <ModalWithTabs
                isOpen={showDbModal}
                onClose={() => setShowDbModal(false)}
                title="DB 테이블: legal_risk_predictions"
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
                featureName="risk"
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
