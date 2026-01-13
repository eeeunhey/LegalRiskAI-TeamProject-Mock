import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
    glow?: 'primary' | 'success' | 'warning' | 'danger';
}

export function Card({ children, className = '', onClick, hoverable = false, glow }: CardProps) {
    return (
        <div
            onClick={onClick}
            className={`
        bg-white dark:bg-slate-800 rounded-xl p-6 transition-all duration-300 
        border border-gray-200 dark:border-slate-700 shadow-sm
        ${hoverable ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg' : ''}
        ${glow ? `glow-${glow}` : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    onClick?: () => void;
    gradient?: string;
}

export function FeatureCard({ icon: Icon, title, description, onClick, gradient = 'from-primary-500 to-primary-700' }: FeatureCardProps) {
    return (
        <Card hoverable onClick={onClick} className="group">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{description}</p>
            <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium group-hover:text-primary-500 transition-colors">
                분석 시작하기
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </Card>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

export function StatCard({ label, value, icon: Icon, trend, trendValue }: StatCardProps) {
    const trendColors = {
        up: 'text-green-500',
        down: 'text-red-500',
        neutral: 'text-gray-400',
    };

    return (
        <Card className="flex items-center gap-4">
            {Icon && (
                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
            )}
            <div className="flex-1">
                <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                {trend && trendValue && (
                    <p className={`text-xs ${trendColors[trend]}`}>{trendValue}</p>
                )}
            </div>
        </Card>
    );
}

interface ResultCardProps {
    title: string;
    children: ReactNode;
    className?: string;
    headerAction?: ReactNode;
}

export function ResultCard({ title, children, className = '', headerAction }: ResultCardProps) {
    return (
        <Card className={className}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                {headerAction}
            </div>
            {children}
        </Card>
    );
}
