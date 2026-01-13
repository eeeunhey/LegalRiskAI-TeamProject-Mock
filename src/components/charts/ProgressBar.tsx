interface Stage {
    id: string;
    label: string;
}

interface ProgressBarProps {
    stages: Stage[];
    currentStage: string;
    className?: string;
}

const defaultStages: Stage[] = [
    { id: 'initial', label: '초기' },
    { id: 'escalation', label: '격화' },
    { id: 'threat', label: '위협' },
    { id: 'lawsuit', label: '소송임박' },
];

// Map Korean stage names to stage IDs
const stageMapping: Record<string, string> = {
    '초기': 'initial',
    '초기 갈등': 'initial',
    '격화': 'escalation',
    '경계 격화': 'escalation',
    '위협': 'threat',
    '위협 및 압박': 'threat',
    '소송임박': 'lawsuit',
    '소송 임박': 'lawsuit',
};

export default function ProgressBar({
    stages = defaultStages,
    currentStage,
    className = '',
}: ProgressBarProps) {
    // Find current stage index
    const mappedStage = stageMapping[currentStage] || currentStage;
    const currentIndex = stages.findIndex(s => s.id === mappedStage || s.label === currentStage);
    const progress = currentIndex >= 0 ? ((currentIndex + 1) / stages.length) * 100 : 0;

    // Color gradient based on progress
    const getStageColor = (index: number, isActive: boolean, isPast: boolean) => {
        if (!isActive && !isPast) return 'bg-gray-200';

        if (index === 0) return 'bg-green-500';
        if (index === 1) return 'bg-yellow-500';
        if (index === 2) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div className={`w-full ${className}`}>
            {/* Progress track */}
            <div className="relative">
                {/* Background line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full" />

                {/* Progress line */}
                <div
                    className="absolute top-4 left-0 h-1 rounded-full transition-all duration-500"
                    style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(to right, #22c55e, #f59e0b, #f97316, #ef4444)',
                    }}
                />

                {/* Stage dots */}
                <div className="relative flex justify-between">
                    {stages.map((stage, idx) => {
                        const isActive = idx === currentIndex;
                        const isPast = idx < currentIndex;
                        const color = getStageColor(idx, isActive, isPast);

                        return (
                            <div key={stage.id} className="flex flex-col items-center">
                                {/* Dot */}
                                <div
                                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    border-2 transition-all duration-300
                    ${isActive || isPast ? color : 'bg-white border-gray-300'}
                    ${isActive ? 'scale-110 border-white shadow-lg' : 'border-transparent'}
                  `}
                                >
                                    {isPast && !isActive && (
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                    {isActive && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={`
                    mt-2 text-xs font-medium transition-colors
                    ${isActive ? 'text-gray-900' : isPast ? 'text-gray-500' : 'text-gray-400'}
                  `}
                                >
                                    {stage.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Simpler percentage progress bar
interface SimpleProgressProps {
    value: number;
    label?: string;
    color?: 'primary' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const colorStyles = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
};

const sizeStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
};

export function SimpleProgress({
    value,
    label,
    color = 'primary',
    size = 'md'
}: SimpleProgressProps) {
    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{value}%</span>
                </div>
            )}
            <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
                <div
                    className={`${sizeStyles[size]} ${colorStyles[color]} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                />
            </div>
        </div>
    );
}
