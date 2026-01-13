'use client';

import {
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface BarChartProps {
    data: { label: string; score: number }[];
    height?: number;
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

export default function BarChart({ data, height = 200 }: BarChartProps) {
    // Transform data for recharts
    const chartData = data.map((item, idx) => ({
        name: item.label,
        value: Math.round(item.score * 100),
        fill: COLORS[idx % COLORS.length],
    }));

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <RechartsBarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                    <XAxis
                        type="number"
                        domain={[0, 100]}
                        tickFormatter={(v) => `${v}%`}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: '#374151', fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                        tickLine={false}
                        width={75}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            color: '#111827',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value: number) => [`${value}%`, '점수']}
                        labelStyle={{ color: '#6b7280' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                        {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
}
