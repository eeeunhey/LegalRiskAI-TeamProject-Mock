import {
    User, Case, AnalysisRun, AnalysisType,
    DisputeClassification, LegalRiskPrediction, EmotionEscalation,
    SimilarCaseMatch, StrategyRecommendation, Report, AuditLog, AuditAction
} from '@/types';

// Simple hash function for deduplication
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
};

// Generate UUID-like string
const generateId = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

// In-memory database store
class DBStore {
    private users: Map<string, User> = new Map();
    private cases: Map<string, Case> = new Map();
    private analysisRuns: Map<string, AnalysisRun> = new Map();
    private disputeClassifications: Map<string, DisputeClassification> = new Map();
    private legalRiskPredictions: Map<string, LegalRiskPrediction> = new Map();
    private emotionEscalations: Map<string, EmotionEscalation> = new Map();
    private similarCaseMatches: Map<string, SimilarCaseMatch> = new Map();
    private strategyRecommendations: Map<string, StrategyRecommendation> = new Map();
    private reports: Map<string, Report> = new Map();
    private auditLogs: Map<string, AuditLog> = new Map();

    private currentUserId: string;

    constructor() {
        // Initialize with a default user
        const userId = 'user-001';
        this.currentUserId = userId;
        this.users.set(userId, {
            user_id: userId,
            email: 'demo@legalrisk.ai',
            name: '데모 사용자',
            role: 'user',
            created_at: new Date().toISOString(),
        });

        // Pre-populate with sample data
        this.initializeSampleData();
    }

    private initializeSampleData() {
        // Create sample cases
        const case1 = {
            case_id: 'case-001',
            user_id: this.currentUserId,
            title: '온라인 쇼핑몰 환불 분쟁',
            raw_text: '온라인 쇼핑몰에서 전자제품 구매 후 청약철회 거부당함',
            domain_hint: 'consumer',
            created_at: new Date(Date.now() - 3600000).toISOString(),
        };
        this.cases.set(case1.case_id, case1);

        const case2 = {
            case_id: 'case-002',
            user_id: this.currentUserId,
            title: '상가 임대차 갱신 거절 분쟁',
            raw_text: '임대인이 리모델링을 이유로 임대차 갱신 거절',
            domain_hint: 'contract',
            created_at: new Date(Date.now() - 7200000).toISOString(),
        };
        this.cases.set(case2.case_id, case2);

        const case3 = {
            case_id: 'case-003',
            user_id: this.currentUserId,
            title: '계약 위반 손해배상 청구',
            raw_text: '계약 5조 위반으로 인한 손해배상 청구서 수신',
            domain_hint: 'contract',
            created_at: new Date(Date.now() - 10800000).toISOString(),
        };
        this.cases.set(case3.case_id, case3);

        // Create sample analysis runs with results
        // Run 1: Classification
        const run1: AnalysisRun = {
            run_id: 'run-001',
            case_id: 'case-001',
            analysis_type: 'CLASSIFY',
            model_name: 'LegalRisk-CLASSIFY-v1.0',
            status: 'success',
            started_at: new Date(Date.now() - 3500000).toISOString(),
            finished_at: new Date(Date.now() - 3498500).toISOString(),
            latency_ms: 1500,
            input_hash: 'abc123',
        };
        this.analysisRuns.set(run1.run_id, run1);

        this.disputeClassifications.set(run1.run_id, {
            run_id: run1.run_id,
            top_label: 'Consumer',
            scores: [
                { label: 'Consumer', score: 0.92 },
                { label: 'Contract', score: 0.06 },
                { label: 'Administrative', score: 0.02 },
            ],
            keywords: ['소비자보호법', '환불 거부', '전자상거래', '계약 해지', '부당 청구'],
            explanation: '환불/청약철회/표시·광고 분쟁 패턴이 강하며 소비자 보호 관련 쟁점이 핵심입니다.',
        });

        // Run 2: Risk Prediction
        const run2: AnalysisRun = {
            run_id: 'run-002',
            case_id: 'case-003',
            analysis_type: 'RISK',
            model_name: 'LegalRisk-RISK-v1.0',
            status: 'success',
            started_at: new Date(Date.now() - 3400000).toISOString(),
            finished_at: new Date(Date.now() - 3398500).toISOString(),
            latency_ms: 1500,
            input_hash: 'def456',
        };
        this.analysisRuns.set(run2.run_id, run2);

        this.legalRiskPredictions.set(run2.run_id, {
            run_id: run2.run_id,
            risk_score: 88,
            win_probability: 85,
            risk_level: 'high',
            risk_factors: [
                '일방적 계약 해지 주장',
                '손해배상액(5천만원) 특정',
                '민/형사 소송 위협 표현',
                '특정 조항(Article 5) 위반 언급',
                '법률대리인 선임 의사 표현',
            ],
            notes: '본 점수는 입력된 텍스트의 법적 표현 강도와 분쟁 패턴을 기반으로 산출된 참고 지표입니다.',
        });

        // Run 3: Emotion Escalation
        const run3: AnalysisRun = {
            run_id: 'run-003',
            case_id: 'case-003',
            analysis_type: 'EMOTION',
            model_name: 'LegalRisk-EMOTION-v1.0',
            status: 'success',
            started_at: new Date(Date.now() - 3300000).toISOString(),
            finished_at: new Date(Date.now() - 3298500).toISOString(),
            latency_ms: 1500,
            input_hash: 'ghi789',
        };
        this.analysisRuns.set(run3.run_id, run3);

        this.emotionEscalations.set(run3.run_id, {
            run_id: run3.run_id,
            stage: '위협 및 압박',
            aggression_score: 88,
            escalation_speed: 'fast',
            trend: [
                { t: 'T-3', value: 62 },
                { t: 'T-2', value: 74 },
                { t: 'T-1', value: 83 },
                { t: 'T0', value: 88 },
            ],
            emotion_keywords: ['이의제기', '기각', '합의하자', '부당', '강경대응', '책임', '손해', '고소'],
        });

        // Run 4: Similar Case Match
        const run4: AnalysisRun = {
            run_id: 'run-004',
            case_id: 'case-002',
            analysis_type: 'SIMILAR',
            model_name: 'LegalRisk-SIMILAR-v1.0',
            status: 'success',
            started_at: new Date(Date.now() - 3200000).toISOString(),
            finished_at: new Date(Date.now() - 3198200).toISOString(),
            latency_ms: 1800,
            input_hash: 'jkl012',
        };
        this.analysisRuns.set(run4.run_id, run4);

        this.similarCaseMatches.set(run4.run_id, {
            run_id: run4.run_id,
            issue_compare: [
                { input_issue: '임대인의 갱신거절(리모델링 사유)', matched_issue: '리모델링이 정당한 갱신거절 사유인지' },
                { input_issue: '프리미엄 회수 기회', matched_issue: '권리금(프리미엄) 회수 방해 여부' },
                { input_issue: '계약 종료 시점 분쟁', matched_issue: '임대차 기간 만료 후 갱신 청구권 인정 범위' },
            ],
            top_matches: [
                {
                    case_title: '대법원 2018다252458 판결',
                    similarity: 0.95,
                    summary: '안전/철거 사유 없는 리모델링 주장만으로 권리금 회수 기회를 제한할 수 없다고 판단.',
                    winner: '임차인',
                    detail: '【쟁점】 리모델링을 이유로 갱신 거절 시 권리금 회수 방해 인정 여부\n\n【판단】 임대인 패소',
                },
                {
                    case_title: '서울중앙지법 2019가합12345',
                    similarity: 0.88,
                    summary: '가치상승 목적 리모델링은 갱신거절 사유로 약함.',
                    winner: '임차인',
                    detail: '【쟁점】 건물 노후화 이유 리모델링 정당성\n\n【판단】 임대인 패소',
                },
                {
                    case_title: '합성 사례: 안전 재건축 케이스',
                    similarity: 0.75,
                    summary: '안전진단 D등급 기반 재건축은 갱신거절 정당성 인정.',
                    winner: '임대인',
                    detail: '【쟁점】 안전 문제 시 갱신거절 정당성\n\n【판단】 임대인 승소',
                },
            ],
        });

        // Run 5: Strategy Recommendation
        const run5: AnalysisRun = {
            run_id: 'run-005',
            case_id: 'case-002',
            analysis_type: 'STRATEGY',
            model_name: 'LegalRisk-STRATEGY-v1.0',
            status: 'success',
            started_at: new Date(Date.now() - 3100000).toISOString(),
            finished_at: new Date(Date.now() - 3098200).toISOString(),
            latency_ms: 1800,
            input_hash: 'mno345',
        };
        this.analysisRuns.set(run5.run_id, run5);

        this.strategyRecommendations.set(run5.run_id, {
            run_id: run5.run_id,
            expected_win_probability: 85,
            summary: {
                key_takeaway: '지연 기간을 3개월 이상 끌면 재판부 인식과 상대방 협상력이 달라질 수 있어 초기 대응이 유리합니다.',
                focus_points: ['증거 선확보', '상대 주장 약점 정리', '합의안 레버리지 설계'],
            },
            scenarios: [
                {
                    title: '행정적 사실확인 + 합의 요청',
                    difficulty: 'easy',
                    effect: 'medium',
                    description: '증빙/기초사실을 먼저 확정하고 협상 테이블을 엽니다.',
                    next_actions: ['증빙 목록화', '요청 공문 템플릿 생성', '타임라인 정리'],
                },
                {
                    title: '연성 경고(Soft Notice) 발송',
                    difficulty: 'easy',
                    effect: 'high',
                    description: '감정 격화를 낮추면서 법적 포지션을 선점합니다.',
                    next_actions: ['표현 수위 조절', '쟁점 3개로 축약', '기한 제시'],
                },
                {
                    title: '내용증명 발송',
                    difficulty: 'medium',
                    effect: 'high',
                    description: '법적 의사표시를 공식화하여 추후 소송에서 증거로 활용합니다.',
                    next_actions: ['법률 전문가 검토', '우체국 발송', '응답 모니터링'],
                },
            ],
            disclaimer: '본 전략 추천은 AI 분석 결과로, 참고 목적으로만 활용해 주세요.',
        });

        // Create sample reports
        const report1: Report = {
            report_id: 'report-001',
            case_id: 'case-002',
            included_run_ids: ['run-004', 'run-005'],
            report_status: 'draft',
            created_at: new Date(Date.now() - 1800000).toISOString(),
        };
        this.reports.set(report1.report_id, report1);

        const report2: Report = {
            report_id: 'report-002',
            case_id: 'case-003',
            included_run_ids: ['run-002', 'run-003'],
            report_status: 'final',
            pdf_url: '/reports/report-002.pdf',
            created_at: new Date(Date.now() - 900000).toISOString(),
        };
        this.reports.set(report2.report_id, report2);

        // Create sample audit logs
        const auditActions: { action: AuditAction; target: string }[] = [
            { action: 'RUN_ANALYSIS', target: 'run-001' },
            { action: 'VIEW_RESULT', target: 'run-001' },
            { action: 'RUN_ANALYSIS', target: 'run-002' },
            { action: 'VIEW_RESULT', target: 'run-002' },
            { action: 'CREATE_REPORT', target: 'report-001' },
        ];

        auditActions.forEach((log, idx) => {
            const logId = `log-00${idx + 1}`;
            this.auditLogs.set(logId, {
                log_id: logId,
                user_id: this.currentUserId,
                action: log.action,
                target_id: log.target,
                created_at: new Date(Date.now() - (5 - idx) * 600000).toISOString(),
            });
        });
    }

    // Get current user
    getCurrentUser(): User | undefined {
        return this.users.get(this.currentUserId);
    }

    // ==================== Cases ====================
    createCase(title: string, rawText: string, domainHint?: string): Case {
        const caseId = generateId();
        const newCase: Case = {
            case_id: caseId,
            user_id: this.currentUserId,
            title,
            raw_text: rawText,
            domain_hint: domainHint,
            created_at: new Date().toISOString(),
        };
        this.cases.set(caseId, newCase);
        return newCase;
    }

    getCase(caseId: string): Case | undefined {
        return this.cases.get(caseId);
    }

    getAllCases(): Case[] {
        return Array.from(this.cases.values());
    }

    // ==================== Analysis Runs ====================
    createAnalysisRun(caseId: string, analysisType: AnalysisType, inputText: string): AnalysisRun {
        const runId = generateId();
        const run: AnalysisRun = {
            run_id: runId,
            case_id: caseId,
            analysis_type: analysisType,
            model_name: `LegalRisk-${analysisType}-v1.0`,
            status: 'running',
            started_at: new Date().toISOString(),
            input_hash: simpleHash(inputText),
        };
        this.analysisRuns.set(runId, run);
        return run;
    }

    completeAnalysisRun(runId: string, success: boolean, latencyMs: number): void {
        const run = this.analysisRuns.get(runId);
        if (run) {
            run.status = success ? 'success' : 'fail';
            run.finished_at = new Date().toISOString();
            run.latency_ms = latencyMs;
        }
    }

    getAnalysisRun(runId: string): AnalysisRun | undefined {
        return this.analysisRuns.get(runId);
    }

    getAllAnalysisRuns(): AnalysisRun[] {
        return Array.from(this.analysisRuns.values())
            .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
    }

    getRecentAnalysisRuns(limit: number = 10): AnalysisRun[] {
        return this.getAllAnalysisRuns().slice(0, limit);
    }

    getAnalysisRunsByType(type: AnalysisType): AnalysisRun[] {
        return this.getAllAnalysisRuns().filter(run => run.analysis_type === type);
    }

    // ==================== Result Tables ====================
    saveClassificationResult(result: DisputeClassification): void {
        this.disputeClassifications.set(result.run_id, result);
    }

    getClassificationResult(runId: string): DisputeClassification | undefined {
        return this.disputeClassifications.get(runId);
    }

    getAllClassificationResults(): DisputeClassification[] {
        return Array.from(this.disputeClassifications.values());
    }

    saveRiskPrediction(result: LegalRiskPrediction): void {
        this.legalRiskPredictions.set(result.run_id, result);
    }

    getRiskPrediction(runId: string): LegalRiskPrediction | undefined {
        return this.legalRiskPredictions.get(runId);
    }

    getAllRiskPredictions(): LegalRiskPrediction[] {
        return Array.from(this.legalRiskPredictions.values());
    }

    saveEmotionEscalation(result: EmotionEscalation): void {
        this.emotionEscalations.set(result.run_id, result);
    }

    getEmotionEscalation(runId: string): EmotionEscalation | undefined {
        return this.emotionEscalations.get(runId);
    }

    getAllEmotionEscalations(): EmotionEscalation[] {
        return Array.from(this.emotionEscalations.values());
    }

    saveSimilarCaseMatch(result: SimilarCaseMatch): void {
        this.similarCaseMatches.set(result.run_id, result);
    }

    getSimilarCaseMatch(runId: string): SimilarCaseMatch | undefined {
        return this.similarCaseMatches.get(runId);
    }

    getAllSimilarCaseMatches(): SimilarCaseMatch[] {
        return Array.from(this.similarCaseMatches.values());
    }

    saveStrategyRecommendation(result: StrategyRecommendation): void {
        this.strategyRecommendations.set(result.run_id, result);
    }

    getStrategyRecommendation(runId: string): StrategyRecommendation | undefined {
        return this.strategyRecommendations.get(runId);
    }

    getAllStrategyRecommendations(): StrategyRecommendation[] {
        return Array.from(this.strategyRecommendations.values());
    }

    // ==================== Reports ====================
    createReport(caseId: string, includedRunIds: string[]): Report {
        const reportId = generateId();
        const report: Report = {
            report_id: reportId,
            case_id: caseId,
            included_run_ids: includedRunIds,
            report_status: 'draft',
            created_at: new Date().toISOString(),
        };
        this.reports.set(reportId, report);
        return report;
    }

    getReport(reportId: string): Report | undefined {
        return this.reports.get(reportId);
    }

    getAllReports(): Report[] {
        return Array.from(this.reports.values())
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    updateReportStatus(reportId: string, status: 'draft' | 'final'): void {
        const report = this.reports.get(reportId);
        if (report) {
            report.report_status = status;
        }
    }

    // ==================== Audit Logs ====================
    logAction(action: AuditAction, targetId: string, meta?: Record<string, unknown>): void {
        const logId = generateId();
        const log: AuditLog = {
            log_id: logId,
            user_id: this.currentUserId,
            action,
            target_id: targetId,
            meta_json: meta,
            created_at: new Date().toISOString(),
        };
        this.auditLogs.set(logId, log);
    }

    getAllAuditLogs(): AuditLog[] {
        return Array.from(this.auditLogs.values())
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    // ==================== Sample Data for Display ====================
    getSampleRecords(tableName: string, limit: number = 5): any[] {
        switch (tableName) {
            case 'users':
                return Array.from(this.users.values()).slice(0, limit);
            case 'cases':
                return Array.from(this.cases.values()).slice(0, limit);
            case 'analysis_runs':
                return this.getRecentAnalysisRuns(limit);
            case 'dispute_classifications':
                return this.getAllClassificationResults().slice(0, limit);
            case 'legal_risk_predictions':
                return this.getAllRiskPredictions().slice(0, limit);
            case 'emotion_escalations':
                return this.getAllEmotionEscalations().slice(0, limit);
            case 'similar_case_matches':
                return this.getAllSimilarCaseMatches().slice(0, limit);
            case 'strategy_recommendations':
                return this.getAllStrategyRecommendations().slice(0, limit);
            case 'reports':
                return this.getAllReports().slice(0, limit);
            case 'audit_logs':
                return this.getAllAuditLogs().slice(0, limit);
            default:
                return [];
        }
    }
}

// Singleton instance
export const db = new DBStore();
