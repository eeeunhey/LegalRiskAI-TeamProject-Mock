'use client';

interface GaugeChartProps {
    value: number; // 0-100
    size?: number;
    label?: string;
    color?: 'primary' | 'success' | 'warning' | 'danger';
}

const colorMap = {
    primary: {
        stroke: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.15)',
    },
    success: {
        stroke: '#22c55e',
        bg: 'rgba(34, 197, 94, 0.15)',
    },
    warning: {
        stroke: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.15)',
    },
    danger: {
        stroke: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.15)',
    },
};

export default function GaugeChart({
    value,
    size = 200,
    label,
    color = 'primary'
}: GaugeChartProps) {
    // Auto-determine color based on value if not specified
    const autoColor = value >= 70 ? 'danger' : value >= 40 ? 'warning' : 'success';
    const finalColor = color === 'primary' ? autoColor : color;
    const colors = colorMap[finalColor];

    const radius = (size - 20) / 2;
    const centerX = size / 2;
    const centerY = size / 2;

    // Semicircle path
    const startAngle = 180;
    const endAngle = 0;
    const valueAngle = startAngle - (value / 100) * 180;

    // Convert angle to radians
    const toRadians = (angle: number) => (angle * Math.PI) / 180;

    // Calculate arc path
    const describeArc = (startAng: number, endAng: number) => {
        const start = {
            x: centerX + radius * Math.cos(toRadians(startAng)),
            y: centerY - radius * Math.sin(toRadians(startAng)),
        };
        const end = {
            x: centerX + radius * Math.cos(toRadians(endAng)),
            y: centerY - radius * Math.sin(toRadians(endAng)),
        };
        const largeArcFlag = startAng - endAng <= 180 ? 0 : 1;

        return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    };

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
                {/* Background arc */}
                <path
                    d={describeArc(startAngle, endAngle)}
                    fill="none"
                    stroke={colors.bg}
                    strokeWidth="16"
                    strokeLinecap="round"
                />

                {/* Value arc */}
                <path
                    d={describeArc(startAngle, valueAngle)}
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth="16"
                    strokeLinecap="round"
                    style={{
                        filter: `drop-shadow(0 2px 4px ${colors.stroke}40)`,
                        transition: 'all 0.5s ease-out',
                    }}
                />

                {/* Center value text */}
                <text
                    x={centerX}
                    y={centerY - 10}
                    textAnchor="middle"
                    fill="#111827"
                    fontSize={size / 5}
                    fontWeight="bold"
                >
                    {value}
                </text>
                <text
                    x={centerX}
                    y={centerY + 15}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize={size / 12}
                >
                    / 100
                </text>

                {/* Min and Max labels */}
                <text
                    x={20}
                    y={size / 2 + 20}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize={size / 15}
                >
                    0
                </text>
                <text
                    x={size - 20}
                    y={size / 2 + 20}
                    textAnchor="middle"
                    fill="#9ca3af"
                    fontSize={size / 15}
                >
                    100
                </text>
            </svg>

            {label && (
                <span className="text-gray-500 text-sm mt-1">{label}</span>
            )}
        </div>
    );
}

// Simpler progress bar version
interface RiskBarProps {
    value: number;
    label?: string;
    showValue?: boolean;
}

export function RiskBar({ value, label, showValue = true }: RiskBarProps) {
    const color = value >= 70 ? 'bg-red-500' : value >= 40 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">{label}</span>
                    {showValue && <span className="text-sm font-semibold text-gray-900">{value}%</span>}
                </div>
            )}
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
