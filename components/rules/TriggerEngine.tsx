'use client';

import React from 'react';
import { Plus, Trash2, Code, Shield, Calculator, Filter, PlayCircle } from 'lucide-react';
import { TableMapping } from './RuleBasicInfo';

export interface ScopeFilter {
  id: string;
  dimension: string;
  comparison: string;
  value: string;
}

export interface ComputeCondition {
  id: string;
  type: 'static' | 'formula' | 'timeseries';
  metric: string;
  leftMathOp?: string;
  leftMathValue?: string;
  formula: string;
  period: string;
  comparison: string;
  rightType?: 'static' | 'metric';
  rightMetric?: string;
  rightMathOp?: string;
  rightMathValue?: string;
  threshold: string;
}

interface TriggerEngineProps {
  engineMode: 'A' | 'B';
  setEngineMode: (val: 'A' | 'B') => void;
  preEvent: string;
  setPreEvent: (val: string) => void;
  postEvent: string;
  setPostEvent: (val: string) => void;
  timeWindow: string;
  setTimeWindow: (val: string) => void;
  
  // Step 1 States & Actions
  skipScope: boolean;
  setSkipScope: (val: boolean) => void;
  scopeOperator: 'AND' | 'OR';
  setScopeOperator: (val: 'AND' | 'OR') => void;
  scopeFilters: ScopeFilter[];
  addScopeFilter: () => void;
  deleteScopeFilter: (id: string) => void;
  editScopeFilter: (id: string, fields: Partial<ScopeFilter>) => void;

  // Step 2 States & Actions
  computeOperator: 'AND' | 'OR';
  setComputeOperator: (val: 'AND' | 'OR') => void;
  computeConditions: ComputeCondition[];
  addComputeCondition: () => void;
  deleteComputeCondition: (id: string) => void;
  editComputeCondition: (id: string, fields: Partial<ComputeCondition>) => void;

  showDebugger: boolean;
  setShowDebugger: (val: boolean) => void;
  selectedTable: TableMapping | null;
}

export default function TriggerEngine({
  engineMode,
  setEngineMode,
  preEvent,
  setPreEvent,
  postEvent,
  setPostEvent,
  timeWindow,
  setTimeWindow,
  
  skipScope,
  setSkipScope,
  scopeOperator,
  setScopeOperator,
  scopeFilters,
  addScopeFilter,
  deleteScopeFilter,
  editScopeFilter,

  computeOperator,
  setComputeOperator,
  computeConditions,
  addComputeCondition,
  deleteComputeCondition,
  editComputeCondition,

  showDebugger,
  setShowDebugger,
  selectedTable,
}: TriggerEngineProps) {

  // Dynamically map dimensions and metrics from the selected table
  const tableDimensions = selectedTable?.fields.filter(f => f.role === 'Dimension' || f.role === 'Attribute') || [];
  const tableMetrics = selectedTable?.fields.filter(f => f.role === 'Metric') || [];

  const dimensions = tableDimensions.map(f => ({
    value: f.name,
    label: `${f.label} (${f.name})`
  }));

  const metrics = [
    { value: 'push_order_count', label: '推单量 (push_order_count)' },
    ...(tableMetrics.map(f => ({
      value: f.name,
      label: `${f.label} (${f.name})`
    })))
  ];

  const operators = [
    { value: 'gt', label: '大于 (>)' },
    { value: 'lt', label: '小于 (<)' },
    { value: 'gte', label: '大于等于 (>=)' },
    { value: 'lte', label: '小于等于 (<=)' },
    { value: 'eq', label: '等于 (=)' },
    { value: 'neq', label: '不等于 (!=)' },
    { value: 'contains', label: '包含 (LIKE)' },
    { value: 'is_null', label: '为空 (IS NULL)' },
    { value: 'is_not_null', label: '不为空 (IS NOT NULL)' },
  ];

  // Shortcut parameters list for formula inputs
  const defaultChips = [
    { label: '当前系统时间', value: '[当前系统时间]' },
    { label: '当前系统日期', value: '[当前系统日期]' },
    { label: '当前系统月份', value: '[当前系统月份]' }
  ];

  const fieldChips = selectedTable?.fields.map(f => ({
    label: f.label,
    value: `[${f.label}]`
  })) || [];

  const parameterChips = [...defaultChips, ...fieldChips];

  return (
    <div className="space-y-6 bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">2</span>
          <span>双模式规则计算引擎配置</span>
        </h3>
        
        <button
          type="button"
          onClick={() => setShowDebugger(!showDebugger)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
            showDebugger
              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
              : 'bg-white border-gray-250 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Code className="h-4 w-4" />
          <span>{showDebugger ? '收起调试器' : '展开调试器'}</span>
        </button>
      </div>

      {/* Mode Switches */}
      <div className="flex bg-gray-100 rounded-xl p-1 w-fit border border-gray-200">
        <button
          type="button"
          onClick={() => setEngineMode('A')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            engineMode === 'A'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <PlayCircle className="h-4 w-4 text-indigo-600" />
          <span>⚙️ 模式 A (指标多维聚合触发)</span>
        </button>
        <button
          type="button"
          onClick={() => setEngineMode('B')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 ${
            engineMode === 'B'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <PlayCircle className="h-4 w-4 text-emerald-600" />
          <span>🕸️ 模式 B (事件时序流触发)</span>
        </button>
      </div>

      {engineMode === 'A' ? (
        <div className="space-y-6">
          
          {/* Step 1: Scope definition */}
          <div className="border border-gray-200 rounded-xl p-5 bg-[#fbfcfd] space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4.5 w-4.5 text-indigo-500" />
                <span className="text-xs font-bold text-gray-800">第一步：范围确认 (Scope Definition / WHERE)</span>
              </div>
              
              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-gray-600">
                <input
                  type="checkbox"
                  checked={skipScope}
                  onChange={(e) => setSkipScope(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0"
                />
                <span>跳过范围确认 (全量数据)</span>
              </label>
            </div>

            {!skipScope && (
              <div className="space-y-4">
                {/* Scope Operator Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">过滤逻辑关系:</span>
                  <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                    <button
                      type="button"
                      onClick={() => setScopeOperator('AND')}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                        scopeOperator === 'AND'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      AND
                    </button>
                    <button
                      type="button"
                      onClick={() => setScopeOperator('OR')}
                      className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                        scopeOperator === 'OR'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      OR
                    </button>
                  </div>
                </div>

                {/* Filters list */}
                <div className="space-y-3">
                  {scopeFilters.map((filter) => (
                    <div key={filter.id} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg p-3 shadow-xs">
                      {/* Dimension selection */}
                      <div className="flex-1 min-w-[200px]">
                        <select
                          value={filter.dimension}
                          onChange={(e) => editScopeFilter(filter.id, { dimension: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500 font-semibold"
                        >
                          {dimensions.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                          {dimensions.length === 0 && <option value="">无可用的维度字段</option>}
                        </select>
                      </div>

                      {/* Operator selection */}
                      <div className="w-[120px]">
                        <select
                          value={filter.comparison}
                          onChange={(e) => editScopeFilter(filter.id, { comparison: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500 font-semibold"
                        >
                          {operators.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>

                      {/* Value input (hidden for IS NULL / IS NOT NULL) */}
                      {!['is_null', 'is_not_null'].includes(filter.comparison) && (
                        <div className="flex-1 min-w-[150px]">
                          <input
                            type="text"
                            value={filter.value}
                            placeholder="输入筛选值，例如: 上海"
                            onChange={(e) => editScopeFilter(filter.id, { value: e.target.value })}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-500 font-bold"
                          />
                        </div>
                      )}

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => deleteScopeFilter(filter.id)}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {scopeFilters.length === 0 && (
                    <p className="text-xs text-gray-400 py-2">无过滤规则，请点击下方按钮添加筛选条件。</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={addScopeFilter}
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-dashed border-indigo-300 hover:border-indigo-500 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50/30 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>添加筛选条件</span>
                </button>
              </div>
            )}
            
            {skipScope && (
              <p className="text-xs text-gray-400 font-medium bg-gray-50 p-3 rounded-lg border border-gray-150">
                🔒 您已勾选“跳过范围确认”，预警底池将默认包含数仓全量明细数据，直接进入判断条件计算层。
              </p>
            )}
          </div>

          {/* Step 2: Condition logic */}
          <div className="border border-gray-200 rounded-xl p-5 bg-[#fbfcfd] space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-4.5 w-4.5 text-indigo-500" />
                <span className="text-xs font-bold text-gray-800">第二步：判断条件 (Condition Logic / HAVING & COMPUTE)</span>
              </div>

              {/* Mode A Condition logic operator AND/OR */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">条件逻辑关系:</span>
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setComputeOperator('AND')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      computeOperator === 'AND'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    AND
                  </button>
                  <button
                    type="button"
                    onClick={() => setComputeOperator('OR')}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      computeOperator === 'OR'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    OR
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {computeConditions.map((cond) => (
                <div key={cond.id} className="border border-gray-200 bg-white rounded-xl p-4 shadow-xs space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    {/* Condition Type Switch */}
                    <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => editComputeCondition(cond.id, { type: 'static' })}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                          cond.type === 'static'
                            ? 'bg-white text-gray-850 shadow-sm border border-gray-200'
                            : 'text-gray-500 hover:text-gray-850'
                        }`}
                      >
                        静态值匹配
                      </button>
                      <button
                        type="button"
                        onClick={() => editComputeCondition(cond.id, { type: 'formula' })}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                          cond.type === 'formula'
                            ? 'bg-white text-gray-850 shadow-sm border border-gray-200'
                            : 'text-gray-500 hover:text-gray-850'
                        }`}
                      >
                        动态逻辑计算
                      </button>
                      <button
                        type="button"
                        onClick={() => editComputeCondition(cond.id, { type: 'timeseries' })}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                          cond.type === 'timeseries'
                            ? 'bg-white text-gray-850 shadow-sm border border-gray-200'
                            : 'text-gray-500 hover:text-gray-850'
                        }`}
                      >
                        时序均值计算
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteComputeCondition(cond.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Render based on Type */}
                  <div className="flex flex-wrap items-center gap-3">
                    {cond.type === 'static' && (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 左侧变量 */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-500 font-semibold">左侧变量:</span>
                          <select
                            value={cond.metric}
                            onChange={(e) => editComputeCondition(cond.id, { metric: e.target.value })}
                            className="w-[160px] bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500 font-semibold"
                          >
                            {metrics.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                          </select>
                        </div>

                        {/* 左侧运算 */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-500 font-semibold">运算(选填):</span>
                          <div className="flex items-center gap-1">
                            <select
                              value={cond.leftMathOp || ''}
                              onChange={(e) => editComputeCondition(cond.id, { leftMathOp: e.target.value })}
                              className="w-[50px] bg-white border border-gray-200 rounded-lg px-1 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500 text-center"
                            >
                              <option value="">无</option>
                              <option value="+">+</option>
                              <option value="-">-</option>
                              <option value="*">*</option>
                              <option value="/">/</option>
                            </select>
                            {cond.leftMathOp && (
                              <input
                                type="number"
                                value={cond.leftMathValue || ''}
                                placeholder="值"
                                onChange={(e) => editComputeCondition(cond.id, { leftMathValue: e.target.value })}
                                className="w-[60px] bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-500"
                              />
                            )}
                          </div>
                        </div>

                        {/* 逻辑条件 */}
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-gray-500 font-semibold">判断条件:</span>
                          <select
                            value={cond.comparison}
                            onChange={(e) => editComputeCondition(cond.id, { comparison: e.target.value })}
                            className="w-[100px] bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500 font-semibold"
                          >
                            {operators.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        </div>

                        {!['is_null', 'is_not_null'].includes(cond.comparison) && (
                          <>
                            {/* 右侧参照量 */}
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-gray-500 font-semibold">参照量:</span>
                              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 p-0.5 rounded-lg">
                                <button
                                  type="button"
                                  onClick={() => editComputeCondition(cond.id, { rightType: 'static' })}
                                  className={`px-2 py-1 rounded text-[10px] font-bold ${(!cond.rightType || cond.rightType === 'static') ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                                >
                                  常量
                                </button>
                                <button
                                  type="button"
                                  onClick={() => editComputeCondition(cond.id, { rightType: 'metric' })}
                                  className={`px-2 py-1 rounded text-[10px] font-bold ${cond.rightType === 'metric' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                                >
                                  变量
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-1 mt-[18px]">
                              {cond.rightType === 'metric' ? (
                                <select
                                  value={cond.rightMetric || ''}
                                  onChange={(e) => editComputeCondition(cond.id, { rightMetric: e.target.value })}
                                  className="w-[160px] bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500 font-semibold"
                                >
                                  <option value="">选择指标...</option>
                                  {metrics.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={cond.threshold}
                                  placeholder="如: 10"
                                  onChange={(e) => editComputeCondition(cond.id, { threshold: e.target.value })}
                                  className="w-[100px] bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-500 font-bold"
                                />
                              )}
                            </div>

                            {/* 右侧运算 */}
                            {cond.rightType === 'metric' && (
                              <div className="flex flex-col gap-1 mt-[18px]">
                                <div className="flex items-center gap-1">
                                  <select
                                    value={cond.rightMathOp || ''}
                                    onChange={(e) => editComputeCondition(cond.id, { rightMathOp: e.target.value })}
                                    className="w-[50px] bg-white border border-gray-200 rounded-lg px-1 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500 text-center"
                                  >
                                    <option value="">无</option>
                                    <option value="+">+</option>
                                    <option value="-">-</option>
                                    <option value="*">*</option>
                                    <option value="/">/</option>
                                  </select>
                                  {cond.rightMathOp && (
                                    <input
                                      type="text"
                                      value={cond.rightMathValue || ''}
                                      placeholder="如: 1.3"
                                      onChange={(e) => editComputeCondition(cond.id, { rightMathValue: e.target.value })}
                                      className="w-[60px] bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-500"
                                    />
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {cond.type === 'formula' && (
                      <div className="flex-1 flex flex-col gap-2.5 min-w-[320px]">
                        <div className="flex flex-wrap items-center gap-3 w-full">
                          <span className="text-xs text-gray-500 font-semibold font-sans">计算公式:</span>
                          <div className="flex-1 min-w-[250px]">
                            <input
                              type="text"
                              value={cond.formula}
                              placeholder="如: [当前系统时间] - [最晚发货时间]"
                              onChange={(e) => editComputeCondition(cond.id, { formula: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-850 font-mono outline-none focus:border-indigo-500 font-bold"
                            />
                          </div>

                          <span className="text-xs text-gray-500 font-semibold font-sans">条件:</span>
                          <div className="w-[120px]">
                            <select
                              value={cond.comparison}
                              onChange={(e) => editComputeCondition(cond.id, { comparison: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-indigo-500 font-semibold"
                            >
                              {operators.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                          </div>

                          <span className="text-xs text-gray-500 font-semibold font-sans">阈值:</span>
                          <div className="w-[100px]">
                            <input
                              type="text"
                              value={cond.threshold}
                              placeholder="如: 2"
                              onChange={(e) => editComputeCondition(cond.id, { threshold: e.target.value })}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-indigo-500 font-bold"
                            />
                          </div>
                        </div>

                        {/* Parameter Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pl-14">
                          <span className="text-[10px] text-gray-400 font-bold mr-1 font-sans">快捷插入列/参数:</span>
                          {parameterChips.map(chip => (
                            <button
                              key={chip.label}
                              type="button"
                              onClick={() => editComputeCondition(cond.id, { formula: (cond.formula || '') + chip.value })}
                              className="px-2 py-0.5 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded text-[10px] font-medium transition-colors cursor-pointer"
                            >
                              + {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {cond.type === 'timeseries' && (
                      <div className="flex-1 flex flex-col gap-3 min-w-[320px] bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                          {/* Step 1 */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block">第一步：选择指标</span>
                            <select
                              value={cond.metric}
                              onChange={(e) => editComputeCondition(cond.id, { metric: e.target.value })}
                              className="w-full bg-white border border-gray-250 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 font-bold outline-none focus:border-indigo-500 shadow-sm"
                            >
                              {metrics.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                          </div>

                          {/* Step 2 */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block">第二步：选择运算符</span>
                            <div className="flex gap-2">
                              <select
                                value={cond.comparison}
                                onChange={(e) => editComputeCondition(cond.id, { comparison: e.target.value })}
                                className="flex-1 bg-white border border-gray-250 rounded-lg px-2 py-1.5 text-xs text-gray-750 font-bold outline-none focus:border-indigo-500 shadow-sm"
                              >
                                <option value="timeseries_avg">比对过去 N 天均值</option>
                              </select>
                              <div className="flex items-center gap-1 bg-white border border-gray-250 rounded-lg px-2 py-1 shadow-sm w-20">
                                <span className="text-[10px] text-gray-400 font-bold">N=</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={cond.period || '7'}
                                  onChange={(e) => editComputeCondition(cond.id, { period: e.target.value })}
                                  className="w-full text-center text-xs font-bold text-gray-800 outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase block">第三步：输入参数 (波动幅度)</span>
                            <div className="relative">
                              <input
                                type="text"
                                value={cond.threshold || '30%'}
                                placeholder="如: 30%"
                                onChange={(e) => editComputeCondition(cond.id, { threshold: e.target.value })}
                                className="w-full bg-white border border-gray-250 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-gray-800 outline-none focus:border-indigo-500 shadow-sm"
                              />
                              <span className="absolute right-3 top-2 text-[10px] font-bold text-gray-400">幅度</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {computeConditions.length === 0 && (
                <p className="text-xs text-gray-400 py-2">无判断条件，请点击下方按钮添加规则逻辑。</p>
              )}

              <button
                type="button"
                onClick={addComputeCondition}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-dashed border-indigo-300 hover:border-indigo-500 rounded-lg text-xs font-bold text-indigo-600 hover:bg-indigo-50/30 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>添加判断条件</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Mode B Event Flow UI */
        <div className="p-5 border border-gray-200 bg-white rounded-2xl shadow-sm space-y-4">
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">前置触发事件</label>
              <select
                value={preEvent}
                onChange={(e) => setPreEvent(e.target.value)}
                className="bg-gray-55 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-indigo-500"
              >
                <option value="ORDER_CREATED">下单 (ORDER_CREATED)</option>
                <option value="CARRIER_PICKED_UP">揽收 (CARRIER_PICKED_UP)</option>
                <option value="TRUCK_LOADED">装车 (TRUCK_LOADED)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">监控时间窗口 (小时)</label>
              <input
                type="number"
                value={timeWindow}
                onChange={(e) => setTimeWindow(e.target.value)}
                placeholder="例如: 2"
                className="bg-gray-55 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-850 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">未发生后置事件</label>
              <select
                value={postEvent}
                onChange={(e) => setPostEvent(e.target.value)}
                className="bg-gray-55 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-indigo-500"
              >
                <option value="WAVE_GENERATED">波次生成 (WAVE_GENERATED)</option>
                <option value="TRUCK_DEPARTED">发车 (TRUCK_DEPARTED)</option>
                <option value="DELIVERY_SIGNED">签收 (DELIVERY_SIGNED)</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-55 p-4 border border-gray-150 rounded-xl leading-relaxed">
            💡 模式B时序引擎将自动监测时序事件流：当前置事件发生后，在设定的时间窗口内，若未接收到目标后置事件流上报，则触发即时预警。
          </div>
        </div>
      )}
    </div>
  );
}
