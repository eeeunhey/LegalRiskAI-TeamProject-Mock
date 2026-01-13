'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, Database, Code, Table } from 'lucide-react';
import DataTable from './DataTable';
import { TableSchema } from '@/types';

interface ModalWithTabsProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    jsonData?: unknown;
    tableData?: Record<string, unknown>[];
    schema?: TableSchema;
}

type TabType = 'json' | 'table' | 'schema';

export default function ModalWithTabs({
    isOpen,
    onClose,
    title,
    jsonData,
    tableData,
    schema,
}: ModalWithTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('json');
    const [copied, setCopied] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveTab('json');
            setCopied(false);
        }
    }, [isOpen]);

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

    const handleCopyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: 'json' as TabType, label: 'JSON', icon: Code },
        { id: 'table' as TabType, label: 'TABLE', icon: Table },
        { id: 'schema' as TabType, label: 'SCHEMA', icon: Database },
    ];

    // Generate table columns from data
    const tableColumns = tableData && tableData.length > 0
        ? Object.keys(tableData[0]).map(key => ({
            key,
            label: key,
        }))
        : [];

    // Schema columns for display
    const schemaColumns = [
        { key: 'name', label: '컬럼명' },
        { key: 'type', label: '타입' },
        { key: 'isPrimaryKey', label: 'PK', render: (v: unknown) => v ? '✓' : '' },
        { key: 'isForeignKey', label: 'FK', render: (v: unknown) => v ? '✓' : '' },
        { key: 'references', label: '참조', render: (v: unknown) => v || '-' },
        { key: 'description', label: '설명' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-4xl max-h-[85vh] mx-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-slate-700">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                  flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors
                  ${activeTab === tab.id
                                        ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                                    }
                `}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6">
                    {/* JSON Tab */}
                    {activeTab === 'json' && (
                        <div className="relative">
                            <button
                                onClick={handleCopyJson}
                                className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-500" />
                                        복사됨
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        복사
                                    </>
                                )}
                            </button>
                            <pre className="p-4 bg-gray-50 dark:bg-slate-900 rounded-lg overflow-auto text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed border border-gray-200 dark:border-slate-700">
                                {JSON.stringify(jsonData, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Table Tab */}
                    {activeTab === 'table' && tableData && (
                        <DataTable
                            columns={tableColumns}
                            data={tableData}
                            pageSize={5}
                            emptyMessage="테이블 데이터가 없습니다."
                        />
                    )}

                    {/* Schema Tab */}
                    {activeTab === 'schema' && schema && (
                        <div>
                            <div className="mb-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">테이블: </span>
                                <span className="text-primary-600 dark:text-primary-400 font-mono font-medium">{schema.tableName}</span>
                            </div>
                            <DataTable
                                columns={schemaColumns}
                                data={schema.columns}
                                searchable={false}
                                filterable={false}
                                pageSize={20}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
