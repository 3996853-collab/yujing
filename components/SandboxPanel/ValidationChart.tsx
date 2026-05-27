'use client';

import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

const mockDailyData = [
  { day: '05-19', triggers: 18, normal: 340 },
  { day: '05-20', triggers: 24, normal: 362 },
  { day: '05-21', triggers: 15, normal: 310 },
  { day: '05-22', triggers: 28, normal: 380 },
  { day: '05-23', triggers: 19, normal: 325 },
  { day: '05-24', triggers: 21, normal: 344 },
  { day: '05-25', triggers: 17, normal: 350 },
];

export default function ValidationChart() {
  return (
    <div className="w-full h-44 bg-gray-950/60 border border-gray-900 rounded-lg p-2 mt-3">
      <div className="text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-wider flex items-center justify-between">
        <span>📈 每日预警命中分布趋势 (对比常态业务包)</span>
        <span className="text-neon-emerald">触发稳定无风暴</span>
      </div>
      
      <div className="w-full h-[130px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={mockDailyData}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTriggers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#111827" vertical={false} />
            <XAxis 
              dataKey="day" 
              stroke="#4b5563" 
              fontSize={8} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#4b5563" 
              fontSize={8} 
              tickLine={false} 
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ 
                background: '#090d16', 
                border: '1px solid #1f2937', 
                borderRadius: '6px',
                fontSize: '10px'
              }}
              labelStyle={{ color: '#9ca3af', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="normal" 
              stroke="#6366f1" 
              fillOpacity={1} 
              fill="url(#colorNormal)" 
              strokeWidth={1.5}
              name="常态监测运单"
            />
            <Area 
              type="monotone" 
              dataKey="triggers" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorTriggers)" 
              strokeWidth={1.5}
              name="预警触发量"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
