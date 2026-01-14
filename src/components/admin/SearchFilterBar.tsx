'use client';

import { Search, Filter } from 'lucide-react';

interface SearchFilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchFilterBar({
    searchTerm,
    onSearchChange,
    placeholder = '검색어를 입력하세요...'
}: SearchFilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Future Extension: Filter Dropdown */}
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
                <span>필터</span>
            </button> */}
        </div>
    );
}
