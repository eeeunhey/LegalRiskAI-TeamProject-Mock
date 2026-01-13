'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Scale,
    AlertTriangle,
    TrendingUp,
    Search,
    Lightbulb,
    FileText,
    Sparkles,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { FeatureCard, Card, ModalWithTabs, ERDModal, Toast } from '@/components/common';
import { db } from '@/lib/db/store';
import { getSchemas } from '@/lib/db/schemas';
import { AnalysisRun } from '@/types';

const features = [
    {
        id: 'classify',
        href: '/classify',
        icon: Scale,
        title: '분쟁 유형 분류 AI',
        description: '분쟁 텍스트를 분석하여 Consumer, Contract, Administrative 등 유형을 자동 분류합니다.',
        gradient: 'from-blue-500 to-blue-700',
    },
    {
        id: 'risk',
        href: '/risk',
        icon: AlertTriangle,
        title: '법적 위험도 예측 AI',
        description: '텍스트 내 법적 표현 강도를 분석하여 리스크 점수와 승소 가능성을 예측합니다.',
        gradient: 'from-orange-500 to-red-600',
    },
    {
        id: 'emotion',
        href: '/emotion',
        icon: TrendingUp,
        title: '감정 격화 단계 분석 AI',
        description: '분쟁 당사자의 감정 상태와 격화 추이를 분석하여 현재 단계를 진단합니다.',
        gradient: 'from-red-500 to-pink-600',
    },
    {
        id: 'similar',
        href: '/similar',
        icon: Search,
        title: '유사 판례 매칭 AI',
        description: '입력된 사건과 유사한 판례를 찾아 핵심 쟁점과 결과를 비교 분석합니다.',
        gradient: 'from-purple-500 to-indigo-600',
    },
    {
        id: 'strategy',
        href: '/strategy',
        icon: Lightbulb,
        title: '조기 종재 전략 추천 AI',
        description: '분쟁의 조기 해결을 위한 최적의 전략과 시나리오를 추천합니다.',
        gradient: 'from-cyan-500 to-teal-600',
    },
];

const analysisTypeLabels: Record<string, string> = {
    CLASSIFY: '분쟁 유형 분류',
    RISK: '위험도 예측',
    EMOTION: '감정 분석',
    SIMILAR: '유사 판례',
    STRATEGY: '조기 종재',
};

const analysisTypeLinks: Record<string, string> = {
    CLASSIFY: '/classify',
    RISK: '/risk',
    EMOTION: '/emotion',
    SIMILAR: '/similar',
    STRATEGY: '/strategy',
};

export default function DashboardPage() {
    const router = useRouter();
    const [showDbModal, setShowDbModal] = useState(false);
    const [showErdModal, setShowErdModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Get recent analysis runs
    const recentRuns = db.getRecentAnalysisRuns(10);

    // Schema for modal
    const schemas = getSchemas(['cases', 'analysis_runs', 'reports']);

    const handleCreateReport = () => {
        // Create a mock report
        const runs = db.getRecentAnalysisRuns(5);
        if (runs.length > 0) {
            const caseId = runs[0].case_id;
            db.createReport(caseId, runs.map(r => r.run_id));
            db.logAction('CREATE_REPORT', caseId, { type: 'premium' });
        }
        setShowReportModal(false);
        setToastMessage('통합 리포트가 생성되었습니다!');
        setShowToast(true);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString('ko-KR', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    AI 기반 <span className="text-primary-600">법적 분쟁 분석</span> 플랫폼
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                    최신 AI 기술로 법적 분쟁을 분석하고, 위험도를 예측하며, 최적의 해결 전략을 제안합니다.
                </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.id}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        gradient={feature.gradient}
                        onClick={() => router.push(feature.href)}
                    />
                ))}
            </div>

            {/* Premium Report CTA */}
            <Card className="mb-8 bg-gradient-to-r from-primary-50 to-purple-50 border-primary-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">통합 분석 리포트 생성</h3>
                            <p className="text-gray-500">모든 AI 분석 결과를 하나의 종합 리포트로 생성합니다.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowReportModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg hover:shadow-orange-500/30"
                    >
                        <span className="flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            전체 리포트 생성 (Premium)
                        </span>
                    </button>
                </div>
            </Card>

            {/* Recent Analysis History */}
            <Card className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary-600" />
                        <h3 className="text-lg font-semibold text-gray-900">최근 분석 실행</h3>
                    </div>
                    <button
                        onClick={() => setShowDbModal(true)}
                        className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        DB 테이블 보기 →
                    </button>
                </div>

                {recentRuns.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>아직 분석 기록이 없습니다.</p>
                        <p className="text-sm mt-1">위의 AI 기능을 사용해보세요!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">분석 유형</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">상태</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">실행 시간</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">소요시간</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">액션</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentRuns.map((run: AnalysisRun) => (
                                    <tr key={run.run_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="text-sm text-gray-900 font-medium">
                                                {analysisTypeLabels[run.analysis_type] || run.analysis_type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {run.status === 'success' ? (
                                                <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                                                    <CheckCircle className="w-4 h-4" />
                                                    성공
                                                </span>
                                            ) : run.status === 'fail' ? (
                                                <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                                                    <XCircle className="w-4 h-4" />
                                                    실패
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-yellow-600 text-sm">
                                                    <Clock className="w-4 h-4 animate-spin" />
                                                    실행중
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {formatDate(run.started_at)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {run.latency_ms ? `${run.latency_ms}ms` : '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => router.push(analysisTypeLinks[run.analysis_type] || '/dashboard')}
                                                className="text-sm text-primary-600 hover:text-primary-500 transition-colors"
                                            >
                                                자세히 보기
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {/* Utility buttons */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => setShowDbModal(true)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    DB 테이블 보기
                </button>
                <button
                    onClick={() => setShowErdModal(true)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    ERD 보기
                </button>
            </div>

            {/* DB Modal */}
            <ModalWithTabs
                isOpen={showDbModal}
                onClose={() => setShowDbModal(false)}
                title="데이터베이스 테이블"
                jsonData={{
                    cases: db.getAllCases(),
                    analysis_runs: db.getAllAnalysisRuns(),
                    reports: db.getAllReports(),
                }}
                tableData={db.getRecentAnalysisRuns(10)}
                schema={schemas[1]} // analysis_runs schema
            />

            {/* ERD Modal */}
            <ERDModal
                isOpen={showErdModal}
                onClose={() => setShowErdModal(false)}
            />

            {/* Report Creation Modal */}
            {showReportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowReportModal(false)} />
                    <div className="relative bg-white rounded-2xl border border-gray-200 p-6 max-w-md mx-4 animate-fadeIn shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">통합 리포트 생성</h3>
                        <p className="text-gray-500 mb-6">
                            최근 실행된 모든 AI 분석 결과를 하나의 종합 리포트로 생성합니다.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">포함될 분석:</h4>
                            <ul className="space-y-1 text-sm text-gray-500">
                                <li>• 분쟁 유형 분류 결과</li>
                                <li>• 법적 위험도 예측 결과</li>
                                <li>• 감정 격화 단계 분석</li>
                                <li>• 유사 판례 매칭 결과</li>
                                <li>• 조기 종재 전략 추천</li>
                            </ul>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReportModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleCreateReport}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-all"
                            >
                                생성하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
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
