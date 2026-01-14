'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import DocsModal from './DocsModal';

interface ChatbotFloatingButtonProps {
    showDocsButton?: boolean; // 기능 설명 버튼을 표시할지 여부
}

export default function ChatbotFloatingButton({ showDocsButton = true }: ChatbotFloatingButtonProps) {
    const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <>
            {/* Floating Chatbot Button */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
                {/* Tooltip / Label */}
                {isHovered && (
                    <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg animate-fade-in">
                        {showDocsButton ? '챗봇 기능 정의서 보기' : 'AI 법률 상담'}
                        <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                )}

                {/* Main Floating Button */}
                <button
                    onClick={() => setIsDocsModalOpen(true)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="group relative w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-full shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center hover:scale-110"
                    aria-label="챗봇 열기"
                >
                    {/* Pulse Animation Ring */}
                    <span className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-30"></span>

                    {/* Icon */}
                    <MessageCircle className="w-7 h-7 relative z-10" />

                    {/* Notification Badge (optional) */}
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold">
                        !
                    </span>
                </button>

                {/* Quick Actions */}
                {showDocsButton && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsDocsModalOpen(true)}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:text-indigo-600 hover:border-indigo-300 shadow-md hover:shadow-lg transition-all"
                        >
                            📋 기능 정의서
                        </button>
                    </div>
                )}
            </div>

            {/* Chatbot Docs Modal */}
            <DocsModal
                isOpen={isDocsModalOpen}
                onClose={() => setIsDocsModalOpen(false)}
                featureName="chatbot"
            />
        </>
    );
}
