'use client';

import { X, BookOpen, Database, Workflow, Code, ArrowRight, Layout, Users, CheckSquare, Plus, Send, Trash2, FlaskConical } from 'lucide-react';
import { useEffect, useState } from 'react';

interface DocsModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName: string;
}

interface UseCase {
    actor: string;
    action: string;
    expected: string;
    flow?: string[]; // 상세 플로우 단계
}

interface TestCase {
    id: string;
    title: string;
    precondition: string;
    testSteps: string[];
    expectedResult: string;
    priority: 'High' | 'Medium' | 'Low';
}

interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    dataDescription?: string; // 반영되는 데이터 설명
    category?: string; // 대분류 카테고리
    isCustom?: boolean;
}

interface RecommendedApi {
    name: string;
    provider: string;
    description: string;
    url: string;
    pricing: string;
}

interface FeatureCategoryInfo {
    definition: string; // 핵심 정의 (What & Why)
    goal: string; // 구현 목표 (Goal)
}

interface FeatureDocData {
    title: string;
    subtitle: string;
    overview: string;
    inputDescription: string;
    outputDescription: string;
    aiModel: string;
    implementationSteps: string[];
    dbTables: { name: string; purpose: string }[];
    dataFlow: string[];
    erdDescription: string;
    wireframe: string;
    useCases: UseCase[];
    checklist: ChecklistItem[];
    categories?: Record<string, FeatureCategoryInfo>; // 카테고리별 상세 정의
    testCases?: TestCase[]; // 테스트 케이스
    recommendedApis?: RecommendedApi[]; // 추천 실제 API
}

export const featureDocumentation: Record<string, FeatureDocData> = {
    classify: {
        title: '분쟁 유형 분류 AI',
        subtitle: 'Dispute Classification AI',
        overview: '입력된 분쟁 텍스트를 분석하여 Consumer, Contract, Administrative 등의 유형으로 자동 분류합니다.',
        inputDescription: '분쟁과 관련된 자유형식 텍스트',
        outputDescription: '분류 레이블, 각 유형별 확률 점수, 핵심 키워드, AI 판단 근거 설명',
        aiModel: 'LegalRisk-CLASSIFY-v1.0 (BERT 기반)',
        implementationSteps: ['텍스트 입력', '전처리', 'AI 모델 분석', '결과 저장', 'UI 표시'],
        dbTables: [{ name: 'cases', purpose: '원본 텍스트 저장' }, { name: 'analysis_runs', purpose: '분석 실행 기록' }, { name: 'dispute_classifications', purpose: '분류 결과' }],
        dataFlow: ['사용자 입력', 'DB 저장', 'AI 분석', '결과 표시'],
        erdDescription: 'cases(1) → analysis_runs(N) → dispute_classifications(1)',
        wireframe: `
┌─────────────────────────────────────────────────────┐
│  분쟁 유형 분류 AI                                    │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │ 텍스트 입력 영역   │  │ 분석 결과 카드           │ │
│  │ [textarea]       │  │ ┌─────────────────────┐  │ │
│  │                  │  │ │ 분류: Consumer      │  │ │
│  │                  │  │ │ 신뢰도: 92%         │  │ │
│  │                  │  │ └─────────────────────┘  │ │
│  │ [샘플 입력 버튼]   │  │ ┌─────────────────────┐  │ │
│  │ [분석 실행 버튼]   │  │ │ Bar Chart 시각화    │  │ │
│  └──────────────────┘  │ └─────────────────────┘  │ │
│                        │ [키워드 태그들]           │ │
│                        └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘`,
        useCases: [
            { actor: '법률 담당자', action: '분쟁 문서를 입력하고 분석 실행', expected: '분쟁 유형이 자동 분류되어 표시됨' },
            { actor: '일반 사용자', action: '샘플 텍스트 버튼 클릭', expected: '예시 텍스트가 자동 입력됨' },
            { actor: '관리자', action: 'DB 테이블 보기 클릭', expected: '저장된 분석 결과 테이블 확인' },
        ],
        checklist: [
            // 입력 인터페이스
            { category: '입력 인터페이스', id: 'clf-1-1', title: '텍스트 입력 Textarea 렌더링', description: '사용자가 분쟁 내용을 입력할 수 있는 textarea 요소를 화면에 렌더링한다. 최소 높이 200px, placeholder 텍스트 포함.' },
            { category: '입력 인터페이스', id: 'clf-1-2', title: '입력 글자수 실시간 카운트', description: 'textarea 하단에 현재 입력된 글자수를 실시간으로 표시한다. (예: "152자")' },
            { category: '입력 인터페이스', id: 'clf-1-3', title: '최소 글자수 유효성 검사', description: '분석 실행 시 입력 텍스트가 30자 미만이면 Toast 경고를 표시하고 분석을 중단한다.' },
            { category: '입력 인터페이스', id: 'clf-2-1', title: '샘플 텍스트 자동 입력 버튼', description: '"샘플 텍스트 입력" 버튼 클릭 시 미리 정의된 예시 분쟁 텍스트를 textarea에 자동 입력한다.' },

            // 분석 요청
            { category: '분석 요청', id: 'clf-3-1', title: '분석 실행 버튼 UI', description: '"유형 분석 실행" 버튼을 그라데이션 스타일로 렌더링한다. 비활성화 상태 스타일 포함.' },
            { category: '분석 요청', id: 'clf-3-2', title: '분석 중 로딩 스피너 표시', description: '분석 실행 중 버튼 내부에 회전하는 로딩 스피너와 "분석 중..." 텍스트를 표시한다.' },
            { category: '분석 요청', id: 'clf-3-3', title: 'Mock API 호출 및 응답 파싱', description: '/mock/classify.json 파일을 fetch하여 분류 결과 데이터를 파싱한다.' },

            // 결과 시각화
            { category: '결과 시각화', id: 'clf-4-1', title: '분류 결과 카드 렌더링', description: '분석 완료 후 상단에 최상위 분류 레이블(예: Consumer)을 강조 표시하는 결과 카드를 렌더링한다.' },
            { category: '결과 시각화', id: 'clf-4-2', title: 'Bar Chart로 분류 점수 시각화', description: '각 분류 유형별 확률 점수를 수평 Bar Chart로 시각화한다. 가장 높은 점수 막대는 강조 색상.' },
            { category: '결과 시각화', id: 'clf-4-3', title: '키워드 태그 그룹 렌더링', description: 'AI가 추출한 핵심 키워드를 Chip/Tag 형태로 나열한다. 클릭 가능한 스타일.' },
            { category: '결과 시각화', id: 'clf-4-4', title: 'AI 판단 근거 설명 표시', description: '분류 결과에 대한 AI의 설명 텍스트를 박스 형태로 표시한다.' },

            // 데이터 처리
            {
                category: '데이터 처리',
                id: 'clf-5-1',
                title: 'In-Memory DB에 분석 결과 저장',
                description: '분석된 분류 데이터를 "classification_results" 테이블에 저장합니다. 이 데이터는 사용자 대시보드에서 "분야별 상담 통계"를 집계하는 데 사용됩니다.',
                dataDescription: 'Schema: { analysis_id: string, category: "Civil" | "Criminal", confidence: 0.95, keywords: ["contract", "breach"] }'
            },
            {
                category: '데이터 처리',
                id: 'clf-5-2',
                title: 'Analysis Run 상태 업데이트',
                description: '비동기 분석 작업의 Lifecycle 관리입니다. 분석이 완료되면 상태를 "completed"로 변경하여 UI상의 로딩 상태를 해제하고 결과 화면으로 전환하는 트리거 역할을 합니다.',
                dataDescription: 'Target: analysis_runs 테이블, Field: status ("pending" -> "success"), completed_at (timestamp)'
            },
            {
                category: '데이터 처리',
                id: 'clf-5-3',
                title: 'Audit Log 기록',
                description: '사용자의 중요 활동(결과 조회)을 보안 감사 로그로 남깁니다. 추후 과금 근거 데이터나 시스템 오용 모니터링 자료로 활용됩니다.',
                dataDescription: 'Audit Format: [TIMESTAMP] [USER_ID] ACTION:VIEW_RESULT TARGET:ANALYSIS_ID'
            },
        ],
        categories: {
            '입력 인터페이스': {
                definition: '사용자로부터 분석할 분쟁 데이터를 입력받고 기본적인 유효성을 검증하는 단계입니다.',
                goal: '최소한의 입력 노력으로 분석에 필요한 양질의 텍스트 데이터를 확보하는 것'
            },
            '분석 요청': {
                definition: '확보된 데이터를 AI 모델(Mock Server)로 전송하고 처리 상태를 관리하는 통신 모듈입니다.',
                goal: '사용자에게 명확한 진행 상태 피드백을 제공하여 대기 경험 최적화'
            },
            '결과 시각화': {
                definition: 'AI 모델의 확률적 분석 결과를 사용자가 이해하기 쉬운 차트와 텍스트로 변환하여 보여줍니다.',
                goal: '단순한 텍스트 분류를 넘어, 왜 그렇게 분류되었는지에 대한 설명력(Explainability) 제공'
            },
            '데이터 처리': {
                definition: '분석 세션의 결과 데이터를 정규화된 스키마로 변환하여 저장하고, 트랜잭션 상태를 관리하는 백엔드 로직입니다.',
                goal: '후행 개발자가 데이터 파이프라인(집계, 과금, 감사)을 구축할 때 명확한 데이터 규격을 참고할 수 있도록 스키마와 저장 목적을 명시'
            }
        },
        testCases: [
            {
                id: 'tc-clf-1',
                title: '분쟁 텍스트 입력 및 분류 분석 실행',
                precondition: '분쟁 유형 분류 페이지에 접속한 상태',
                testSteps: [
                    '1. textarea에 30자 이상의 분쟁 상황 텍스트 입력',
                    '2. "유형 분석 실행" 버튼 클릭',
                    '3. 로딩 스피너 표시 확인',
                    '4. 분류 결과 카드 렌더링 확인'
                ],
                expectedResult: '분류 레이블(Consumer/Contract 등)과 확률 점수가 표시됨',
                priority: 'High'
            },
            {
                id: 'tc-clf-2',
                title: '샘플 텍스트 자동 입력',
                precondition: '분쟁 유형 분류 페이지에 접속한 상태',
                testSteps: [
                    '1. "샘플 텍스트 입력" 버튼 클릭',
                    '2. textarea에 예시 텍스트가 입력되는지 확인'
                ],
                expectedResult: '미리 정의된 샘플 분쟁 텍스트가 textarea에 자동 입력됨',
                priority: 'Medium'
            },
            {
                id: 'tc-clf-3',
                title: '최소 글자수 미만 입력 시 경고',
                precondition: '분쟁 유형 분류 페이지에 접속한 상태',
                testSteps: [
                    '1. textarea에 20자 미만의 짧은 텍스트 입력',
                    '2. "유형 분석 실행" 버튼 클릭'
                ],
                expectedResult: '토스트 경고 메시지 표시, 분석 실행되지 않음',
                priority: 'High'
            },
            {
                id: 'tc-clf-4',
                title: 'Bar Chart 분류 점수 시각화',
                precondition: '분석 완료 후 결과가 표시된 상태',
                testSteps: [
                    '1. 분류 결과 카드에서 Bar Chart 확인',
                    '2. 각 유형별 확률이 막대로 표시되는지 확인',
                    '3. 최고 점수 막대가 강조되어 있는지 확인'
                ],
                expectedResult: '각 분류 유형의 확률이 수평 막대로 표시, 최고 점수 강조',
                priority: 'Medium'
            },
            {
                id: 'tc-clf-5',
                title: '키워드 태그 표시',
                precondition: '분석 완료 후 결과가 표시된 상태',
                testSteps: [
                    '1. 키워드 태그 영역 확인',
                    '2. AI가 추출한 키워드들이 Chip 형태로 표시되는지 확인'
                ],
                expectedResult: '핵심 키워드가 태그 형태로 나열됨',
                priority: 'Low'
            },
        ],
        recommendedApis: [
            {
                name: 'OpenAI GPT-4 API',
                provider: 'OpenAI',
                description: '자연어 처리 및 텍스트 분류에 최적화된 LLM. 법률 문서 분류, 카테고리 판단, 키워드 추출에 활용 가능.',
                url: 'https://platform.openai.com/docs/api-reference',
                pricing: '사용량 기반 (GPT-4: $0.03/1K tokens 입력)'
            },
            {
                name: 'Google Cloud Natural Language API',
                provider: 'Google Cloud',
                description: '텍스트 분류, 감정 분석, 엔티티 추출 기능 제공. 법률 문서 분류에 커스텀 분류기 학습 가능.',
                url: 'https://cloud.google.com/natural-language',
                pricing: '월 5,000건 무료, 이후 $1/1,000건'
            }
        ],
    },
    risk: {
        title: '법적 위험도 예측 AI',
        subtitle: 'Legal Risk Prediction AI',
        overview: '분쟁 텍스트 내 법적 표현의 강도를 분석하여 리스크 점수와 승소 가능성을 산출합니다.',
        inputDescription: '경고 서신, 통보문, 분쟁 관련 문서',
        outputDescription: '리스크 점수(0-100), 리스크 레벨, 예상 승소확률, 리스크 요인',
        aiModel: 'LegalRisk-RISK-v1.0',
        implementationSteps: ['텍스트 분석', '위협 수준 계산', '승소율 예측', '결과 저장'],
        dbTables: [{ name: 'legal_risk_predictions', purpose: '위험도 결과 저장' }],
        dataFlow: ['텍스트 입력', 'AI 분석', '결과 표시'],
        erdDescription: 'analysis_runs(1) → legal_risk_predictions(1)',
        wireframe: `
┌─────────────────────────────────────────────────────┐
│  법적 위험도 예측 AI                                  │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │ 텍스트 입력 영역   │  │ ┌─────────────────────┐  │ │
│  │ [textarea]       │  │ │ Gauge Chart         │  │ │
│  │                  │  │ │    88/100 HIGH      │  │ │
│  │                  │  │ └─────────────────────┘  │ │
│  │                  │  │ ┌─────────────────────┐  │ │
│  │ [분석 실행 버튼]   │  │ │ 승소 확률: 85%      │  │ │
│  └──────────────────┘  │ │ [Progress Bar]      │  │ │
│                        │ └─────────────────────┘  │ │
│                        │ [리스크 요인 목록]        │ │
│                        └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘`,
        useCases: [
            { actor: '법률 담당자', action: '경고 서신 내용 입력 후 분석', expected: '위험도 점수 및 승소 확률 표시' },
            { actor: '사용자', action: '리스크 요인 항목 클릭', expected: '상세 설명 펼쳐짐' },
        ],
        checklist: [
            // 입력 인터페이스
            { category: '입력 인터페이스', id: 'risk-1-1', title: '텍스트 입력 Textarea 렌더링', description: '경고 서신/통보문 내용을 입력받을 textarea 요소를 렌더링한다.' },
            { category: '입력 인터페이스', id: 'risk-1-2', title: '입력 글자수 실시간 표시', description: '현재 입력된 글자수를 textarea 하단에 표시한다.' },

            // 시각화 및 결과
            { category: '시각화 및 결과', id: 'risk-2-1', title: 'Gauge Chart 컴포넌트 렌더링', description: '리스크 점수(0-100)를 반원형 게이지 차트로 시각화한다. 색상은 점수에 따라 변경.' },
            { category: '시각화 및 결과', id: 'risk-2-2', title: '리스크 레벨 배지 표시', description: 'HIGH/MEDIUM/LOW 레벨을 색상별 배지로 표시한다. (빨강/노랑/초록)' },
            { category: '시각화 및 결과', id: 'risk-3-1', title: '승소 확률 Progress Bar 렌더링', description: '예상 승소 확률을 수평 Progress Bar로 시각화한다. 퍼센트 값 표시.' },
            { category: '시각화 및 결과', id: 'risk-4-1', title: '리스크 요인 목록 렌더링', description: '분석된 리스크 요인들을 목록 형태로 표시한다. 각 항목에 아이콘 포함.' },
            { category: '시각화 및 결과', id: 'risk-4-2', title: '리스크 요인 클릭 시 상세 설명 토글', description: '리스크 요인 항목 클릭 시 해당 항목의 상세 설명을 펼치거나 접는다.' },

            // 데이터 처리
            {
                category: '데이터 처리',
                id: 'risk-5-1',
                title: 'Mock API 호출 (/mock/risk.json)',
                description: 'REST API를 통해 리스크 분석 모델 서버에 텍스트를 전송하고 결과를 수신합니다. 응답 시간 최적화를 위해 비동기 처리하며, 타임아웃 예외 처리가 필수적입니다.',
                dataDescription: 'Request: { text: string } -> Response: { riskScore: number, riskFactors: [{factor: string, description: string}] }'
            },
            {
                category: '데이터 처리',
                id: 'risk-5-2',
                title: '분석 결과 DB 저장',
                description: '산출된 리스크 점수와 상세 요인을 "legal_risk_predictions" 테이블에 저장합니다. 이 데이터는 추후 사용자의 리스크 변화 추이 그래프를 그리는 데 활용됩니다.',
                dataDescription: 'Schema: { analysis_id: string, risk_score: 85, risk_level: "HIGH", factors_json: "[...]" }'
            },
            {
                category: '데이터 처리',
                id: 'risk-6-1',
                title: '참고 안내 메시지 표시',
                description: '법적 효력에 대한 오인을 방지하기 위해 면책 조항(Disclaimer) 데이터를 UI 하단에 동적으로 로드하여 표시합니다.',
                dataDescription: 'Static Data or Config: { disclamier_text_kr: "본 결과는..." }'
            },
        ],
        categories: {
            '입력 인터페이스': {
                definition: '법적 위험도를 측정할 대상 텍스트(계약서, 내용증명 등)를 수집하는 단계입니다.',
                goal: '법률 문서의 특수성을 고려한 안정적인 텍스트 입력 환경 제공'
            },
            '시각화 및 결과': {
                definition: '추상적인 "위험"의 개념을 게이지, 레벨, 확률 등 구체적인 수치와 시각적 지표로 변환합니다.',
                goal: '사용자가 직관적으로 사안의 심각성을 인지하고 신속하게 대응 수위를 결정하도록 지원'
            },
            '데이터 처리': {
                definition: '분석된 리스크 정량 지표와 진단 근거를 데이터베이스에 구조화하여 저장하고, 법적 고지사항을 관리합니다.',
                goal: '단순 결과 저장을 넘어, 리스크 변화 이력 추적(History Tracking) 기능 구현을 위한 시계열 데이터 기반 마련'
            }
        },
        testCases: [
            {
                id: 'tc-risk-1',
                title: '위험도 분석 실행',
                precondition: '법적 위험도 예측 페이지에 접속한 상태',
                testSteps: [
                    '1. textarea에 경고 서신 내용 입력',
                    '2. "위험도 분석" 버튼 클릭',
                    '3. 로딩 상태 확인',
                    '4. 결과 표시 확인'
                ],
                expectedResult: 'Gauge Chart에 리스크 점수(0-100)와 레벨(HIGH/MEDIUM/LOW) 표시',
                priority: 'High'
            },
            {
                id: 'tc-risk-2',
                title: 'Gauge Chart 색상 변경',
                precondition: '분석 완료 후 결과가 표시된 상태',
                testSteps: [
                    '1. Gauge Chart 색상 확인',
                    '2. 점수가 70 이상이면 빨간색 확인',
                    '3. 점수가 40-69면 노란색 확인'
                ],
                expectedResult: '점수에 따라 게이지 색상이 적절히 변경됨',
                priority: 'Medium'
            },
            {
                id: 'tc-risk-3',
                title: '리스크 요인 상세 보기',
                precondition: '분석 완료 후 리스크 요인이 표시된 상태',
                testSteps: [
                    '1. 리스크 요인 항목 클릭',
                    '2. 상세 설명이 펼쳐지는지 확인',
                    '3. 다시 클릭하여 접기'
                ],
                expectedResult: '클릭 시 상세 설명 토글 동작',
                priority: 'Medium'
            },
            {
                id: 'tc-risk-4',
                title: '승소 확률 Progress Bar',
                precondition: '분석 완료 후 결과가 표시된 상태',
                testSteps: [
                    '1. 승소 확률 영역 확인',
                    '2. Progress Bar가 퍼센트에 맞게 채워져 있는지 확인'
                ],
                expectedResult: '승소 확률이 수평 Progress Bar로 시각화됨',
                priority: 'Low'
            },
        ],
        recommendedApis: [
            {
                name: 'LexisNexis Legal Analytics API',
                provider: 'LexisNexis',
                description: '법률 문서 분석, 판례 검색, 법적 리스크 평가 전문 서비스. 승소 확률 예측 모델 제공.',
                url: 'https://www.lexisnexis.com/en-us/products/lexis-analytics.page',
                pricing: '기업 맞춤 견적 (월 구독형)'
            },
            {
                name: 'IBM Watson Discovery',
                provider: 'IBM',
                description: 'AI 기반 문서 분석 및 인사이트 추출. 법률 문서에서 리스크 요인 자동 추출 가능.',
                url: 'https://www.ibm.com/products/watson-discovery',
                pricing: 'Lite 무료, Plus $500/월'
            }
        ],
    },
    emotion: {
        title: '감정 격화 단계 분석 AI',
        subtitle: 'Emotion Escalation Analysis AI',
        overview: '분쟁 당사자의 커뮤니케이션에서 감정 상태와 격화 단계를 진단합니다.',
        inputDescription: '대화 내용, 이메일, 문자 메시지',
        outputDescription: '갈등 단계, 공격성 지수, 격화 속도, 감정 키워드',
        aiModel: 'LegalRisk-EMOTION-v1.0',
        implementationSteps: ['감정 분석', '추이 계산', '단계 판정', '결과 저장'],
        dbTables: [{ name: 'emotion_escalations', purpose: '감정 분석 결과' }],
        dataFlow: ['텍스트 입력', 'AI 분석', '결과 표시'],
        erdDescription: 'analysis_runs(1) → emotion_escalations(1)',
        wireframe: `
┌─────────────────────────────────────────────────────┐
│  감정 격화 단계 분석 AI                               │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │ 텍스트 입력 영역   │  │ 현재 단계: 위협 및 압박   │ │
│  │ [textarea]       │  │ ┌─────────────────────┐  │ │
│  │ (강조 텍스트 표시) │  │ │ Line Chart 추이     │  │ │
│  │                  │  │ │ T-3 → T-2 → T-1 → T0│  │ │
│  │ [분석 실행 버튼]   │  │ └─────────────────────┘  │ │
│  └──────────────────┘  │ 공격성 지수: 88          │ │
│                        │ [감정 키워드 태그들]       │ │
│                        └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘`,
        useCases: [
            { actor: '조정 담당자', action: '대화 내용 입력 후 분석', expected: '감정 격화 단계 및 추이 확인' },
            { actor: '사용자', action: '텍스트 내 키워드 확인', expected: '감정 키워드가 하이라이트됨' },
        ],
        checklist: [
            // 감정 데이터 입력
            { category: '감정 데이터 입력', id: 'emo-1-1', title: '텍스트 입력 Textarea 렌더링', description: '메시지/이메일 내용을 입력받을 textarea를 렌더링한다.' },
            { category: '감정 데이터 입력', id: 'emo-1-2', title: '입력 글자수 실시간 표시', description: '현재 입력된 글자수를 textarea 하단에 표시한다.' },

            // 감정 추이 시각화
            { category: '감정 추이 시각화', id: 'emo-2-1', title: 'Line Chart 컴포넌트 렌더링', description: '시간 흐름에 따른 감정 격화 추이를 Line Chart로 시각화한다. X축: 시간(T-3~T0), Y축: 격화 지수.' },
            { category: '감정 추이 시각화', id: 'emo-2-2', title: '상승/하락 추세 아이콘 표시', description: '전 단계 대비 감정 격화 속도가 상승했는지 하락했는지 화살표 아이콘으로 표시.' },

            // 지표 심층 분석
            { category: '지표 심층 분석', id: 'emo-3-1', title: 'Radar Chart 컴포넌트 렌더링', description: '공격성, 불안, 방어성 등 세부 감정 지표를 Radar Chart로 시각화한다.' },
            { category: '지표 심층 분석', id: 'emo-3-2', title: '현재 갈등 단계 배지 표시', description: '현재 분석된 갈등 심각도 단계를 시각적 배지로 표시한다.' },
            { category: '지표 심층 분석', id: 'emo-4-1', title: '감정 키워드 목록 렌더링', description: '텍스트에서 감지된 주요 감정 키워들를 추출하여 나열한다.' },

            // 데이터 처리
            {
                category: '데이터 처리',
                id: 'emo-5-1',
                title: 'Mock API 호출 (/mock/emotion.json)',
                description: '시간 역순으로 정렬된 감정 추이 데이터를 요청하여 가져옵니다. 각 시점 데이터는 텍스트 입력의 변화에 따른 감정 격화 과정을 추적하는 데 필수적입니다.',
                dataDescription: 'Response: { timeline: [{t: -3, score: 30}, {t: 0, score: 88, state: "Threat"}], radarData: {aggression: 90, anxiety: 40} }'
            },
            {
                category: '데이터 처리',
                id: 'emo-5-2',
                title: '분석 결과 DB 저장',
                description: '감정 상태 스냅샷과 시계열 변화 데이터를 "emotion_escalations" 테이블에 JSONB 컬럼으로 저장합니다. 복잡한 지표 데이터를 유연하게 저장하기 위해 NoSQL 형태의 저장 방식을 채택합니다.',
                dataDescription: 'Schema: { analysis_id: string, current_stage: "Explosion", timeline_json: "[...]", radar_metrics_json: "{...}" }'
            },
        ],
        categories: {
            '감정 데이터 입력': {
                definition: '상대방과의 대화, 이메일, 문자 메시지 등 감정 상태가 반영된 텍스트 데이터를 입력받는 단계입니다.',
                goal: '객관적인 감정 분석을 위한 원문 데이터를 충실히 확보'
            },
            '감정 추이 시각화': {
                definition: '단발적인 감정이 아닌, 시간의 흐름에 따라 변화하는 감정의 기류를 시계열 그래프로 보여줍니다.',
                goal: '갈등이 진정 국면인지 악화 일로인지 흐름을 파악하여 적절한 개입(Intervention) 타이밍 포착'
            },
            '지표 심층 분석': {
                definition: '분노, 불안, 혐오 등 복합적인 감정의 스펙트럼을 세부적으로 분해하여 다각도로 진단합니다.',
                goal: '단순히 "화났다"를 넘어 구체적으로 어떤 감정이 지배적인지 파악하여 맞춤형 대응 전략 수립'
            },
            '데이터 처리': {
                definition: '다차원적인 감정 분석 결과(시계열, 레이더 차트)를 효율적으로 저장하고 이력을 관리하는 데이터 파이프라인입니다.',
                goal: '정형화하기 어려운 감정 데이터의 특성을 고려하여, 추후 심층 분석이 가능하도록 원본 데이터(Raw Data)와 분석 지표를 모두 보존'
            }
        },
        testCases: [
            {
                id: 'tc-emo-1',
                title: '감정 격화 분석 실행',
                precondition: '감정 격화 단계 분석 페이지에 접속한 상태',
                testSteps: [
                    '1. textarea에 대화 내용/이메일/문자 입력',
                    '2. "감정 분석" 버튼 클릭',
                    '3. 로딩 상태 확인',
                    '4. 결과 카드 렌더링 확인'
                ],
                expectedResult: '감정 단계, 공격성 지수, 격화 속도가 표시됨',
                priority: 'High'
            },
            {
                id: 'tc-emo-2',
                title: '감정 키워드 하이라이트',
                precondition: '분석 완료 후 결과가 표시된 상태',
                testSteps: [
                    '1. 입력 텍스트 영역 확인',
                    '2. 감정 키워드가 색상으로 강조되어 있는지 확인'
                ],
                expectedResult: '감정 관련 키워드가 하이라이트 표시됨',
                priority: 'Medium'
            },
            {
                id: 'tc-emo-3',
                title: 'Line Chart 감정 추이 확인',
                precondition: '분석 완료 후 결과가 표시된 상태',
                testSteps: [
                    '1. Line Chart 영역 확인',
                    '2. T-3 → T-2 → T-1 → T0 시점별 데이터 확인'
                ],
                expectedResult: '시점별 감정 지수 변화가 꺾은선 그래프로 표시됨',
                priority: 'Medium'
            },
            {
                id: 'tc-emo-4',
                title: '격화 속도 아이콘 표시',
                precondition: '분석 완료 후 결과가 표시된 상태',
                testSteps: [
                    '1. 격화 속도 영역 확인',
                    '2. fast/moderate/slow 중 하나가 표시되는지 확인'
                ],
                expectedResult: '격화 속도가 텍스트와 아이콘으로 표시됨',
                priority: 'Low'
            },
        ],
        recommendedApis: [
            {
                name: 'Microsoft Azure Text Analytics (Sentiment)',
                provider: 'Microsoft Azure',
                description: '감정 분석, 의견 마이닝, 키워드 추출 전문 API. 다국어 지원 및 커스텀 모델 학습 가능.',
                url: 'https://azure.microsoft.com/en-us/services/cognitive-services/text-analytics/',
                pricing: 'Free: 5,000건/월, S: $1/1,000건'
            },
            {
                name: 'Amazon Comprehend',
                provider: 'AWS',
                description: 'NLP 서비스로 감정 분석, 엔티티 인식, 토픽 모델링 제공. 법률 문서 감정 분석에 활용 가능.',
                url: 'https://aws.amazon.com/comprehend/',
                pricing: '$0.0001/unit (최소 3 units/요청)'
            }
        ],
    },
    similar: {
        title: '유사 판례 매칭 AI',
        subtitle: 'Similar Case Matching AI',
        overview: '입력된 사건의 핵심 쟁점을 추출하고 유사한 판례를 찾아 비교 분석합니다.',
        inputDescription: '분쟁 사건의 상황 설명',
        outputDescription: '쟁점 비교 테이블, Top 3 유사 판례',
        aiModel: 'LegalRisk-SIMILAR-v1.0',
        implementationSteps: ['쟁점 추출', '유사도 검색', '판례 매칭', '결과 저장'],
        dbTables: [{ name: 'similar_case_matches', purpose: '유사 판례 매칭 결과' }],
        dataFlow: ['텍스트 입력', 'AI 검색', '결과 표시'],
        erdDescription: 'analysis_runs(1) → similar_case_matches(1)',
        wireframe: `
┌─────────────────────────────────────────────────────┐
│  유사 판례 매칭 AI                                   │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │ 텍스트 입력 영역   │  │ 쟁점 비교 테이블         │ │
│  │ [textarea]       │  │ ┌─────────────────────┐  │ │
│  │                  │  │ │ 입력 쟁점 vs 매칭 쟁점│  │ │
│  │                  │  │ └─────────────────────┘  │ │
│  │ [분석 실행 버튼]   │  │ 유사 판례 카드 (3개)     │ │
│  └──────────────────┘  │ [유사도] [요약] [결과]    │ │
│                        │ [판결문 보기] 버튼        │ │
│                        └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘`,
        useCases: [
            { actor: '변호사', action: '사건 상황 입력 후 유사 판례 검색', expected: '유사한 판례 3건 표시' },
            { actor: '사용자', action: '판례 카드 클릭', expected: '상세 정보 모달 표시' },
        ],
        checklist: [
            // 사건 검색
            { category: '사건 검색', id: 'sim-1-1', title: '검색어 입력 Search Bar 렌더링', description: '돋보기 아이콘이 포함된 대형 검색바를 중앙에 배치한다.' },
            { category: '사건 검색', id: 'sim-1-2', title: '최근 검색어/인기 키워드 표시', description: '검색바 하단에 사용자의 최근 검색어와 시스템 인기 급상승 키워드를 렌더링한다.' },

            // 매칭 결과
            { category: '매칭 결과', id: 'sim-2-1', title: '매칭된 판례 목록 카드 리스트', description: '검색 결과로 매칭된 판례들을 카드 리스트 형태로 나열한다. 정확도 순 정렬.' },
            { category: '매칭 결과', id: 'sim-2-2', title: '유사도 퍼센트 배지 표시', description: '각 판례 카드에 AI가 분석한 유사도(예: 88%)를 배지로 표시한다.' },
            { category: '매칭 결과', id: 'sim-3-1', title: '사건번호 및 판례 요약 표시', description: '판례의 사건번호와 핵심 요약 텍스트(3줄 제한)를 카드 내부에 표시한다.' },

            // 상세 비교
            { category: '상세 비교', id: 'sim-3-2', title: '판례 상세 모달/페이지 이동', description: '판례 카드 클릭 시 상세 정보를 볼 수 있는 모달을 띄우거나 페이지로 이동한다.' },
            { category: '상세 비교', id: 'sim-4-1', title: '내 사건 vs 판례 비교 차트', description: '내 사건과 선택된 판례의 주요 속성을 방사형 차트 등으로 비교 시각화한다.' },

            // 데이터 처리
            {
                category: '데이터 처리',
                id: 'sim-5-1',
                title: 'Mock API 호출 (/mock/similar.json)',
                description: '사용자의 자연어 쿼리를 임베딩 벡터로 변환하여 벡터 DB(Mock)에서 유사도가 높은 상위 N개의 판례를 검색합니다.',
                dataDescription: 'Request: { query: string, topK: 3 } -> Response: { cases: [{ id: "2023da1234", title: "...", similarity: 0.88, summary: "..." }] }'
            },
            {
                category: '데이터 처리',
                id: 'sim-5-2',
                title: '검색 이력 DB 저장',
                description: '사용자의 검색 쿼리와 선택한 판례 ID를 "search_histories" 테이블에 기록합니다. 이는 개인화 추천 모델의 학습 데이터(Training Data)로 활용됩니다.',
                dataDescription: 'Schema: { user_id: string, query_text: string, selected_case_id: string, search_timestamp: timestamp }'
            },
        ],
        categories: {
            '사건 검색': {
                definition: '사용자의 구체적인 상황을 가장 잘 설명하는 자연어 쿼리를 통해 방대한 판례 데이터베이스를 탐색합니다.',
                goal: '법률 전문 용어를 모르더라도 일상 언어로 정확하고 신속하게 관련 판례 발견'
            },
            '매칭 결과': {
                definition: '수만 건의 판례 중 AI가 분석한 유사도(Similarity Score)를 기준으로 가장 연관성 높은 사례를 선별하여 제시합니다.',
                goal: '검색 결과의 홍수 속에서 사용자에게 실질적으로 도움이 되는 "진짜 유사 판례" 우선 노출'
            },
            '상세 비교': {
                definition: '나의 사건과 판례 사이의 공통점과 차이점을 구조적으로 대조하여 보여줍니다.',
                goal: '단순 정보 열람을 넘어, 해당 판례가 내 사건에 유리한지 불리한지 판단할 수 있는 근거 제공'
            },
            '데이터 처리': {
                definition: '검색 질의어와 사용자 피드백(클릭 데이터)을 수집하여 검색 품질을 개선하고 추천 알고리즘을 고도화합니다.',
                goal: '단순 로그 저장이 아닌, User interaction 데이터를 통한 검색 엔진의 지속적인 성능 향상(Reinforcement Learning from Human Feedback)'
            }
        },
        testCases: [
            {
                id: 'tc-similar-1',
                title: '유사 판례 검색 실행',
                precondition: '유사 판례 매칭 페이지에 접속한 상태',
                testSteps: [
                    '1. textarea에 사건 상황 입력',
                    '2. "유사 판례 검색" 버튼 클릭',
                    '3. 로딩 상태 확인',
                    '4. 판례 카드 3개 표시 확인'
                ],
                expectedResult: 'Top 3 유사 판례가 카드 형태로 표시됨',
                priority: 'High'
            },
            {
                id: 'tc-similar-2',
                title: '쟁점 비교 테이블 표시',
                precondition: '분석 완료 후 결과가 표시된 상태',
                testSteps: [
                    '1. 쟁점 비교 테이블 영역 확인',
                    '2. 입력 쟁점과 매칭 쟁점이 2열로 표시되는지 확인'
                ],
                expectedResult: '입력 쟁점 vs 매칭 쟁점 비교 테이블 표시',
                priority: 'High'
            },
            {
                id: 'tc-similar-3',
                title: '판례 상세 모달 열기',
                precondition: '유사 판례 카드가 표시된 상태',
                testSteps: [
                    '1. 판례 카드 클릭',
                    '2. 모달 열림 확인',
                    '3. 상세 정보 표시 확인'
                ],
                expectedResult: '판례 상세 정보 모달 표시',
                priority: 'Medium'
            },
            {
                id: 'tc-similar-4',
                title: '유사도 배지 색상 확인',
                precondition: '유사 판례 카드가 표시된 상태',
                testSteps: [
                    '1. 각 판례의 유사도 배지 확인',
                    '2. 유사도에 따른 색상 구분 확인'
                ],
                expectedResult: '높은 유사도는 초록색, 낮은 유사도는 회색 배지',
                priority: 'Low'
            },
        ],
        recommendedApis: [
            {
                name: '대법원 판례검색 Open API',
                provider: '대한민국 법원',
                description: '대법원 판례, 하급심 판결문 검색 API. 사건번호, 당사자, 키워드 기반 검색 제공.',
                url: 'https://www.law.go.kr/LSO/openApi.do',
                pricing: '무료 (공공 API)'
            },
            {
                name: 'Pinecone Vector DB + OpenAI Embeddings',
                provider: 'Pinecone / OpenAI',
                description: '법률 문서를 벡터화하여 의미 기반 유사도 검색. 판례간 유사도 계산에 최적.',
                url: 'https://www.pinecone.io/',
                pricing: 'Starter 무료, Standard $70/월'
            }
        ],
    },
    strategy: {
        title: '조기 종재 전략 추천 AI',
        subtitle: 'Early Resolution Strategy AI',
        overview: '분쟁 상황을 분석하여 조기 해결을 위한 최적의 전략을 추천합니다.',
        inputDescription: '분쟁 상황, 관계, 해결 방향',
        outputDescription: '예상 승소 확률, 전략 요약, 추천 시나리오',
        aiModel: 'LegalRisk-STRATEGY-v1.0',
        implementationSteps: ['상황 분석', '경로 탐색', '시나리오 생성', '결과 저장'],
        dbTables: [{ name: 'strategy_recommendations', purpose: '전략 추천 결과' }],
        dataFlow: ['텍스트 입력', 'AI 분석', '결과 표시'],
        erdDescription: 'analysis_runs(1) → strategy_recommendations(1)',
        wireframe: `
┌─────────────────────────────────────────────────────┐
│  조기 종재 전략 추천 AI                               │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │ 텍스트 입력 영역   │  │ 예상 승소율: 85%        │ │
│  │ [textarea]       │  │ ┌─────────────────────┐  │ │
│  │                  │  │ │ 전략 요약 카드       │  │ │
│  │                  │  │ │ - Key Takeaway      │  │ │
│  │ [분석 실행 버튼]   │  │ │ - Focus Points     │  │ │
│  └──────────────────┘  │ └─────────────────────┘  │ │
│                        │ 추천 시나리오 (3개)       │ │
│                        │ [난이도] [효과] [설명]    │ │
│                        └──────────────────────────┘ │
└─────────────────────────────────────────────────────┘`,
        useCases: [
            { actor: '법률 담당자', action: '분쟁 상황 입력 후 전략 분석', expected: '최적 전략 시나리오 표시' },
            { actor: '사용자', action: '시나리오 카드 선택', expected: '상세 액션 아이템 표시' },
        ],
        checklist: [
            // 사건 정보 수집
            { category: '사건 정보 수집', id: 'strat-1-1', title: '분쟁 정보 입력 Form 렌더링', description: '상대방과의 관계(가족/직장 등), 분쟁 유형, 원하는 해결 방향을 입력받는 폼을 제공한다.' },
            { category: '사건 정보 수집', id: 'strat-1-2', title: '해결 방향 선택 라디오 버튼', description: '원만 해결/강경 대응/법적 조치 중 선호하는 전략 방향을 선택하게 한다.' },

            // AI 전략 수립
            { category: 'AI 전략 수립', id: 'strat-2-1', title: '전략 요약 카드 렌더링', description: 'AI가 제안하는 핵심 전략을 3줄 요약하여 카드 형태로 표시한다.' },
            { category: 'AI 전략 수립', id: 'strat-2-2', title: '예상 승소 확률 차트 표시', description: '현재 상황에서의 예상 승소 확률을 도넛 차트나 게이지로 시각화한다.' },
            { category: 'AI 전략 수립', id: 'strat-3-1', title: '추천 시나리오 타임라인 렌더링', description: '단계별 대응 시나리오(내용증명 발송 -> 협상 -> 소송 등)를 타임라인 형태로 시각화한다.' },

            // 실행 리포트
            { category: '실행 리포트', id: 'strat-4-1', title: '액션 플랜 체크리스트 생성', description: '사용자가 당장 실행해야 할 구체적인 행동 지침을 체크리스트로 제공한다.' },
            { category: '실행 리포트', id: 'strat-4-2', title: '필요 서류 목록 표시', description: '해당 전략 실행에 필요한 증빙 서류 목록을 안내한다.' },

            // 데이터 처리
            {
                category: '데이터 처리',
                id: 'strat-5-1',
                title: 'Mock API 호출 (/mock/strategy.json)',
                description: '사용자의 입력 상황(Context)과 목표(Goal)를 분석하여 최적의 전략 로드맵을 수신합니다. 결정 트리(Decision Tree) 기반의 로직이 백엔드에서 수행됩니다.',
                dataDescription: 'Request: { context: string, goal: "settlement" } -> Response: { strategies: [{ name: "Negotiation", probability: 0.7, steps: ["..."] }] }'
            },
            {
                category: '데이터 처리',
                id: 'strat-5-2',
                title: '전략 리포트 저장',
                description: '생성된 맞춤형 전략 리포트를 "strategy_recommendations" 테이블에 저장합니다. 사용자가 언제든 다시 열어보고 진행 상황을 체크(Checklist Update)할 수 있도록 상태 정보를 포함합니다.',
                dataDescription: 'Schema: { analysis_id: string, recommendation_json: "{...}", action_items_status: { "item_1": "done", "item_2": "pending" } }'
            },
        ],
        categories: {
            '사건 정보 수집': {
                definition: '단순한 사실 관계를 넘어, 당사자 간의 특수 관계(가족, 고용 등)와 사용자의 내면적 욕구(원만 해결 vs 강경 대응)를 파악합니다.',
                goal: '법적 유불리뿐만 아니라 정서적, 상황적 맥락까지 고려한 전방위적 데이터 확보'
            },
            'AI 전략 수립': {
                definition: '확보된 데이터를 종합하여 승소 확률을 극대화하면서도 사용자의 성향에 맞는 최적의 로드맵을 설계합니다.',
                goal: '단 하나의 정답이 아닌, 상황에 따라 선택 가능한 복수의 시나리오 제안으로 사용자의 선택권 보장'
            },
            '실행 리포트': {
                definition: '추상적인 전략을 사용자가 당장 수행할 수 있는 구체적인 행동 단위(Action Item)로 번역하여 제공합니다.',
                goal: '법률 전문가의 조력 없이도 초기 대응이 가능하도록 실행 장벽 최소화'
            },
            '데이터 처리': {
                definition: '전략의 실행 현황(Action Item 완료 여부)을 지속적으로 동기화하고, 상황 변화에 따른 전략 수정(Re-planning)을 지원합니다.',
                goal: '일회성 조언이 아닌, 분쟁 해결의 전 과정을 관리하는 "살아있는 문서"로서 데이터 가치 창출'
            }
        },
        testCases: [
            {
                id: 'tc-str-1',
                title: '전략 분석 실행',
                precondition: '조기 종재 전략 추천 페이지에 접속한 상태',
                testSteps: [
                    '1. textarea에 분쟁 상황 입력',
                    '2. "전략 분석" 버튼 클릭',
                    '3. 로딩 상태 확인',
                    '4. 결과 표시 확인'
                ],
                expectedResult: '예상 승소율, 전략 요약, 추천 시나리오 3개 표시',
                priority: 'High'
            },
            {
                id: 'tc-str-2',
                title: '추천 시나리오 카드 난이도/효과 배지',
                precondition: '분석 완료 후 시나리오가 표시된 상태',
                testSteps: [
                    '1. 각 시나리오 카드의 난이도 배지 확인',
                    '2. 효과 배지 확인',
                    '3. 색상이 적절히 구분되는지 확인'
                ],
                expectedResult: 'easy/medium/hard 난이도, low/medium/high 효과 배지 표시',
                priority: 'Medium'
            },
            {
                id: 'tc-str-3',
                title: 'Next Actions 아코디언',
                precondition: '시나리오 카드가 표시된 상태',
                testSteps: [
                    '1. 시나리오 카드 클릭',
                    '2. Next Actions 목록이 펼쳐지는지 확인',
                    '3. 다시 클릭하여 접기'
                ],
                expectedResult: '클릭 시 구체적인 다음 행동 목록 토글',
                priority: 'Medium'
            },
            {
                id: 'tc-str-4',
                title: '면책 조항 표시',
                precondition: '분석 완료 후 결과가 표시된 상태',
                testSteps: [
                    '1. 결과 하단 영역 확인',
                    '2. 면책 조항 메시지 표시 확인'
                ],
                expectedResult: '"본 전략 추천은 AI 분석 결과로..." 안내 메시지 표시',
                priority: 'Low'
            },
        ],
        recommendedApis: [
            {
                name: 'OpenAI GPT-4 with Function Calling',
                provider: 'OpenAI',
                description: 'LLM 기반 전략 생성 및 시나리오 분석. 구조화된 JSON 출력으로 전략 옵션 제공 가능.',
                url: 'https://platform.openai.com/docs/guides/function-calling',
                pricing: '사용량 기반 (GPT-4: $0.03/1K tokens)'
            },
            {
                name: 'Anthropic Claude API',
                provider: 'Anthropic',
                description: '장문 분석에 강한 LLM. 법률 상황 분석 및 전략 추천에 적합. 200K 토큰 컨텍스트 지원.',
                url: 'https://www.anthropic.com/api',
                pricing: 'Claude-3: $0.008/1K tokens 입력'
            }
        ],
    },
    simulation: {
        title: '사건 시뮬레이션',
        subtitle: 'Case Simulation & Analysis',
        overview: '분쟁 관련 텍스트를 입력하면 AI가 종합 리스크 분석, 유사 판례 매칭, 쟁점별 상세 매칭, 반대 결과 주의 판례까지 한 번에 분석하여 통합 결과를 제공합니다.',
        inputDescription: '분쟁 사건의 상세 설명 (임대차, 계약, 소비자 분쟁 등)',
        outputDescription: 'AI 종합 리스크 분석, 유사 판례 리포트, 쟁점별 상세 매칭, 변호사 전략 리포트',
        aiModel: 'LegalRisk-SIMULATION-v1.0 (Multi-Model Ensemble)',
        implementationSteps: ['텍스트 입력', '가중치 조정', 'AI 종합 분석', '판례 매칭', '리포트 생성'],
        dbTables: [
            { name: 'simulations', purpose: '시뮬레이션 메타데이터' },
            { name: 'simulation_results', purpose: '종합 분석 결과 저장' },
            { name: 'similar_case_matches', purpose: '유사 판례 매칭 결과' }
        ],
        dataFlow: ['사건 입력', '가중치 설정', 'AI 분석', '판례 매칭', '결과 표시'],
        erdDescription: 'simulations(1) → simulation_results(N) → similar_case_matches(N)',
        wireframe: `
┌───────────────────────────────────────────────────────────────────────────────┐
│  사건 시뮬레이션                              [편사] [노동] [가사]  가중치 세부 조절 │
├───────────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────┐   사실관계 유사도  ████████░░ 80%  │
│  │ [TextArea] 분쟁 상황 입력                │   법리적 쟁점     ████████░░ 80%  │
│  │ 임대인이 실거주를 이유로 계약 갱신 거절... │   최종 결론 일치  ████████░░ 80%  │
│  │                                        │                                  │
│  │ [별도 사건 불러오기]  [✏️]               │                                  │
│  │ ○ 쉬운 설명 모드                        │   [🔍 유사 판례 검색 실행]          │
│  └────────────────────────────────────────┘                                  │
├───────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌──────────────────────────────────────────┐   │
│  │ MASTER AI REPORT        │  │ 유사 판례 리포트              적중률 94.8% │   │
│  │ AI 종합 리스크 분석      │  │ ┌───────────────────────────────────────┐│   │
│  │                         │  │ │ 유사도 88%  2022가소345***           ││   │
│  │ 사용자의 사건은...       │  │ │ "실거주 위장 매도 시도"               ││   │
│  │ 예상 승소율: 72.4%       │  │ │ [사실관계] ████░  [법리쟁점] ████░    ││   │
│  │ 매칭 판례 수: 42건       │  │ │ 판단 근거 / 전략적 시사점              ││   │
│  │                         │  │ └───────────────────────────────────────┘│   │
│  └─────────────────────────┘  │ ┌───────────────────────────────────────┐│   │
│                               │ │ 유사도 75%  2021다267***              ││   │
│                               │ └───────────────────────────────────────┘│   │
│                               │ ┌───────────────────────────────────────┐│   │
│                               │ │ 변호사 전략 리포트 생성 [PDF 다운로드]   ││   │
│                               │ └───────────────────────────────────────┘│   │
│                               └──────────────────────────────────────────┘   │
├───────────────────────────────────────────────────────────────────────────────┤
│  ⚖️ 쟁점별 상세 매칭                                                           │
│  ○ 쟁점 1: 임대인의 실거주 필요성 입증 책임               가중치 55%             │
│     [CASE] 주택임대차보호법 제6조의3 제1항 손해배상 책임 요건                      │
│  ○ 쟁점 2: 갱신거절 통지 시점 적정성                      가중치 80%             │
│     [CASE] 갱신거절 사전 통지 기간 6개월 준수 여부                               │
│  ○ 쟁점 3: 제3자 개입 (부동산 중개 관련)                  가중치 70%             │
├───────────────────────────────────────────────────────────────────────────────┤
│  ⚠️ 반대 결과 주의 판례                                                        │
│  2021다267***                                     [임대인 책임 없음]           │
│  핵심 차이점: "6개월전 통지 이행 여부"                                           │
└───────────────────────────────────────────────────────────────────────────────┘`,
        useCases: [
            {
                actor: '법률 담당자',
                action: '분쟁 상황 입력 후 통합 분석 실행',
                expected: 'AI 종합 리스크 분석 + 유사 판례 매칭 결과 표시',
                flow: [
                    '1. 분쟁 상황 텍스트 입력',
                    '2. 분쟁 유형 탭 선택 (편사/노동/가사)',
                    '3. 가중치 슬라이더 조정 (선택)',
                    '4. "유사 판례 검색 실행" 버튼 클릭',
                    '5. 로딩 스피너 표시 → API 호출',
                    '6. 분석 결과 렌더링 (AI 분석 카드 + 유사 판례 목록)',
                    '7. 토스트 메시지 "분석 완료" 표시'
                ]
            },
            {
                actor: '변호사',
                action: '가중치 슬라이더로 우선순위 조정',
                expected: '조정된 가중치에 따라 유사도 재계산',
                flow: [
                    '1. 현재 가중치 값 확인 (사실관계/법리쟁점/결론)',
                    '2. 슬라이더 드래그하여 값 변경',
                    '3. 변경된 값이 실시간으로 상태에 반영',
                    '4. 재검색 실행 시 새 가중치로 유사도 계산'
                ]
            },
            {
                actor: '사용자',
                action: '유사 판례 카드 클릭',
                expected: '판례 상세 정보 및 전략적 시사점 표시',
                flow: [
                    '1. 유사 판례 카드 식별 (유사도 배지 확인)',
                    '2. 카드 클릭 → 펼침 영역 토글',
                    '3. 판단 근거/전략적 시사점 상세 내용 표시',
                    '4. "원본 전문 보기" 버튼 클릭 가능'
                ]
            },
            {
                actor: '사용자',
                action: 'PDF 리포트 다운로드 버튼 클릭',
                expected: '변호사 전략 리포트 PDF 생성 및 다운로드',
                flow: [
                    '1. 하단 CTA 영역 확인',
                    '2. "PDF 리포트 다운로드" 버튼 클릭',
                    '3. PDF 생성 로직 호출',
                    '4. 브라우저 다운로드 트리거',
                    '5. 토스트 메시지 "다운로드 완료" 표시'
                ]
            },
            {
                actor: '관리자',
                action: '쟁점별 상세 매칭 영역 확인',
                expected: '각 쟁점별 관련 판례와 가중치 표시',
                flow: [
                    '1. 쟁점별 상세 매칭 섹션 스크롤',
                    '2. 개별 쟁점 항목 클릭 → 아코디언 펼침',
                    '3. 관련 법률 조항 태그 확인',
                    '4. 가중치 퍼센트 확인'
                ]
            },
        ],
        testCases: [
            {
                id: 'tc-sim-1',
                title: '분쟁 상황 입력 및 분석 실행',
                precondition: '사건 시뮬레이션 페이지에 접속한 상태',
                testSteps: [
                    '1. textarea에 30자 이상의 분쟁 상황 텍스트 입력',
                    '2. "유사 판례 검색 실행" 버튼 클릭',
                    '3. 로딩 스피너 표시 확인',
                    '4. 분석 결과 카드 렌더링 확인'
                ],
                expectedResult: 'AI 종합 리스크 분석 카드와 유사 판례 리포트가 화면에 표시됨',
                priority: 'High'
            },
            {
                id: 'tc-sim-2',
                title: '가중치 슬라이더 조절',
                precondition: '사건 시뮬레이션 페이지에 접속한 상태',
                testSteps: [
                    '1. 사실관계 유사도 슬라이더를 50%로 조절',
                    '2. 법리적 쟁점 슬라이더를 90%로 조절',
                    '3. 변경된 값이 실시간으로 표시되는지 확인'
                ],
                expectedResult: '슬라이더 우측에 변경된 퍼센트 값이 즉시 반영됨',
                priority: 'Medium'
            },
            {
                id: 'tc-sim-3',
                title: '유사 판례 카드 상세 정보 토글',
                precondition: '분석 완료 후 유사 판례가 표시된 상태',
                testSteps: [
                    '1. 유사 판례 카드의 펼침 버튼 클릭',
                    '2. 전략적 시사점 내용 확인',
                    '3. 다시 클릭하여 접기'
                ],
                expectedResult: '클릭 시 상세 내용이 펼쳐지고, 재클릭 시 접힘',
                priority: 'Medium'
            },
            {
                id: 'tc-sim-4',
                title: 'PDF 리포트 다운로드',
                precondition: '분석 완료 후 결과가 표시된 상태',
                testSteps: [
                    '1. 하단 CTA 영역의 "PDF 리포트 다운로드" 버튼 확인',
                    '2. 버튼 클릭',
                    '3. 토스트 메시지 확인'
                ],
                expectedResult: '토스트 메시지 "변호사 전략 리포트 PDF가 다운로드 되었습니다" 표시',
                priority: 'High'
            },
            {
                id: 'tc-sim-5',
                title: '쟁점별 상세 매칭 아코디언 동작',
                precondition: '분석 완료 후 쟁점 목록이 표시된 상태',
                testSteps: [
                    '1. "쟁점 1" 항목 클릭',
                    '2. 펼쳐진 관련 법률 조항 확인',
                    '3. "쟁점 2" 항목 클릭'
                ],
                expectedResult: '클릭한 쟁점 항목이 펼쳐지고 관련 법률 정보가 표시됨',
                priority: 'Medium'
            },
            {
                id: 'tc-sim-6',
                title: '입력 없이 분석 시도',
                precondition: '사건 시뮬레이션 페이지에 접속한 상태',
                testSteps: [
                    '1. textarea를 비워둔 상태로 유지',
                    '2. "유사 판례 검색 실행" 버튼 클릭'
                ],
                expectedResult: '토스트 경고 메시지 "분쟁 상황을 입력해주세요" 표시되고 분석 중단',
                priority: 'High'
            },
        ],
        checklist: [
            // 사건 정보 입력
            { category: '사건 정보 입력', id: 'sim-1-1', title: '분쟁 상황 입력 Textarea 렌더링', description: '분쟁 사건 상세 내용을 입력받는 textarea를 렌더링한다. 최소 높이 150px, placeholder 포함.', dataDescription: 'input_text: TEXT - 사용자가 입력한 분쟁 상황 텍스트' },
            { category: '사건 정보 입력', id: 'sim-1-2', title: '별도 사건 불러오기 버튼', description: '\"별도 사건 불러오기\" 버튼 클릭 시 저장된 사건 목록을 모달로 표시한다.', dataDescription: 'cases 테이블에서 기존 사건 조회' },
            { category: '사건 정보 입력', id: 'sim-1-3', title: '쉬운 설명 모드 토글 스위치', description: '\"쉬운 설명 모드\" 토글 스위치를 렌더링한다. 활성화 시 법률 용어를 쉽게 풀어서 표시.', dataDescription: 'easy_mode: BOOLEAN - 쉬운 설명 모드 상태' },
            { category: '사건 정보 입력', id: 'sim-1-4', title: '편집 아이콘 버튼', description: '입력 영역 우측 상단에 편집 아이콘(✏️) 버튼을 배치한다.', dataDescription: '없음 (UI Only)' },

            // 가중치 조절 섹션
            { category: '가중치 설정', id: 'sim-2-1', title: '분쟁 유형 탭 버튼 그룹', description: '편사/노동/가사 등 분쟁 유형 선택 탭 버튼을 가로로 배치한다. 선택된 탭 강조.', dataDescription: 'dispute_type: VARCHAR(20) - civil/labor/family' },
            { category: '가중치 설정', id: 'sim-2-2', title: '사실관계 유사도 슬라이더', description: '사실관계 유사도 가중치(0-100%)를 조절하는 슬라이더를 렌더링한다.', dataDescription: 'fact_weight: INT (0-100)' },
            { category: '가중치 설정', id: 'sim-2-3', title: '법리적 쟁점 유사도 슬라이더', description: '법리적 쟁점 유사도 가중치를 조절하는 슬라이더를 렌더링한다.', dataDescription: 'legal_weight: INT (0-100)' },
            { category: '가중치 설정', id: 'sim-2-4', title: '최종 결론 일치 슬라이더', description: '최종 결론 일치 가중치를 조절하는 슬라이더를 렌더링한다.', dataDescription: 'conclusion_weight: INT (0-100)' },
            { category: '가중치 설정', id: 'sim-2-5', title: '가중치 변경 시 실시간 반영', description: '슬라이더 값 변경 시 useState로 상태 업데이트하고 분석에 반영.', dataDescription: 'weights 객체 상태 업데이트' },

            // 유사 판례 검색 버튼
            { category: '분석 실행', id: 'sim-3-1', title: '유사 판례 검색 실행 버튼', description: '\"🔍 유사 판례 검색 실행\" 버튼을 그라데이션 스타일로 렌더링한다.', dataDescription: '없음 (Action Trigger)' },
            { category: '분석 실행', id: 'sim-3-2', title: '버튼 클릭 시 로딩 스피너 표시', description: '검색 실행 중 버튼 내부에 로딩 스피너와 \"분석 중...\" 텍스트 표시.', dataDescription: 'isAnalyzing: BOOLEAN 상태' },

            // AI 종합 리스크 분석 카드
            { category: '종합 리스크 분석', id: 'sim-4-1', title: 'MASTER AI REPORT 카드 렌더링', description: '좌측에 어두운 배경의 AI 종합 리스크 분석 카드를 렌더링한다.', dataDescription: 'simulation_results.ai_analysis: TEXT' },
            { category: '종합 리스크 분석', id: 'sim-4-2', title: '예상 승소율 큰 숫자 표시', description: '예상 승소율(예: 72.4%)을 크고 강조된 숫자로 표시한다.', dataDescription: 'win_probability: DECIMAL(5,2)' },
            { category: '종합 리스크 분석', id: 'sim-4-3', title: '매칭 판례 수 표시', description: '매칭된 판례 수(예: 42건)를 배지 형태로 표시한다.', dataDescription: 'matched_cases_count: INT' },
            { category: '종합 리스크 분석', id: 'sim-4-4', title: 'AI 분석 요약 텍스트 표시', description: 'AI가 생성한 사건 요약 및 분석 설명을 텍스트로 표시한다.', dataDescription: 'ai_analysis: TEXT' },

            // 유사 판례 리포트 섹션
            { category: '유사 판례 리포트', id: 'sim-5-1', title: '유사 판례 리포트 헤더 렌더링', description: '\"유사 판례 리포트\" 헤더와 전체 적중률(예: 94.8%)을 표시한다.', dataDescription: 'overall_accuracy: DECIMAL(5,2)' },
            { category: '유사 판례 리포트', id: 'sim-5-2', title: '유사 판례 카드 목록 렌더링', description: '유사도 순으로 정렬된 판례 카드들을 세로로 나열한다.', dataDescription: 'similar_case_matches[] 배열' },
            { category: '유사 판례 리포트', id: 'sim-5-3', title: '판례 카드 내 유사도 배지 표시', description: '각 카드 좌측 상단에 유사도 퍼센트 배지(예: 88%)를 표시한다.', dataDescription: 'similarity_score: DECIMAL(5,2)' },
            { category: '유사 판례 리포트', id: 'sim-5-4', title: '판례 카드 내 사건번호 표시', description: '판례 사건번호를 마스킹 처리하여 표시(예: 2022가소345***).', dataDescription: 'case_number: VARCHAR(50)' },
            { category: '유사 판례 리포트', id: 'sim-5-5', title: '판례 카드 내 핵심 요약 표시', description: '판례의 핵심 내용을 1-2줄로 요약하여 표시.', dataDescription: 'summary: TEXT' },
            { category: '유사 판례 리포트', id: 'sim-5-6', title: '사실관계/법리쟁점 Progress Bar', description: '사실관계, 법리쟁점 일치도를 각각 Progress Bar로 표시한다.', dataDescription: 'fact_similarity, legal_issue_similarity: DECIMAL(5,2)' },
            { category: '유사 판례 리포트', id: 'sim-5-7', title: '판단 근거 섹션 토글', description: '\"판단 근거\" 섹션 클릭 시 상세 내용을 펼치거나 접는다.', dataDescription: 'reasoning: TEXT' },
            { category: '유사 판례 리포트', id: 'sim-5-8', title: '전략적 시사점 섹션 토글', description: '\"전략적 시사점\" 섹션 클릭 시 상세 내용을 펼치거나 접는다.', dataDescription: 'strategic_implication: TEXT' },
            { category: '유사 판례 리포트', id: 'sim-5-9', title: '원고/임차인 승소 표시 버튼', description: '판례 원문 보기/분석 리포트 포함 버튼을 렌더링한다.', dataDescription: 'winner: VARCHAR(50)' },

            // 변호사 전략 리포트
            { category: '변호사 전략 리포트', id: 'sim-6-1', title: '변호사 전략 리포트 생성 CTA', description: '하단에 보라색 배경의 \"변호사 전략 리포트 생성\" CTA 바를 렌더링한다.', dataDescription: '없음 (UI Only)' },
            { category: '변호사 전략 리포트', id: 'sim-6-2', title: 'PDF 리포트 다운로드 버튼', description: '\"PDF 리포트 다운로드\" 버튼을 배치한다. 클릭 시 PDF 생성 로직 호출.', dataDescription: 'PDF 생성 시 전체 결과 데이터 사용' },

            // 쟁점별 상세 매칭
            { category: '쟁점별 상세 매칭', id: 'sim-7-1', title: '쟁점별 상세 매칭 헤더 렌더링', description: '\"⚖️ 쟁점별 상세 매칭\" 헤더를 렌더링한다.', dataDescription: '없음 (Header UI)' },
            { category: '쟁점별 상세 매칭', id: 'sim-7-2', title: '쟁점 항목 아코디언 리스트', description: '각 쟁점을 클릭하면 펼쳐지는 아코디언 형태로 렌더링한다.', dataDescription: 'issues[]: { id, title, description }' },
            { category: '쟁점별 상세 매칭', id: 'sim-7-3', title: '쟁점별 가중치 퍼센트 표시', description: '각 쟁점 우측에 해당 쟁점의 가중치 퍼센트를 표시한다.', dataDescription: 'issue.weight: INT' },
            { category: '쟁점별 상세 매칭', id: 'sim-7-4', title: '관련 판례 태그 표시', description: '각 쟁점 하단에 관련 법률 조항 및 판례 태그를 표시한다.', dataDescription: 'issue.relatedLaw: TEXT' },

            // 반대 결과 주의 판례
            { category: '반대 결과 주의', id: 'sim-8-1', title: '반대 결과 주의 판례 헤더', description: '\"⚠️ 반대 결과 주의 판례\" 헤더를 노란색 경고 스타일로 렌더링한다.', dataDescription: '없음 (Warning UI)' },
            { category: '반대 결과 주의', id: 'sim-8-2', title: '반대 판례 카드 렌더링', description: '반대 결과 판례를 카드 형태로 렌더링하고 \"임대인 책임 없음\" 등 결과 배지 표시.', dataDescription: 'contraryCase: { caseNumber, result }' },
            { category: '반대 결과 주의', id: 'sim-8-3', title: '핵심 차이점 강조 표시', description: '입력 사건과 반대 판례의 핵심 차이점을 빨간색 텍스트로 강조 표시.', dataDescription: 'contraryCase.keyDifference: TEXT' },

            // 데이터 저장
            { category: '데이터 저장', id: 'sim-9-1', title: 'Mock API 호출', description: '/mock/simulation.json 파일을 fetch하여 시뮬레이션 결과 데이터를 파싱한다.', dataDescription: 'API Response: SimulationResult 객체' },
            {
                category: '데이터 저장',
                id: 'sim-9-2',
                title: '시뮬레이션 결과 DB 저장',
                description: '사용자가 시뮬레이션한 파라미터(전략, 가중치 등)와 그에 따른 예측 결과(승소율, 보상금 등)를 "simulation_results" 테이블에 저장합니다. 이는 사용자가 다양한 시나리오를 비교 분석(A/B Test)할 수 있게 합니다.',
                dataDescription: 'Schema: { simulation_id: string, parameters_json: "{strategy:..., weight:...}", outcome_json: "{win_prob: 0.82, compensation: 5000000}" }'
            },
            {
                category: '데이터 저장',
                id: 'sim-9-3',
                title: 'Analysis Run 생성 및 연결',
                description: '개별 시뮬레이션 실행을 전체 분석 세션과 연결합니다. 하나의 사건 분석(Analysis Run) 내에서 여러 번의 시뮬레이션이 수행될 수 있으므로, 1:N 관계를 형성합니다.',
                dataDescription: 'Relation: analysis_runs(1) --< simulation_results(N)'
            },
        ],
        categories: {
            '사건 정보 입력': {
                definition: '사용자의 비정형 분쟁 상황을 AI가 이해할 수 있는 정형화된 데이터 컨텍스트로 변환하는 진입점입니다.',
                goal: '법률적 배경 지식이 없는 사용자도 자신의 상황을 명확하게 전달할 수 있는 직관적인 인터페이스 제공'
            },
            '가중치 설정': {
                definition: '사용자마다 다른 "승소", "피해 보상", "빠른 해결" 등의 목표 우선순위를 분석 엔진에 반영하는 제어 모듈입니다.',
                goal: '천편일률적인 분석이 아닌, 사용자의 니즈가 반영된 개인화된 맞춤형 분석 결과 도출'
            },
            '분석 실행': {
                definition: '설정된 데이터와 가중치를 기반으로 멀티 모델(Risk, Similar, Strategy)을 병렬로 가동하는 트리거입니다.',
                goal: '복잡한 법률 분석 과정을 원클릭으로 단순화하고, 실시간 피드백을 통해 대기 시간의 지루함 해소'
            },
            '종합 리스크 분석': {
                definition: '승소 확률, 예상 보상, 리스크 요인을 종합하여 하나의 직관적인 지표(Score/Probability)로 시각화하는 대시보드입니다.',
                goal: '복잡한 법률 리스크를 숫자로 정량화하여 의사결정의 객관적인 기준점 제시'
            },
            '유사 판례 리포트': {
                definition: '과거 데이터(판례) 중 내 사건과 가장 유사한 사례를 찾아 "미래의 내 결과"를 예측해볼 수 있는 비교 분석 도구입니다.',
                goal: '단순 검색이 아닌, 내 사건과의 유사도 점수와 구체적인 공통점/차이점을 명시하여 설득력 강화'
            },
            '변호사 전략 리포트': {
                definition: '분석된 데이터를 바탕으로 실제 변호사가 조언해주듯 구체적인 행동 지침(Action Plan)을 생성하는 심화 컨설팅입니다.',
                goal: '단순한 현황 분석을 넘어 "그래서 이제 무엇을 해야 하는가?"에 대한 실질적인 솔루션 제공'
            },
            '쟁점별 상세 매칭': {
                definition: '사건을 구성하는 세부 법리적 쟁점(Issue) 단위로 쪼개어 미시적인 분석 결과를 제공하는 정밀 진단 기능입니다.',
                goal: '전체적인 승률뿐만 아니라, 특정 쟁점에서의 유불리를 파악하여 약점을 보완할 수 있는 기회 제공'
            },
            '반대 결과 주의': {
                definition: '나에게 유리한 판례뿐만 아니라, 불리하게 작용할 수 있는 예외적인 판례를 미리 식별하는 방어 기제입니다.',
                goal: '확증 편향을 방지하고 예상치 못한 반격이나 패소 가능성에 대비하여 분석의 신뢰도 확보'
            },
            '데이터 저장': {
                definition: '사용자의 설정 값(Input)과 시뮬레이션 결과 값(Output)을 쌍으로 저장하여 비교 분석을 지원하는 데이터 아카이빙입니다.',
                goal: '단순 결과 기록을 넘어선 "시나리오 실험실" 기능 제공 (예: "만약 합의를 우선시했다면 결과가 어떻게 달랐을까?")'
            }
        },
        recommendedApis: [
            {
                name: '대법원 판례검색 Open API',
                provider: '대한민국 법원',
                description: '대법원/하급심 판례 검색. 사건번호, 법조문, 키워드 검색 제공. 판례 원문 및 요약 데이터 제공.',
                url: 'https://www.law.go.kr/LSO/openApi.do',
                pricing: '무료 (공공 API, 일 1,000건 제한)'
            },
            {
                name: 'OpenAI GPT-4 + Embeddings',
                provider: 'OpenAI',
                description: '텍스트 임베딩으로 유사도 계산, GPT-4로 종합 분석 리포트 생성. RAG 파이프라인 구축 가능.',
                url: 'https://platform.openai.com/docs/guides/embeddings',
                pricing: 'Embeddings: $0.0001/1K tokens, GPT-4: $0.03/1K tokens'
            }
        ],
    },
    chatbot: {
        title: '법률 상담 AI 챗봇',
        subtitle: 'Legal Consultation AI Chatbot',
        overview: '사용자가 자연어로 법률 관련 질문을 하면 AI가 맥락을 이해하고 관련 법률 정보, 유사 사례, 조언을 대화형으로 제공합니다.',
        inputDescription: '자연어 질문 (예: "임대차 계약 위반 시 손해배상 청구 가능한가요?")',
        outputDescription: 'AI 응답 (법률 정보, 관련 조문, 유사 판례 링크, 추천 행동)',
        aiModel: 'LegalRisk-CHATBOT-v1.0 (GPT-4 + RAG Pipeline)',
        implementationSteps: ['질문 입력', '의도 분석', '컨텍스트 검색', 'LLM 응답 생성', '대화 저장'],
        dbTables: [
            { name: 'chat_sessions', purpose: '대화 세션 관리' },
            { name: 'chat_messages', purpose: '개별 메시지 저장' },
            { name: 'chat_contexts', purpose: '대화 컨텍스트 벡터 저장' }
        ],
        dataFlow: ['사용자 질문', '의도 분류(NLU)', 'RAG 검색', 'LLM 응답', 'UI 표시'],
        erdDescription: 'users(1) → chat_sessions(N) → chat_messages(N)',
        wireframe: `
┌─────────────────────────────────────────────────────┐
│  법률 상담 AI 챗봇                                    │
├─────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐  │
│  │ [AI 아이콘] 안녕하세요! 법률 상담 AI입니다.     │  │
│  │            무엇을 도와드릴까요?                 │  │
│  ├───────────────────────────────────────────────┤  │
│  │                    [사용자 메시지]             │  │
│  │         임대차 계약 위반 손해배상 가능한가요?   │  │
│  ├───────────────────────────────────────────────┤  │
│  │ [AI 아이콘] 네, 민법 제390조에 따라 가능합니다. │  │
│  │            [관련 조문 보기] [유사 판례 보기]    │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │ [메시지 입력]                    [전송 버튼]   │  │
│  └───────────────────────────────────────────────┘  │
│  [📎 파일첨부] [🎤 음성입력] [📋 대화내역 저장]       │
└─────────────────────────────────────────────────────┘`,
        useCases: [
            { actor: '일반 사용자', action: '법률 질문 입력', expected: 'AI가 관련 법률 정보와 조언 제공' },
            { actor: '사용자', action: '후속 질문 입력', expected: '이전 대화 맥락을 유지한 응답' },
            { actor: '사용자', action: '대화 내역 저장 클릭', expected: '대화가 PDF 또는 텍스트로 저장됨' },
        ],
        checklist: [
            // 채팅 UI 구성
            { category: '채팅 UI 구성', id: 'chat-1-1', title: '채팅 컨테이너 렌더링', description: '스크롤 가능한 메시지 목록 영역과 고정된 입력 영역으로 구성된 채팅 레이아웃을 구현한다.', dataDescription: 'CSS: height: calc(100vh - 200px), overflow-y: auto' },
            { category: '채팅 UI 구성', id: 'chat-1-2', title: '메시지 버블 컴포넌트', description: '사용자/AI 메시지를 구분하는 말풍선 UI를 구현한다. AI는 왼쪽 정렬 + 아이콘, 사용자는 오른쪽 정렬.', dataDescription: 'Props: { role: "user" | "assistant", content: string, timestamp: Date }' },
            { category: '채팅 UI 구성', id: 'chat-1-3', title: '타이핑 인디케이터', description: 'AI가 응답을 생성 중일 때 "..." 애니메이션 또는 타이핑 효과를 표시한다.', dataDescription: 'State: isTyping: boolean' },
            { category: '채팅 UI 구성', id: 'chat-1-4', title: '메시지 입력창 및 전송 버튼', description: 'Enter 키 또는 버튼 클릭으로 메시지를 전송하는 입력 폼을 구현한다. Shift+Enter는 줄바꿈.', dataDescription: 'Event: onKeyDown, condition: e.key === "Enter" && !e.shiftKey' },

            // 대화 처리 로직
            { category: '대화 처리 로직', id: 'chat-2-1', title: '세션 ID 생성 및 관리', description: '새 대화 시작 시 UUID를 생성하여 세션을 식별한다. 세션별로 대화 이력을 그룹화.', dataDescription: 'Schema: { session_id: uuid, user_id: string, created_at: timestamp, title: string }' },
            { category: '대화 처리 로직', id: 'chat-2-2', title: '대화 컨텍스트 유지', description: '최근 N개의 메시지를 컨텍스트로 유지하여 LLM에 전달한다. 토큰 제한 관리 필수.', dataDescription: 'Config: MAX_CONTEXT_MESSAGES = 10, MAX_TOKENS = 4000' },
            { category: '대화 처리 로직', id: 'chat-2-3', title: '의도 분류 (NLU)', description: '사용자 질문의 의도를 분류한다 (법률 질문, 판례 검색, 일반 인사 등). 분류 결과에 따라 다른 처리 파이프라인 적용.', dataDescription: 'Intent Types: "legal_question" | "case_search" | "greeting" | "out_of_scope"' },

            // AI 응답 생성
            { category: 'AI 응답 생성', id: 'chat-3-1', title: 'RAG 파이프라인 구현', description: '질문을 임베딩하여 벡터 DB에서 관련 법률 문서/판례를 검색하고, 검색 결과를 LLM 프롬프트에 포함.', dataDescription: 'Flow: Query → Embedding → Vector Search (Top 5) → LLM Prompt Injection' },
            { category: 'AI 응답 생성', id: 'chat-3-2', title: 'LLM API 호출', description: 'OpenAI/Claude API를 호출하여 법률 조언 응답을 생성한다. 시스템 프롬프트에 법률 전문가 페르소나 설정.', dataDescription: 'API: POST /v1/chat/completions, system_prompt: "당신은 대한민국 법률 전문 AI입니다..."' },
            { category: 'AI 응답 생성', id: 'chat-3-3', title: '응답 스트리밍 표시', description: 'SSE(Server-Sent Events)를 활용하여 LLM 응답을 실시간으로 한 글자씩 표시한다.', dataDescription: 'API: stream: true, Event: onmessage → append to message buffer' },
            { category: 'AI 응답 생성', id: 'chat-3-4', title: '관련 링크/카드 삽입', description: '응답 내에 관련 법조문, 판례 링크를 클릭 가능한 카드 형태로 삽입한다.', dataDescription: 'Component: <ReferenceCard lawId="민법390" title="민법 제390조" />' },

            // 부가 기능
            { category: '부가 기능', id: 'chat-4-1', title: '대화 내역 저장 (Export)', description: '현재 대화를 PDF, TXT, JSON 형식으로 다운로드할 수 있는 기능을 제공한다.', dataDescription: 'Formats: application/pdf, text/plain, application/json' },
            { category: '부가 기능', id: 'chat-4-2', title: '이전 대화 불러오기', description: '사용자의 과거 채팅 세션 목록을 표시하고, 선택 시 해당 대화를 불러온다.', dataDescription: 'API: GET /api/chat/sessions?user_id=xxx' },
            { category: '부가 기능', id: 'chat-4-3', title: '만족도 피드백 수집', description: 'AI 응답 하단에 👍/👎 버튼을 배치하여 응답 품질 피드백을 수집한다.', dataDescription: 'Schema: { message_id: string, feedback: "positive" | "negative", comment?: string }' },

            // 데이터 처리
            {
                category: '데이터 처리',
                id: 'chat-5-1',
                title: '메시지 DB 저장',
                description: '모든 대화 메시지를 "chat_messages" 테이블에 영구 저장하여 대화 이력 관리 및 분석에 활용한다.',
                dataDescription: 'Schema: { id: uuid, session_id: string, role: "user"|"assistant", content: string, metadata_json: "{tokens: 150, model: gpt-4}", created_at: timestamp }'
            },
            {
                category: '데이터 처리',
                id: 'chat-5-2',
                title: 'LLM 토큰 사용량 추적',
                description: 'API 응답의 usage 필드를 파싱하여 토큰 소비량을 기록한다. 과금 및 비용 최적화에 활용.',
                dataDescription: 'API Response: { usage: { prompt_tokens: 500, completion_tokens: 200, total_tokens: 700 } }'
            },
            {
                category: '데이터 처리',
                id: 'chat-5-3',
                title: '벡터 DB 인덱싱',
                description: '법률 문서, 판례를 임베딩하여 벡터 DB(Pinecone/Weaviate)에 저장한다. RAG 검색의 기반 데이터.',
                dataDescription: 'Vector: dimension=1536 (text-embedding-ada-002), metadata: { doc_type, law_id, ... }'
            },
        ],
        categories: {
            '채팅 UI 구성': {
                definition: '사용자와 AI 간의 자연스러운 대화 경험을 제공하는 인터페이스 레이어입니다.',
                goal: '메시징 앱과 같은 친숙한 UX로 진입 장벽을 낮추고, 법률 상담의 부담감 해소'
            },
            '대화 처리 로직': {
                definition: '입력된 자연어를 해석하고, 대화의 맥락(Context)을 유지하며 적절한 처리 파이프라인으로 라우팅하는 핵심 로직입니다.',
                goal: '단발성 Q&A가 아닌, 문맥을 이해하는 연속적인 상담 경험 제공'
            },
            'AI 응답 생성': {
                definition: 'RAG(Retrieval-Augmented Generation) 기반으로 관련 법률 지식을 검색하고, LLM을 통해 사용자 맞춤형 응답을 생성합니다.',
                goal: '할루시네이션(Hallucination)을 최소화하고, 신뢰할 수 있는 법률 정보 기반의 응답 제공'
            },
            '부가 기능': {
                definition: '대화 저장, 이력 관리, 피드백 수집 등 핵심 대화 기능을 보완하는 편의 기능입니다.',
                goal: '일회성 상담에 그치지 않고, 지속적인 사용과 서비스 개선을 위한 데이터 확보'
            },
            '데이터 처리': {
                definition: '대화 로그, 토큰 사용량, 벡터 인덱스 등 챗봇 운영에 필요한 데이터 파이프라인을 관리합니다.',
                goal: '비용 효율적인 LLM 운영 및 검색 품질 향상을 위한 데이터 인프라 구축'
            }
        },
        testCases: [
            {
                id: 'tc-chat-1',
                title: '기본 법률 질문 응답',
                precondition: '챗봇 페이지에 접속한 상태',
                testSteps: [
                    '1. 입력창에 "임대차 계약 위반 시 손해배상 청구 가능한가요?" 입력',
                    '2. 전송 버튼 클릭 또는 Enter 키',
                    '3. 타이핑 인디케이터 표시 확인',
                    '4. AI 응답 표시 확인'
                ],
                expectedResult: '민법 관련 조문과 함께 손해배상 가능 여부에 대한 설명 표시',
                priority: 'High'
            },
            {
                id: 'tc-chat-2',
                title: '대화 맥락 유지',
                precondition: '이전 질문에 대한 응답이 표시된 상태',
                testSteps: [
                    '1. "그러면 어떤 증거가 필요한가요?" 후속 질문 입력',
                    '2. 전송',
                    '3. 응답 확인'
                ],
                expectedResult: '이전 대화(임대차 손해배상)의 맥락을 유지한 증거 관련 응답',
                priority: 'High'
            },
            {
                id: 'tc-chat-3',
                title: '대화 내역 저장',
                precondition: '최소 3개 이상의 메시지가 있는 대화 상태',
                testSteps: [
                    '1. "대화 내역 저장" 버튼 클릭',
                    '2. 형식 선택 (PDF)',
                    '3. 다운로드 파일 확인'
                ],
                expectedResult: '현재까지의 대화 내용이 PDF 파일로 다운로드됨',
                priority: 'Medium'
            },
        ],
        recommendedApis: [
            {
                name: 'OpenAI Chat Completions API',
                provider: 'OpenAI',
                description: 'GPT-4/GPT-4o 기반 대화형 AI. 스트리밍, Function Calling 지원. 법률 상담 챗봇의 핵심 LLM.',
                url: 'https://platform.openai.com/docs/api-reference/chat',
                pricing: 'GPT-4: $0.03/1K input, $0.06/1K output tokens'
            },
            {
                name: 'Pinecone Vector Database',
                provider: 'Pinecone',
                description: '벡터 유사도 검색 전문 DB. 법률 문서/판례 임베딩 저장 및 RAG 검색에 최적.',
                url: 'https://www.pinecone.io/',
                pricing: 'Starter 무료 (100K 벡터), Standard $70/월'
            }
        ],
    },
    auth: {
        title: '로그인 / 회원가입',
        subtitle: 'Authentication System',
        overview: '사용자 인증 및 계정 관리 시스템입니다. 이메일/비밀번호 로그인, 소셜 로그인(Google, Kakao), 회원가입, 비밀번호 재설정 기능을 제공합니다.',
        inputDescription: '이메일, 비밀번호, 사용자 정보 (이름, 전화번호 등)',
        outputDescription: '인증 토큰 (JWT), 사용자 세션, 권한 정보',
        aiModel: 'N/A (보안 인증 로직)',
        implementationSteps: ['입력 검증', '서버 인증', '토큰 발급', '세션 저장', '리다이렉트'],
        dbTables: [
            { name: 'users', purpose: '사용자 계정 정보' },
            { name: 'user_sessions', purpose: '로그인 세션 관리' },
            { name: 'password_resets', purpose: '비밀번호 재설정 토큰' }
        ],
        dataFlow: ['사용자 입력', '유효성 검증', 'API 인증', '토큰 저장', '홈 리다이렉트'],
        erdDescription: 'users(1) → user_sessions(N), users(1) → password_resets(N)',
        wireframe: `
┌─────────────────────────────────────────────────────┐
│  로그인                                              │
├─────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐  │
│  │  🔐 LegalRisk AI                              │  │
│  │                                               │  │
│  │  이메일                                        │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ user@example.com                        │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  비밀번호                                      │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ ••••••••                    [👁 토글]   │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  │  [  로그인  ]                                  │  │
│  │                                               │  │
│  │  ─────────── 또는 ───────────                 │  │
│  │                                               │  │
│  │  [G Google 로그인] [K 카카오 로그인]           │  │
│  │                                               │  │
│  │  비밀번호 찾기  |  회원가입                    │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘`,
        useCases: [
            { actor: '비회원', action: '이메일/비밀번호로 로그인', expected: '인증 성공 후 대시보드로 이동' },
            { actor: '비회원', action: 'Google 소셜 로그인 클릭', expected: 'Google OAuth 팝업 후 자동 로그인' },
            { actor: '신규 사용자', action: '회원가입 폼 제출', expected: '계정 생성 및 환영 이메일 발송' },
            { actor: '기존 사용자', action: '비밀번호 찾기 요청', expected: '재설정 링크가 이메일로 발송됨' },
        ],
        checklist: [
            // 로그인 UI
            { category: '로그인 UI', id: 'auth-1-1', title: '이메일 입력 필드', description: '이메일 형식 유효성 검증을 포함한 입력 필드. 실시간 검증 피드백 표시.', dataDescription: 'Validation: /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/' },
            { category: '로그인 UI', id: 'auth-1-2', title: '비밀번호 입력 필드', description: '비밀번호 표시/숨김 토글 버튼 포함. 최소 8자 이상 검증.', dataDescription: 'State: showPassword: boolean, min-length: 8' },
            { category: '로그인 UI', id: 'auth-1-3', title: '로그인 버튼 및 로딩 상태', description: '클릭 시 로딩 스피너 표시, 중복 클릭 방지(disabled).', dataDescription: 'State: isLoading: boolean' },
            { category: '로그인 UI', id: 'auth-1-4', title: '에러 메시지 표시', description: '인증 실패 시 "이메일 또는 비밀번호가 올바르지 않습니다" 등 사용자 친화적 메시지.', dataDescription: 'Error Types: "invalid_credentials", "account_locked", "network_error"' },

            // 소셜 로그인
            { category: '소셜 로그인', id: 'auth-2-1', title: 'Google OAuth 연동', description: 'Google Identity Services를 활용한 원클릭 로그인. 팝업 방식 또는 리다이렉트 방식 선택.', dataDescription: 'API: accounts.google.com/gsi/client, Scope: email, profile' },
            { category: '소셜 로그인', id: 'auth-2-2', title: 'Kakao 로그인 연동', description: 'Kakao JavaScript SDK를 활용한 카카오 계정 로그인.', dataDescription: 'API: kauth.kakao.com/oauth/authorize, App Key 필요' },
            { category: '소셜 로그인', id: 'auth-2-3', title: '소셜 계정 연동/해제', description: '기존 계정에 소셜 로그인 연결 또는 연결 해제 기능.', dataDescription: 'DB: users.google_id, users.kakao_id (nullable)' },

            // 회원가입
            { category: '회원가입', id: 'auth-3-1', title: '회원가입 폼 렌더링', description: '이름, 이메일, 비밀번호, 비밀번호 확인, 약관 동의 체크박스를 포함한 폼.', dataDescription: 'Fields: name, email, password, password_confirm, terms_agreed' },
            { category: '회원가입', id: 'auth-3-2', title: '비밀번호 강도 표시기', description: '입력된 비밀번호의 강도를 시각적으로 표시 (약함/보통/강함).', dataDescription: 'Logic: length >= 12 && hasUpperCase && hasNumber && hasSpecial = "Strong"' },
            { category: '회원가입', id: 'auth-3-3', title: '이메일 중복 확인', description: '입력된 이메일이 이미 등록되어 있는지 실시간 확인.', dataDescription: 'API: GET /api/auth/check-email?email=xxx, Response: { available: boolean }' },
            { category: '회원가입', id: 'auth-3-4', title: '이메일 인증 발송', description: '회원가입 완료 후 인증 링크가 포함된 이메일 발송.', dataDescription: 'Email: verification_token (6자리 또는 UUID), 유효기간 24시간' },

            // 비밀번호 재설정
            { category: '비밀번호 재설정', id: 'auth-4-1', title: '비밀번호 찾기 폼', description: '이메일 입력 후 재설정 링크 발송 요청.', dataDescription: 'API: POST /api/auth/forgot-password, Body: { email: string }' },
            { category: '비밀번호 재설정', id: 'auth-4-2', title: '재설정 토큰 검증', description: 'URL의 토큰이 유효한지 확인 (만료, 사용 여부).', dataDescription: 'Token: SHA256 hash, Expiry: 1 hour, One-time use' },
            { category: '비밀번호 재설정', id: 'auth-4-3', title: '새 비밀번호 설정 폼', description: '새 비밀번호 입력 및 확인 필드. 기존 비밀번호와 동일 시 경고.', dataDescription: 'Validation: newPassword !== oldPasswordHash' },

            // 세션 및 보안
            {
                category: '세션 및 보안',
                id: 'auth-5-1',
                title: 'JWT 토큰 발급 및 저장',
                description: '로그인 성공 시 액세스 토큰(15분)과 리프레시 토큰(7일)을 발급하여 httpOnly 쿠키에 저장.',
                dataDescription: 'Schema: { accessToken: JWT(15min), refreshToken: JWT(7days) }, Storage: httpOnly cookie'
            },
            {
                category: '세션 및 보안',
                id: 'auth-5-2',
                title: '토큰 자동 갱신',
                description: '액세스 토큰 만료 시 리프레시 토큰으로 자동 갱신. 갱신 실패 시 로그아웃 처리.',
                dataDescription: 'API: POST /api/auth/refresh, Cookie: refreshToken → new accessToken'
            },
            {
                category: '세션 및 보안',
                id: 'auth-5-3',
                title: '로그아웃 처리',
                description: '클라이언트 토큰 삭제 및 서버 세션 무효화.',
                dataDescription: 'Actions: clearCookies(), invalidateSession(sessionId), redirect("/login")'
            },
            {
                category: '세션 및 보안',
                id: 'auth-5-4',
                title: '로그인 시도 제한',
                description: '5회 연속 실패 시 계정 잠금 또는 CAPTCHA 표시.',
                dataDescription: 'Config: MAX_ATTEMPTS = 5, LOCKOUT_DURATION = 15min'
            },
        ],
        categories: {
            '로그인 UI': {
                definition: '사용자가 자격 증명을 입력하고 인증을 요청하는 진입점입니다.',
                goal: '직관적이고 안전한 로그인 경험 제공, 실시간 피드백으로 입력 오류 최소화'
            },
            '소셜 로그인': {
                definition: '외부 OAuth 제공자(Google, Kakao)를 통한 간편 인증 방식입니다.',
                goal: '회원가입 과정 생략으로 신규 사용자 전환율 향상, 비밀번호 관리 부담 감소'
            },
            '회원가입': {
                definition: '신규 사용자가 계정을 생성하고 필수 정보를 등록하는 과정입니다.',
                goal: '최소한의 정보만 수집하여 가입 허들을 낮추고, 이메일 인증으로 유효성 확보'
            },
            '비밀번호 재설정': {
                definition: '비밀번호를 분실한 사용자가 안전하게 새 비밀번호를 설정하는 셀프서비스 기능입니다.',
                goal: '고객 지원 개입 없이 24/7 자동화된 계정 복구 제공'
            },
            '세션 및 보안': {
                definition: '인증 상태를 안전하게 유지하고, 무단 접근을 방지하는 보안 인프라입니다.',
                goal: 'JWT 기반 Stateless 인증으로 확장성 확보, 자동 갱신으로 UX 저하 방지'
            }
        },
        testCases: [
            {
                id: 'tc-auth-1',
                title: '정상 로그인',
                precondition: '유효한 계정이 존재하는 상태',
                testSteps: [
                    '1. 로그인 페이지 접속',
                    '2. 등록된 이메일 입력',
                    '3. 올바른 비밀번호 입력',
                    '4. 로그인 버튼 클릭'
                ],
                expectedResult: '대시보드로 리다이렉트, 사용자 이름 표시',
                priority: 'High'
            },
            {
                id: 'tc-auth-2',
                title: '잘못된 비밀번호 에러',
                precondition: '유효한 계정이 존재하는 상태',
                testSteps: [
                    '1. 등록된 이메일 입력',
                    '2. 잘못된 비밀번호 입력',
                    '3. 로그인 버튼 클릭'
                ],
                expectedResult: '"이메일 또는 비밀번호가 올바르지 않습니다" 에러 표시',
                priority: 'High'
            },
            {
                id: 'tc-auth-3',
                title: '회원가입 및 이메일 인증',
                precondition: '로그인 페이지에서 회원가입 링크 클릭',
                testSteps: [
                    '1. 이름, 이메일, 비밀번호 입력',
                    '2. 약관 동의 체크',
                    '3. 회원가입 버튼 클릭',
                    '4. 이메일 수신함에서 인증 링크 클릭'
                ],
                expectedResult: '계정 활성화, 로그인 페이지로 리다이렉트',
                priority: 'High'
            },
            {
                id: 'tc-auth-4',
                title: 'Google 소셜 로그인',
                precondition: 'Google 계정 보유',
                testSteps: [
                    '1. "Google 로그인" 버튼 클릭',
                    '2. Google 계정 선택 또는 로그인',
                    '3. 권한 승인'
                ],
                expectedResult: '자동 로그인 후 대시보드로 이동',
                priority: 'Medium'
            },
        ],
        recommendedApis: [
            {
                name: 'NextAuth.js',
                provider: 'Vercel',
                description: 'Next.js 전용 인증 라이브러리. OAuth, 이메일/비밀번호, JWT 세션 등 다양한 인증 방식 지원.',
                url: 'https://next-auth.js.org/',
                pricing: '무료 (오픈소스)'
            },
            {
                name: 'Firebase Authentication',
                provider: 'Google',
                description: '이메일/비밀번호, 소셜 로그인, 전화번호 인증 등 다양한 방식 지원. 실시간 사용자 관리 콘솔 제공.',
                url: 'https://firebase.google.com/docs/auth',
                pricing: '무료 (월 10K 인증까지)'
            }
        ],
    },
};

type TabType = 'overview' | 'wireframe' | 'usecase' | 'checklist' | 'test';

export default function DocsModal({ isOpen, onClose, featureName }: DocsModalProps) {
    const docs = featureDocumentation[featureName] || featureDocumentation.classify;
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [customFeatures, setCustomFeatures] = useState<ChecklistItem[]>([]);
    const [newFeatureTitle, setNewFeatureTitle] = useState('');
    const [newFeatureDesc, setNewFeatureDesc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Test case related states
    const [checkedTests, setCheckedTests] = useState<Record<string, boolean>>({});
    const [customTests, setCustomTests] = useState<TestCase[]>([]);
    const [newTestTitle, setNewTestTitle] = useState('');
    const [newTestPrecondition, setNewTestPrecondition] = useState('');
    const [newTestSteps, setNewTestSteps] = useState('');
    const [newTestExpected, setNewTestExpected] = useState('');
    const [newTestPriority, setNewTestPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');

    // Category filter state for checklist
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Report assignee name
    const [assigneeName, setAssigneeName] = useState<string>('');

    // Per-item deadline dates
    const [itemDeadlines, setItemDeadlines] = useState<Record<string, string>>({});

    // Initialize checked items
    useEffect(() => {
        if (isOpen) {
            const initialChecked: Record<string, boolean> = {};
            docs.checklist.forEach(item => {
                initialChecked[item.id] = false; // Start unchecked
            });
            setCheckedItems(initialChecked);
            setCustomFeatures([]);
            setNewFeatureTitle('');
            setNewFeatureDesc('');
            setActiveTab('overview');

            // Initialize test case checked items
            const initialTestChecked: Record<string, boolean> = {};
            if (docs.testCases) {
                docs.testCases.forEach(tc => {
                    initialTestChecked[tc.id] = false;
                });
            }
            setCheckedTests(initialTestChecked);
            setCustomTests([]);
            setNewTestTitle('');
            setNewTestPrecondition('');
            setNewTestSteps('');
            setNewTestExpected('');
            setNewTestPriority('Medium');
            setSubmitResult(null);
        }
    }, [isOpen, docs.checklist, docs.testCases]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) { document.addEventListener('keydown', handleEscape); document.body.style.overflow = 'hidden'; }
        return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = 'unset'; };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleCheckToggle = (id: string) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddFeature = () => {
        if (newFeatureTitle.trim()) {
            const newItem: ChecklistItem = {
                id: `custom-${Date.now()}`,
                title: newFeatureTitle.trim(),
                description: newFeatureDesc.trim() || '(세부 내용 없음)',
                isCustom: true,
            };
            setCustomFeatures(prev => [...prev, newItem]);
            setCheckedItems(prev => ({ ...prev, [newItem.id]: false }));
            setNewFeatureTitle('');
            setNewFeatureDesc('');
        }
    };

    const handleRemoveCustomFeature = (id: string) => {
        setCustomFeatures(prev => prev.filter(f => f.id !== id));
        setCheckedItems(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    // Test case handlers
    const handleTestCheckToggle = (id: string) => {
        setCheckedTests(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleAddTest = () => {
        if (newTestTitle.trim() && newTestExpected.trim()) {
            const newTest: TestCase = {
                id: `custom-test-${Date.now()}`,
                title: newTestTitle.trim(),
                precondition: newTestPrecondition.trim() || '(사전 조건 없음)',
                testSteps: newTestSteps.split('\n').filter(s => s.trim()),
                expectedResult: newTestExpected.trim(),
                priority: newTestPriority,
            };
            setCustomTests(prev => [...prev, newTest]);
            setCheckedTests(prev => ({ ...prev, [newTest.id]: false }));
            setNewTestTitle('');
            setNewTestPrecondition('');
            setNewTestSteps('');
            setNewTestExpected('');
            setNewTestPriority('Medium');
        }
    };

    const handleRemoveCustomTest = (id: string) => {
        setCustomTests(prev => prev.filter(t => t.id !== id));
        setCheckedTests(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const allChecklist = [...docs.checklist, ...customFeatures];
    const checkedCount = allChecklist.filter(item => checkedItems[item.id]).length;

    const allTestCases = [...(docs.testCases || []), ...customTests];
    const checkedTestCount = allTestCases.filter(tc => checkedTests[tc.id]).length;

    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1460880172357128263/PZB6PyXgBBk-wdIQwJrhRjJTk2Pb7Ngsu5ZpYXOFftUzZ-qIpdU3QJf-2UtczUzvTtZ6';

    const handleSubmitReport = async () => {
        const checkedFeatures = allChecklist.filter(item => checkedItems[item.id]);
        const uncheckedFeatures = allChecklist.filter(item => !checkedItems[item.id]);
        const completedTests = allTestCases.filter(tc => checkedTests[tc.id]);
        const pendingTests = allTestCases.filter(tc => !checkedTests[tc.id]);

        setIsSubmitting(true);
        setSubmitResult(null);

        // Helper function to chunk array into groups (for Discord 1024 char limit)
        const chunkItems = (items: { id?: string; title: string }[], chunkSize: number = 12) => {
            const chunks: string[][] = [];
            for (let i = 0; i < items.length; i += chunkSize) {
                chunks.push(items.slice(i, i + chunkSize).map((f, idx) => {
                    const itemId = (f as ChecklistItem).id;
                    const deadline = itemId && itemDeadlines[itemId] ? ` 📅${itemDeadlines[itemId]}` : '';
                    return `${i + idx + 1}. ${f.title}${deadline}`;
                }));
            }
            return chunks;
        };

        // Build fields array with all items
        const fields: { name: string; value: string; inline: boolean }[] = [];

        // Assignee info (if provided)
        if (assigneeName.trim()) {
            fields.push({
                name: '👤 담당자',
                value: `**${assigneeName.trim()}**`,
                inline: false
            });
        }

        // Group checked features by category for table format
        const groupedFeatures = checkedFeatures.reduce((acc, item) => {
            const category = item.category || '기타';
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
        }, {} as Record<string, ChecklistItem[]>);

        // Create table-style output for each category
        Object.entries(groupedFeatures).forEach(([category, items]) => {
            // Create table header
            let tableContent = '```\n';
            tableContent += '┌─────────────────────────────────────────────────┐\n';
            tableContent += `│ 📂 ${category.padEnd(44)}│\n`;
            tableContent += '├───────────────────────┬─────────────────────────┤\n';
            tableContent += '│ 기능                  │ 예정일                  │\n';
            tableContent += '├───────────────────────┼─────────────────────────┤\n';

            items.forEach((item) => {
                const title = item.title.length > 20 ? item.title.slice(0, 18) + '..' : item.title.padEnd(20);
                const deadline = itemDeadlines[item.id] || '-';
                const deadlinePad = deadline.padEnd(22);
                tableContent += `│ ${title} │ ${deadlinePad} │\n`;
            });

            tableContent += '└───────────────────────┴─────────────────────────┘\n';
            tableContent += '```';

            fields.push({
                name: `📌 ${category} (${items.length}개)`,
                value: tableContent,
                inline: false
            });
        });

        // Summary field
        fields.push({
            name: '📊 요약',
            value: `✅ 총 **${checkedFeatures.length}개** 기능 선택\n` +
                `📂 **${Object.keys(groupedFeatures).length}개** 카테고리`,
            inline: false
        });

        // Discord Embed 형식으로 메시지 구성 (최대 25개 fields)
        const embed = {
            title: `📋 기능 정의 리포트: ${docs.title}`,
            color: 0x4F46E5, // Primary color (indigo)
            fields: fields.slice(0, 25), // Discord limit: 25 fields
            footer: {
                text: `LegalRisk AI Platform | ${new Date().toLocaleString('ko-KR')}`
            },
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'LegalRisk AI Reporter',
                    avatar_url: 'https://cdn-icons-png.flaticon.com/512/4727/4727424.png',
                    embeds: [embed]
                }),
            });

            if (response.ok) {
                setSubmitResult({ type: 'success', message: '✅ Discord 채널에 리포트가 전송되었습니다!' });
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('Discord webhook error:', error);
            setSubmitResult({ type: 'error', message: '❌ 전송 실패. 네트워크를 확인해주세요.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 테스트 정의서 전용 리포트 전송
    const handleSubmitTestReport = async () => {
        const completedTests = allTestCases.filter(tc => checkedTests[tc.id]);
        const pendingTests = allTestCases.filter(tc => !checkedTests[tc.id]);
        const highPriorityPending = pendingTests.filter(tc => tc.priority === 'High');

        setIsSubmitting(true);
        setSubmitResult(null);

        const embed = {
            title: `🧪 테스트 정의서 리포트: ${docs.title}`,
            color: 0x8B5CF6, // Purple
            description: `**테스트 진행률: ${allTestCases.length > 0 ? Math.round((completedTests.length / allTestCases.length) * 100) : 0}%**\n전체 ${allTestCases.length}개 중 ${completedTests.length}개 완료`,
            fields: [
                {
                    name: `✅ 완료된 테스트 (${completedTests.length}개)`,
                    value: completedTests.length > 0
                        ? completedTests.slice(0, 8).map((tc, i) =>
                            `${i + 1}. ✓ **${tc.title}** \`[${tc.priority}]\``
                        ).join('\n') + (completedTests.length > 8 ? `\n... 외 ${completedTests.length - 8}개` : '')
                        : '없음',
                    inline: false
                },
                {
                    name: `🔴 미완료 High 우선순위 (${highPriorityPending.length}개)`,
                    value: highPriorityPending.length > 0
                        ? highPriorityPending.slice(0, 5).map((tc, i) =>
                            `${i + 1}. ⚠️ ${tc.title}`
                        ).join('\n') + (highPriorityPending.length > 5 ? `\n... 외 ${highPriorityPending.length - 5}개` : '')
                        : '✅ 모든 High 우선순위 테스트 완료!',
                    inline: false
                },
                {
                    name: `⏳ 전체 미완료 테스트 (${pendingTests.length}개)`,
                    value: pendingTests.length > 0
                        ? pendingTests.slice(0, 5).map((tc, i) =>
                            `${i + 1}. ${tc.title} \`[${tc.priority}]\``
                        ).join('\n') + (pendingTests.length > 5 ? `\n... 외 ${pendingTests.length - 5}개` : '')
                        : '🎉 모든 테스트 완료!',
                    inline: false
                }
            ],
            footer: {
                text: `LegalRisk AI Platform - 테스트 리포트 | ${new Date().toLocaleString('ko-KR')}`
            },
            timestamp: new Date().toISOString()
        };

        try {
            const response = await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'LegalRisk AI Test Reporter',
                    avatar_url: 'https://cdn-icons-png.flaticon.com/512/2756/2756778.png',
                    embeds: [embed]
                }),
            });

            if (response.ok) {
                setSubmitResult({ type: 'success', message: '✅ 테스트 리포트가 Discord로 전송되었습니다!' });
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('Discord webhook error:', error);
            setSubmitResult({ type: 'error', message: '❌ 전송 실패. 네트워크를 확인해주세요.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const tabs = [
        { id: 'overview' as TabType, label: '기능 개요', icon: BookOpen },
        { id: 'wireframe' as TabType, label: '와이어프레임', icon: Layout },
        { id: 'usecase' as TabType, label: '유즈케이스', icon: Users },
        { id: 'checklist' as TabType, label: '기능 정의서', icon: CheckSquare },
        { id: 'test' as TabType, label: '테스트 정의서', icon: FlaskConical },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-5xl max-h-[90vh] mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-white" />
                        <div>
                            <h2 className="text-lg font-semibold text-white">{docs.title}</h2>
                            <p className="text-primary-100 text-sm">{docs.subtitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                {tab.id === 'checklist' && (
                                    <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${checkedCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {checkedCount}/{allChecklist.length}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <BookOpen className="w-5 h-5 text-blue-600" />기능 개요
                                </h3>
                                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">{docs.overview}</p>
                            </section>
                            <section className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                    <h4 className="font-semibold text-green-800 mb-2">📥 입력</h4>
                                    <p className="text-green-700 text-sm">{docs.inputDescription}</p>
                                </div>
                                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                                    <h4 className="font-semibold text-purple-800 mb-2">📤 출력</h4>
                                    <p className="text-purple-700 text-sm">{docs.outputDescription}</p>
                                </div>
                            </section>
                            <section className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                <h4 className="font-semibold text-yellow-800 mb-2">🤖 AI 모델</h4>
                                <code className="text-yellow-700 text-sm">{docs.aiModel}</code>
                            </section>
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <Code className="w-5 h-5 text-orange-600" />구현 단계
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {docs.implementationSteps.map((step, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">
                                            {idx + 1}. {step}
                                        </span>
                                    ))}
                                </div>
                            </section>
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <Database className="w-5 h-5 text-cyan-600" />관련 DB 테이블
                                </h3>
                                <div className="space-y-2">
                                    {docs.dbTables.map((table, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <code className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded text-sm">{table.name}</code>
                                            <span className="text-gray-600 text-sm">{table.purpose}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <Workflow className="w-5 h-5 text-pink-600" />데이터 흐름
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 rounded-xl">
                                    {docs.dataFlow.map((step, idx) => (
                                        <span key={idx} className="flex items-center gap-2">
                                            <span className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">{step}</span>
                                            {idx < docs.dataFlow.length - 1 && <ArrowRight className="w-4 h-4 text-gray-400" />}
                                        </span>
                                    ))}
                                </div>
                            </section>

                            {/* Recommended APIs Section */}
                            {docs.recommendedApis && docs.recommendedApis.length > 0 && (
                                <section>
                                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                        🔗 추천 실제 API (데이터 연동용)
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4">
                                        Mock API 대신 실제 서비스 연동 시 활용할 수 있는 API입니다.
                                    </p>
                                    <div className="space-y-4">
                                        {docs.recommendedApis.map((api, idx) => (
                                            <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-semibold text-blue-900">{api.name}</h4>
                                                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{api.provider}</span>
                                                    </div>
                                                    <a
                                                        href={api.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                                                    >
                                                        문서 보기 →
                                                    </a>
                                                </div>
                                                <p className="text-sm text-blue-800 mb-2">{api.description}</p>
                                                <div className="flex items-center gap-2 text-xs text-blue-600">
                                                    <span className="font-medium">💰 가격:</span>
                                                    <span>{api.pricing}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}

                    {/* Wireframe Tab */}
                    {activeTab === 'wireframe' && (
                        <div className="space-y-6">
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <Layout className="w-5 h-5 text-indigo-600" />와이어프레임
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    아래는 해당 기능의 UI 레이아웃 구조를 ASCII 다이어그램으로 표현한 것입니다.
                                </p>
                                <pre className="p-6 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-auto whitespace-pre leading-relaxed">
                                    {docs.wireframe}
                                </pre>
                            </section>
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <Database className="w-5 h-5 text-indigo-600" />ERD 관계
                                </h3>
                                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                                    <code className="text-indigo-700 text-sm">{docs.erdDescription}</code>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Use Case Tab */}
                    {activeTab === 'usecase' && (
                        <div className="space-y-6">
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <Users className="w-5 h-5 text-teal-600" />유즈케이스
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    각 사용자 유형별로 예상되는 시나리오와 기대 결과입니다. 상세 플로우를 확인하려면 항목을 클릭하세요.
                                </p>
                                <div className="space-y-4">
                                    {docs.useCases.map((uc, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                                            <div className="p-4 bg-white flex items-start gap-4">
                                                <div className="flex-shrink-0 w-20">
                                                    <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-medium">
                                                        {uc.actor}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900 mb-1">{uc.action}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        <span className="text-gray-400">기대 결과: </span>{uc.expected}
                                                    </p>
                                                </div>
                                            </div>
                                            {uc.flow && uc.flow.length > 0 && (
                                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                                    <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">상세 플로우</h5>
                                                    <div className="space-y-1.5">
                                                        {uc.flow.map((step, stepIdx) => (
                                                            <div key={stepIdx} className="flex items-start gap-2">
                                                                <ArrowRight className="w-3 h-3 text-primary-500 mt-1 flex-shrink-0" />
                                                                <span className="text-sm text-gray-700">{step}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Test Tab */}
                    {activeTab === 'test' && (
                        <div className="space-y-6">
                            {/* Add New Test - At Top */}
                            <section className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-900 mb-4">
                                    <Plus className="w-5 h-5" />새 테스트 케이스 추가
                                </h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            value={newTestTitle}
                                            onChange={(e) => setNewTestTitle(e.target.value)}
                                            placeholder="테스트 제목 (예: 분석 실행 테스트)"
                                            className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <select
                                            value={newTestPriority}
                                            onChange={(e) => setNewTestPriority(e.target.value as 'High' | 'Medium' | 'Low')}
                                            className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="High">🔴 High (필수)</option>
                                            <option value="Medium">🟡 Medium (권장)</option>
                                            <option value="Low">🟢 Low (선택)</option>
                                        </select>
                                    </div>
                                    <input
                                        type="text"
                                        value={newTestPrecondition}
                                        onChange={(e) => setNewTestPrecondition(e.target.value)}
                                        placeholder="사전 조건 (예: 페이지에 접속한 상태)"
                                        className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <textarea
                                        value={newTestSteps}
                                        onChange={(e) => setNewTestSteps(e.target.value)}
                                        placeholder="테스트 단계 (한 줄에 하나씩)&#10;1. 버튼 클릭&#10;2. 결과 확인"
                                        rows={3}
                                        className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    />
                                    <input
                                        type="text"
                                        value={newTestExpected}
                                        onChange={(e) => setNewTestExpected(e.target.value)}
                                        placeholder="기대 결과 (예: 성공 메시지가 표시됨)"
                                        className="w-full px-4 py-3 bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={handleAddTest}
                                        disabled={!newTestTitle.trim() || !newTestExpected.trim()}
                                        className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-4 h-4" />
                                        테스트 케이스 추가
                                    </button>
                                </div>
                            </section>

                            {/* Test Cases Checklist */}
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <FlaskConical className="w-5 h-5 text-purple-600" />
                                    테스트 케이스 체크리스트
                                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-sm rounded-full">
                                        {checkedTestCount} / {allTestCases.length} 완료
                                    </span>
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    완료한 테스트에 체크하세요. 우선순위에 따라 테스트를 진행하세요.
                                </p>
                                {allTestCases.length > 0 ? (
                                    <div className="space-y-4">
                                        {allTestCases.map((tc, idx) => (
                                            <div
                                                key={tc.id}
                                                className={`border rounded-xl overflow-hidden transition-all ${checkedTests[tc.id]
                                                    ? 'bg-green-50 border-green-300'
                                                    : customTests.find(t => t.id === tc.id)
                                                        ? 'bg-purple-50 border-purple-200'
                                                        : 'border-gray-200'
                                                    }`}
                                            >
                                                <div className="p-4 bg-white flex items-start gap-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedTests[tc.id] || false}
                                                        onChange={() => handleTestCheckToggle(tc.id)}
                                                        className="mt-1 w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                                                    />
                                                    <div className="flex-shrink-0">
                                                        <span className={`px-2 py-1 rounded-lg text-xs font-bold ${tc.priority === 'High' ? 'bg-red-100 text-red-700' :
                                                            tc.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {tc.priority}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className={`font-medium mb-1 ${checkedTests[tc.id] ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                                                            <span className="text-gray-400 mr-2">TC-{idx + 1}</span>
                                                            {tc.title}
                                                            {customTests.find(t => t.id === tc.id) && (
                                                                <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                                                                    추가됨
                                                                </span>
                                                            )}
                                                        </h4>
                                                        <p className={`text-sm ${checkedTests[tc.id] ? 'text-green-600' : 'text-gray-500'}`}>
                                                            <span className="font-medium">사전 조건: </span>{tc.precondition}
                                                        </p>
                                                    </div>
                                                    {customTests.find(t => t.id === tc.id) && (
                                                        <button
                                                            onClick={() => handleRemoveCustomTest(tc.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-4">
                                                    <div>
                                                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">테스트 단계</h5>
                                                        <div className="space-y-1.5">
                                                            {tc.testSteps.map((step, stepIdx) => (
                                                                <div key={stepIdx} className="flex items-start gap-2">
                                                                    <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${checkedTests[tc.id] ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'
                                                                        }`}>
                                                                        {stepIdx + 1}
                                                                    </span>
                                                                    <span className={`text-sm ${checkedTests[tc.id] ? 'text-green-700' : 'text-gray-700'}`}>
                                                                        {step.replace(/^\d+\.\s*/, '')}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">기대 결과</h5>
                                                        <div className={`p-3 rounded-lg border ${checkedTests[tc.id]
                                                            ? 'bg-green-100 border-green-300'
                                                            : 'bg-green-50 border-green-200'
                                                            }`}>
                                                            <p className={`text-sm ${checkedTests[tc.id] ? 'text-green-900' : 'text-green-800'}`}>
                                                                {tc.expectedResult}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200">
                                        <FlaskConical className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">테스트 케이스가 없습니다.</p>
                                        <p className="text-gray-400 text-sm mt-1">위 폼을 사용하여 새 테스트를 추가하세요.</p>
                                    </div>
                                )}
                            </section>

                            {/* Submit Test Report */}
                            <section className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-800 mb-4">
                                    🧪 테스트 진행 현황
                                </h3>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                                        <p className="text-2xl font-bold text-gray-900">{allTestCases.length}</p>
                                        <p className="text-sm text-gray-500">전체 테스트</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                                        <p className="text-2xl font-bold text-green-700">{checkedTestCount}</p>
                                        <p className="text-sm text-green-600">완료</p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
                                        <p className="text-2xl font-bold text-yellow-700">{allTestCases.length - checkedTestCount}</p>
                                        <p className="text-sm text-yellow-600">미완료</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSubmitTestReport}
                                    disabled={allTestCases.length === 0 || isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-fuchsia-500 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-3"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            전송 중...
                                        </>
                                    ) : (
                                        <>
                                            <FlaskConical className="w-5 h-5" />
                                            테스트 리포트 전송 (Discord)
                                        </>
                                    )}
                                </button>
                                {submitResult && (
                                    <div className={`mb-3 p-3 rounded-lg text-center text-sm font-medium ${submitResult.type === 'success'
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                        }`}>
                                        {submitResult.message}
                                    </div>
                                )}
                                <p className="text-gray-500 text-xs text-center">
                                    테스트 진행 현황을 Discord 채널로 전송합니다.
                                </p>
                            </section>
                        </div>
                    )}

                    {/* Checklist Tab */}
                    {activeTab === 'checklist' && (
                        <div className="space-y-6">
                            {/* Add New Feature - Now at the top */}
                            <section className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-900 mb-4">
                                    <Plus className="w-5 h-5" />새 기능 추가
                                </h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        value={newFeatureTitle}
                                        onChange={(e) => setNewFeatureTitle(e.target.value)}
                                        placeholder="기능 제목 (예: 로딩 스피너 표시)"
                                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <textarea
                                        value={newFeatureDesc}
                                        onChange={(e) => setNewFeatureDesc(e.target.value)}
                                        placeholder="세부 내용 (예: API 호출 중 버튼 내부에 스피너 아이콘과 '처리 중...' 텍스트를 표시한다.)"
                                        rows={2}
                                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    />
                                    <button
                                        onClick={handleAddFeature}
                                        disabled={!newFeatureTitle.trim()}
                                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-4 h-4" />
                                        체크리스트에 추가
                                    </button>
                                </div>
                            </section>

                            {/* Feature Checklist */}
                            <section>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
                                    <CheckSquare className="w-5 h-5 text-green-600" />
                                    기능 정의서 체크리스트
                                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-sm rounded-full">
                                        {checkedCount} / {allChecklist.length} 선택
                                    </span>
                                </h3>
                                <p className="text-gray-500 text-sm mb-4">
                                    구현할 기능을 선택하세요. 각 항목은 개발자가 구현해야 할 세부 기능 단위입니다.
                                </p>

                                {/* Category Filter Buttons */}
                                <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                                    <span className="text-sm font-medium text-gray-600 mr-2 self-center">📂 카테고리:</span>
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === null
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                            }`}
                                    >
                                        전체 보기
                                    </button>
                                    {Object.keys(
                                        allChecklist.reduce((acc, item) => {
                                            const category = item.category || '기타 기능';
                                            acc[category] = true;
                                            return acc;
                                        }, {} as Record<string, boolean>)
                                    ).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-8">
                                    {Object.entries(
                                        allChecklist
                                            .filter(item => selectedCategory === null || item.category === selectedCategory || (!item.category && selectedCategory === '기타 기능'))
                                            .reduce((acc, item) => {
                                                const category = item.category || '기타 기능 (추가 분류 필요)';
                                                if (!acc[category]) acc[category] = [];
                                                acc[category].push(item);
                                                return acc;
                                            }, {} as Record<string, ChecklistItem[]>)
                                    ).map(([category, items]) => (
                                        <div key={category} className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                                            <div className="mb-6">
                                                <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                                                    {category}
                                                    <span className={`text-xs ml-2 px-2.5 py-1 rounded-full border ${items.every(i => checkedItems[i.id])
                                                        ? 'bg-green-100 text-green-700 border-green-200 font-medium'
                                                        : 'bg-white text-gray-500 border-gray-200'
                                                        }`}>
                                                        {items.filter(i => checkedItems[i.id]).length} / {items.length} 완료
                                                    </span>
                                                </h4>
                                                {docs.categories?.[category] && (
                                                    <div className="ml-3.5 pl-4 border-l-2 border-gray-200 space-y-2">
                                                        <p className="text-gray-700 font-medium leading-relaxed">
                                                            <span className="text-indigo-600 mr-2">💡 정의:</span>
                                                            {docs.categories[category].definition}
                                                        </p>
                                                        <p className="text-gray-600 text-sm">
                                                            <span className="text-emerald-600 mr-2">🎯 목표:</span>
                                                            {docs.categories[category].goal}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-3 pl-2">
                                                {items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className={`p-4 rounded-xl border transition-all ${checkedItems[item.id]
                                                            ? 'bg-green-50 border-green-300'
                                                            : item.isCustom
                                                                ? 'bg-blue-50 border-blue-200'
                                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedItems[item.id] || false}
                                                                onChange={() => handleCheckToggle(item.id)}
                                                                className="mt-1 w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                                                            />
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`font-semibold ${checkedItems[item.id] ? 'text-green-800' : 'text-gray-900'}`}>
                                                                        {item.title}
                                                                    </span>
                                                                    {item.isCustom && (
                                                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                                            추가됨
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className={`text-sm mt-1 ${checkedItems[item.id] ? 'text-green-600' : 'text-gray-500'}`}>
                                                                    {item.description}
                                                                </p>
                                                                {item.dataDescription && (
                                                                    <div className="mt-2 flex items-center gap-2">
                                                                        <Database className="w-3.5 h-3.5 text-cyan-600" />
                                                                        <code className="text-xs px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded border border-cyan-200">
                                                                            {item.dataDescription}
                                                                        </code>
                                                                    </div>
                                                                )}
                                                                {/* Per-item deadline date */}
                                                                {checkedItems[item.id] && (
                                                                    <div className="mt-3 flex items-center gap-2">
                                                                        <span className="text-xs text-gray-500">📅 예정일:</span>
                                                                        <input
                                                                            type="date"
                                                                            value={itemDeadlines[item.id] || ''}
                                                                            onChange={(e) => setItemDeadlines(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                                            className="px-2 py-1 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                                        />
                                                                        {itemDeadlines[item.id] && (
                                                                            <span className="text-xs text-indigo-600 font-medium">
                                                                                {new Date(itemDeadlines[item.id]).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {item.isCustom && (
                                                                <button
                                                                    onClick={() => handleRemoveCustomFeature(item.id)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Submit Report */}
                            <section className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                                    📋 선택된 기능 요약
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    총 <span className="font-bold text-primary-600">{checkedCount}</span>개의 기능이 선택되었습니다.
                                </p>

                                {/* Assignee Name Input */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        👤 담당자 이름
                                    </label>
                                    <input
                                        type="text"
                                        value={assigneeName}
                                        onChange={(e) => setAssigneeName(e.target.value)}
                                        placeholder="담당자 이름을 입력하세요"
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    {assigneeName.trim() && (
                                        <p className="mt-2 text-sm text-indigo-600">
                                            ✓ 담당자: <strong>{assigneeName.trim()}</strong>
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={handleSubmitReport}
                                    disabled={checkedCount === 0 || isSubmitting}
                                    className="w-full py-4 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Discord로 전송 중...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            리포트 제출하기 (Discord)
                                        </>
                                    )}
                                </button>
                                {submitResult && (
                                    <div className={`mt-3 p-3 rounded-lg text-center text-sm font-medium ${submitResult.type === 'success'
                                        ? 'bg-green-100 text-green-800 border border-green-200'
                                        : 'bg-red-100 text-red-800 border border-red-200'
                                        }`}>
                                        {submitResult.message}
                                    </div>
                                )}
                                <p className="text-center text-gray-500 text-xs mt-3">
                                    버튼 클릭 시 선택된 기능 목록이 Discord 채널로 전송됩니다.
                                </p>
                            </section>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-500">
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
