'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Zap, ExternalLink, BookOpen, X } from 'lucide-react';
import { Card, ResultCard, SimilarityBadge, WinnerBadge, UtilityButtons, ModalWithTabs, ERDModal, Toast, DocsModal } from '@/components/common';
import { db } from '@/lib/db/store';
import { getSchema } from '@/lib/db/schemas';
import { SimilarCaseMatch, CaseMatch } from '@/types';

const sampleText = `상가 임대차 분쟁 사례입니다.
임대인이 건물 리모델링을 이유로 임대차 갱신을 거절하고 있습니다.
저는 해당 상가에서 5년간 영업을 해왔으며, 상당한 프리미엄(권리금)을 투자했습니다.
임대인은 리모델링 후 다른 임차인을 들이겠다고 하며, 권리금 회수 기회를 주지 않고 있습니다.
계약 만료까지 3개월 남은 상황입니다.`;

export default function SimilarPage() {
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<SimilarCaseMatch | null>(null);
    const [selectedCase, setSelectedCase] = useState<CaseMatch | null>(null);
    const [includeInReport, setIncludeInReport] = useState<Set<string>>(new Set());
    const [showMockModal, setShowMockModal] = useState(false);
    const [showDbModal, setShowDbModal] = useState(false);
    const [showSampleModal, setShowSampleModal] = useState(false);
    const [showErdModal, setShowErdModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Load existing data on mount
    useEffect(() => {
        const existingResults = db.getAllSimilarCaseMatches();
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

        const caseRecord = db.createCase('유사 판례 매칭', inputText);
        const run = db.createAnalysisRun(caseRecord.case_id, 'SIMILAR', inputText);

        const startTime = Date.now();
        await new Promise(resolve => setTimeout(resolve, 1800));

        try {
            const response = await fetch('/mock/similar.json');
            const data = await response.json();

            const resultData: SimilarCaseMatch = {
                ...data,
                run_id: run.run_id,
            };
            db.saveSimilarCaseMatch(resultData);
            db.completeAnalysisRun(run.run_id, true, Date.now() - startTime);
            db.logAction('VIEW_RESULT', run.run_id, { analysis_type: 'SIMILAR' });

            setResult(resultData);
        } catch (error) {
            db.completeAnalysisRun(run.run_id, false, Date.now() - startTime);
            setToastMessage('분석 중 오류가 발생했습니다.');
            setShowToast(true);
        }

        setIsLoading(false);
    };

    const toggleReportInclude = (caseTitle: string) => {
        const newSet = new Set(includeInReport);
        if (newSet.has(caseTitle)) {
            newSet.delete(caseTitle);
        } else {
            newSet.add(caseTitle);
        }
        setIncludeInReport(newSet);
        setToastMessage(newSet.has(caseTitle) ? '리포트에 추가되었습니다.' : '리포트에서 제외되었습니다.');
        setShowToast(true);
    };

    const schema = getSchema('similar_case_matches');
    const sampleRecords = db.getAllSimilarCaseMatches();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <Search className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">유사 판례 매칭 AI</h1>
                </div>
                <p className="text-gray-500">
                    입력된 사건과 유사한 판례를 찾아 핵심 쟁점과 결과를 비교 분석합니다.
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
                        placeholder="분쟁 사건의 상황, 당사자 관계, 주요 쟁점 등을 입력해주세요..."
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
                        className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                검색 중...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                유사 사례 찾기
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
                            {/* Issue Comparison Table */}
                            <ResultCard title="핵심 쟁점 비교">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">입력 사건 쟁점</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">매칭된 쟁점</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {result.issue_compare.map((issue, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-700">{issue.input_issue}</td>
                                                    <td className="px-4 py-3 text-sm text-primary-600">{issue.matched_issue}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </ResultCard>

                            {/* Matched Cases */}
                            <ResultCard title="매칭된 유사 사례 (Top 3)">
                                <div className="space-y-4">
                                    {result.top_matches.map((match, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <h4 className="text-gray-900 font-medium">{match.case_title}</h4>
                                                <SimilarityBadge similarity={match.similarity} />
                                            </div>

                                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                                {match.summary}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <WinnerBadge winner={match.winner} />
                                                <button
                                                    onClick={() => setSelectedCase(match)}
                                                    className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-500 transition-colors"
                                                >
                                                    상세 판결 보기
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ResultCard>
                        </>
                    ) : (
                        <Card className="flex flex-col items-center justify-center py-16 text-center">
                            <Search className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-500 mb-2">분석 대기 중</h3>
                            <p className="text-gray-400 text-sm">
                                좌측에 사건 내용을 입력하고 검색을 실행하세요.
                            </p>
                        </Card>
                    )}
                </div>
            </div>

            {/* Case Detail Modal */}
            {selectedCase && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedCase(null)} />
                    <div className="relative bg-white rounded-2xl border border-gray-200 max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden animate-fadeIn shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-purple-600" />
                                <h2 className="text-lg font-semibold text-gray-900">판결 상세 보기</h2>
                            </div>
                            <button
                                onClick={() => setSelectedCase(null)}
                                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-auto max-h-[calc(85vh-140px)]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{selectedCase.case_title}</h3>
                                <div className="flex items-center gap-2">
                                    <SimilarityBadge similarity={selectedCase.similarity} />
                                    <WinnerBadge winner={selectedCase.winner} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-500 mb-2">요약</h4>
                                    <p className="text-gray-700 text-sm">{selectedCase.summary}</p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-500 mb-3">상세 판결 내용</h4>
                                    <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                        {selectedCase.detail}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={includeInReport.has(selectedCase.case_title)}
                                    onChange={() => toggleReportInclude(selectedCase.case_title)}
                                    className="w-4 h-4 rounded bg-white border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-600">이 사례를 리포트에 포함</span>
                            </label>
                            <button
                                onClick={() => setSelectedCase(null)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
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
                title="목업 데이터 (similar.json)"
                jsonData={result}
                tableData={result ? [result] : []}
                schema={schema}
            />

            <ModalWithTabs
                isOpen={showDbModal}
                onClose={() => setShowDbModal(false)}
                title="DB 테이블: similar_case_matches"
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
