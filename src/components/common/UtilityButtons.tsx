'use client';

import { FileJson, Database, Code, GitBranch, BookOpen } from 'lucide-react';

interface UtilityButtonsProps {
    onViewMockData: () => void;
    onViewDbTable: () => void;
    onViewSampleRecords: () => void;
    onViewERD: () => void;
    onViewDocs?: () => void;
}

export default function UtilityButtons({ onViewMockData, onViewDbTable, onViewSampleRecords, onViewERD, onViewDocs }: UtilityButtonsProps) {
    const buttons = [
        { icon: BookOpen, label: '기능 설명 보기', onClick: onViewDocs, highlight: true },
        { icon: FileJson, label: '목업 데이터 보기', onClick: onViewMockData },
        { icon: Database, label: 'DB 테이블 보기', onClick: onViewDbTable },
        { icon: Code, label: '샘플 레코드 보기', onClick: onViewSampleRecords },
        { icon: GitBranch, label: 'ERD 보기', onClick: onViewERD },
    ].filter(btn => btn.onClick);

    return (
        <div className="flex flex-wrap gap-2">
            {buttons.map((button, idx) => {
                const Icon = button.icon;
                return (
                    <button key={idx} onClick={button.onClick} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${button.highlight ? 'bg-primary-50 border-primary-200 text-primary-700 hover:bg-primary-100' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                        <Icon className="w-4 h-4" />{button.label}
                    </button>
                );
            })}
        </div>
    );
}
