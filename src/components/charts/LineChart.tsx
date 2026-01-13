'use client';

import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';

interface TrendPoint {
    t: string;
    value: number;
}

interface LineChartProps {
    data: TrendPoint[];
    height?: number;
    showGrid?: boolean;
    areaFill?: boolean;
    color?: string;
}

export default function LineChart({
    data,
    height = 200,
    showGrid = false,
    areaFill = true,
    color = '#ef4444',
}: LineChartProps) {
    const Chart = areaFill ? AreaChart : RechartsLineChart;

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <Chart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="t"
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={false}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: '#111827',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value: number) => [value, '점수']}
                        labelFormatter={(label) => `시점: ${label}`}
                    />
                    {areaFill ? (
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            fill="url(#colorValue)"
                            dot={{ fill: color, strokeWidth: 2, r: 4, stroke: '#fff' }}
                            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                        />
                    ) : (
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={3}
                            dot={{ fill: color, strokeWidth: 2, r: 4, stroke: '#fff' }}
                            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                        />
                    )}
                </Chart>
            </ResponsiveContainer>
        </div>
    );
}
