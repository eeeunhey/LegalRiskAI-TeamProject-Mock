'use client';

import { Shield, CheckCircle, XCircle, Trash2, Edit2 } from 'lucide-react';
import { UserData } from './EditUserModal';

interface UserTableProps {
    users: UserData[];
    onEdit: (user: UserData) => void;
    onDelete: (id: number) => void;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function UserTable({ users, onEdit, onDelete, currentPage, totalPages, onPageChange }: UserTableProps) {
    if (users.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wide">
                            <th className="px-6 py-4 whitespace-nowrap">사용자</th>
                            <th className="px-6 py-4 whitespace-nowrap">권한</th>
                            <th className="px-6 py-4 whitespace-nowrap">상태</th>
                            <th className="px-6 py-4 whitespace-nowrap">마지막 로그인</th>
                            <th className="px-6 py-4 text-right whitespace-nowrap">관리</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                                        {user.role === 'admin' ? '관리자' : '일반 회원'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                                        user.status === 'inactive' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                                            'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {user.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {user.status === 'active' ? '활성' :
                                            user.status === 'inactive' ? '휴면' : '정지됨'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    {user.lastLogin}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="수정"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(user.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="삭제"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                        >
                            이전
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`px-3 py-1 text-sm border rounded-md ${currentPage === page
                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                            : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
                        >
                            다음
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
