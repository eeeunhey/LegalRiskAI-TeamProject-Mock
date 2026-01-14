import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import ChatbotFloatingButton from '@/components/common/ChatbotFloatingButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'LegalRisk AI Platform',
    description: 'AI 기반 법적 분쟁 분석 플랫폼',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body className={`${inter.className} min-h-screen flex flex-col bg-white`}>
                <AuthProvider>
                    <Navigation />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                    <ChatbotFloatingButton />
                </AuthProvider>
            </body>
        </html>
    );
}
