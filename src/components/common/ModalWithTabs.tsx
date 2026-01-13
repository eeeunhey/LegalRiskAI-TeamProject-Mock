'use client';

import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Database, Code, Table } from 'lucide-react';
import DataTable from './DataTable';
import { TableSchema } from '@/types';

interface ModalWithTabsProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    jsonData?: unknown;
    tableData?: unknown[];
    schema?: TableSchema;
}

type TabType = 'json' | 'table' | 'schema';

export default function ModalWithTabs({ isOpen, onClose, title, jsonData, tableData, schema }: ModalWithTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('json');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (isOpen) { setActiveTab('json'); setCopied(false); }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = 'unset'; };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleCopyJson = () => {
        navigator.clipboard.writeText(JSON.stringify(jsonData ?? {}, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: 'json' as TabType, label: 'JSON', icon: Code },
        { id: 'table' as TabType, label: 'TABLE', icon: Table },
        { id: 'schema' as TabType, label: 'SCHEMA', icon: Database },
    ];

    const tableColumns = tableData && tableData.length > 0
        ? Object.keys(tableData[0] as Record<string, unknown>).map(key => ({ key, label: key }))
        : [];

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
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-4xl max-h-[85vh] mx-4 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-fadeIn">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                                <Icon className="w-4 h-4" />{tab.label}
                            </button>
                        );
                    })}
                </div>
                <div className="flex-1 overflow-auto p-6">
                    {activeTab === 'json' && (
                        <div className="relative">
                            <button onClick={handleCopyJson} className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200">
                                {copied ? <><Check className="w-4 h-4 text-green-500" />복사됨</> : <><Copy className="w-4 h-4" />복사</>}
                            </button>
                            <pre className="p-4 bg-gray-50 rounded-lg overflow-auto text-sm text-gray-700 font-mono leading-relaxed border border-gray-200">
                                {JSON.stringify(jsonData ?? {}, null, 2)}
                            </pre>
                        </div>
                    )}
                    {activeTab === 'table' && tableData && (
                        <DataTable columns={tableColumns} data={tableData as Record<string, unknown>[]} pageSize={5} emptyMessage="테이블 데이터가 없습니다." />
                    )}
                    {activeTab === 'schema' && schema && (
                        <div>
                            <div className="mb-4">
                                <span className="text-sm text-gray-500">테이블: </span>
                                <span className="text-primary-600 font-mono font-medium">{schema.tableName}</span>
                            </div>
                            <DataTable columns={schemaColumns as any} data={schema.columns as unknown as Record<string, unknown>[]} searchable={false} filterable={false} pageSize={20} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
