'use client';

import React, { useState, useEffect } from 'react';
import { Play, ShieldAlert, CheckCircle, Calendar, Clock } from 'lucide-react';
import { ComputeCondition } from './TriggerEngine';
import { TableMapping } from './RuleBasicInfo';

interface RuleLifecycleProps {
  onBacktestSuccess: () => void;
  showSubmit: boolean;
  computeConditions: ComputeCondition[];
  selectedTable: TableMapping | null;
}

export default function RuleLifecycle({ 
  onBacktestSuccess, 
  showSubmit,
  computeConditions,
  selectedTable
}: RuleLifecycleProps) {
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Param 1: Statistics date field (Past 7 days baseline)
  const [baselineMetric, setBaselineMetric] = useState('');

  // Param 2: Current system time simulation mapping field
  const [systemTimeMappingMetric, setSystemTimeMappingMetric] = useState('');

  // Dynamically filter time-related fields from active table
  let timeFields = selectedTable?.fields.filter(f => 
    f.type.toLowerCase().includes('time') || 
    f.type.toLowerCase().includes('date') ||
    f.name.toLowerCase().includes('time') ||
    f.name.toLowerCase().includes('date')
  ) || [];

  // Guarantee fallback options if physical table has no datetime columns in metadata
  if (timeFields.length === 0) {
    timeFields = [
      { name: 'out_warehouse_time', type: 'DateTime', label: '出库时间', role: 'Attribute' },
      { name: 'create_time', type: 'DateTime', label: '运单创建时间', role: 'Attribute' }
    ];
  }

  useEffect(() => {
    if (timeFields.length > 0) {
      if (!baselineMetric || !timeFields.some(f => f.name === baselineMetric)) {
        setBaselineMetric(timeFields[0].name);
      }
      if (!systemTimeMappingMetric || !timeFields.some(f => f.name === systemTimeMappingMetric)) {
        setSystemTimeMappingMetric(timeFields[Math.min(1, timeFields.length - 1)].name || timeFields[0].name);
      }
    } else {
      setBaselineMetric('');
      setSystemTimeMappingMetric('');
    }
  }, [timeFields, baselineMetric, systemTimeMappingMetric]);

  // Check if any compute condition formula references system time
  const hasCurrentTimeParam = computeConditions.some(
    c => c.type === 'formula' && (
      c.formula.includes('当前系统时间') || 
      c.formula.includes('当前系统日期') || 
      c.formula.includes('当前系统月份') ||
      c.formula.toLowerCase().includes('current')
    )
  );

  const startBacktest = () => {
    if (!baselineMetric && timeFields.length > 0) {
      alert('请先选择过去 7 天统计日期字段！');
      return;
    }
    if (hasCurrentTimeParam && !systemTimeMappingMetric && timeFields.length > 0) {
      alert('请选择当前系统时间映射字段！');
      return;
    }
    setRunning(true);
    setCompleted(false);
    setTimeout(() => {
      setRunning(false);
      setCompleted(true);
      onBacktestSuccess();
    }, 2000);
  };

  const selectedFieldName = timeFields.find(f => f.name === baselineMetric)?.label || baselineMetric || '未指定时间字段';
  const selectedSysFieldName = timeFields.find(f => f.name === systemTimeMappingMetric)?.label || systemTimeMappingMetric || '未指定时间字段';

  return (
    <div className="space-y-4 bg-white p-5 border border-gray-200 rounded-2xl shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 border-b border-gray-100 pb-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">3</span>
        <span>规则回测评估与生命周期维护</span>
      </h3>

      {/* Enforce Datetime Baseline Selection with 2 Parameters */}
      <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
          <Calendar className="h-4.5 w-4.5 text-indigo-600" />
          <span>离线回测日期时间字段对齐 (必选项)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Parameter 1: statistics date field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-gray-700">
              参数 1. 选择过去 7 天对应的统计日期字段:
            </label>
            <select
              value={baselineMetric}
              onChange={(e) => setBaselineMetric(e.target.value)}
              className="w-full bg-white border border-gray-250 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 font-bold outline-none focus:border-indigo-500 shadow-sm"
            >
              {timeFields.map(f => (
                <option key={f.name} value={f.name}>
                  按过去7天的【{f.label}】({f.name})
                </option>
              ))}
              {timeFields.length === 0 && <option value="">无可用的时间字段</option>}
            </select>
          </div>

          {/* Parameter 2: mock system time mapping field */}
          {hasCurrentTimeParam ? (
            <div className="space-y-1.5 p-2 bg-amber-50/50 border border-amber-250/50 rounded-lg animate-fadeIn">
              <label className="block text-[11px] font-extrabold text-amber-900 flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-600 animate-pulse" />
                <span>参数 2. [当前系统时间/日期] 对应的映射字段:</span>
              </label>
              <select
                value={systemTimeMappingMetric}
                onChange={(e) => setSystemTimeMappingMetric(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 font-bold outline-none focus:border-amber-500 shadow-sm"
              >
                {timeFields.map(f => (
                  <option key={f.name} value={f.name}>
                    以【{f.label}】模拟当前系统时间 ({f.name})
                  </option>
                ))}
                {timeFields.length === 0 && <option value="">无可用的时间字段</option>}
              </select>
            </div>
          ) : (
            <div className="space-y-1.5 opacity-50 select-none">
              <label className="block text-[11px] font-bold text-gray-400">
                参数 2. [当前系统时间/日期] 映射字段 (未配置该参数，无需选择)
              </label>
              <div className="w-full bg-gray-100 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-400 font-semibold cursor-not-allowed">
                公式未引用当前时间变量
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={startBacktest}
          disabled={running || timeFields.length === 0}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {running ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>正在拉取历史数据回测...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>运行离线回测</span>
            </>
          )}
        </button>

        {showSubmit && (
          <button
            type="button"
            onClick={() => {
              setSuccess(true);
              setTimeout(() => setSuccess(false), 3000);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <CheckCircle className="h-4.5 w-4.5" />
            <span>提交审核并生效</span>
          </button>
        )}
      </div>

      {completed && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3 text-green-900 animate-fadeIn shadow-xs">
          <ShieldAlert className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-green-800">回测评估成功</h4>
            <p className="text-xs leading-relaxed text-green-700">
              回测完成：已按照统计字段 <strong>【{selectedFieldName}】</strong> 进行 7 日回回溯。
              {hasCurrentTimeParam && (
                <span>
                   同时，公式中引用到的系统时间已使用 <strong>【{selectedSysFieldName}】</strong> 作为模拟对齐基准。
                </span>
              )}
               此段数据内日均产生 120 条预警，触发 45 次推送，允许同步至生效环境。
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-gray-900 border border-gray-800 text-white rounded-2xl flex items-center gap-2 shadow-lg w-fit">
          <CheckCircle className="h-4.5 w-4.5 text-green-500" />
          <span className="text-xs font-semibold">预警控制塔：规则生效提交成功，已同步至底座引擎！</span>
        </div>
      )}
    </div>
  );
}
