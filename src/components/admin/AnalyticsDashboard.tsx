'use client';

import { BarChart as BarIcon, TrendingUp, Users, Clock, AlertTriangle } from 'lucide-react';
import BarChart from '@/components/charts/BarChart';

// Mock Data for Charts
const MOCK_ACTIVITY_DATA = [
    { label: '월', score: 45 },
    { label: '화', score: 52 },
    { label: '수', score: 38 },
    { label: '목', score: 65 },
    { label: '금', score: 48 },
    { label: '토', score: 25 },
    { label: '일', score: 15 },
];

const MOCK_ERROR_DATA = [
    { label: '404', score: 12 },
    { label: '500', score: 5 },
    { label: '403', score: 3 },
    { label: 'Other', score: 2 },
];

export default function AnalyticsDashboard() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarIcon className="w-5 h-5 text-primary-600" />
                통계 대시보드
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Users className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-500 font-medium">총 사용자</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" /> +12% vs last week
                    </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-500 font-medium">분석 요청</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">856</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" /> +5% vs last week
                    </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                            <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-500 font-medium">평균 응답시간</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">245ms</p>
                    <p className="text-xs text-gray-500 mt-1">안정적임</p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-500 font-medium">에러 발생률</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0.8%</p>
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" /> +0.2% increase
                    </p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Activity Chart */}
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">주간 활성 사용자</h3>
                        <p className="text-sm text-gray-500">최근 7일간의 사용자 활동 추이</p>
                    </div>
                    <div className="h-64">
                        <BarChart
                            data={MOCK_ACTIVITY_DATA}
                            color="#8b5cf6"
                            label="방문자 수"
                            type="number"
                        />
                    </div>
                </div>

                {/* Error Distribution Chart */}
                <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">에러 유형 분포</h3>
                        <p className="text-sm text-gray-500">발생한 시스템 에러의 유형별 통계</p>
                    </div>
                    <div className="h-64">
                        <BarChart
                            data={MOCK_ERROR_DATA}
                            color="#ef4444"
                            label="발생 건수"
                            type="number"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
