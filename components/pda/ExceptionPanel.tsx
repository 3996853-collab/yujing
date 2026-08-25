'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Truck, MoreHorizontal, ChevronRight } from 'lucide-react';

interface ExceptionItem {
  id: string;
  orderId: string;
  description: string;
  since: string;
  severity: 'high' | 'medium' | 'low';
}

const warehouseExceptions: { subtype: string; items: ExceptionItem[] }[] = [
  {
    subtype: '缺货异常',
    items: [
      { id: 'EX-W-001', orderId: 'ORD-20260603-0012', description: '商品「运动套装-M码」OMS显示缺货，截止当前时间', since: '10:05', severity: 'high' },
      { id: 'EX-W-002', orderId: 'ORD-20260603-0018', description: '商品「有机牛奶礼盒-500ml×12」库存归零', since: '10:42', severity: 'high' },
    ]
  },
  {
    subtype: '面单异常',
    items: [
      { id: 'EX-W-003', orderId: 'ORD-20260603-0021', description: '调用面单接口失败 (HTTP 503)，已重试 3 次', since: '11:02', severity: 'high' },
      { id: 'EX-W-004', orderId: 'ORD-20260603-0025', description: '面单打印异常：打印机离线，无法输出面单', since: '11:15', severity: 'medium' },
    ]
  },
  {
    subtype: '回传超时',
    items: [
      { id: 'EX-W-005', orderId: 'ORD-20260603-0009', description: '未回传单号，当前时间已超过回传超时标准（+45min）', since: '09:55', severity: 'high' },
    ]
  },
  {
    subtype: '打单超时',
    items: [
      { id: 'EX-W-006', orderId: 'ORD-20260603-0003', description: '已回传单号，未打印面单，超时 +28min', since: '10:12', severity: 'medium' },
    ]
  },
  {
    subtype: '拣货超时',
    items: [
      { id: 'EX-W-007', orderId: 'ORD-20260603-0007', description: '已打单，未拣货，超时 +55min', since: '09:30', severity: 'high' },
    ]
  },
  {
    subtype: '发货超时',
    items: [
      { id: 'EX-W-008', orderId: 'ORD-20260603-0005', description: '已拣货，未发货，超过提货时间 +62min', since: '09:48', severity: 'high' },
    ]
  }
];

const logisticsExceptions: { subtype: string; items: ExceptionItem[] }[] = [
  {
    subtype: '揽收超时',
    items: [
      { id: 'EX-L-001', orderId: 'BATCH-2026-0603-A', description: '8票货物未揽收，超过应揽收时间 +30min', since: '10:30', severity: 'high' },
    ]
  },
  {
    subtype: '未到首中心已超时',
    items: [
      { id: 'EX-L-002', orderId: 'ZTO-CC-10293', description: '已揽收未到首中心，超标 +45min', since: '08:15', severity: 'high' },
      { id: 'EX-L-003', orderId: 'ZTO-CC-10301', description: '已揽收未到首中心，超标 +20min', since: '09:00', severity: 'medium' },
    ]
  },
  {
    subtype: '未到末中心已超时',
    items: [
      { id: 'EX-L-004', orderId: 'ZTO-CC-09817', description: '已到首中心，未到末中心，超标 +2h 10min', since: '昨日 22:00', severity: 'high' },
    ]
  },
  {
    subtype: '未派送已超时',
    items: [
      { id: 'EX-L-005', orderId: 'ZTO-CC-10105', description: '已到末中心，未派送，超标 +3h 20min', since: '07:40', severity: 'high' },
    ]
  },
  {
    subtype: '未签收已超时',
    items: [
      { id: 'EX-L-006', orderId: 'ZTO-CC-09500', description: '已派送，未签收，超过应签收时间 +1天', since: '昨日', severity: 'medium' },
    ]
  }
];

const otherExceptions: { subtype: string; count: number; items: ExceptionItem[] }[] = [
  {
    subtype: '待拦截',
    count: 3,
    items: [
      { id: 'EX-O-003', orderId: 'ORD-20260603-0033', description: '客户申请拦截，货物尚在仓内待处理', since: '11:05', severity: 'high' },
    ]
  },
  {
    subtype: '待回库',
    count: 7,
    items: [
      { id: 'EX-O-004', orderId: 'ORD-20260603-0019', description: '物流退回包裹，待仓库接收回库', since: '10:45', severity: 'medium' },
    ]
  }
];

const severityConfig = {
  high: { dot: 'bg-red-500', text: 'text-red-600', badge: 'bg-red-100 text-red-700' },
  medium: { dot: 'bg-amber-500', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
  low: { dot: 'bg-blue-400', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
};

function ExceptionGroup({ subtype, items }: { subtype: string; items: ExceptionItem[] }) {
  const total = items.length;
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-xs font-extrabold text-gray-600">{subtype}</span>
        <span className="text-xs bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded-full">{total}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const sc = severityConfig[item.severity];
          return (
            <div key={item.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-start gap-3">
              <span className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${sc.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-gray-800 truncate">{item.orderId}</span>
                  <span className="text-xs text-gray-400 shrink-0">{item.since}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

const tabs = [
  { key: 'warehouse', label: '仓内异常', icon: <AlertTriangle className="h-4 w-4" />, color: 'text-red-600', activeBg: 'bg-red-50 border-red-200 text-red-700' },
  { key: 'logistics', label: '物流异常', icon: <Truck className="h-4 w-4" />, color: 'text-amber-600', activeBg: 'bg-amber-50 border-amber-200 text-amber-700' },
  { key: 'other', label: '其他', icon: <MoreHorizontal className="h-4 w-4" />, color: 'text-blue-600', activeBg: 'bg-blue-50 border-blue-200 text-blue-700' },
];

const tabCounts = {
  warehouse: warehouseExceptions.reduce((s, g) => s + g.items.length, 0),
  logistics: logisticsExceptions.reduce((s, g) => s + g.items.length, 0),
  other: otherExceptions.reduce((s, g) => s + g.count, 0),
};

export default function ExceptionPanel() {
  const [activeTab, setActiveTab] = useState<'warehouse' | 'logistics' | 'other'>('warehouse');

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-bold transition-all ${
                isActive ? tab.activeBg : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <div className={isActive ? '' : tab.color}>{tab.icon}</div>
              <span>{tab.label}</span>
              <span className={`text-lg font-extrabold leading-none ${isActive ? '' : 'text-gray-700'}`}>
                {tabCounts[tab.key as keyof typeof tabCounts]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {activeTab === 'warehouse' && warehouseExceptions.map((g) => (
          <ExceptionGroup key={g.subtype} subtype={g.subtype} items={g.items} />
        ))}
        {activeTab === 'logistics' && logisticsExceptions.map((g) => (
          <ExceptionGroup key={g.subtype} subtype={g.subtype} items={g.items} />
        ))}
        {activeTab === 'other' && otherExceptions.map((g) => (
          <ExceptionGroup key={g.subtype} subtype={g.subtype} items={g.items} />
        ))}
      </motion.div>
    </div>
  );
}
