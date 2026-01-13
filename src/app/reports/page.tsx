'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, Eye, X, Clock, CheckCircle } from 'lucide-react';
import { Card, ResultCard, Badge, UtilityButtons, ModalWithTabs, ERDModal, Toast } from '@/components/common';
import { db } from '@/lib/db/store';
import { getSchema } from '@/lib/db/schemas';
import { Report } from '@/types';

const analysisTypeLabels: Record<string, string> = {
    CLASSIFY: '분쟁 유형 분류',
    RISK: '위험도 예측',
    EMOTION: '감정 분석',
    SIMILAR: '유사 판례',
    STRATEGY: '조기 종재',
};

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showMockModal, setShowMockModal] = useState(false);
    const [showDbModal, setShowDbModal] = useState(false);
    const [showSampleModal, setShowSampleModal] = useState(false);
    const [showErdModal, setShowErdModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        setReports(db.getAllReports());
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleExportPdf = (reportId: string) => {
        db.logAction('EXPORT_PDF', reportId);
        setToastMessage('PDF 내보내기가 완료되었습니다. (목업)');
        setShowToast(true);
    };

    const getIncludedAnalysisTypes = (report: Report): string[] => {
        const types: string[] = [];
        report.included_run_ids.forEach(runId => {
            const run = db.getAnalysisRun(runId);
            if (run && !types.includes(run.analysis_type)) {
                types.push(run.analysis_type);
            }
        });
        return types;
    };

    const schema = getSchema('reports');

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">리포트 관리</h1>
                </div>
                <p className="text-gray-500">
                    생성된 분석 리포트를 관리하고 PDF로 내보낼 수 있습니다.
                </p>
            </div>

            {/* Utility Buttons */}
            <div className="flex justify-end mb-6">
                <UtilityButtons
                    onViewMockData={() => setShowMockModal(true)}
                    onViewDbTable={() => setShowDbModal(true)}
                    onViewSampleRecords={() => setShowSampleModal(true)}
                    onViewERD={() => setShowErdModal(true)}
                />
            </div>

            {/* Reports List */}
            {reports.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-16 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">생성된 리포트가 없습니다</h3>
                    <p className="text-gray-400 text-sm">
                        대시보드에서 &apos;통합 리포트 생성&apos; 버튼을 클릭하여 리포트를 생성하세요.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => {
                        const analysisTypes = getIncludedAnalysisTypes(report);

                        return (
                            <Card key={report.report_id} className="hover:border-pink-300 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-pink-500" />
                                        <span className="font-medium text-gray-900">분석 리포트</span>
                                    </div>
                                    <Badge
                                        variant={report.report_status === 'final' ? 'success' : 'warning'}
                                        size="sm"
                                    >
                                        {report.report_status === 'final' ? '완료' : '초안'}
                                    </Badge>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        {formatDate(report.created_at)}
                                    </div>

                                    <div>
                                        <span className="text-xs text-gray-400 uppercase">포함된 분석</span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {analysisTypes.map((type) => (
                                                <span
                                                    key={type}
                                                    className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                                                >
                                                    {analysisTypeLabels[type] || type}
                                                </span>
                                            ))}
                                            {analysisTypes.length === 0 && (
                                                <span className="text-gray-400 text-xs">분석 없음</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-400">
                                        실행 {report.included_run_ids.length}개 포함
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedReport(report)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        미리보기
                                    </button>
                                    <button
                                        onClick={() => handleExportPdf(report.report_id)}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pink-600 rounded-lg text-sm text-white hover:bg-pink-500 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        PDF
                                    </button>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Report Preview Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedReport(null)} />
                    <div className="relative bg-white rounded-2xl border border-gray-200 max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden animate-fadeIn shadow-xl">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-pink-500" />
                                <h2 className="text-lg font-semibold text-gray-900">리포트 미리보기</h2>
                            </div>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-auto max-h-[calc(85vh-140px)]">
                            {/* Report Header */}
                            <div className="text-center mb-8 pb-6 border-b border-gray-200">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    LegalRisk 통합 분석 리포트
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    생성일: {formatDate(selectedReport.created_at)}
                                </p>
                            </div>

                            {/* Table of Contents */}
                            <div className="mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">목차</h2>
                                <ul className="space-y-2">
                                    {getIncludedAnalysisTypes(selectedReport).map((type, idx) => (
                                        <li key={type} className="flex items-center gap-2 text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>{idx + 1}. {analysisTypeLabels[type] || type} 분석 결과</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Analysis Sections */}
                            {getIncludedAnalysisTypes(selectedReport).map((type, idx) => {
                                let resultData: any | null = null;

                                // Get result data based on type
                                selectedReport.included_run_ids.forEach(runId => {
                                    const run = db.getAnalysisRun(runId);
                                    if (run?.analysis_type === type) {
                                        switch (type) {
                                            case 'CLASSIFY':
                                                resultData = db.getClassificationResult(runId) || null;
                                                break;
                                            case 'RISK':
                                                resultData = db.getRiskPrediction(runId) || null;
                                                break;
                                            case 'EMOTION':
                                                resultData = db.getEmotionEscalation(runId) || null;
                                                break;
                                            case 'SIMILAR':
                                                resultData = db.getSimilarCaseMatch(runId) || null;
                                                break;
                                            case 'STRATEGY':
                                                resultData = db.getStrategyRecommendation(runId) || null;
                                                break;
                                        }
                                    }
                                });

                                return (
                                    <div key={type} className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <h3 className="text-md font-semibold text-gray-900 mb-3">
                                            {idx + 1}. {analysisTypeLabels[type] || type}
                                        </h3>
                                        {resultData ? (
                                            <pre className="text-xs text-gray-600 overflow-auto max-h-40">
                                                {JSON.stringify(resultData, null, 2)}
                                            </pre>
                                        ) : (
                                            <p className="text-gray-400 text-sm">결과 데이터 없음</p>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Disclaimer */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <p className="text-xs text-gray-400 text-center">
                                    본 리포트는 AI 분석 결과를 종합한 참고 자료이며, 법적 조언을 대체하지 않습니다.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                닫기
                            </button>
                            <button
                                onClick={() => {
                                    handleExportPdf(selectedReport.report_id);
                                    setSelectedReport(null);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-500 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                PDF 내보내기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <ModalWithTabs
                isOpen={showMockModal}
                onClose={() => setShowMockModal(false)}
                title="리포트 데이터"
                jsonData={reports}
                tableData={reports}
                schema={schema}
            />

            <ModalWithTabs
                isOpen={showDbModal}
                onClose={() => setShowDbModal(false)}
                title="DB 테이블: reports"
                jsonData={schema}
                tableData={reports}
                schema={schema}
            />

            <ModalWithTabs
                isOpen={showSampleModal}
                onClose={() => setShowSampleModal(false)}
                title="샘플 레코드"
                jsonData={reports}
                tableData={reports}
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
