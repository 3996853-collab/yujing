'use client';

import React from 'react';
import { Clock } from 'lucide-react';

export default function Timeline() {
  const steps = [
    { time: '14:20', title: '时效诊断分析触发', desc: '检测到上海仓揽收出库即将超时，激活控制塔预警。' },
    { time: '13:45', title: '包裹流转数据阻断', desc: '包裹在分拣区扫描完成后超过2小时无后续装车轨迹，触发SLA预警红线。' },
    { time: '12:00', title: '批次任务生成', desc: '系统顺利生成批次任务 WAVE-2026052601，共计85票。' }
  ];

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
        <Clock className="h-4.5 w-4.5 text-indigo-600" />
        <span>异常节点诊断轨迹时间轴</span>
      </h3>
      <div className="relative border-l border-gray-200 pl-4 space-y-6 text-xs ml-1.5">
        {steps.map((step, idx) => (
          <div key={idx} className="relative">
            <span className="absolute -left-6 top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-indigo-100 ring-4 ring-white">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            </span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
              <span>{step.time}</span>
            </div>
            <h4 className="font-bold text-gray-800 mt-0.5">{step.title}</h4>
            <p className="text-gray-500 mt-1 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
