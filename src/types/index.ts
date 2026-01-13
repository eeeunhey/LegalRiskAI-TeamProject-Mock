// User types
export interface User {
    user_id: string;
    email: string;
    name: string;
    role: 'admin' | 'user';
    created_at: string;
}

// Case types
export interface Case {
    case_id: string;
    user_id: string;
    title: string;
    raw_text: string;
    domain_hint?: string;
    created_at: string;
}

// Analysis run types
export type AnalysisType = 'CLASSIFY' | 'RISK' | 'EMOTION' | 'SIMILAR' | 'STRATEGY';

export interface AnalysisRun {
    run_id: string;
    case_id: string;
    analysis_type: AnalysisType;
    model_name: string;
    status: 'success' | 'fail' | 'running';
    started_at: string;
    finished_at?: string;
    latency_ms?: number;
    input_hash: string;
}

// Classification result
export interface ClassificationScore {
    label: string;
    score: number;
}

export interface DisputeClassification {
    run_id: string;
    top_label: string;
    scores: ClassificationScore[];
    keywords: string[];
    explanation: string;
}

// Risk prediction result
export interface LegalRiskPrediction {
    run_id: string;
    risk_score: number;
    win_probability: number;
    risk_level: 'low' | 'medium' | 'high';
    risk_factors: string[];
    notes: string;
}

// Emotion escalation result
export interface TrendPoint {
    t: string;
    value: number;
}

export interface EmotionEscalation {
    run_id: string;
    stage: string;
    aggression_score: number;
    escalation_speed: 'slow' | 'normal' | 'fast';
    trend: TrendPoint[];
    emotion_keywords: string[];
}

// Similar case match result
export interface IssueCompare {
    input_issue: string;
    matched_issue: string;
}

export interface CaseMatch {
    case_title: string;
    similarity: number;
    summary: string;
    winner: string;
    detail: string;
}

export interface SimilarCaseMatch {
    run_id: string;
    issue_compare: IssueCompare[];
    top_matches: CaseMatch[];
}

// Strategy recommendation result
export interface StrategySummary {
    key_takeaway: string;
    focus_points: string[];
}

export interface Scenario {
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
    effect: 'low' | 'medium' | 'high';
    description: string;
    next_actions: string[];
}

export interface StrategyRecommendation {
    run_id: string;
    expected_win_probability: number;
    summary: StrategySummary;
    scenarios: Scenario[];
    disclaimer: string;
}

// Report types
export interface Report {
    report_id: string;
    case_id: string;
    included_run_ids: string[];
    report_status: 'draft' | 'final';
    pdf_url?: string;
    created_at: string;
}

// Audit log types
export type AuditAction =
    | 'VIEW_RESULT'
    | 'EXPORT_CSV'
    | 'EXPORT_PDF'
    | 'CREATE_REPORT'
    | 'OPEN_MODAL'
    | 'RUN_ANALYSIS';

export interface AuditLog {
    log_id: string;
    user_id: string;
    action: AuditAction;
    target_id: string;
    meta_json?: Record<string, unknown>;
    created_at: string;
}

// Schema display types
export interface SchemaColumn {
    name: string;
    type: string;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
    references?: string;
    description: string;
}

export interface TableSchema {
    tableName: string;
    columns: SchemaColumn[];
}
