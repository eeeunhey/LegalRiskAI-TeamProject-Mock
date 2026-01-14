'use client';

import { useState, useEffect } from 'react';
import { Scale, FileText, Zap } from 'lucide-react';
import { Card, ResultCard, ChipGroup, UtilityButtons, ModalWithTabs, ERDModal, Toast, DocsModal } from '@/components/common';
import { BarChart } from '@/components/charts';
import { db } from '@/lib/db/store';
import { getSchema } from '@/lib/db/schemas';
import { DisputeClassification } from '@/types';

const sampleText = `안녕하세요, 저는 온라인 쇼핑몰에서 전자제품을 구매했습니다. 
제품 수령 후 3일 만에 청약철회를 요청했으나, 판매자가 개봉제품이라는 이유로 환불을 거부하고 있습니다. 
전자상거래법에 따르면 7일 이내 청약철회가 가능한 것으로 알고 있는데, 
판매자는 자체 규정을 근거로 반품 불가를 주장합니다. 
이로 인해 50만원의 손해가 발생했으며, 부당한 청구라고 생각합니다.
소비자보호원에 신고할 예정이며, 필요시 법적 조치도 고려하고 있습니다.`;

export default function ClassifyPage() {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<DisputeClassification | null>(null);
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
            const existingResults = db.getAllClassificationResults();
            if (existingResults.length > 0) {
                setResult(existingResults[0]);
            } else {
                // If no data exists (e.g. hard refresh), restore from mock
                try {
                    const response = await fetch('/mock/classify.json');
                    const data = await response.json();

                    // Create a dummy run for restoration
                    const caseRecord = db.createCase('복구된 분쟁 사례', '자동 복구된 샘플 데이터입니다.', 'consumer');
                    const run = db.createAnalysisRun(caseRecord.case_id, 'CLASSIFY', 'Sample Text');

                    const resultData: DisputeClassification = {
                        ...data,
                        run_id: run.run_id,
                    };

                    db.saveClassificationResult(resultData);
                    db.completeAnalysisRun(run.run_id, true, 0);
                    setResult(resultData);
                } catch (e) {
                    console.error("Failed to restore initial data", e);
                }
            }
        };
        loadInitialData();
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

        // Create case and analysis run
        const caseRecord = db.createCase('분쟁 유형 분류', inputText);
        const run = db.createAnalysisRun(caseRecord.case_id, 'CLASSIFY', inputText);

        // Simulate API call
        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Load mock data
        try {
            const response = await fetch('/mock/classify.json');
            const data = await response.json();

            // Save result
            const resultData: DisputeClassification = {
                ...data,
                run_id: run.run_id,
            };
            db.saveClassificationResult(resultData);
            db.completeAnalysisRun(run.run_id, true, Date.now() - startTime);
            db.logAction('VIEW_RESULT', run.run_id, { analysis_type: 'CLASSIFY' });

            setResult(resultData);
        } catch (error) {
            db.completeAnalysisRun(run.run_id, false, Date.now() - startTime);
            setToastMessage('분석 중 오류가 발생했습니다.');
            setShowToast(true);
        }

        setIsLoading(false);
    };

    const schema = getSchema('dispute_classifications');
    const sampleRecords = db.getAllClassificationResults();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                        <Scale className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">분쟁 유형 분류 AI</h1>
                </div>
                <p className="text-gray-500">
                    분쟁 텍스트를 분석하여 Consumer, Contract, Administrative 등 유형을 자동 분류합니다.
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
                        placeholder="분쟁과 관련된 내용을 입력해주세요. 계약서 내용, 분쟁 상황, 상대방 주장 등을 상세히 기술할수록 정확한 분석이 가능합니다..."
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
                        className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-400 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                분석 중...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                유형 분석 실행
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
                            {/* Classification Result */}
                            <ResultCard title={`분석 결과: ${result.top_label}`}>
                                <div className="space-y-6">
                                    {/* Bar Chart */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-3">분류 점수</h4>
                                        <BarChart data={result.scores} height={150} />
                                    </div>

                                    {/* Keywords */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-3">주요 키워드</h4>
                                        <ChipGroup chips={result.keywords} color="primary" />
                                    </div>

                                    {/* Explanation */}
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-500 mb-3">분석 설명</h4>
                                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {result.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </ResultCard>
                        </>
                    ) : (
                        <Card className="flex flex-col items-center justify-center py-16 text-center">
                            <Scale className="w-16 h-16 text-gray-300 mb-4" />
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
                title="목업 데이터 (classify.json)"
                jsonData={result}
                tableData={result ? [result] : []}
                schema={schema}
            />

            <ModalWithTabs
                isOpen={showDbModal}
                onClose={() => setShowDbModal(false)}
                title="DB 테이블: dispute_classifications"
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
                featureName="classify"
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
