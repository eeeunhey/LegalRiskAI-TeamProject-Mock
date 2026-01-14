'use client';

import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Database, Code, Table, Network } from 'lucide-react';
import DataTable from './DataTable';
import { TableSchema } from '@/types';
import { ERDView } from './ERDModal';

interface ModalWithTabsProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    jsonData?: unknown;
    tableData?: unknown[];
    schema?: TableSchema;
}

type TabType = 'json' | 'table' | 'schema' | 'erd';

// Helper to generate TypeScript interface from JSON
function generateTypeDefinition(data: unknown, name: string = 'Data'): string {
    if (data === null) return 'type Data = null;';
    if (typeof data !== 'object') return `type Data = ${typeof data};`;

    const getTypeName = (value: unknown): string => {
        if (value === null) return 'null';
        if (Array.isArray(value)) {
            if (value.length === 0) return 'any[]';
            const firstType = getTypeName(value[0]);
            return `${firstType}[]`;
        }
        if (typeof value === 'object') return 'object'; // Simplified for nested objects
        return typeof value;
    };

    let result = `interface ${name} {\n`;
    Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
        result += `  ${key}: ${getTypeName(value)};\n`;
    });
    result += '}';
    return result;
}

// Key-Value Table for Object
function JsonToTable({ data }: { data: Record<string, unknown> }) {
    const rows = Object.entries(data).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value).substring(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '') : String(value),
        type: Array.isArray(value) ? 'array' : typeof value
    }));

    return (
        <div className="border rounded-lg overflow-hidden text-sm">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                    <tr>
                        <th className="px-4 py-2 w-1/4">Key</th>
                        <th className="px-4 py-2 w-1/6">Type</th>
                        <th className="px-4 py-2">Value</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {rows.map((row, i) => (
                        <tr key={i} className="bg-white hover:bg-gray-50">
                            <td className="px-4 py-2 font-mono text-primary-700">{row.key}</td>
                            <td className="px-4 py-2 text-gray-500 text-xs">{row.type}</td>
                            <td className="px-4 py-2 text-gray-700 font-mono truncate max-w-xs" title={String(row.value)}>{row.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

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
        { id: 'erd' as TabType, label: 'ERD', icon: Network },
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

    const generatedSchema = jsonData ? generateTypeDefinition(jsonData) : '';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
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
                        <div className="space-y-6">
                            {/* Inferred Schema Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Database className="w-4 h-4 text-purple-600" />
                                    Infered Schema (TypeScript)
                                </h3>
                                <pre className="p-3 bg-slate-800 text-slate-100 rounded-lg text-xs font-mono overflow-auto border border-slate-700">
                                    {generatedSchema}
                                </pre>
                            </div>

                            {/* Data Table Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Table className="w-4 h-4 text-blue-600" />
                                    Data Structure Items
                                </h3>
                                {jsonData && typeof jsonData === 'object' ? (
                                    <JsonToTable data={jsonData as Record<string, unknown>} />
                                ) : (
                                    <p className="text-sm text-gray-500">객체 데이터가 아닙니다.</p>
                                )}
                            </div>

                            {/* Raw JSON Section */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Code className="w-4 h-4 text-gray-600" />
                                    Raw JSON
                                </h3>
                                <div className="relative">
                                    <button onClick={handleCopyJson} className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm z-10">
                                        {copied ? <><Check className="w-3 h-3 text-green-500" />복사됨</> : <><Copy className="w-3 h-3" />복사</>}
                                    </button>
                                    <pre className="p-4 bg-gray-50 rounded-lg overflow-auto text-sm text-gray-700 font-mono leading-relaxed border border-gray-200 h-64">
                                        {JSON.stringify(jsonData ?? {}, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'table' && tableData && (
                        <DataTable columns={tableColumns} data={tableData as Record<string, unknown>[]} pageSize={5} emptyMessage="테이블 데이터가 없습니다." />
                    )}
                    {activeTab === 'schema' && schema && (
                        <div>
                            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <h3 className="text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                                    <Database className="w-4 h-4" />
                                    테이블 정보: {schema.tableName}
                                </h3>
                                <p className="text-xs text-indigo-700">
                                    이 스키마는 실제 서비스에서 사용되는 데이터 구조를 반영합니다.
                                    효율적인 조회와 데이터 무결성을 위해 정규화 및 인덱싱 전략이 적용되었습니다.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <DataTable
                                    columns={schemaColumns as any}
                                    data={schema.columns as unknown as Record<string, unknown>[]}
                                    searchable={false}
                                    filterable={false}
                                    pageSize={20}
                                />

                                {/* Educational Details */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-gray-900 border-l-4 border-primary-500 pl-3">
                                        데이터 모델링 상세 가이드
                                    </h4>
                                    <div className="grid gap-4">
                                        {schema.columns.filter(c => c.pkReason || c.fkReason || c.dataStrategy).map((col) => (
                                            <div key={col.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-primary-300 transition-colors">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <code className="px-2 py-0.5 bg-white border border-gray-200 rounded text-sm font-mono text-primary-700 font-semibold">
                                                        {col.name}
                                                    </code>
                                                    <span className="text-xs text-gray-500">{col.type}</span>
                                                    {col.isPrimaryKey && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">PK</span>}
                                                    {col.isForeignKey && <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">FK</span>}
                                                </div>

                                                <div className="space-y-2 pl-2">
                                                    {col.pkReason && (
                                                        <div className="text-sm">
                                                            <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide block mb-0.5">PK 설계 이유</span>
                                                            <span className="text-gray-600">{col.pkReason}</span>
                                                        </div>
                                                    )}
                                                    {col.fkReason && (
                                                        <div className="text-sm">
                                                            <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide block mb-0.5">FK 관계 설정</span>
                                                            <span className="text-gray-600">{col.fkReason}</span>
                                                        </div>
                                                    )}
                                                    {col.dataStrategy && (
                                                        <div className="text-sm">
                                                            <span className="font-semibold text-gray-700 text-xs uppercase tracking-wide block mb-0.5">데이터 전략 & 최적화</span>
                                                            <span className="text-gray-600">{col.dataStrategy}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'erd' && (
                        <div>
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                    <Network className="w-4 h-4" />
                                    전체 데이터베이스 구조 (ERD)
                                </h3>
                                <p className="text-xs text-blue-700">
                                    현재 보고 계신 데이터가 전체 시스템 내에서 어떻게 연결되는지 아래 다이어그램을 통해 확인하세요.
                                </p>
                            </div>
                            <ERDView />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
