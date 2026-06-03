'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatItem {
  key: string;
  label: string;
  value: number;
  color: string;
  bg: string;
  unit?: string;
}

const stats: StatItem[] = [
  { key: 'received',    label: '已接单',   value: 312, color: 'text-indigo-700', bg: 'bg-indigo-50' },
  { key: 'got_waybill', label: '已获取面单', value: 289, color: 'text-purple-700', bg: 'bg-purple-50' },
  { key: 'returned',   label: '已回传单号', value: 278, color: 'text-blue-700',   bg: 'bg-blue-50' },
  { key: 'printed',    label: '已打单',   value: 255, color: 'text-cyan-700',   bg: 'bg-cyan-50' },
  { key: 'picked',     label: '已拣货',   value: 214, color: 'text-teal-700',   bg: 'bg-teal-50' },
  { key: 'reviewed',   label: '已复核',   value: 198, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { key: 'packed',     label: '已打包',   value: 186, color: 'text-green-700',  bg: 'bg-green-50' },
  { key: 'weighed',    label: '已称重',   value: 180, color: 'text-lime-700',   bg: 'bg-lime-50' },
  { key: 'shipped',    label: '已发货',   value: 174, color: 'text-yellow-700', bg: 'bg-yellow-50' },
  { key: 'cancelled',  label: '已取消',   value: 8,   color: 'text-gray-600',   bg: 'bg-gray-100' },
  { key: 'intercepted',label: '已拦截',   value: 3,   color: 'text-orange-700', bg: 'bg-orange-50' },
  { key: 'oos',        label: '缺货',    value: 6,   color: 'text-red-700',    bg: 'bg-red-50' },
];

export default function StatsPanel() {
  const totalReceived = stats.find(s => s.key === 'received')?.value ?? 0;
  const totalShipped = stats.find(s => s.key === 'shipped')?.value ?? 0;
  const fulfillRate = Math.round((totalShipped / totalReceived) * 100);

  return (
    <div>
      {/* Summary Progress */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-4 mb-5 text-white">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs font-bold opacity-75">今日整体履约率</div>
            <div className="text-3xl font-extrabold mt-0.5">{fulfillRate}%</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold opacity-75">已发货 / 已接单</div>
            <div className="text-xl font-extrabold mt-0.5">{totalShipped} / {totalReceived}</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fulfillRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.04 }}
            className={`${stat.bg} rounded-xl p-3 flex flex-col items-center text-center`}
          >
            <div className={`text-2xl font-extrabold ${stat.color} leading-none`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 font-medium mt-1.5 leading-tight">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
