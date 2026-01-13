'use client';

import React, { useMemo, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, Filter } from 'lucide-react';

export type Column<T extends Record<string, unknown>> = {
  key: keyof T & string; // ✅ string이면서 T의 실제 키만 허용
  label: string;
  render?: (value: unknown, row: T) => React.ReactNode;
};

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  emptyMessage?: string;
  searchable?: boolean;
  filterable?: boolean;
  onRowClick?: (row: T) => void; // ✅ 누락된 prop 추가
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  emptyMessage = '데이터가 없습니다.',
  searchable = true,
  filterable = true,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterColumn, setFilterColumn] = useState<'all' | (keyof T & string)>('all');
  const [pageSizeOption, setPageSizeOption] = useState(pageSize);

  // Filter and search data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      if (!searchTerm) return true;

      const keysToSearch: (keyof T & string)[] =
        filterColumn === 'all' ? columns.map((c) => c.key) : [filterColumn];

      return keysToSearch.some((key) => {
        const value = row[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, filterColumn, columns]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSizeOption));
  const startIndex = (currentPage - 1) * pageSizeOption;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSizeOption);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // CSV escape helper
  const escapeCsv = (v: unknown) => {
    const s =
      v === null || v === undefined
        ? ''
        : typeof v === 'object'
          ? JSON.stringify(v)
          : String(v);

    // 쉼표/줄바꿈/따옴표가 있으면 "..."로 감싸고 내부 "는 ""로 이스케이프
    if (/[,"\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
    return s;
  };

  const handleDownloadCSV = () => {
    const headers = columns.map((c) => escapeCsv(c.label)).join(',');
    const rows = filteredData.map((row) =>
      columns.map((c) => escapeCsv(row[c.key])).join(',')
    );
    const csv = [headers, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data_export.csv';
    link.click();
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    return String(value);
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Search */}
        {searchable && (
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Column filter */}
            {filterable && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={filterColumn}
                  onChange={(e) => setFilterColumn(e.target.value as 'all' | (keyof T & string))}
                  className="pl-10 pr-8 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
                >
                  <option value="all">전체 컬럼</option>
                  {columns.map((col) => (
                    <option key={col.key} value={col.key}>
                      {col.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Page size & download */}
        <div className="flex items-center gap-3">
          <select
            value={pageSizeOption}
            onChange={(e) => {
              setPageSizeOption(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
          >
            <option value={10}>10개씩</option>
            <option value={20}>20개씩</option>
            <option value={50}>50개씩</option>
          </select>

          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-slate-700 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={`
                    bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors
                    ${onRowClick ? 'cursor-pointer' : ''}
                  `}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {column.render ? column.render(row[column.key], row) : formatValue(row[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm">
          <div className="text-gray-500 dark:text-gray-400">
            총 {filteredData.length}개 중 {filteredData.length === 0 ? 0 : startIndex + 1}-
            {Math.min(startIndex + pageSizeOption, filteredData.length)}개
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`
                      w-8 h-8 rounded-lg text-sm font-medium transition-colors
                      ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
