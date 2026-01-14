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
            { id: 'clf-1-1', title: '텍스트 입력 Textarea 렌더링', description: '사용자가 분쟁 내용을 입력할 수 있는 textarea 요소를 화면에 렌더링한다. 최소 높이 200px, placeholder 텍스트 포함.' },
            { id: 'clf-1-2', title: '입력 글자수 실시간 카운트', description: 'textarea 하단에 현재 입력된 글자수를 실시간으로 표시한다. (예: "152자")' },
            { id: 'clf-1-3', title: '최소 글자수 유효성 검사', description: '분석 실행 시 입력 텍스트가 30자 미만이면 Toast 경고를 표시하고 분석을 중단한다.' },
            { id: 'clf-2-1', title: '샘플 텍스트 자동 입력 버튼', description: '"샘플 텍스트 입력" 버튼 클릭 시 미리 정의된 예시 분쟁 텍스트를 textarea에 자동 입력한다.' },
            { id: 'clf-3-1', title: '분석 실행 버튼 UI', description: '"유형 분석 실행" 버튼을 그라데이션 스타일로 렌더링한다. 비활성화 상태 스타일 포함.' },
            { id: 'clf-3-2', title: '분석 중 로딩 스피너 표시', description: '분석 실행 중 버튼 내부에 회전하는 로딩 스피너와 "분석 중..." 텍스트를 표시한다.' },
            { id: 'clf-3-3', title: 'Mock API 호출 및 응답 파싱', description: '/mock/classify.json 파일을 fetch하여 분류 결과 데이터를 파싱한다.' },
            { id: 'clf-4-1', title: '분류 결과 카드 렌더링', description: '분석 완료 후 상단에 최상위 분류 레이블(예: Consumer)을 강조 표시하는 결과 카드를 렌더링한다.' },
            { id: 'clf-4-2', title: 'Bar Chart로 분류 점수 시각화', description: '각 분류 유형별 확률 점수를 수평 Bar Chart로 시각화한다. 가장 높은 점수 막대는 강조 색상.' },
            { id: 'clf-4-3', title: '키워드 태그 그룹 렌더링', description: 'AI가 추출한 핵심 키워드를 Chip/Tag 형태로 나열한다. 클릭 가능한 스타일.' },
            { id: 'clf-4-4', title: 'AI 판단 근거 설명 표시', description: '분류 결과에 대한 AI의 설명 텍스트를 박스 형태로 표시한다.' },
            { id: 'clf-5-1', title: 'In-Memory DB에 분석 결과 저장', description: 'db.saveClassificationResult()를 호출하여 분류 결과를 메모리 DB에 저장한다.' },
            { id: 'clf-5-2', title: 'Analysis Run 상태 업데이트', description: 'db.completeAnalysisRun()을 호출하여 분석 실행 상태를 success로 업데이트한다.' },
            { id: 'clf-5-3', title: 'Audit Log 기록', description: 'db.logAction()을 호출하여 VIEW_RESULT 액션을 감사 로그에 기록한다.' },
        ],
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
            { id: 'risk-1-1', title: '텍스트 입력 Textarea 렌더링', description: '경고 서신/통보문 내용을 입력받을 textarea 요소를 렌더링한다.' },
            { id: 'risk-1-2', title: '입력 글자수 실시간 표시', description: '현재 입력된 글자수를 textarea 하단에 표시한다.' },
            { id: 'risk-2-1', title: 'Gauge Chart 컴포넌트 렌더링', description: '리스크 점수(0-100)를 반원형 게이지 차트로 시각화한다. 색상은 점수에 따라 변경.' },
            { id: 'risk-2-2', title: '리스크 레벨 배지 표시', description: 'HIGH/MEDIUM/LOW 레벨을 색상별 배지로 표시한다. (빨강/노랑/초록)' },
            { id: 'risk-3-1', title: '승소 확률 Progress Bar 렌더링', description: '예상 승소 확률을 수평 Progress Bar로 시각화한다. 퍼센트 값 표시.' },
            { id: 'risk-4-1', title: '리스크 요인 목록 렌더링', description: '분석된 리스크 요인들을 목록 형태로 표시한다. 각 항목에 아이콘 포함.' },
            { id: 'risk-4-2', title: '리스크 요인 클릭 시 상세 설명 토글', description: '리스크 요인 항목 클릭 시 해당 항목의 상세 설명을 펼치거나 접는다.' },
            { id: 'risk-5-1', title: 'Mock API 호출 (/mock/risk.json)', description: 'fetch를 사용하여 위험도 분석 Mock 데이터를 불러온다.' },
            { id: 'risk-5-2', title: '분석 결과 DB 저장', description: 'db.saveRiskPrediction()으로 예측 결과를 저장한다.' },
            { id: 'risk-6-1', title: '참고 안내 메시지 표시', description: '분석 결과 하단에 "본 점수는 참고 지표입니다" 형태의 안내 메시지를 표시한다.' },
        ],
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
            { id: 'emo-1-1', title: '텍스트 입력 Textarea 렌더링', description: '대화 내용을 입력받는 textarea를 렌더링한다.' },
            { id: 'emo-1-2', title: '감정 키워드 하이라이트 표시', description: '입력된 텍스트 중 감정 키워드를 색상으로 강조 표시한다.' },
            { id: 'emo-2-1', title: '현재 감정 단계 배지 렌더링', description: '"위협 및 압박", "갈등 고조" 등 현재 단계를 배지 형태로 표시한다.' },
            { id: 'emo-2-2', title: '공격성 지수 수치 표시', description: '공격성 지수(0-100)를 큰 숫자로 표시하고 색상별로 구분한다.' },
            { id: 'emo-3-1', title: 'Line Chart로 감정 추이 시각화', description: 'T-3 → T-2 → T-1 → T0 시점별 감정 지수 변화를 꺾은선 그래프로 표시한다.' },
            { id: 'emo-3-2', title: '격화 속도 표시', description: '"fast", "moderate", "slow" 중 하나를 텍스트와 아이콘으로 표시한다.' },
            { id: 'emo-4-1', title: '감정 키워드 태그 렌더링', description: '분석된 감정 키워드들을 Chip 형태로 나열한다.' },
            { id: 'emo-5-1', title: 'Mock API 호출 (/mock/emotion.json)', description: 'fetch로 감정 분석 Mock 데이터를 불러온다.' },
            { id: 'emo-5-2', title: '분석 결과 DB 저장', description: 'db.saveEmotionEscalation()으로 결과를 저장한다.' },
        ],
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
            { id: 'sim-1-1', title: '텍스트 입력 Textarea 렌더링', description: '사건 상황을 입력받는 textarea를 렌더링한다.' },
            { id: 'sim-2-1', title: '쟁점 비교 테이블 렌더링', description: '입력 쟁점과 매칭된 쟁점을 2열 테이블로 비교 표시한다.' },
            { id: 'sim-2-2', title: '쟁점별 연결선 또는 하이라이트', description: '입력 쟁점과 매칭 쟁점 간 연결 관계를 시각적으로 표시한다.' },
            { id: 'sim-3-1', title: '유사 판례 카드 3개 렌더링', description: 'Top 3 유사 판례를 카드 형태로 렌더링한다. 각 카드에 제목, 유사도, 요약 포함.' },
            { id: 'sim-3-2', title: '유사도 퍼센트 배지 표시', description: '각 판례의 유사도를 %로 표시하고 색상으로 구분한다.' },
            { id: 'sim-3-3', title: '승소자 표시 (임차인/임대인)', description: '판례의 승소 당사자를 배지 형태로 표시한다.' },
            { id: 'sim-4-1', title: '판례 상세 모달 트리거', description: '판례 카드 클릭 시 상세 정보를 모달로 표시한다.' },
            { id: 'sim-4-2', title: '판결문 전체 보기 버튼', description: '모달 내 "판결문 보기" 버튼을 배치한다.' },
            { id: 'sim-5-1', title: 'Mock API 호출 (/mock/similar.json)', description: 'fetch로 유사 판례 Mock 데이터를 불러온다.' },
            { id: 'sim-5-2', title: '분석 결과 DB 저장', description: 'db.saveSimilarCaseMatch()로 결과를 저장한다.' },
        ],
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
            { id: 'str-1-1', title: '텍스트 입력 Textarea 렌더링', description: '분쟁 상황을 입력받는 textarea를 렌더링한다.' },
            { id: 'str-2-1', title: '예상 승소율 큰 숫자 표시', description: '예상 승소 확률을 크고 강조된 숫자로 표시한다.' },
            { id: 'str-3-1', title: '전략 요약 카드 렌더링', description: 'Key Takeaway와 Focus Points를 포함한 요약 카드를 렌더링한다.' },
            { id: 'str-3-2', title: 'Focus Points 목록 표시', description: '핵심 집중 포인트를 불릿 리스트로 표시한다.' },
            { id: 'str-4-1', title: '추천 시나리오 카드 3개 렌더링', description: '3가지 추천 전략 시나리오를 카드 형태로 렌더링한다.' },
            { id: 'str-4-2', title: '난이도 배지 표시 (easy/medium/hard)', description: '각 시나리오의 실행 난이도를 색상별 배지로 표시한다.' },
            { id: 'str-4-3', title: '효과 배지 표시 (low/medium/high)', description: '각 시나리오의 예상 효과를 배지로 표시한다.' },
            { id: 'str-4-4', title: '시나리오 설명 텍스트 표시', description: '각 시나리오에 대한 상세 설명을 표시한다.' },
            { id: 'str-4-5', title: 'Next Actions 아코디언 토글', description: '시나리오 선택 시 구체적인 다음 행동 목록을 펼쳐서 표시한다.' },
            { id: 'str-5-1', title: 'Mock API 호출 (/mock/strategy.json)', description: 'fetch로 전략 추천 Mock 데이터를 불러온다.' },
            { id: 'str-5-2', title: '분석 결과 DB 저장', description: 'db.saveStrategyRecommendation()으로 결과를 저장한다.' },
            { id: 'str-6-1', title: '면책 조항 안내 메시지 표시', description: '"본 전략 추천은 AI 분석 결과로, 참고 목적으로만 활용해 주세요." 메시지를 표시한다.' },
        ],
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
            { category: '데이터 저장', id: 'sim-9-2', title: '시뮬레이션 결과 DB 저장', description: 'db.saveSimulationResult()로 분석 결과를 메모리 DB에 저장한다.', dataDescription: 'simulation_results 테이블 INSERT' },
            { category: '데이터 저장', id: 'sim-9-3', title: 'Analysis Run 생성 및 연결', description: 'db.createAnalysisRun()으로 분석 실행 기록을 생성하고 결과와 연결한다.', dataDescription: 'analysis_runs 테이블 INSERT' },
        ],
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

    const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1460796340765327464/Hb19pQmG58jxbEU0G_mNEgM3IQLxnnM-yaUwb48WtasteRyJWpahT7nwgWNsIDc2RJqE';

    const handleSubmitReport = async () => {
        const checkedFeatures = allChecklist.filter(item => checkedItems[item.id]);
        const uncheckedFeatures = allChecklist.filter(item => !checkedItems[item.id]);
        const completedTests = allTestCases.filter(tc => checkedTests[tc.id]);
        const pendingTests = allTestCases.filter(tc => !checkedTests[tc.id]);

        setIsSubmitting(true);
        setSubmitResult(null);

        // Discord Embed 형식으로 메시지 구성
        const embed = {
            title: `📋 기능 정의 리포트: ${docs.title}`,
            color: 0x4F46E5, // Primary color (indigo)
            fields: [
                {
                    name: `✅ 선택된 기능 (${checkedFeatures.length}개)`,
                    value: checkedFeatures.length > 0
                        ? checkedFeatures.slice(0, 10).map((f, i) => `${i + 1}. **${f.title}**`).join('\n') + (checkedFeatures.length > 10 ? `\n... 외 ${checkedFeatures.length - 10}개` : '')
                        : '없음',
                    inline: false
                },
                {
                    name: `⏳ 미선택 기능 (${uncheckedFeatures.length}개)`,
                    value: uncheckedFeatures.length > 0
                        ? uncheckedFeatures.slice(0, 5).map((f, i) => `${i + 1}. ${f.title}`).join('\n') + (uncheckedFeatures.length > 5 ? `\n... 외 ${uncheckedFeatures.length - 5}개` : '')
                        : '없음',
                    inline: false
                },
                {
                    name: `🧪 완료된 테스트 (${completedTests.length}/${allTestCases.length})`,
                    value: completedTests.length > 0
                        ? completedTests.slice(0, 5).map((tc, i) => `${i + 1}. ✓ ${tc.title} [${tc.priority}]`).join('\n') + (completedTests.length > 5 ? `\n... 외 ${completedTests.length - 5}개` : '')
                        : '없음',
                    inline: true
                },
                {
                    name: `🔬 미완료 테스트 (${pendingTests.length}개)`,
                    value: pendingTests.length > 0
                        ? pendingTests.slice(0, 5).map((tc, i) => `${i + 1}. ${tc.title}`).join('\n') + (pendingTests.length > 5 ? `\n... 외 ${pendingTests.length - 5}개` : '')
                        : '없음',
                    inline: true
                }
            ],
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
                                <div className="space-y-8">
                                    {Object.entries(
                                        allChecklist.reduce((acc, item) => {
                                            const category = item.category || '기타 기능 (추가 분류 필요)';
                                            if (!acc[category]) acc[category] = [];
                                            acc[category].push(item);
                                            return acc;
                                        }, {} as Record<string, ChecklistItem[]>)
                                    ).map(([category, items]) => (
                                        <div key={category} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                                            <h4 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                                {category}
                                                <span className="text-xs font-normal text-gray-500 ml-2 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                                                    {items.filter(i => checkedItems[i.id]).length} / {items.length} 완료
                                                </span>
                                            </h4>
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
