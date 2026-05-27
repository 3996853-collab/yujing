'use client';

import React from 'react';
import { TrendingUp, ShieldAlert, ShieldCheck } from 'lucide-react';

interface AlertDetailProps {
  totalWarnings: number;
  redWarnings: number;
  orangeWarnings: number;
  yellowWarnings: number;
}

export default function AlertDetail({ totalWarnings, redWarnings, orangeWarnings, yellowWarnings }: AlertDetailProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-indigo-600" />
          <span>全局水位大盘</span>
        </h2>
        <p className="text-xs text-gray-500 mt-1">各省区核心物流枢纽实时预警与安全指标监控</p>
      </div>

      {/* Grid of aggregated indicators */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">总未核销数</span>
          <span className="text-4xl font-extrabold text-gray-900 font-mono mt-2">{totalWarnings} <span className="text-xs font-semibold text-gray-400 ml-1">票</span></span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-red-500 uppercase tracking-wider">红色高危预警</span>
          <span className="text-4xl font-extrabold text-red-600 font-mono mt-2">{redWarnings} <span className="text-xs font-semibold text-gray-400 ml-1">票</span></span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">橙色严重预警</span>
          <span className="text-4xl font-extrabold text-orange-600 font-mono mt-2">{orangeWarnings} <span className="text-xs font-semibold text-gray-400 ml-1">票</span></span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">黄色常规预警</span>
          <span className="text-4xl font-extrabold text-yellow-600 font-mono mt-2">{yellowWarnings} <span className="text-xs font-semibold text-gray-400 ml-1">票</span></span>
        </div>
      </div>

      {/* Visual indicators */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">预警级别分布 (实时统计)</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>红色预警</span>
                <span>{totalWarnings > 0 ? Math.round((redWarnings / totalWarnings) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full transition-all duration-500" style={{ width: `${totalWarnings > 0 ? (redWarnings / totalWarnings) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>橙色预警</span>
                <span>{totalWarnings > 0 ? Math.round((orangeWarnings / totalWarnings) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: `${totalWarnings > 0 ? (orangeWarnings / totalWarnings) * 100 : 0}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                <span>黄色预警</span>
                <span>{totalWarnings > 0 ? Math.round((yellowWarnings / totalWarnings) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full transition-all duration-500" style={{ width: `${totalWarnings > 0 ? (yellowWarnings / totalWarnings) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-2">安全静默与自动消警机制</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              本控制塔全面引入“隐性核销”逻辑，对于超时入库、发车晚点等业务预警，不设立任何人工处理/核销/关闭按钮。系统直接通过下行流转的数据状态判定是否已恢复。
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 p-3 bg-green-50 rounded-xl border border-green-100 text-green-800 text-xs">
            <ShieldAlert className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="font-medium">过去 24 小时系统自动静默核销率达 96.8%</span>
          </div>
        </div>
      </div>

      {/* Trending section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4">近 7 天时效趋势波幅</h3>
        <div className="flex items-end justify-between h-36 gap-3 pt-4">
          <div className="flex-1 bg-indigo-100 hover:bg-indigo-200 transition-all rounded-t-lg" style={{ height: '40%' }}></div>
          <div className="flex-1 bg-indigo-100 hover:bg-indigo-200 transition-all rounded-t-lg" style={{ height: '55%' }}></div>
          <div className="flex-1 bg-indigo-200 hover:bg-indigo-300 transition-all rounded-t-lg" style={{ height: '70%' }}></div>
          <div className="flex-1 bg-indigo-100 hover:bg-indigo-200 transition-all rounded-t-lg" style={{ height: '50%' }}></div>
          <div className="flex-1 bg-indigo-100 hover:bg-indigo-200 transition-all rounded-t-lg" style={{ height: '45%' }}></div>
          <div className="flex-1 bg-indigo-200 hover:bg-indigo-300 transition-all rounded-t-lg" style={{ height: '80%' }}></div>
          <div className="flex-1 bg-red-400 hover:bg-red-500 transition-all rounded-t-lg" style={{ height: '95%' }}></div>
        </div>
        <div className="flex justify-between text-xs font-semibold text-gray-400 mt-3">
          <span>周一</span>
          <span>周二</span>
          <span>周三</span>
          <span>周四</span>
          <span>周五</span>
          <span>周六</span>
          <span>周日 (高水位)</span>
        </div>
      </div>
    </div>
  );
}
