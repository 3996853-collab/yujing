'use client';

import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface InboxMessage {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const mockMessages: InboxMessage[] = [
  {
    id: 'msg-001',
    type: 'error',
    title: '缺货异常告警',
    body: '订单 ORD-20260603-0012 商品「运动套装-M码」库存不足，OMS 显示缺货。',
    time: '11:28',
    read: false
  },
  {
    id: 'msg-002',
    type: 'warning',
    title: '发货超时预警',
    body: '订单 ORD-20260603-0005 已拣货超过 60 分钟，尚未发货，请及时处理。',
    time: '11:10',
    read: false
  },
  {
    id: 'msg-003',
    type: 'warning',
    title: '揽收超时提醒',
    body: '批次 BATCH-2026-0603-A 共 8 票货物，物流商超过应揽收时间 30 分钟未揽收。',
    time: '10:55',
    read: false
  },
  {
    id: 'msg-004',
    type: 'info',
    title: '面单打印完成',
    body: '批次 BATCH-2026-0603-B 共 45 票订单面单打印成功，可开始拣货。',
    time: '10:20',
    read: true
  },
  {
    id: 'msg-005',
    type: 'info',
    title: '今日发货汇总',
    body: '截至 10:00，今日已完成发货 128 票，较昨日同期提升 12.3%。',
    time: '10:00',
    read: true
  }
];

interface InboxDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function InboxDrawer({ open, onClose }: InboxDrawerProps) {
  const typeConfig = {
    error: { icon: <AlertTriangle className="h-4 w-4" />, bg: 'bg-red-50', border: 'border-red-200', iconColor: 'text-red-500', dot: 'bg-red-500' },
    warning: { icon: <Clock className="h-4 w-4" />, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-500', dot: 'bg-amber-500' },
    info: { icon: <CheckCircle className="h-4 w-4" />, bg: 'bg-blue-50', border: 'border-blue-200', iconColor: 'text-blue-500', dot: 'bg-blue-400' },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-indigo-600" />
                <span className="font-extrabold text-gray-900 text-base">消息收件箱</span>
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {mockMessages.filter(m => !m.read).length}
                </span>
              </div>
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mockMessages.map((msg, idx) => {
                const cfg = typeConfig[msg.type];
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-xl border p-3.5 ${cfg.bg} ${cfg.border} ${msg.read ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className={`flex items-center gap-1.5 font-bold text-sm text-gray-800`}>
                        {!msg.read && <span className={`h-2 w-2 rounded-full ${cfg.dot} shrink-0`} />}
                        <span className={cfg.iconColor}>{cfg.icon}</span>
                        {msg.title}
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">{msg.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{msg.body}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 text-center">
              <button className="text-xs text-indigo-600 font-bold hover:text-indigo-700">全部标记为已读</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
