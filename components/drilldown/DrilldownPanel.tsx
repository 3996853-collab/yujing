'use client';

import React, { useState, useEffect } from 'react';
import { AlertCardData } from '../alerts/AlertInboxPage';
import ProfileStats from './ProfileStats';
import Timeline from './Timeline';
import { MessageSquare, Send, UserCheck, Clock, X, ChevronRight } from 'lucide-react';

interface DrilldownPanelProps {
  alert: AlertCardData;
  onClose: () => void;
}

export default function DrilldownPanel({ alert, onClose }: DrilldownPanelProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'bills'>('profile');
  const [timeLeft, setTimeLeft] = useState<number>(3600); // 1 hour countdown in seconds
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Countdown timer for SLA violation
  useEffect(() => {
    // Reset timer on alert change
    setTimeLeft(Math.floor(Math.random() * 2000) + 1800);

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [alert.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock list of bills under this aggregation
  const mockBills = [
    { id: 'WAVE-2026052601', node: '上海仓', delay: '2.1小时', status: '待拣货' },
    { id: 'WAVE-2026052602', node: '上海仓', delay: '1.8小时', status: '待创建波次' },
    { id: 'WAVE-2026052603', node: '上海仓', delay: '2.4小时', status: '待拣货' },
    { id: 'WAVE-2026052604', node: '上海仓', delay: '1.5小时', status: '待创建波次' },
  ];

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Top Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white text-xs px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce border border-gray-800">
          <span className="font-bold text-green-400">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col gap-4 bg-[#fbfcfd]">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <span>上海省公司</span>
              <ChevronRight className="h-3 w-3" />
              <span>上海仓</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              {alert.title} <span className="font-mono text-indigo-600 ml-1">({alert.count}票)</span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SLA Countdown Timer */}
        <div className="flex items-center justify-between p-3.5 bg-red-50/60 border border-red-100 rounded-xl">
          <div className="flex items-center gap-2">
            <Clock className="h-4.5 w-4.5 text-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-800">距离 SLA 违约触发剩余时间</span>
          </div>
          <span className="text-lg font-black text-red-600 font-mono tracking-wider">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="border-b border-gray-100 px-6 flex bg-white">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3.5 px-4 font-bold text-xs border-b-2 transition-all -mb-px ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          聚合画像
        </button>
        <button
          onClick={() => setActiveTab('bills')}
          className={`py-3.5 px-4 font-bold text-xs border-b-2 transition-all -mb-px ${
            activeTab === 'bills'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          受影响波次/单据列表
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#fbfcfd] space-y-6">
        {activeTab === 'profile' ? (
          <>
            <ProfileStats 
              vipCount={alert.vipCount} 
              coldChainCount={alert.coldChainCount} 
              total={alert.count} 
            />
            
            <Timeline />

            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-3 text-xs text-gray-500">
              <h4 className="font-bold text-gray-700">异常主要诱因诊断</h4>
              <p className="leading-relaxed">
                依据当前节点上报的前置事件，分析得出 82% 的异常是由于上海仓拣货效率低；
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase font-bold text-gray-500 border-b border-gray-100">
                  <th className="py-3 px-4">波次号</th>
                  <th className="py-3 px-4">当前停留节点</th>
                  <th className="py-3 px-4">延误时长</th>
                  <th className="py-3 px-4">作业状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {mockBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">{bill.id}</td>
                    <td className="py-3 px-4 text-gray-600">{bill.node}</td>
                    <td className="py-3 px-4 text-red-600 font-bold">{bill.delay}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700">
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Floating Action Bar */}
      <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3 shadow-lg">
        <button
          onClick={() => showToast('已一键拉取企微群组，包含现场网格负责人及司机')}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#059669] border border-[#a7f3d0] transition-all"
        >
          <MessageSquare className="h-4 w-4" />
          <span>一键拉群督办</span>
        </button>

        <button
          onClick={() => showToast('急件指令已下发至上海嘉定仓现场操作员 PDA 终端')}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#eff6ff] hover:bg-[#dbeafe] text-[#2563eb] border border-[#bfdbfe] transition-all"
        >
          <Send className="h-4 w-4" />
          <span>下发加急至 PDA</span>
        </button>

        <button
          onClick={() => showToast('已指派高级质控经理人工对口跟单介入')}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-all"
        >
          <UserCheck className="h-4 w-4" />
          <span>转交人工跟进</span>
        </button>
      </div>
    </div>
  );
}
