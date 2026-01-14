'use client';

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export interface UserData {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive' | 'banned';
    lastLogin: string;
}

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserData | null;
    onSave: (updatedUser: UserData) => void;
}

export default function EditUserModal({ isOpen, onClose, user, onSave }: EditUserModalProps) {
    const [formData, setFormData] = useState<UserData | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({ ...user });
        }
    }, [user]);

    if (!isOpen || !formData) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 animate-fadeIn">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900">사용자 정보 수정</h3>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                        <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">이메일은 변경할 수 없습니다.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">권한 (Role)</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        >
                            <option value="user">일반 회원 (User)</option>
                            <option value="admin">관리자 (Admin)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">상태 (Status)</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'banned' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        >
                            <option value="active">활성 (Active)</option>
                            <option value="inactive">휴면 (Inactive)</option>
                            <option value="banned">정지 (Banned)</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 font-medium transition-colors shadow-sm"
                        >
                            <Save className="w-4 h-4" />
                            저장하기
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
