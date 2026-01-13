'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
    columns: Column[];
    data: Record<string, unknown>[];
    searchable?: boolean;
    filterable?: boolean;
    pageSize?: number;
    onRowClick?: (row: Record<string, unknown>) => void;
    emptyMessage?: string;
}

export default function DataTable({
    columns,
    data,
    searchable = true,
    filterable = true,
    pageSize = 10,
    onRowClick,
    emptyMessage = '데이터가 없습니다.',
}: DataTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filterColumn, setFilterColumn] = useState<string>('all');
    const [pageSizeOption, setPageSizeOption] = useState(pageSize);

    const filteredData = useMemo(() => {
        return data.filter((row) => {
            if (!searchTerm) return true;
            const columnsToSearch = filterColumn === 'all' ? columns.map(c => c.key) : [filterColumn];
            return columnsToSearch.some((key) => {
                const value = row[key];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            });
        });
    }, [data, searchTerm, filterColumn, columns]);

    const totalPages = Math.ceil(filteredData.length / pageSizeOption);
    const startIndex = (currentPage - 1) * pageSizeOption;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSizeOption);

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const formatValue = (value: unknown): string => {
        if (value === null || value === undefined) return '-';
        if (typeof value === 'object') return JSON.stringify(value);
        if (typeof value === 'boolean') return value ? '✓' : '✗';
        return String(value);
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                {searchable && (
                    <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="검색..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        {filterable && (
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={filterColumn}
                                    onChange={(e) => setFilterColumn(e.target.value)}
                                    className="pl-10 pr-8 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                    <option value="all">전체 컬럼</option>
                                    {columns.map((col) => (<option key={col.key} value={col.key}>{col.label}</option>))}
                                </select>
                            </div>
                        )}
                    </div>
                )}
                <div className="flex items-center gap-3">
                    <select
                        value={pageSizeOption}
                        onChange={(e) => { setPageSizeOption(Number(e.target.value)); setCurrentPage(1); }}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700"
                    >
                        <option value={10}>10개씩</option>
                        <option value={20}>20개씩</option>
                        <option value={50}>50개씩</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            {columns.map((column) => (
                                <th key={column.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedData.length === 0 ? (
                            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">{emptyMessage}</td></tr>
                        ) : (
                            paginatedData.map((row, idx) => (
                                <tr key={idx} onClick={() => onRowClick?.(row)} className={`bg-white hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}>
                                    {columns.map((column) => (
                                        <td key={column.key} className="px-4 py-3 text-sm text-gray-700">
                                            {column.render ? column.render(row[column.key], row) : formatValue(row[column.key])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 text-sm">
                    <div className="text-gray-500">총 {filteredData.length}개 중 {startIndex + 1}-{Math.min(startIndex + pageSizeOption, filteredData.length)}개</div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 text-gray-700">{currentPage} / {totalPages}</span>
                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
