'use client';

import { useState } from 'react';
import {
    FileText,
    Search,
    ChevronDown,
    ChevronUp,
    AlertTriangle,
    CheckCircle,
    FileDown,
    Edit3,
    Loader2,
    Scale,
    ExternalLink
} from 'lucide-react';
import { Card, Toast, UtilityButtons, ModalWithTabs, ERDModal } from '@/components/common';
import DocsModal from '@/components/common/DocsModal';

// Mock data types
interface SimilarCase {
    caseId: string;
    caseNumber: string;
    similarity: number;
    summary: string;
    factSimilarity: number;
    legalIssueSimilarity: number;
    result: string;
    winner: string;
    reasoning: string;
    strategicImplication: string;
}

interface Issue {
    id: string;
    title: string;
    weight: number;
    relatedLaw: string;
    description: string;
}

interface SimulationResult {
    winProbability: number;
    matchedCases: number;
    aiAnalysis: string;
    overallAccuracy: number;
    similarCases: SimilarCase[];
    issues: Issue[];
    contraryCase: {
        caseNumber: string;
        keyDifference: string;
        result: string;
    };
}

// Sample simulation result
const sampleResult: SimulationResult = {
    winProbability: 72.4,
    matchedCases: 42,
    aiAnalysis: '사용자의 사건은 임대인의 "실거주 목적" 진정성이 진정하다 입증하는 것이 핵심입니다. 주택임대차보호법상 제3자에게 있대한 경우 또는 "리모델링을 목적"으로 갱신을 거부하거나, "법정 손해배상" 청구도 아닙니다. 판단컨대 재경 관할 등이 분쟁요인이 중요합니다. 따라서 입증책임과 손해배상 관련 쟁점이 매우 중요해지며, 특히 판례검증을 통해 본안 진행시 실효성 있는 대응이 가능합니다.',
    overallAccuracy: 94.8,
    similarCases: [
        {
            caseId: 'case-1',
            caseNumber: '2022가소345***',
            similarity: 88,
            summary: '"실거주 위장 매도 시도"',
            factSimilarity: 85,
            legalIssueSimilarity: 90,
            result: '원고(임차인) 승소',
            winner: '원고(임차인)',
            reasoning: '단순 공실 요구는 제3자 양도가 미니널로 인정 손해배상 대상은 아니나, 뚜렷한 기만은 인정되어 공실을 합형.',
            strategicImplication: '임대인이 실거주 목서를 걸었으녀 허위 또는 정가이거만체의 이상 소송도 우리 때우동이 시드릉 관행어 호시히 사건때문에, 면부은 실거주 목시의 편설들로 관정화고 손해배성을 인정함. 아데름들이 시드들물 위한 가기정 목 뚜렷하의 인지어세서프를 완정합니다.',
        },
        {
            caseId: 'case-2',
            caseNumber: '2021다267***',
            similarity: 75,
            summary: '"거주 목적 리모델링 인정"',
            factSimilarity: 70,
            legalIssueSimilarity: 80,
            result: '피고(임대인) 승소',
            winner: '피고(임대인)',
            reasoning: '임대인의 리모델링 계획이 합리적이며, 임차인에게 충분한 보상 제안이 있었음.',
            strategicImplication: '이 판례는 임대인 측에 유리한 결과였으나, 사전 통지 및 보상 제안이 있었던 점이 차별점.',
        },
    ],
    issues: [
        {
            id: 'issue-1',
            title: '임대인의 실거주 필요성 입증 책임',
            weight: 55,
            relatedLaw: '주택임대차보호법 제6조의3 제1항 손해배상 책임 요건',
            description: '임대인이 실거주 목적으로 갱신을 거절하기 위해서는 실제 거주 의사와 필요성을 입증해야 합니다.',
        },
        {
            id: 'issue-2',
            title: '갱신거절 통지 시점 적정성',
            weight: 80,
            relatedLaw: '갱신거절 사전 통지 기간 6개월 준수 여부',
            description: '임대차계약 종료 6개월 전에 갱신거절 통지를 했는지 여부가 중요한 쟁점입니다.',
        },
        {
            id: 'issue-3',
            title: '제3자 개입 (부동산 중개 관련)',
            weight: 70,
            relatedLaw: '제3자 앞에 있는 분쟁이 있던 불법행위 해당 성립 여부',
            description: '부동산 중개인을 통한 제3자 매각 시도가 있었는지 확인이 필요합니다.',
        },
    ],
    contraryCase: {
        caseNumber: '2021다267***',
        keyDifference: '"6개월전 통지 이행 여부"',
        result: '임대인 책임 없음',
    },
};

export default function SimulationPage() {
    const [inputText, setInputText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<SimulationResult | null>(null);
    const [showDocsModal, setShowDocsModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
    const [expandedCases, setExpandedCases] = useState<Set<string>>(new Set());
    const [easyMode, setEasyMode] = useState(false);
    const [activeTab, setActiveTab] = useState<'civil' | 'labor' | 'family'>('civil');

    // Modal states for utility buttons
    const [showMockDataModal, setShowMockDataModal] = useState(false);
    const [showDbTableModal, setShowDbTableModal] = useState(false);
    const [showSampleRecordsModal, setShowSampleRecordsModal] = useState(false);
    const [showErdModal, setShowErdModal] = useState(false);

    // Weight sliders
    const [factWeight, setFactWeight] = useState(80);
    const [legalWeight, setLegalWeight] = useState(80);
    const [conclusionWeight, setConclusionWeight] = useState(80);

    const sampleText = `임대인이 실거주를 이유로 계약 갱신을 거절했으나, 실제로는 리모델링을 계획하고 있는 징황이 포착되었습니다. 임차인은 이주를 완료한 상태이며, 이후 임대인이 제3자에게 임대한 것이 아니라 공실 상태로 리모델링을 진행 중입니다. 권리금 회수 방해 및 손해배상 청구가 가능한지 궁금합니다.`;

    const handleLoadSample = () => {
        setInputText(sampleText);
    };

    const handleAnalyze = async () => {
        if (!inputText.trim()) {
            setToastMessage('분쟁 상황을 입력해주세요.');
            setShowToast(true);
            return;
        }

        setIsAnalyzing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setResult(sampleResult);
        setIsAnalyzing(false);
        setToastMessage('AI 분석이 완료되었습니다.');
        setShowToast(true);
    };

    const toggleIssue = (id: string) => {
        setExpandedIssues(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleCase = (id: string) => {
        setExpandedCases(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleDownloadPDF = () => {
        setToastMessage('변호사 전략 리포트 PDF가 다운로드 되었습니다.');
        setShowToast(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Scale className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">사건 시뮬레이션</h1>
                        <p className="text-gray-500 text-sm">사건관계를 바탕으로 유사 사례를 매칭합니다</p>
                    </div>
                </div>
                {/* Utility Buttons - Top */}
                <div className="flex justify-start">
                    <UtilityButtons
                        onViewDocs={() => setShowDocsModal(true)}
                        onViewMockData={() => setShowMockDataModal(true)}
                        onViewDbTable={() => setShowDbTableModal(true)}
                        onViewSampleRecords={() => setShowSampleRecordsModal(true)}
                        onViewERD={() => setShowErdModal(true)}
                    />
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Left Column - Input */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Input Section */}
                    <Card>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-gray-600 text-sm">
                                분쟁 관련 상황을 자세히 입력해주세요. AI가 유사 판례를 매칭하고 전략을 분석합니다.
                            </p>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Edit3 className="w-4 h-4" />
                            </button>
                        </div>

                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="임대인이 실거주를 이유로 계약 갱신을 거절했으나, 실제로는 리모델링을 계획하고 있는 정황이 포착되었습니다..."
                            className="w-full h-40 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-700"
                        />

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleLoadSample}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    별도 사건 불러오기
                                </button>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <div className={`w-10 h-5 rounded-full transition-colors ${easyMode ? 'bg-primary-500' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${easyMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                    </div>
                                    <span className="text-sm text-gray-600">쉬운 설명 모드</span>
                                </label>
                            </div>
                            <span className="text-sm text-gray-400">{inputText.length}자</span>
                        </div>
                    </Card>
                </div>

                {/* Right Column - Weight Controls */}
                <div className="space-y-6">
                    {/* Tab Buttons */}
                    <div className="flex gap-2">
                        {[
                            { id: 'civil', label: '편사' },
                            { id: 'labor', label: '노동' },
                            { id: 'family', label: '가사' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Weight Sliders */}
                    <Card>
                        <h3 className="text-sm font-semibold text-gray-700 mb-4">⚙️ 가중치 세부 조절</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">사실관계 유사도</span>
                                    <span className="text-primary-600 font-medium">{factWeight}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={factWeight}
                                    onChange={(e) => setFactWeight(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">법리적 쟁점</span>
                                    <span className="text-primary-600 font-medium">{legalWeight}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={legalWeight}
                                    onChange={(e) => setLegalWeight(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">최종 결론 일치</span>
                                    <span className="text-primary-600 font-medium">{conclusionWeight}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={conclusionWeight}
                                    onChange={(e) => setConclusionWeight(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4">
                            변호사 관점으로 새로 알고리즘 기술팀대로 포집/기변 연구성과로 알려기 구동모델에 사용합니다.
                        </p>
                    </Card>

                    {/* Search Button */}
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !inputText.trim()}
                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                분석 중...
                            </>
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                유사 판례 검색 실행
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {result && (
                <>
                    {/* AI Analysis + Similar Cases Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* AI Comprehensive Risk Analysis Card */}
                        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
                            <div className="text-xs font-medium text-primary-400 mb-2 tracking-wide">MASTER AI REPORT</div>
                            <h3 className="text-xl font-bold mb-4">AI 종합 리스크 분석</h3>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                {result.aiAnalysis}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-700/50 rounded-xl p-4">
                                    <div className="text-slate-400 text-xs mb-1">예상 승소율</div>
                                    <div className="text-2xl font-bold text-green-400">{result.winProbability}%</div>
                                </div>
                                <div className="bg-slate-700/50 rounded-xl p-4">
                                    <div className="text-slate-400 text-xs mb-1">매칭 판례 수</div>
                                    <div className="text-2xl font-bold text-white">{result.matchedCases}건</div>
                                </div>
                            </div>
                        </Card>

                        {/* Similar Cases Report */}
                        <div className="lg:col-span-2">
                            <Card>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-gray-900">유사 판례 리포트</h3>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                            ✓ 적중률 {result.overallAccuracy}%
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                            </svg>
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {result.similarCases.map((caseItem) => (
                                        <div key={caseItem.caseId} className="border border-gray-200 rounded-xl overflow-hidden">
                                            {/* Case Header */}
                                            <div className="p-4 bg-gray-50 flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className={`px-2 py-1 rounded-lg text-xs font-bold ${caseItem.similarity >= 80 ? 'bg-green-100 text-green-700' :
                                                        caseItem.similarity >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        유사도 {caseItem.similarity}%
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-500 mb-1">ID {caseItem.caseId}</div>
                                                        <h4 className="font-semibold text-gray-900">{caseItem.caseNumber}</h4>
                                                        <p className="text-sm text-gray-600 mt-1">{caseItem.summary}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${caseItem.winner.includes('원고') || caseItem.winner.includes('임차인')
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {caseItem.winner}
                                                </span>
                                            </div>

                                            {/* Similarity Bars */}
                                            <div className="px-4 py-3 grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-gray-500">▶ AI 유사도 산출 근거 (XAI)</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span className="text-gray-600">사실관계</span>
                                                            </div>
                                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-blue-500 rounded-full"
                                                                    style={{ width: `${caseItem.factSimilarity}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span className="text-gray-600">법리쟁점</span>
                                                            </div>
                                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-purple-500 rounded-full"
                                                                    style={{ width: `${caseItem.legalIssueSimilarity}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="flex justify-between text-xs mb-1">
                                                                <span className="text-gray-600">결론유사</span>
                                                            </div>
                                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-green-500 rounded-full"
                                                                    style={{ width: `${Math.round((caseItem.factSimilarity + caseItem.legalIssueSimilarity) / 2)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <h5 className="text-xs font-semibold text-gray-700 mb-2">판단 근거:</h5>
                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                        {caseItem.reasoning.substring(0, 100)}...
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Expandable Section */}
                                            <button
                                                onClick={() => toggleCase(caseItem.caseId)}
                                                className="w-full px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600 hover:bg-gray-100"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span>▷ 현재 결론 분석</span>
                                                    <span>◇ 전략적 시사점</span>
                                                </div>
                                                {expandedCases.has(caseItem.caseId) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>

                                            {expandedCases.has(caseItem.caseId) && (
                                                <div className="px-4 py-3 bg-white border-t border-gray-100">
                                                    <h5 className="text-sm font-semibold text-gray-700 mb-2">전략적 시사점</h5>
                                                    <p className="text-sm text-gray-600">{caseItem.strategicImplication}</p>
                                                    <div className="flex gap-2 mt-3">
                                                        <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">
                                                            원본 전문 보기
                                                        </button>
                                                        <button className="px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-lg text-xs text-primary-700 hover:bg-primary-100">
                                                            분석 리포트 포함
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Strategy Report CTA */}
                                <div className="mt-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-between">
                                    <div className="text-white">
                                        <h4 className="font-semibold">변호사 전략 리포트 생성</h4>
                                        <p className="text-purple-200 text-sm">본석된 판례와 쟁점을 문서화하여 즉시 PDF로 출력합니다.</p>
                                    </div>
                                    <button
                                        onClick={handleDownloadPDF}
                                        className="px-4 py-2 bg-white text-purple-700 font-medium rounded-lg hover:bg-purple-50 flex items-center gap-2"
                                    >
                                        <FileDown className="w-4 h-4" />
                                        PDF 리포트 다운로드
                                    </button>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Issue-based Matching */}
                    <Card className="mb-8">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-6">
                            <Scale className="w-5 h-5 text-primary-600" />
                            쟁점별 상세 매칭
                        </h3>
                        <div className="space-y-3">
                            {result.issues.map((issue, idx) => (
                                <div key={issue.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleIssue(issue.id)}
                                        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400">○</span>
                                            <span className="font-medium text-gray-900">쟁점 {idx + 1}</span>
                                            <span className="text-gray-700">{issue.title}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-gray-500">가중치 {issue.weight}%</span>
                                            {expandedIssues.has(issue.id) ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                        </div>
                                    </button>
                                    {expandedIssues.has(issue.id) && (
                                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded font-medium">CASE</span>
                                                <span className="text-sm text-gray-700">{issue.relatedLaw}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{issue.description}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Contrary Result Warning */}
                    <Card className="bg-yellow-50 border-yellow-200">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-yellow-800 mb-2">반대 결과 주의 판례</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{result.contraryCase.caseNumber}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            핵심 차이점: <span className="text-red-600 font-medium">{result.contraryCase.keyDifference}</span>
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
                                        {result.contraryCase.result}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </>
            )}

            {/* Modals */}
            <DocsModal
                isOpen={showDocsModal}
                onClose={() => setShowDocsModal(false)}
                featureName="simulation"
            />

            {/* Mock Data Modal */}
            <ModalWithTabs
                isOpen={showMockDataModal}
                onClose={() => setShowMockDataModal(false)}
                title="사건 시뮬레이션 목업 데이터"
                jsonData={{
                    request: {
                        input_text: "임대인이 실거주를 이유로 계약 갱신을 거절...",
                        weights: { fact_similarity: 80, legal_issue: 80, conclusion: 80 },
                        dispute_type: "civil"
                    },
                    response: sampleResult
                }}
                tableData={result ? [result] : []}
            />

            {/* DB Table Modal */}
            <ModalWithTabs
                isOpen={showDbTableModal}
                onClose={() => setShowDbTableModal(false)}
                title="관련 DB 테이블"
                jsonData={{
                    simulations: {
                        simulation_id: "UUID PRIMARY KEY",
                        case_id: "UUID REFERENCES cases(case_id)",
                        input_text: "TEXT NOT NULL",
                        dispute_type: "VARCHAR(20)",
                        fact_weight: "INT DEFAULT 80",
                        legal_weight: "INT DEFAULT 80",
                        conclusion_weight: "INT DEFAULT 80",
                        created_at: "TIMESTAMP DEFAULT NOW()"
                    },
                    simulation_results: {
                        result_id: "UUID PRIMARY KEY",
                        simulation_id: "UUID REFERENCES simulations",
                        win_probability: "DECIMAL(5,2)",
                        matched_cases_count: "INT",
                        ai_analysis: "TEXT",
                        overall_accuracy: "DECIMAL(5,2)",
                        created_at: "TIMESTAMP DEFAULT NOW()"
                    }
                }}
            />

            {/* Sample Records Modal */}
            <ModalWithTabs
                isOpen={showSampleRecordsModal}
                onClose={() => setShowSampleRecordsModal(false)}
                title="샘플 레코드"
                jsonData={{
                    simulation_id: "sim-001",
                    case_id: "case-001",
                    input_text: "임대인이 실거주를 이유로 계약 갱신을 거절...",
                    dispute_type: "civil",
                    fact_weight: 80,
                    legal_weight: 80,
                    conclusion_weight: 80,
                    created_at: new Date().toISOString()
                }}
                tableData={[
                    {
                        match_id: "match-001",
                        case_number: "2022가소345***",
                        similarity_score: 88,
                        winner: "원고(임차인)"
                    },
                    {
                        match_id: "match-002",
                        case_number: "2021다267***",
                        similarity_score: 75,
                        winner: "피고(임대인)"
                    }
                ]}
            />

            {/* ERD Modal */}
            <ERDModal
                isOpen={showErdModal}
                onClose={() => setShowErdModal(false)}
            />

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
