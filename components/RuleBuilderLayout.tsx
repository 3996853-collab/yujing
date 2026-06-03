'use client';

import React, { useState } from 'react';
import AlertInboxPage from './alerts/AlertInboxPage';
import RuleBuilderPage from './rules/RuleBuilderPage';
import SemanticLayerPage from './semantic/SemanticLayerPage';
import PlatformIntroPage from './platform/PlatformIntroPage';
import PreviewPage from './preview/PreviewPage';
import RuleQueryPage from './rules/RuleQueryPage';
import PdaOperationPage from './pda/PdaOperationPage';

import { 
  Inbox, 
  Settings2, 
  Database, 
  Terminal,
  Activity,
  BookOpen,
  Smartphone,
  Search,
  Warehouse
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'inbox' | 'builder' | 'semantic' | 'intro' | 'preview' | 'query' | 'pda';

export default function RuleBuilderLayout() {
  const [activeTab, setActiveTab] = useState<TabType>('intro');

  React.useEffect(() => {
    const handleNavigate = (e: any) => {
      setActiveTab('builder');
      // In a real app, this would also load the rule configuration into the builder
    };
    window.addEventListener('navigate-to-builder', handleNavigate);
    return () => window.removeEventListener('navigate-to-builder', handleNavigate);
  }, []);

  const navItems = [
    { id: 'intro', label: '平台战略与模型说明', icon: <BookOpen className="h-4.5 w-4.5" />, desc: '价值战略与预警模型抽象' },
    { id: 'semantic', label: '语义映射层配置（IT使用）', icon: <Database className="h-4.5 w-4.5" />, desc: '数据源翻译与资产发布' },
    { id: 'builder', label: '策略规则配置器', icon: <Settings2 className="h-4.5 w-4.5" />, desc: '双引擎策略与离线回测' },
    { id: 'query', label: '已配置规则查询', icon: <Search className="h-4.5 w-4.5" />, desc: '规则状态与多维组合筛选' },
    { id: 'preview', label: '预警接收端预览', icon: <Smartphone className="h-4.5 w-4.5" />, desc: '移动端接收卡片效果演示' },
    { id: 'inbox', label: '管理者预警收件箱', icon: <Inbox className="h-4.5 w-4.5" />, desc: '预警聚合态势与隐性核销' },
    { id: 'pda', label: '仓库 PDA 操作端', icon: <Warehouse className="h-4.5 w-4.5" />, desc: '移动端仓库作业与异常处理' },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#f8f9fa] overflow-hidden text-gray-800 font-sans">
      
      {/* 1. Sidebar Navigation (Google Cloud Console style) */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-4 z-20 shadow-sm">
        <div className="space-y-6">
          {/* Logo Brand in Material Design */}
          <div className="flex items-center gap-2.5 px-2 py-3 border-b border-gray-150">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/10">
              <Activity className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-gray-900 block leading-tight">
                供应链控制塔
              </span>
              <span className="block text-[10px] text-gray-500 font-semibold tracking-wider uppercase mt-0.5">
                预警管理平台
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className={`${
                    isSelected ? 'text-indigo-600' : 'text-gray-400'
                  } transition-colors`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs">{item.label}</div>
                    <div className={`text-[10px] font-medium truncate ${
                      isSelected ? 'text-indigo-500' : 'text-gray-400'
                    }`}>
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer status bar */}
        <div className="bg-[#fcfdfe] border border-gray-150 p-3.5 rounded-xl flex items-center gap-2.5">
          <Terminal className="h-4 w-4 text-emerald-600" />
          <div className="text-[10px] font-bold text-gray-500">
            <div className="text-gray-700 font-bold uppercase">Flink & FlinkCDC</div>
            <div className="text-emerald-600 flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              <span>数据流水线同步中</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-[#f8f9fa]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {activeTab === 'inbox' ? (
              <AlertInboxPage />
            ) : activeTab === 'builder' ? (
              <RuleBuilderPage />
            ) : activeTab === 'query' ? (
              <RuleQueryPage />
            ) : activeTab === 'pda' ? (
              <PdaOperationPage />
            ) : activeTab === 'preview' ? (
              <PreviewPage />
            ) : activeTab === 'semantic' ? (
              <SemanticLayerPage />
            ) : (
              <PlatformIntroPage />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
