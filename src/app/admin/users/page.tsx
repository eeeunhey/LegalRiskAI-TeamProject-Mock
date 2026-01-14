'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import Link from 'next/link';

// Components
import UserTable from '@/components/admin/UserTable';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import EditUserModal, { UserData } from '@/components/admin/EditUserModal';

// Mock Data (Expanded for pagination testing)
const INITIAL_USERS: UserData[] = [
    { id: 1, name: '김철수', email: 'kim@example.com', role: 'user', status: 'active', lastLogin: '2024-05-20 14:30' },
    { id: 2, name: '이영희', email: 'lee@example.com', role: 'admin', status: 'active', lastLogin: '2024-05-21 09:15' },
    { id: 3, name: '박민수', email: 'park@example.com', role: 'user', status: 'inactive', lastLogin: '2024-04-10 11:20' },
    { id: 4, name: '최지우', email: 'choi@example.com', role: 'user', status: 'active', lastLogin: '2024-05-19 18:45' },
    { id: 5, name: '정우성', email: 'jung@example.com', role: 'user', status: 'banned', lastLogin: '2024-03-01 10:00' },
    { id: 6, name: '강동원', email: 'kang@example.com', role: 'user', status: 'active', lastLogin: '2024-05-21 15:00' },
    { id: 7, name: '송혜교', email: 'song@example.com', role: 'user', status: 'active', lastLogin: '2024-05-18 09:30' },
    { id: 8, name: '현빈', email: 'hyun@example.com', role: 'admin', status: 'active', lastLogin: '2024-05-21 08:20' },
    { id: 9, name: '손예진', email: 'son@example.com', role: 'user', status: 'inactive', lastLogin: '2024-04-05 14:10' },
    { id: 10, name: '공유', email: 'gong@example.com', role: 'user', status: 'active', lastLogin: '2024-05-20 11:45' },
    { id: 11, name: '김태리', email: 'kim2@example.com', role: 'user', status: 'active', lastLogin: '2024-05-19 16:20' },
    { id: 12, name: '마동석', email: 'ma@example.com', role: 'user', status: 'banned', lastLogin: '2024-02-15 10:30' },
    { id: 13, name: '아이유', email: 'iu@example.com', role: 'admin', status: 'active', lastLogin: '2024-05-21 10:00' },
    { id: 14, name: '박서준', email: 'park2@example.com', role: 'user', status: 'active', lastLogin: '2024-05-17 19:20' },
    { id: 15, name: '김수현', email: 'kim3@example.com', role: 'user', status: 'inactive', lastLogin: '2024-04-25 13:40' },
];

const ITEMS_PER_PAGE = 5;

export default function UserManagementPage() {
    // State
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter Logic
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleEditClick = (user: UserData) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        if (confirm('정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    const handleSaveUser = (updatedUser: UserData) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

        // Show success feedback (In a real app, use toast)
        alert('사용자 정보가 수정되었습니다.');
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-6 h-6 text-primary-600" />
                        사용자 관리
                    </h1>
                    <p className="text-gray-500 mt-1">
                        전체 사용자 목록을 조회하고 권한 및 상태를 관리합니다.
                    </p>
                </div>
                <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 font-medium">
                    ← 관리자 홈으로
                </Link>
            </div>

            {/* Search */}
            <SearchFilterBar
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />

            {/* Table */}
            <UserTable
                users={paginatedUsers}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Edit Modal */}
            <EditUserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                onSave={handleSaveUser}
            />
        </div>
    );
}
