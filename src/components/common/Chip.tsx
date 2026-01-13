'use client';

import { X } from 'lucide-react';

type ChipColor = 'primary' | 'success' | 'warning' | 'danger' | 'default';
type ChipSize = 'sm' | 'md' | 'lg';

interface ChipProps {
    label: string;
    color?: ChipColor;
    size?: ChipSize;
    onRemove?: () => void;
    className?: string;
}

const colorStyles: Record<ChipColor, string> = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
};

const sizeStyles: Record<ChipSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
};

export function Chip({
    label,
    color = 'default',
    size = 'md',
    onRemove,
    className = ''
}: ChipProps) {
    return (
        <span
            className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${colorStyles[color]}
        ${sizeStyles[size]}
        ${className}
      `}
        >
            {label}
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="ml-0.5 p-0.5 rounded-full hover:bg-black/10 transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </span>
    );
}

// Chip Group for displaying multiple keywords
interface ChipGroupProps {
    chips: string[];
    color?: ChipColor;
    size?: ChipSize;
    onRemove?: (chip: string) => void;
    className?: string;
}

export function ChipGroup({
    chips,
    color = 'default',
    size = 'md',
    onRemove,
    className = ''
}: ChipGroupProps) {
    return (
        <div className={`flex flex-wrap gap-2 ${className}`}>
            {chips.map((chip, idx) => (
                <Chip
                    key={`${chip}-${idx}`}
                    label={chip}
                    color={color}
                    size={size}
                    onRemove={onRemove ? () => onRemove(chip) : undefined}
                />
            ))}
        </div>
    );
}

export default Chip;
