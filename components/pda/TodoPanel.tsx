'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, FileText, Search, Package, CheckSquare, Scale, Truck, Download, ArrowUpCircle, ClipboardList, AlertCircle, Clock, Undo2 } from 'lucide-react';

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

const outboundCategories: TodoCategory[] = [
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
    ]
  }
];

const purchasingCategories: TodoCategory[] = [
  {
    key: 'receive',
    label: '待入库',
    count: 15,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: <Download className="h-5 w-5" />,
    description: '状态=待收货/待上架，类型=采购入库或退货入库',
    items: [
      { orderId: 'IN-20260603-001', cargoOwner: '李宁体育', sku: '夏季运动服', qty: 100, createdAt: '08:30' },
    ]
  }
];

const inventoryCategories: TodoCategory[] = [
  {
    key: 'adjustment',
    label: '调整单待审核',
    count: 8,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: <FileText className="h-5 w-5" />,
    description: '库存调整单据待审核确认',
    items: [
      { orderId: 'ADJ-20260603-01', cargoOwner: '苹果中国', sku: '差异损耗调整', qty: 5, createdAt: '09:15' },
    ]
  },
  {
    key: 'count',
    label: '盘点任务待盘点',
    count: 3,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: <ClipboardList className="h-5 w-5" />,
    description: '盘点状态为盘点中，尚未完成',
    items: [
      { orderId: 'CNT-20260603-01', cargoOwner: '通用货主', sku: 'A区货架盘点', qty: 0, createdAt: '08:00' },
    ]
  },
  {
    key: 'expired',
    label: '过期商品',
    count: 12,
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: <AlertCircle className="h-5 w-5" />,
    description: '保质期>过期，应拦截',
    items: [
      { orderId: 'EXP-20260603-01', cargoOwner: '盒马鲜生', sku: '有机纯牛奶', qty: 24, createdAt: '昨天' },
    ]
  },
  {
    key: 'expiring',
    label: '临期商品',
    count: 45,
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: <Clock className="h-5 w-5" />,
    description: '临期商品',
    items: [
      { orderId: 'EXP-20260603-02', cargoOwner: '盒马鲜生', sku: '全麦面包', qty: 15, createdAt: '昨天' },
    ]
  },
];

type TabType = 'outbound' | 'purchasing' | 'inventory';

export default function TodoPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('outbound');
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const getCategories = () => {
    switch (activeTab) {
      case 'purchasing': return purchasingCategories;
      case 'inventory': return inventoryCategories;
      case 'outbound': default: return outboundCategories;
    }
  };

  const currentCategories = getCategories();
  const total = currentCategories.reduce((sum, c) => sum + c.count, 0);

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'outbound', label: '出库', count: outboundCategories.reduce((s, c) => s + c.count, 0) },
    { key: 'purchasing', label: '采购', count: purchasingCategories.reduce((s, c) => s + c.count, 0) },
    { key: 'inventory', label: '库存', count: inventoryCategories.reduce((s, c) => s + c.count, 0) },
  ];

  return (
    <div className="relative">
      {/* Floating Tab Switcher */}
      <div className="sticky top-0 z-10 bg-[#f5f6fa] pb-4 -mx-4 px-4 pt-1">
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setExpandedKey(null);
                }}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors relative ${
                  isActive ? 'text-indigo-700 bg-indigo-50' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="flex items-center justify-between mb-4 mt-2">
        <span className="text-sm font-bold text-gray-500">
          累计未处理待办合计
        </span>
        <span className="text-2xl font-extrabold text-gray-900">{total} <span className="text-sm font-bold text-gray-400">票/项</span></span>
      </div>

      {/* Categories List */}
      <div className="space-y-2.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-2.5"
          >
            {currentCategories.map((cat) => (
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
                              查看全部 {cat.count} 项 →
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
