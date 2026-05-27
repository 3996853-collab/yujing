'use client';

import React, { useState } from 'react';
import { HelpCircle, ShieldAlert, Layers } from 'lucide-react';
import { TableMapping } from './RuleBasicInfo';

export interface LevelConfig {
  enabled: boolean;
  threshold: number;
  notifyRole: string;
  notifyChannel: string;
  notifyFrequencyType: 'fixed' | 'interval';
  notifyFrequencyValue: string;
}

interface EscalationMatrixProps {
  groupByDimensions: string[];
  setGroupByDimensions: (val: string[]) => void;
  levelConfigs: Record<number, LevelConfig>;
  setLevelConfigs: React.Dispatch<React.SetStateAction<Record<number, LevelConfig>>>;
  selectedTable: TableMapping | null;
}

export default function EscalationMatrix({
  groupByDimensions,
  setGroupByDimensions,
  levelConfigs,
  setLevelConfigs,
  selectedTable,
}: EscalationMatrixProps) {
  
  // Track active configuration level tab
  const [activeTab, setActiveTab] = useState<number>(1);

  // Dynamically extract dimensions from selected table mapping
  const tableDimensions = selectedTable?.fields.filter(f => f.role === 'Dimension' || f.role === 'Attribute') || [];
  const dimensions = tableDimensions.map(f => ({
    value: f.name,
    label: `${f.label} (${f.name})`
  }));

  const isAggregated = groupByDimensions.length > 0;

  const activeConfig = levelConfigs[activeTab] || {
    threshold: 1,
    notifyRole: '仓库经理',
    notifyChannel: '钉钉群机器人',
    notifyFrequencyType: 'interval',
    notifyFrequencyValue: '30'
  };

  const updateActiveConfig = (fields: Partial<LevelConfig>) => {
    setLevelConfigs(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        ...fields
      }
    }));
  };

  return (
    <div className="space-y-4 bg-white p-5 border border-gray-200 rounded-2xl shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 border-b border-gray-100 pb-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">2.5</span>
        <span>聚合策略与分发路由矩阵 (Aggregation & Distribution)</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Aggregation selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
              <span>1. 聚合维度选择 (GroupBy Dimensions)</span>
              <span className="cursor-help" title="选择预警汇总维度。不聚合会逐单生成预警，适合核心高危异常件。">
                <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              </span>
            </label>
            
            <div className="space-y-3">
              {/* Option A: No Aggregation */}
              <div 
                onClick={() => setGroupByDimensions([])}
                className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                  !isAggregated 
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input 
                  type="radio"
                  name="aggregationType"
                  checked={!isAggregated}
                  onChange={() => setGroupByDimensions([])}
                  className="mt-0.5 rounded-full text-indigo-600 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-bold text-gray-800 block">不聚合</span>
                  <span className="text-[10px] text-gray-500">逐单明细推送，实时高频发出，适合极高危件</span>
                </div>
              </div>

              {/* Option B: Aggregation */}
              <div 
                onClick={() => {
                  if (!isAggregated && dimensions.length > 0) {
                    setGroupByDimensions([dimensions[0].value]);
                  }
                }}
                className={`p-3.5 border rounded-xl cursor-pointer transition-all flex items-start gap-3 ${
                  isAggregated 
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input 
                  type="radio"
                  name="aggregationType"
                  checked={isAggregated}
                  onChange={() => {
                    if (!isAggregated && dimensions.length > 0) {
                      setGroupByDimensions([dimensions[0].value]);
                    }
                  }}
                  className="mt-0.5 rounded-full text-indigo-600 focus:ring-0"
                />
                <div className="flex-1 space-y-2">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">维度汇总聚合</span>
                    <span className="text-[10px] text-gray-500">按照选定字段多维汇聚计算，适用于控制塔看板与通知推送</span>
                  </div>
                  
                  {isAggregated && (
                    <div onClick={(e) => e.stopPropagation()} className="space-y-2">
                      <span className="text-[10px] text-gray-400 font-bold block mb-1">选择聚合维度 (多选):</span>
                      <div className="grid grid-cols-1 gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200 max-h-40 overflow-y-auto">
                        {dimensions.map(d => {
                          const isChecked = groupByDimensions.includes(d.value);
                          return (
                            <label key={d.value} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 hover:text-indigo-600 py-0.5">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setGroupByDimensions(groupByDimensions.filter(item => item !== d.value));
                                  } else {
                                    setGroupByDimensions([...groupByDimensions, d.value]);
                                  }
                                }}
                                className="rounded text-indigo-600 focus:ring-0"
                              />
                              <span>{d.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: 3-Level config selector & Settings */}
        <div className="space-y-4 border-l border-gray-100 pl-0 md:pl-6">
          {/* Level Switch Tab Bar */}
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">预警分级选择与配置:</span>
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
              {[1, 2, 3].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setActiveTab(lvl)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1 ${
                    activeTab === lvl
                      ? 'bg-white text-indigo-700 shadow-sm border border-gray-150'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Layers className={`h-3 w-3 ${activeTab === lvl ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span>{lvl} 级预警</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 p-4 border border-indigo-50 bg-indigo-50/10 rounded-2xl">
            {/* Toggle Enable/Disable for Level 2 & 3 */}
            {activeTab > 1 && (
              <div className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-xl shadow-xs">
                <span className="text-xs font-bold text-gray-700">启用该级别预警配置</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeConfig.enabled}
                    onChange={(e) => updateActiveConfig({ enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            )}

            {activeConfig.enabled ? (
              <>
                {/* Threshold config */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                    <span>{activeTab} 级触发阈值门槛 (Trigger Threshold)</span>
                    <ShieldAlert className="h-3.5 w-3.5 text-gray-400" />
                  </label>
                  <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-medium">当 预警触发判定 结果 &gt;=</span>
                      <input
                        type="number"
                        min="1"
                        value={activeConfig.threshold}
                        onChange={(e) => updateActiveConfig({ threshold: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="bg-gray-50 border border-gray-250 rounded-lg px-3 py-1 text-xs font-bold text-gray-800 outline-none w-20 focus:border-indigo-500 text-center"
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 block leading-tight">
                      💡 设定第 {activeTab} 级预警触发的最底线件数/票数。只有达到该门槛时才发出对应级别报警。
                    </span>
                  </div>
                </div>

                {/* Touchpoints Recipients, Channels, & Frequency */}
                <div className="space-y-3 pt-1">
                  <label className="block text-xs font-bold text-gray-700">{activeTab} 级触达分发与通知设置</label>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold">通知接收角色</span>
                      <select
                        value={activeConfig.notifyRole}
                        onChange={(e) => updateActiveConfig({ notifyRole: e.target.value })}
                        className="border border-gray-200 bg-white rounded-lg p-2 text-xs text-gray-700 focus:border-indigo-500 outline-none font-semibold"
                      >
                        <option value="仓库经理">仓库经理 (Site Manager)</option>
                        <option value="运营经理">运营经理 (Operations Manager)</option>
                        <option value="高级总监">高级总监 (Senior Director)</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400 font-bold">通知渠道</span>
                      <select
                        value={activeConfig.notifyChannel}
                        onChange={(e) => updateActiveConfig({ notifyChannel: e.target.value })}
                        className="border border-gray-200 bg-white rounded-lg p-2 text-xs text-gray-700 focus:border-indigo-500 outline-none font-semibold"
                      >
                        <option value="钉钉群机器人">钉钉群机器人 (Ding Robot)</option>
                        <option value="邮件通知">邮件通知 (Email)</option>
                        <option value="短信通知">短信通知 (SMS)</option>
                        <option value="自动分配工单">自动分配工单 (Work Order)</option>
                      </select>
                    </div>

                    {/* Notification Frequency */}
                    <div className="flex flex-col gap-1 col-span-2 mt-1">
                      <span className="text-[10px] text-gray-400 font-bold mb-1">通知频率 (Notification Frequency)</span>
                      <div className="flex items-center gap-4 bg-white p-2.5 rounded-xl border border-gray-250 text-xs shadow-xs">
                        {/* Fixed Time Option */}
                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700">
                          <input
                            type="radio"
                            name={`notifyFrequency-${activeTab}`}
                            checked={activeConfig.notifyFrequencyType === 'fixed'}
                            onChange={() => {
                              updateActiveConfig({ notifyFrequencyType: 'fixed', notifyFrequencyValue: '09:00' });
                            }}
                            className="rounded-full text-indigo-600 focus:ring-0"
                          />
                          <span>固定时间</span>
                          {activeConfig.notifyFrequencyType === 'fixed' && (
                            <input
                              type="text"
                              placeholder="09:00"
                              value={activeConfig.notifyFrequencyValue}
                              onChange={(e) => updateActiveConfig({ notifyFrequencyValue: e.target.value })}
                              className="bg-gray-50 border border-gray-250 rounded-lg px-2 py-0.5 text-[11px] font-bold text-gray-800 outline-none w-16 text-center focus:border-indigo-500"
                            />
                          )}
                        </label>

                        {/* Interval Option */}
                        <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700">
                          <input
                            type="radio"
                            name={`notifyFrequency-${activeTab}`}
                            checked={activeConfig.notifyFrequencyType === 'interval'}
                            onChange={() => {
                              updateActiveConfig({ notifyFrequencyType: 'interval', notifyFrequencyValue: '30' });
                            }}
                            className="rounded-full text-indigo-600 focus:ring-0"
                          />
                          <span>每隔</span>
                          {activeConfig.notifyFrequencyType === 'interval' && (
                            <input
                              type="number"
                              min="1"
                              placeholder="30"
                              value={activeConfig.notifyFrequencyValue}
                              onChange={(e) => updateActiveConfig({ notifyFrequencyValue: e.target.value })}
                              className="bg-gray-50 border border-gray-250 rounded-lg px-2 py-0.5 text-[11px] font-bold text-gray-800 outline-none w-14 text-center focus:border-indigo-500"
                            />
                          )}
                          <span>分钟通知</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-xs font-bold text-gray-400 space-y-2">
                <p>⚠️ {activeTab} 级预警配置已禁用</p>
                <p className="text-[10px] font-semibold text-gray-400">开启后将对此级别的聚合件数进行差异化门槛和通知设置。</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
