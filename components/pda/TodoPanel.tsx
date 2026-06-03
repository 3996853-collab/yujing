'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, FileText, Search, Package, CheckSquare, Scale, Box, Truck } from 'lucide-react';

interface TodoItem {
  orderId: string;
  cargoOwner: string;
  sku: string;
  qty: number;
  createdAt: string;
}

interface TodoCategory {
  key: string;
  label: string;
  count: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  description: string;
  items: TodoItem[];
}

const todoCategories: TodoCategory[] = [
  {
    key: 'print',
    label: '待打单',
    count: 23,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: <FileText className="h-5 w-5" />,
    description: '面单已获取，未成功打印面单',
    items: [
      { orderId: 'ORD-20260603-0001', cargoOwner: '李宁体育', sku: '运动套装-L码', qty: 2, createdAt: '09:12' },
      { orderId: 'ORD-20260603-0003', cargoOwner: '盒马鲜生', sku: '有机蔬菜礼盒', qty: 1, createdAt: '09:35' },
      { orderId: 'ORD-20260603-0007', cargoOwner: '苹果中国', sku: 'iPhone 16 Pro', qty: 1, createdAt: '10:01' },
    ]
  },
  {
    key: 'pick',
    label: '待拣货',
    count: 41,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: <Search className="h-5 w-5" />,
    description: '未拣货的订单',
    items: [
      { orderId: 'ORD-20260603-0008', cargoOwner: '通用货主', sku: '3C 配件套装', qty: 5, createdAt: '09:50' },
      { orderId: 'ORD-20260603-0010', cargoOwner: '李宁体育', sku: '跑步鞋-42码', qty: 1, createdAt: '10:15' },
    ]
  },
  {
    key: 'review',
    label: '待复核',
    count: 17,
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    icon: <CheckSquare className="h-5 w-5" />,
    description: '未复核的订单',
    items: [
      { orderId: 'ORD-20260603-0004', cargoOwner: '盒马鲜生', sku: '进口牛肉礼盒', qty: 3, createdAt: '09:20' },
    ]
  },
  {
    key: 'pack',
    label: '待打包',
    count: 29,
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    icon: <Package className="h-5 w-5" />,
    description: '未打包的订单',
    items: [
      { orderId: 'ORD-20260603-0002', cargoOwner: '苹果中国', sku: 'MacBook Air M4', qty: 1, createdAt: '09:05' },
      { orderId: 'ORD-20260603-0009', cargoOwner: '通用货主', sku: '家用电器套装', qty: 2, createdAt: '10:08' },
    ]
  },
  {
    key: 'weigh',
    label: '待称重',
    count: 12,
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    icon: <Scale className="h-5 w-5" />,
    description: '未称重的订单',
    items: [
      { orderId: 'ORD-20260603-0011', cargoOwner: '李宁体育', sku: '运动装备套装', qty: 4, createdAt: '10:22' },
    ]
  },
  {
    key: 'ship',
    label: '待发货',
    count: 35,
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: <Truck className="h-5 w-5" />,
    description: '未发货的订单',
    items: [
      { orderId: 'ORD-20260603-0005', cargoOwner: '盒马鲜生', sku: '水果礼盒', qty: 2, createdAt: '09:40' },
      { orderId: 'ORD-20260603-0006', cargoOwner: '通用货主', sku: '标准件 × 8', qty: 8, createdAt: '09:48' },
    ]
  }
];

export default function TodoPanel() {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const total = todoCategories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div>
      {/* Summary Bar */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-gray-500">待处理订单合计</span>
        <span className="text-2xl font-extrabold text-gray-900">{total} <span className="text-sm font-bold text-gray-400">票</span></span>
      </div>

      <div className="space-y-2.5">
        {todoCategories.map((cat) => (
          <div key={cat.key} className={`rounded-2xl border overflow-hidden ${cat.borderColor}`}>
            {/* Category Header */}
            <button
              className={`w-full flex items-center justify-between px-4 py-3.5 ${cat.bgColor} transition-colors`}
              onClick={() => setExpandedKey(expandedKey === cat.key ? null : cat.key)}
            >
              <div className="flex items-center gap-3">
                <span className={cat.color}>{cat.icon}</span>
                <div className="text-left">
                  <div className={`font-extrabold text-sm ${cat.color}`}>{cat.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{cat.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-extrabold ${cat.color}`}>{cat.count}</span>
                <span className="text-xs text-gray-400 font-medium">票</span>
                {expandedKey === cat.key
                  ? <ChevronDown className="h-4 w-4 text-gray-400" />
                  : <ChevronRight className="h-4 w-4 text-gray-400" />
                }
              </div>
            </button>

            {/* Expanded order list */}
            <AnimatePresence initial={false}>
              {expandedKey === cat.key && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden bg-white"
                >
                  <div className="divide-y divide-gray-100">
                    {cat.items.map((item) => (
                      <div key={item.orderId} className="px-4 py-3 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-gray-800">{item.orderId}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.cargoOwner} · {item.sku}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-gray-700">{item.qty} 件</div>
                          <div className="text-xs text-gray-400 mt-0.5">{item.createdAt}</div>
                        </div>
                      </div>
                    ))}
                    {cat.count > cat.items.length && (
                      <div className="px-4 py-2.5 text-center">
                        <button className="text-xs text-indigo-600 font-bold">
                          查看全部 {cat.count} 票 →
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
