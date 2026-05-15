import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#5fcff8', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']

export default function ChartBlock({ block, onChange }) {
    const [rawLabels, setRawLabels] = useState((block.data?.map(d => d.name) || []).join(', '))
    const [rawValues, setRawValues] = useState((block.data?.map(d => d.value) || []).join(', '))

    const parse = (labels, values) => {
        const l = labels.split(',').map(s => s.trim()).filter(Boolean)
        const v = values.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
        const data = l.map((name, i) => ({ name, value: v[i] ?? 0 }))
        onChange({ ...block, data })
    }

    const handleLabels = (val) => { setRawLabels(val); parse(val, rawValues) }
    const handleValues = (val) => { setRawValues(val); parse(rawLabels, val) }

    const data = block.data || []
    const type = block.chartType || 'bar'

    return (
        <div className="chart-block">
            <select value={type} onChange={e => onChange({ ...block, chartType: e.target.value })}>
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
            </select>
            <input placeholder="Labels: Jan, Feb, Mar" value={rawLabels} onChange={e => handleLabels(e.target.value)} />
            <input placeholder="Values: 10, 20, 30" value={rawValues} onChange={e => handleValues(e.target.value)} />

            {data.length > 0 && (
                <ResponsiveContainer width="100%" height={220}>
                    {type === 'bar' ? (
                        <BarChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#5fcff8" /></BarChart>
                    ) : type === 'line' ? (
                        <LineChart data={data}><XAxis dataKey="name" /><YAxis /><Tooltip /><Line dataKey="value" stroke="#5fcff8" strokeWidth={2} dot={false} /></LineChart>
                    ) : (
                        <PieChart><Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie><Tooltip /></PieChart>
                    )}
                </ResponsiveContainer>
            )}
        </div>
    )
}