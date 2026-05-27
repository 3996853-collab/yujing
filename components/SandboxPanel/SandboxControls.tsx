'use client';

import React, { useState } from 'react';
import ValidationChart from './ValidationChart';
import { Play, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SandboxControls() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isRunning, setIsRunning] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handleRunBacktest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
    }, 1500);
  };

  const handlePublish = () => {
    setIsPublished(true);
    setTimeout(() => {
      setIsPublished(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg/95 border-l border-gray-850 p-4 justify-between">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-gray-300 mb-1 flex items-center gap-1.5">
            <span>🧪 沙箱回测与上线 (Sandbox)</span>
          </h3>
          <p className="text-[10px] text-gray-500">发布前拉取真实历史数据演练，防范告警风暴</p>
        </div>

        {/* Backtest Config */}
        <div className="space-y-3 bg-gray-950/60 p-3 rounded-lg border border-gray-900">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">选取范围:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="24h">过去 24 小时</option>
              <option value="7d">过去 7 天</option>
              <option value="30d">过去 30 天</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-xs border-t border-gray-900/60 pt-2">
            <span className="text-gray-400">运行状态:</span>
            <span className="text-neon-emerald font-semibold flex items-center gap-1">
              {isRunning ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  跑批中...
                </>
              ) : (
                <>
                  <span>模拟跑批完成 ✅</span>
                </>
              )}
            </span>
          </div>

          <button
            onClick={handleRunBacktest}
            disabled={isRunning}
            className="w-full bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-300 text-[10px] py-1.5 rounded transition-all flex items-center justify-center gap-1"
          >
            <Play className="h-3 w-3 fill-current" />
            重新执行历史跑批
          </button>
        </div>

        {/* Dynamic Recharts Chart */}
        <ValidationChart />

        {/* Statistics & Risk Summary */}
        <div className="space-y-2 text-xs bg-gray-950/40 p-3 rounded-lg border border-gray-900/60">
          <div className="flex items-center justify-between text-gray-300">
            <span>📊 预估触发量:</span>
            <span className="font-mono font-bold text-gray-200">142 次 / 周</span>
          </div>
          
          <div className="flex items-start justify-between gap-2 border-t border-gray-900/40 pt-2 text-gray-300">
            <span>⚠️ 风险评估:</span>
            <span className="text-right text-neon-emerald font-semibold">
              低。未产生告警风暴。
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation & Publish Button */}
      <div className="mt-4 pt-4 border-t border-gray-900/60">
        <button
          onClick={handlePublish}
          disabled={isPublished}
          className={`w-full text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] ${
            isPublished 
              ? 'bg-neon-emerald text-dark-bg font-extrabold shadow-neon-emerald/20' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'
          }`}
        >
          {isPublished ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              规则已发布上线！
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              确认并发布该规则
            </>
          )}
        </button>
      </div>
    </div>
  );
}
