'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ERDModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ERDModal({ isOpen, onClose }: ERDModalProps) {
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
            <div className="relative w-full max-w-5xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Entity Relationship Diagram (ERD)</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {/* ERD Diagram using SVG */}
                    <div className="bg-gray-50 rounded-xl p-8 overflow-auto border border-gray-200">
                        <svg viewBox="0 0 1200 800" className="w-full h-auto min-w-[800px]">
                            {/* Definitions */}
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                                </marker>
                                <linearGradient id="tableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#1e40af" stopOpacity="0.05" />
                                </linearGradient>
                            </defs>

                            {/* USERS Table */}
                            <g transform="translate(50, 50)">
                                <rect width="180" height="130" rx="8" fill="url(#tableGrad)" stroke="#3b82f6" strokeWidth="2" />
                                <rect width="180" height="30" rx="8" fill="#3b82f6" />
                                <text x="90" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">users</text>
                                <text x="10" y="50" fill="#1e40af" fontSize="10">🔑 user_id (UUID)</text>
                                <text x="10" y="70" fill="#374151" fontSize="10">email (VARCHAR)</text>
                                <text x="10" y="90" fill="#374151" fontSize="10">name (VARCHAR)</text>
                                <text x="10" y="110" fill="#374151" fontSize="10">role (VARCHAR)</text>
                            </g>

                            {/* CASES Table */}
                            <g transform="translate(300, 50)">
                                <rect width="180" height="150" rx="8" fill="url(#tableGrad)" stroke="#3b82f6" strokeWidth="2" />
                                <rect width="180" height="30" rx="8" fill="#3b82f6" />
                                <text x="90" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">cases</text>
                                <text x="10" y="50" fill="#1e40af" fontSize="10">🔑 case_id (UUID)</text>
                                <text x="10" y="70" fill="#f59e0b" fontSize="10">🔗 user_id (FK)</text>
                                <text x="10" y="90" fill="#374151" fontSize="10">title (VARCHAR)</text>
                                <text x="10" y="110" fill="#374151" fontSize="10">raw_text (TEXT)</text>
                                <text x="10" y="130" fill="#374151" fontSize="10">domain_hint (VARCHAR)</text>
                            </g>

                            {/* ANALYSIS_RUNS Table */}
                            <g transform="translate(550, 50)">
                                <rect width="200" height="180" rx="8" fill="url(#tableGrad)" stroke="#3b82f6" strokeWidth="2" />
                                <rect width="200" height="30" rx="8" fill="#3b82f6" />
                                <text x="100" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">analysis_runs</text>
                                <text x="10" y="50" fill="#1e40af" fontSize="10">🔑 run_id (UUID)</text>
                                <text x="10" y="70" fill="#f59e0b" fontSize="10">🔗 case_id (FK)</text>
                                <text x="10" y="90" fill="#374151" fontSize="10">analysis_type (VARCHAR)</text>
                                <text x="10" y="110" fill="#374151" fontSize="10">model_name (VARCHAR)</text>
                                <text x="10" y="130" fill="#374151" fontSize="10">status (VARCHAR)</text>
                                <text x="10" y="150" fill="#374151" fontSize="10">started_at (TIMESTAMPTZ)</text>
                                <text x="10" y="170" fill="#374151" fontSize="10">latency_ms (INT)</text>
                            </g>

                            {/* Result Tables */}
                            {/* DISPUTE_CLASSIFICATIONS */}
                            <g transform="translate(820, 50)">
                                <rect width="180" height="110" rx="8" fill="url(#tableGrad)" stroke="#22c55e" strokeWidth="2" />
                                <rect width="180" height="30" rx="8" fill="#22c55e" />
                                <text x="90" y="20" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">dispute_classifications</text>
                                <text x="10" y="50" fill="#f59e0b" fontSize="10">🔗 run_id (FK/PK)</text>
                                <text x="10" y="70" fill="#374151" fontSize="10">top_label (VARCHAR)</text>
                                <text x="10" y="90" fill="#374151" fontSize="10">scores_json (JSONB)</text>
                            </g>

                            {/* LEGAL_RISK_PREDICTIONS */}
                            <g transform="translate(820, 180)">
                                <rect width="180" height="110" rx="8" fill="url(#tableGrad)" stroke="#f59e0b" strokeWidth="2" />
                                <rect width="180" height="30" rx="8" fill="#f59e0b" />
                                <text x="90" y="20" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">legal_risk_predictions</text>
                                <text x="10" y="50" fill="#f59e0b" fontSize="10">🔗 run_id (FK/PK)</text>
                                <text x="10" y="70" fill="#374151" fontSize="10">risk_score (INT)</text>
                                <text x="10" y="90" fill="#374151" fontSize="10">win_probability (INT)</text>
                            </g>

                            {/* EMOTION_ESCALATIONS */}
                            <g transform="translate(820, 310)">
                                <rect width="180" height="110" rx="8" fill="url(#tableGrad)" stroke="#ef4444" strokeWidth="2" />
                                <rect width="180" height="30" rx="8" fill="#ef4444" />
                                <text x="90" y="20" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">emotion_escalations</text>
                                <text x="10" y="50" fill="#f59e0b" fontSize="10">🔗 run_id (FK/PK)</text>
                                <text x="10" y="70" fill="#374151" fontSize="10">stage (VARCHAR)</text>
                                <text x="10" y="90" fill="#374151" fontSize="10">aggression_score (INT)</text>
                            </g>

                            {/* SIMILAR_CASE_MATCHES */}
                            <g transform="translate(1020, 120)">
                                <rect width="160" height="100" rx="8" fill="url(#tableGrad)" stroke="#8b5cf6" strokeWidth="2" />
                                <rect width="160" height="30" rx="8" fill="#8b5cf6" />
                                <text x="80" y="20" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">similar_case_matches</text>
                                <text x="10" y="50" fill="#f59e0b" fontSize="10">🔗 run_id (FK/PK)</text>
                                <text x="10" y="70" fill="#374151" fontSize="10">issue_compare (JSONB)</text>
                                <text x="10" y="90" fill="#374151" fontSize="10">top_matches (JSONB)</text>
                            </g>

                            {/* STRATEGY_RECOMMENDATIONS */}
                            <g transform="translate(1020, 250)">
                                <rect width="160" height="100" rx="8" fill="url(#tableGrad)" stroke="#06b6d4" strokeWidth="2" />
                                <rect width="160" height="30" rx="8" fill="#06b6d4" />
                                <text x="80" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">strategy_recommendations</text>
                                <text x="10" y="50" fill="#f59e0b" fontSize="10">🔗 run_id (FK/PK)</text>
                                <text x="10" y="70" fill="#374151" fontSize="10">win_probability (INT)</text>
                                <text x="10" y="90" fill="#374151" fontSize="10">scenarios (JSONB)</text>
                            </g>

                            {/* REPORTS Table */}
                            <g transform="translate(300, 300)">
                                <rect width="180" height="130" rx="8" fill="url(#tableGrad)" stroke="#ec4899" strokeWidth="2" />
                                <rect width="180" height="30" rx="8" fill="#ec4899" />
                                <text x="90" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">reports</text>
                                <text x="10" y="50" fill="#1e40af" fontSize="10">🔑 report_id (UUID)</text>
                                <text x="10" y="70" fill="#f59e0b" fontSize="10">🔗 case_id (FK)</text>
                                <text x="10" y="90" fill="#374151" fontSize="10">included_run_ids (JSONB)</text>
                                <text x="10" y="110" fill="#374151" fontSize="10">report_status (VARCHAR)</text>
                            </g>

                            {/* AUDIT_LOGS Table */}
                            <g transform="translate(50, 300)">
                                <rect width="180" height="130" rx="8" fill="url(#tableGrad)" stroke="#6b7280" strokeWidth="2" />
                                <rect width="180" height="30" rx="8" fill="#6b7280" />
                                <text x="90" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">audit_logs</text>
                                <text x="10" y="50" fill="#1e40af" fontSize="10">🔑 log_id (UUID)</text>
                                <text x="10" y="70" fill="#f59e0b" fontSize="10">🔗 user_id (FK)</text>
                                <text x="10" y="90" fill="#374151" fontSize="10">action (VARCHAR)</text>
                                <text x="10" y="110" fill="#374151" fontSize="10">target_id (UUID)</text>
                            </g>

                            {/* Relationship Lines */}
                            {/* users -> cases */}
                            <line x1="230" y1="115" x2="300" y2="115" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />

                            {/* users -> audit_logs */}
                            <line x1="140" y1="180" x2="140" y2="300" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />

                            {/* cases -> analysis_runs */}
                            <line x1="480" y1="115" x2="550" y2="115" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />

                            {/* cases -> reports */}
                            <line x1="390" y1="200" x2="390" y2="300" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />

                            {/* analysis_runs -> result tables */}
                            <line x1="750" y1="100" x2="820" y2="100" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
                            <line x1="750" y1="140" x2="820" y2="220" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
                            <line x1="750" y1="180" x2="820" y2="350" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
                            <line x1="750" y1="120" x2="1020" y2="160" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
                            <line x1="750" y1="160" x2="1020" y2="290" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />

                            {/* Legend */}
                            <g transform="translate(50, 500)">
                                <text x="0" y="0" fill="#1f2937" fontSize="14" fontWeight="bold">범례</text>
                                <rect x="0" y="15" width="16" height="16" rx="2" fill="#3b82f6" />
                                <text x="25" y="27" fill="#374151" fontSize="11">Core Tables</text>
                                <rect x="120" y="15" width="16" height="16" rx="2" fill="#22c55e" />
                                <text x="145" y="27" fill="#374151" fontSize="11">분류 결과</text>
                                <rect x="240" y="15" width="16" height="16" rx="2" fill="#f59e0b" />
                                <text x="265" y="27" fill="#374151" fontSize="11">위험도 결과</text>
                                <rect x="360" y="15" width="16" height="16" rx="2" fill="#ef4444" />
                                <text x="385" y="27" fill="#374151" fontSize="11">감정 분석</text>
                                <text x="0" y="55" fill="#1e40af" fontSize="11">🔑 Primary Key</text>
                                <text x="120" y="55" fill="#f59e0b" fontSize="11">🔗 Foreign Key</text>
                                <line x1="240" y1="48" x2="280" y2="48" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                <text x="290" y="55" fill="#374151" fontSize="11">Relationship</text>
                            </g>
                        </svg>
                    </div>

                    {/* Mermaid Code (collapsed) */}
                    <details className="mt-6">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-900 text-sm font-medium">
                            📝 Mermaid 코드 보기
                        </summary>
                        <pre className="mt-3 p-4 bg-gray-50 rounded-lg overflow-auto text-xs text-gray-600 font-mono border border-gray-200">
                            {`erDiagram
    users ||--o{ cases : creates
    users ||--o{ audit_logs : generates
    cases ||--o{ analysis_runs : has
    cases ||--o{ reports : produces
    analysis_runs ||--|| dispute_classifications : stores
    analysis_runs ||--|| legal_risk_predictions : stores
    analysis_runs ||--|| emotion_escalations : stores
    analysis_runs ||--|| similar_case_matches : stores
    analysis_runs ||--|| strategy_recommendations : stores

    users {
        uuid user_id PK
        varchar email
        varchar name
        varchar role
        timestamptz created_at
    }
    
    cases {
        uuid case_id PK
        uuid user_id FK
        varchar title
        text raw_text
        varchar domain_hint
        timestamptz created_at
    }
    
    analysis_runs {
        uuid run_id PK
        uuid case_id FK
        varchar analysis_type
        varchar model_name
        varchar status
        timestamptz started_at
        timestamptz finished_at
        int latency_ms
    }`}
                        </pre>
                    </details>
                </div>
            </div>
        </div>
    );
}
