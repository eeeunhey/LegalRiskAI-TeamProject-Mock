import { AlertTriangle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 mt-auto transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Disclaimer */}
                    <div className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="max-w-3xl">
                            <span className="font-semibold text-gray-600 dark:text-gray-300">법적 고지:</span> 본 플랫폼의 모든 분석 결과는 AI 기반 참고 자료이며,
                            법적 조언을 대체하지 않습니다. 실제 법적 판단은 자격을 갖춘 변호사와 상담하시기 바랍니다.
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        © 2024 LegalRisk AI Platform
                    </div>
                </div>
            </div>
        </footer>
    );
}
