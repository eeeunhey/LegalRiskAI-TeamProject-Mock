import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
};

export function Badge({
    children,
    variant = 'default',
    size = 'sm',
    className = ''
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}

// Risk Level Badge
interface RiskBadgeProps {
    level: 'low' | 'medium' | 'high';
}

export function RiskBadge({ level }: RiskBadgeProps) {
    const labels = {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk',
    };
    const variants: Record<string, BadgeVariant> = {
        low: 'success',
        medium: 'warning',
        high: 'danger',
    };

    return <Badge variant={variants[level]}>{labels[level]}</Badge>;
}

// Difficulty Badge
interface DifficultyBadgeProps {
    difficulty: 'easy' | 'medium' | 'hard';
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
    const labels = {
        easy: '쉬움',
        medium: '보통',
        hard: '어려움',
    };
    const variants: Record<string, BadgeVariant> = {
        easy: 'success',
        medium: 'warning',
        hard: 'danger',
    };

    return <Badge variant={variants[difficulty]}>{labels[difficulty]}</Badge>;
}

// Effect Badge
interface EffectBadgeProps {
    effect: 'low' | 'medium' | 'high';
}

export function EffectBadge({ effect }: EffectBadgeProps) {
    const labels = {
        low: '효과 낮음',
        medium: '효과 중간',
        high: '효과 높음',
    };
    const variants: Record<string, BadgeVariant> = {
        low: 'default',
        medium: 'info',
        high: 'primary',
    };

    return <Badge variant={variants[effect]}>{labels[effect]}</Badge>;
}

// Similarity Badge
interface SimilarityBadgeProps {
    similarity: number; // 0-1
}

export function SimilarityBadge({ similarity }: SimilarityBadgeProps) {
    const percentage = Math.round(similarity * 100);
    const variant: BadgeVariant = percentage >= 90 ? 'success' : percentage >= 70 ? 'warning' : 'default';

    return <Badge variant={variant}>{percentage}% 일치</Badge>;
}

// Winner Badge
interface WinnerBadgeProps {
    winner: string;
}

export function WinnerBadge({ winner }: WinnerBadgeProps) {
    const isPlaintiff = winner.includes('원고') || winner.includes('임차인') || winner.includes('소비자');
    const variant: BadgeVariant = isPlaintiff ? 'success' : 'danger';

    return <Badge variant={variant}>{winner} 승</Badge>;
}

export default Badge;
