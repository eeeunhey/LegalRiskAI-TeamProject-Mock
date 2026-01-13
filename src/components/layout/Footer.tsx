import { AlertTriangle } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-start gap-3 text-sm text-gray-500">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="max-w-3xl">
                            <span className="font-semibold text-gray-600">법적 고지:</span> 본 플랫폼의 모든 분석 결과는 AI 기반 참고 자료이며, 법적 조언을 대체하지 않습니다.
                        </p>
                    </div>
                    <div className="text-sm text-gray-400 whitespace-nowrap">© 2024 LegalRisk AI Platform</div>
                </div>
            </div>
        </footer>
    );
}
