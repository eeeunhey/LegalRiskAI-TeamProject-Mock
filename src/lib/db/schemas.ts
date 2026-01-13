import { TableSchema } from '@/types';

// 한국어 설명이 포함된 모든 테이블 스키마 정의
export const schemas: Record<string, TableSchema> = {
    users: {
        tableName: 'users',
        columns: [
            { name: 'user_id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, description: '사용자 고유 식별자' },
            { name: 'email', type: 'VARCHAR(255)', isPrimaryKey: false, isForeignKey: false, description: '로그인 이메일 주소' },
            { name: 'name', type: 'VARCHAR(80)', isPrimaryKey: false, isForeignKey: false, description: '사용자 이름' },
            { name: 'role', type: 'VARCHAR(30)', isPrimaryKey: false, isForeignKey: false, description: '권한 (admin/user)' },
            { name: 'created_at', type: 'TIMESTAMPTZ', isPrimaryKey: false, isForeignKey: false, description: '계정 생성일시' },
        ],
    },
    cases: {
        tableName: 'cases',
        columns: [
            { name: 'case_id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, description: '사건 고유 식별자' },
            { name: 'user_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, references: 'users.user_id', description: '작성자 ID' },
            { name: 'title', type: 'VARCHAR(200)', isPrimaryKey: false, isForeignKey: false, description: '사건 제목' },
            { name: 'raw_text', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, description: '입력 원문 텍스트' },
            { name: 'domain_hint', type: 'VARCHAR(50)', isPrimaryKey: false, isForeignKey: false, description: '분야 힌트 (consumer/contract/admin)' },
            { name: 'created_at', type: 'TIMESTAMPTZ', isPrimaryKey: false, isForeignKey: false, description: '사건 생성일시' },
        ],
    },
    analysis_runs: {
        tableName: 'analysis_runs',
        columns: [
            { name: 'run_id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, description: 'AI 실행 고유 식별자' },
            { name: 'case_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, references: 'cases.case_id', description: '관련 사건 ID' },
            { name: 'analysis_type', type: 'VARCHAR(50)', isPrimaryKey: false, isForeignKey: false, description: '분석 유형 (CLASSIFY/RISK/EMOTION/SIMILAR/STRATEGY)' },
            { name: 'model_name', type: 'VARCHAR(80)', isPrimaryKey: false, isForeignKey: false, description: '사용된 AI 모델명' },
            { name: 'status', type: 'VARCHAR(20)', isPrimaryKey: false, isForeignKey: false, description: '실행 상태 (success/fail/running)' },
            { name: 'started_at', type: 'TIMESTAMPTZ', isPrimaryKey: false, isForeignKey: false, description: '실행 시작 시간' },
            { name: 'finished_at', type: 'TIMESTAMPTZ', isPrimaryKey: false, isForeignKey: false, description: '실행 완료 시간' },
            { name: 'latency_ms', type: 'INT', isPrimaryKey: false, isForeignKey: false, description: '처리 소요시간 (밀리초)' },
            { name: 'input_hash', type: 'VARCHAR(64)', isPrimaryKey: false, isForeignKey: false, description: '입력 텍스트 해시 (중복 방지용)' },
        ],
    },
    dispute_classifications: {
        tableName: 'dispute_classifications',
        columns: [
            { name: 'run_id', type: 'UUID', isPrimaryKey: true, isForeignKey: true, references: 'analysis_runs.run_id', description: '분석 실행 ID (1:1 관계)' },
            { name: 'top_label', type: 'VARCHAR(50)', isPrimaryKey: false, isForeignKey: false, description: '최상위 분류 라벨' },
            { name: 'scores_json', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: '분류별 점수 (막대그래프용)' },
            { name: 'keywords_json', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: '추출된 키워드 목록' },
            { name: 'explanation', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, description: '분류 결과 설명' },
        ],
    },
    legal_risk_predictions: {
        tableName: 'legal_risk_predictions',
        columns: [
            { name: 'run_id', type: 'UUID', isPrimaryKey: true, isForeignKey: true, references: 'analysis_runs.run_id', description: '분석 실행 ID (1:1 관계)' },
            { name: 'risk_score', type: 'INT', isPrimaryKey: false, isForeignKey: false, description: '법적 위험도 점수 (0-100)' },
            { name: 'win_probability', type: 'INT', isPrimaryKey: false, isForeignKey: false, description: '승소 가능성 (0-100%)' },
            { name: 'risk_level', type: 'VARCHAR(20)', isPrimaryKey: false, isForeignKey: false, description: '위험 등급 (low/medium/high)' },
            { name: 'risk_factors_json', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: '핵심 리스크 요인 목록' },
            { name: 'notes', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, description: '분석 관련 주의사항' },
        ],
    },
    emotion_escalations: {
        tableName: 'emotion_escalations',
        columns: [
            { name: 'run_id', type: 'UUID', isPrimaryKey: true, isForeignKey: true, references: 'analysis_runs.run_id', description: '분석 실행 ID (1:1 관계)' },
            { name: 'stage', type: 'VARCHAR(30)', isPrimaryKey: false, isForeignKey: false, description: '현재 감정 단계' },
            { name: 'aggression_score', type: 'INT', isPrimaryKey: false, isForeignKey: false, description: '공격성 지수 (0-100)' },
            { name: 'escalation_speed', type: 'VARCHAR(20)', isPrimaryKey: false, isForeignKey: false, description: '심화 속도 (slow/normal/fast)' },
            { name: 'trend_json', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: '시계열 트렌드 데이터' },
            { name: 'emotion_keywords_json', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: '감정 키워드 목록' },
        ],
    },
    similar_case_matches: {
        tableName: 'similar_case_matches',
        columns: [
            { name: 'run_id', type: 'UUID', isPrimaryKey: true, isForeignKey: true, references: 'analysis_runs.run_id', description: '분석 실행 ID (1:1 관계)' },
            { name: 'issue_compare_json', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: '핵심 쟁점 비교 표' },
            { name: 'top_matches_json', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: 'Top 3 유사 판례 데이터' },
        ],
    },
    strategy_recommendations: {
        tableName: 'strategy_recommendations',
        columns: [
            { name: 'run_id', type: 'UUID', isPrimaryKey: true, isForeignKey: true, references: 'analysis_runs.run_id', description: '분석 실행 ID (1:1 관계)' },
            { name: 'expected_win_probability', type: 'INT', isPrimaryKey: false, isForeignKey: false, description: '예상 승소 확률 (0-100%)' },
            { name: 'summary_json', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: '전략 요약 정보' },
            { name: 'scenarios_json', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: '추천 시나리오 목록' },
            { name: 'disclaimer', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, description: '면책 조항' },
        ],
    },
    reports: {
        tableName: 'reports',
        columns: [
            { name: 'report_id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, description: '리포트 고유 식별자' },
            { name: 'case_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, references: 'cases.case_id', description: '관련 사건 ID' },
            { name: 'included_run_ids', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: '포함된 분석 실행 ID 목록' },
            { name: 'report_status', type: 'VARCHAR(20)', isPrimaryKey: false, isForeignKey: false, description: '리포트 상태 (draft/final)' },
            { name: 'pdf_url', type: 'TEXT', isPrimaryKey: false, isForeignKey: false, description: 'PDF 다운로드 URL' },
            { name: 'created_at', type: 'TIMESTAMPTZ', isPrimaryKey: false, isForeignKey: false, description: '리포트 생성일시' },
        ],
    },
    audit_logs: {
        tableName: 'audit_logs',
        columns: [
            { name: 'log_id', type: 'UUID', isPrimaryKey: true, isForeignKey: false, description: '로그 고유 식별자' },
            { name: 'user_id', type: 'UUID', isPrimaryKey: false, isForeignKey: true, references: 'users.user_id', description: '사용자 ID' },
            { name: 'action', type: 'VARCHAR(80)', isPrimaryKey: false, isForeignKey: false, description: '수행한 액션 (VIEW_RESULT/EXPORT_CSV 등)' },
            { name: 'target_id', type: 'UUID', isPrimaryKey: false, isForeignKey: false, description: '대상 엔티티 ID (case/run/report)' },
            { name: 'meta_json', type: 'JSONB', isPrimaryKey: false, isForeignKey: false, description: '부가 메타데이터' },
            { name: 'created_at', type: 'TIMESTAMPTZ', isPrimaryKey: false, isForeignKey: false, description: '로그 생성일시' },
        ],
    },
};

// 테이블 목록 조회
export const getTableNames = (): string[] => Object.keys(schemas);

// 특정 테이블 스키마 조회
export const getSchema = (tableName: string): TableSchema | undefined => schemas[tableName];

// 여러 테이블 스키마 조회
export const getSchemas = (tableNames: string[]): TableSchema[] =>
    tableNames.map(name => schemas[name]).filter(Boolean);
