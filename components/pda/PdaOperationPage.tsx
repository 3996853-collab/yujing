'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ClipboardList, AlertOctagon, BarChart2, Warehouse } from 'lucide-react';
import TodoPanel from './TodoPanel';
import ExceptionPanel from './ExceptionPanel';
import StatsPanel from './StatsPanel';
import InboxDrawer from './InboxDrawer';

const UNREAD_COUNT = 3;

type SectionKey = 'todo' | 'exception' | 'stats';

const sections: { key: SectionKey; label: string; icon: React.ReactNode; badge?: number }[] = [
  { key: 'todo', label: '待办事项', icon: <ClipboardList className="h-5 w-5" /> },
  { key: 'exception', label: '异常数据', icon: <AlertOctagon className="h-5 w-5" />, badge: 18 },
  { key: 'stats', label: '今日作业', icon: <BarChart2 className="h-5 w-5" /> },
];

export default function PdaOperationPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>('todo');
  const [inboxOpen, setInboxOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f5f6fa] overflow-hidden">
      {/* Top Nav Bar — PDA style */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Warehouse className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-gray-900 leading-tight">仓库 PDA 操作端</div>
            <div className="text-[10px] text-gray-500 font-medium">上海嘉定仓 · 2026-06-03</div>
          </div>
        </div>

        {/* Inbox Bell */}
        <button
          onClick={() => setInboxOpen(true)}
          className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="消息收件箱"
        >
          <Bell className="h-5.5 w-5.5 text-gray-600" />
          {UNREAD_COUNT > 0 && (
            <span className="absolute top-1 right-1 h-4 min-w-4 px-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center leading-none">
              {UNREAD_COUNT}
            </span>
          )}
        </button>
      </div>

      {/* Section Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 flex gap-1 shrink-0">
        {sections.map((sec) => {
          const isActive = activeSection === sec.key;
          return (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-bold transition-colors relative ${
                isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {sec.icon}
                {sec.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full leading-none">
                    {sec.badge}
                  </span>
                )}
              </div>
              <span>{sec.label}</span>
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area — scrollable */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="p-4"
          >
            {activeSection === 'todo' && <TodoPanel />}
            {activeSection === 'exception' && <ExceptionPanel />}
            {activeSection === 'stats' && <StatsPanel />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Inbox Drawer */}
      <InboxDrawer open={inboxOpen} onClose={() => setInboxOpen(false)} />
    </div>
  );
}
