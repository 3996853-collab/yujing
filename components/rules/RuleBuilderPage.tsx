'use client';

import React, { useState, useEffect } from 'react';
import RuleBasicInfo, { businessLineToTables, TableMapping } from './RuleBasicInfo';
import TriggerEngine, { ScopeFilter, ComputeCondition } from './TriggerEngine';
import EscalationMatrix from './EscalationMatrix';
import RuleLifecycle from './RuleLifecycle';
import { Code, Terminal, Sparkles, Brain } from 'lucide-react';

export default function RuleBuilderPage() {
  // Basic info states
  const [ruleName, setRuleName] = useState('上海仓出库揽收即将超时预警');
  const [businessLine, setBusinessLine] = useState('冷链仓配');
  const [warningLevel, setWarningLevel] = useState<'RED' | 'ORANGE' | 'YELLOW'>('RED');

  // Track the active data warehouse physical source table
  const [selectedTable, setSelectedTable] = useState<TableMapping | null>(null);

  // AI Input states
  const [aiPrompt, setAiPrompt] = useState('[场景一] 上海仓库揽收即将超时预警');
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [aiSteps, setAiSteps] = useState<{ id: string; text: string; status: 'pending' | 'active' | 'done' }[]>([]);

  // Engine mode state
  const [engineMode, setEngineMode] = useState<'A' | 'B'>('A');
  const [showDebugger, setShowDebugger] = useState(false);

  // Mode B: Event sequence parameters
  const [preEvent, setPreEvent] = useState('ORDER_CREATED');
  const [postEvent, setPostEvent] = useState('WAVE_GENERATED');
  const [timeWindow, setTimeWindow] = useState('2');

  // Mode A: Step-by-Step Structured State
  const [skipScope, setSkipScope] = useState(false);
  const [scopeOperator, setScopeOperator] = useState<'AND' | 'OR'>('AND');
  const [scopeFilters, setScopeFilters] = useState<ScopeFilter[]>([
    { id: 'sf-1', dimension: 'warehouse_name', comparison: 'contains', value: '上海' },
    { id: 'sf-2', dimension: 'process_type', comparison: 'eq', value: '0' }
  ]);
  const [computeOperator, setComputeOperator] = useState<'AND' | 'OR'>('AND');
  const [computeConditions, setComputeConditions] = useState<ComputeCondition[]>([
    { id: 'cc-1', type: 'static', metric: 'receive_time', formula: '', period: '7', comparison: 'is_null', threshold: '' },
    { id: 'cc-2', type: 'static', metric: 'latest_delivery_time', formula: '', period: '7', comparison: 'lte', threshold: '1' }
  ]);

  // 3-Level Configs
  const [levelConfigs, setLevelConfigs] = useState<Record<number, {
    enabled: boolean;
    threshold: number;
    notifyRole: string;
    notifyChannel: string;
    notifyPhoneNumbers?: string;
    notifyFrequencyType: 'fixed' | 'interval';
    notifyFrequencyValue: string;
    groupByDimensions: string[];
  }>>({
    1: { enabled: true, threshold: 1, notifyRole: '仓库经理', notifyChannel: '钉钉群机器人', notifyFrequencyType: 'interval', notifyFrequencyValue: '30', groupByDimensions: [] },
    2: { enabled: true, threshold: 5, notifyRole: '运营经理', notifyChannel: '钉钉工作通知', notifyPhoneNumbers: '', notifyFrequencyType: 'interval', notifyFrequencyValue: '15', groupByDimensions: [] },
    3: { enabled: true, threshold: 10, notifyRole: '高级总监', notifyChannel: '短信通知', notifyFrequencyType: 'fixed', notifyFrequencyValue: '09:00', groupByDimensions: [] }
  });

  // Outputs
  const [astJson, setAstJson] = useState('');
  const [pseudoSql, setPseudoSql] = useState('');
  const [showSubmit, setShowSubmit] = useState(false);

  // Helper mapping comparison keys to SQL signs
  const getCompSymbol = (comparison: string) => {
    switch (comparison) {
      case 'gt': return '>';
      case 'lt': return '<';
      case 'gte': return '>=';
      case 'lte': return '<=';
      case 'eq': return '=';
      case 'neq': return '!=';
      case 'contains': return 'LIKE';
      case 'is_null': return 'IS NULL';
      case 'is_not_null': return 'IS NOT NULL';
      default: return '=';
    }
  };

  // Compile individual ComputeCondition into SQL fragment
  const compileCondition = (c: ComputeCondition, isAgg: boolean) => {
    const compSymbol = getCompSymbol(c.comparison);
    
    if (c.type === 'formula') {
      // Substitute system variables
      let sqlFormula = c.formula
        .replace(/\[当前系统时间\]/g, 'CURRENT_TIMESTAMP')
        .replace(/\[当前系统日期\]/g, 'CURRENT_DATE')
        .replace(/\[当前系统月份\]/g, 'EXTRACT(MONTH FROM CURRENT_DATE)');
      
      // Substitute Chinese labels for fields with physical names
      if (selectedTable) {
        selectedTable.fields.forEach(f => {
          const escapedLabel = f.label.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`\\[${escapedLabel}\\]`, 'g');
          sqlFormula = sqlFormula.replace(regex, `[${f.name}]`);
        });
      }

      // Strip brackets for fields
      sqlFormula = sqlFormula.replace(/\[(.*?)\]/g, '$1');
      return `${sqlFormula} ${compSymbol} ${c.threshold}`;
    }
    
    if (c.type === 'timeseries') {
      return `AVG_LAST_${c.period}_DAYS(${c.metric}) ${compSymbol} ${c.threshold}`;
    }
    
    // c.type === 'static'
    const isTimeMetric = c.metric.toLowerCase().includes('time') || c.metric.toLowerCase().includes('date');
    if (isTimeMetric && !c.rightType) {
      if (c.comparison === 'is_null') return `${c.metric} IS NULL`;
      if (c.comparison === 'is_not_null') return `${c.metric} IS NOT NULL`;
      return `TIMESTAMPDIFF(HOUR, ${c.metric}, NOW()) ${compSymbol} ${c.threshold}`;
    }
    
    if (c.comparison === 'is_null') {
      return `${c.metric} IS NULL`;
    }
    if (c.comparison === 'is_not_null') {
      return `${c.metric} IS NOT NULL`;
    }

    let leftOperand = c.metric;
    if (c.leftMathOp && c.leftMathValue) {
      leftOperand = `(${c.metric} ${c.leftMathOp} ${c.leftMathValue})`;
    }

    let rightOperand = c.threshold;
    if (c.rightType === 'metric' && c.rightMetric) {
      rightOperand = c.rightMetric;
      if (c.rightMathOp && c.rightMathValue) {
        rightOperand = `(${c.rightMetric} ${c.rightMathOp} ${c.rightMathValue})`;
      }
    } else {
      const isValNumeric = !isNaN(Number(c.threshold)) && c.threshold !== '';
      rightOperand = isValNumeric ? c.threshold : `'${c.threshold}'`;
    }
    
    if (!isAgg) {
      return `${leftOperand} ${compSymbol} ${rightOperand}`;
    } else {
      let agg = 'SUM';
      if (['delay_rate', 'process_time', 'efficiency_score', 'transit_time', 'on_time_rate', 'satisfaction_score', 'delivery_time', 'weight_error_pct', 'current_temperature', 'current_humidity', 'std_duration_hub'].includes(c.metric)) {
        agg = 'AVG';
      }
      return `${agg}(${leftOperand}) ${compSymbol} ${rightOperand}`;
    }
  };

  // Sync default table when business line changes
  useEffect(() => {
    const tables = businessLineToTables[businessLine] || [];
    if (tables.length > 0) {
      setSelectedTable(tables[0]);
    }
  }, [businessLine]);

  // Generate AST and SQL on parameter changes
  useEffect(() => {
    const activeTable = selectedTable?.tableName || 'dm_ll.dwd_cl_shipment_package_out_warehouse_d';

    // Mode B Event-based Engine
    if (engineMode === 'B') {
      const bAst = {
        type: 'EventSequenceRule',
        ruleName,
        businessLine,
        dataSource: activeTable,
        preEvent,
        postEvent,
        timeWindowHours: parseFloat(timeWindow) || 2,
        trigger: 'NOT_OCCURRED',
        notification: {
          role: levelConfigs[1].notifyRole,
          channel: levelConfigs[1].notifyChannel,
          frequency: { type: levelConfigs[1].notifyFrequencyType, value: levelConfigs[1].notifyFrequencyValue }
        }
      };
      setAstJson(JSON.stringify(bAst, null, 2));
      setPseudoSql(
        `SELECT * FROM ${activeTable}\n` +
        `WHERE event_type = '${preEvent}'\n` +
        `  AND NOT EXISTS (\n` +
        `      SELECT 1 FROM ${activeTable} e2\n` +
        `      WHERE e2.order_id = ${activeTable}.order_id\n` +
        `        AND e2.event_type = '${postEvent}'\n` +
        `        AND e2.timestamp BETWEEN ${activeTable}.timestamp AND ${activeTable}.timestamp + INTERVAL '${timeWindow}' HOUR\n` +
        `  )`
      );
      return;
    }

    const astWrapper = {
      type: 'MetricAggregationRule',
      ruleName,
      businessLine,
      dataSource: activeTable,
      skipScope,
      scopeOperator,
      scopeFilters: skipScope ? [] : scopeFilters,
      computeOperator,
      computeConditions,
      aggregation: {
        levels: {
          level1: {
            enabled: true,
            threshold: levelConfigs[1].threshold,
            groupByDimensions: levelConfigs[1].groupByDimensions,
            notification: {
              role: levelConfigs[1].notifyRole,
              channel: levelConfigs[1].notifyChannel,
              phoneNumbers: levelConfigs[1].notifyPhoneNumbers,
              frequency: { type: levelConfigs[1].notifyFrequencyType, value: levelConfigs[1].notifyFrequencyValue }
            }
          },
          level2: {
            enabled: levelConfigs[2].enabled,
            threshold: levelConfigs[2].enabled ? levelConfigs[2].threshold : null,
            groupByDimensions: levelConfigs[2].enabled ? levelConfigs[2].groupByDimensions : null,
            notification: levelConfigs[2].enabled ? {
              role: levelConfigs[2].notifyRole,
              channel: levelConfigs[2].notifyChannel,
              phoneNumbers: levelConfigs[2].notifyPhoneNumbers,
              frequency: { type: levelConfigs[2].notifyFrequencyType, value: levelConfigs[2].notifyFrequencyValue }
            } : null
          },
          level3: {
            enabled: levelConfigs[3].enabled,
            threshold: levelConfigs[3].enabled ? levelConfigs[3].threshold : null,
            groupByDimensions: levelConfigs[3].enabled ? levelConfigs[3].groupByDimensions : null,
            notification: levelConfigs[3].enabled ? {
              role: levelConfigs[3].notifyRole,
              channel: levelConfigs[3].notifyChannel,
              phoneNumbers: levelConfigs[3].notifyPhoneNumbers,
              frequency: { type: levelConfigs[3].notifyFrequencyType, value: levelConfigs[3].notifyFrequencyValue }
            } : null
          }
        }
      }
    };
    setAstJson(JSON.stringify(astWrapper, null, 2));

    let sql = `SELECT * FROM ${activeTable}`;
    const whereClauses: string[] = [];

    if (!skipScope && scopeFilters.length > 0) {
      const filters = scopeFilters.map(f => {
        const compSymbol = getCompSymbol(f.comparison);
        if (f.comparison === 'is_null') return `${f.dimension} IS NULL`;
        if (f.comparison === 'is_not_null') return `${f.dimension} IS NOT NULL`;
        if (f.comparison === 'contains') return `${f.dimension} LIKE '%${f.value}%'`;
        const isNumeric = !isNaN(Number(f.value)) && f.value !== '';
        return `${f.dimension} ${compSymbol} ${isNumeric ? f.value : `'${f.value}'`}`;
      });
      whereClauses.push(`(${filters.join(` ${scopeOperator} `)})`);
    }

    const condSqls = computeConditions.map(c => compileCondition(c, false)).filter(Boolean);
    if (condSqls.length > 0) {
      whereClauses.push(`(${condSqls.join(` ${computeOperator} `)})`);
    }

    if (whereClauses.length > 0) {
      sql += `\nWHERE ${whereClauses.join(' AND ')}`;
    }

    setPseudoSql(sql);

  }, [
    engineMode, ruleName, businessLine, preEvent, postEvent, timeWindow,
    skipScope, scopeOperator, scopeFilters, computeOperator, computeConditions, 
    levelConfigs, selectedTable
  ]);

  const addScopeFilter = () => {
    const defaultDim = selectedTable?.fields.filter(f => f.role === 'Dimension' || f.role === 'Attribute')[0]?.name || 'warehouse_name';
    setScopeFilters(prev => [
      ...prev,
      { id: `sf-${Date.now()}`, dimension: defaultDim, comparison: 'eq', value: '' }
    ]);
  };

  const deleteScopeFilter = (id: string) => {
    setScopeFilters(prev => prev.filter(f => f.id !== id));
  };

  const editScopeFilter = (id: string, fields: Partial<ScopeFilter>) => {
    setScopeFilters(prev => prev.map(f => f.id === id ? { ...f, ...fields } : f));
  };

  const addComputeCondition = () => {
    const defaultMetric = selectedTable?.fields.filter(f => f.role === 'Metric')[0]?.name || 'order_count';
    setComputeConditions(prev => [
      ...prev,
      { id: `cc-${Date.now()}`, type: 'static', metric: defaultMetric, formula: '', period: '7', comparison: 'gt', threshold: '10' }
    ]);
  };

  const deleteComputeCondition = (id: string) => {
    setComputeConditions(prev => prev.filter(c => c.id !== id));
  };

  const editComputeCondition = (id: string, fields: Partial<ComputeCondition>) => {
    setComputeConditions(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c));
  };

  const handleAiParse = () => {
    if (!aiPrompt.trim()) return;
    setIsAiParsing(true);
    setAiSteps([
      { id: '1', text: '提取过滤维度与指标参数语义...', status: 'active' },
      { id: '2', text: '对齐 ClickHouse 数仓业务语义字典词表...', status: 'pending' },
      { id: '3', text: '正在转化生成树状 AST 并构建 Stream SQL 子句...', status: 'pending' }
    ]);

    setTimeout(() => {
      setAiSteps(prev => prev.map(s => s.id === '1' ? { ...s, status: 'done' } : s.id === '2' ? { ...s, status: 'active' } : s));
    }, 800);

    setTimeout(() => {
      setAiSteps(prev => prev.map(s => s.id === '2' ? { ...s, status: 'done' } : s.id === '3' ? { ...s, status: 'active' } : s));
    }, 1600);

    setTimeout(() => {
      setAiSteps(prev => prev.map(s => ({ ...s, status: 'done' })));
      setIsAiParsing(false);

      const promptLower = aiPrompt.toLowerCase();
      if (promptLower.includes('超时') || promptLower.includes('场景一') || promptLower.includes('receive_time')) {
        setSkipScope(false);
        setScopeOperator('AND');
        setScopeFilters([
          { id: 'sf-1', dimension: 'warehouse_name', comparison: 'contains', value: '上海' },
          { id: 'sf-2', dimension: 'process_type', comparison: 'eq', value: '0' }
        ]);
        setComputeConditions([
          { id: 'cc-1', type: 'static', metric: 'receive_time', formula: '', period: '7', comparison: 'is_null', threshold: '' },
          { id: 'cc-2', type: 'static', metric: 'latest_delivery_time', formula: '', period: '7', comparison: 'lte', threshold: '1' }
        ]);
        setRuleName('上海仓出库揽收即将超时预警');
        setBusinessLine('冷链仓配');
        setWarningLevel('RED');
      } else if (promptLower.includes('遗失') || promptLower.includes('场景二') || promptLower.includes('update_time')) {
        setSkipScope(false);
        setScopeOperator('AND');
        setScopeFilters([
          { id: 'sf-1', dimension: 'process_type', comparison: 'eq', value: '0' }
        ]);
        setComputeConditions([
          { id: 'cc-1', type: 'static', metric: 'shipped_time', formula: '', period: '7', comparison: 'is_not_null', threshold: '' },
          { id: 'cc-2', type: 'static', metric: 'sign_time', formula: '', period: '7', comparison: 'is_null', threshold: '' },
          { id: 'cc-3', type: 'static', metric: 'update_time', formula: '', period: '7', comparison: 'gte', threshold: '48' }
        ]);
        setRuleName('全部已发出快递疑似遗失预警');
        setBusinessLine('冷链仓配');
        setWarningLevel('ORANGE');
      } else {
        setSkipScope(false);
        setScopeOperator('AND');
        setScopeFilters([
          { id: 'sf-1', dimension: 'warehouse_name', comparison: 'contains', value: '上海' }
        ]);
        setComputeConditions([
          { id: 'cc-1', type: 'timeseries', metric: 'delay_rate', formula: '', period: '7', comparison: 'gt', threshold: '10' }
        ]);
        setLevelConfigs(prev => ({ ...prev, 1: { ...prev[1], threshold: 5, groupByDimensions: ['warehouse_name'] } }));
        setRuleName('上海分拨中心延误率均值超标预警');
        setBusinessLine('冷链仓配');
        setWarningLevel('YELLOW');
      }
    }, 2400);
  };

  const handleChipClick = (text: string) => {
    setAiPrompt(text);
  };

  return (
    <div className="h-full flex bg-[#f8f9fa] overflow-hidden text-gray-800">
      
      {/* Left config form container */}
      <div className={`border-r border-gray-200 bg-white flex flex-col h-full overflow-y-auto transition-all duration-300 ${
        showDebugger ? 'w-[60%]' : 'w-full'
      }`}>
        <div className="p-6 border-b border-gray-100 bg-[#fbfcfd]">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
            <span>AI 智能规则配置中心</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            输入业务自然语言，系统自动识别维度、生成 AST 树状关系和 Flink SQL 监控子句
          </p>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* AI natural language parser bar */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-800">
              <Brain className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
              <span>AI 自然语言智能规则解析</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="例如：如果上海嘉定仓的延误率大于过去7天均值的1.5倍触发预警..."
                className="flex-1 bg-white border border-indigo-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs font-semibold text-gray-800 placeholder-gray-400 outline-none shadow-inner"
              />
              <button
                type="button"
                onClick={handleAiParse}
                disabled={isAiParsing}
                className="inline-flex items-center gap-1.5 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>智能解析</span>
              </button>
            </div>

            {/* Quick recommendation prompts chips */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-500">
              <span>快捷选择示例:</span>
              <button
                type="button"
                onClick={() => handleChipClick('[场景一] 上海仓库揽收即将超时预警')}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded-lg transition-all cursor-pointer font-bold"
              >
                时效超时预警
              </button>
              <button
                type="button"
                onClick={() => handleChipClick('[场景二] 运输途中快递疑似遗失预警')}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 rounded-lg transition-all cursor-pointer font-bold"
              >
                疑似遗失预警
              </button>
            </div>

            {/* Simulated loader and steps */}
            {isAiParsing && (
              <div className="p-4 bg-white border border-indigo-100 rounded-xl space-y-3 shadow-sm animate-pulse">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>AI 预警控制塔 Flink Engine 正在构建规则...</span>
                </div>
                <div className="space-y-2 pl-6">
                  {aiSteps.map((step) => (
                    <div key={step.id} className="flex items-center gap-2 text-xs font-semibold">
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        step.status === 'done' ? 'bg-green-500' :
                        step.status === 'active' ? 'bg-indigo-600 animate-ping' :
                        'bg-gray-300'
                      }`} />
                      <span className={
                        step.status === 'done' ? 'text-gray-500 line-through' :
                        step.status === 'active' ? 'text-indigo-600 font-extrabold' :
                        'text-gray-400'
                      }>
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Block 1: Basic definitions */}
          <RuleBasicInfo 
            ruleName={ruleName} 
            setRuleName={setRuleName}
            businessLine={businessLine} 
            setBusinessLine={setBusinessLine}
            warningLevel={warningLevel} 
            setWarningLevel={setWarningLevel}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />

          {/* Block 2: Dual trigger engine */}
          <TriggerEngine 
            engineMode={engineMode}
            setEngineMode={setEngineMode}
            preEvent={preEvent}
            setPreEvent={setPreEvent}
            postEvent={postEvent}
            setPostEvent={setPostEvent}
            timeWindow={timeWindow}
            setTimeWindow={setTimeWindow}
            skipScope={skipScope}
            setSkipScope={setSkipScope}
            scopeOperator={scopeOperator}
            setScopeOperator={setScopeOperator}
            scopeFilters={scopeFilters}
            addScopeFilter={addScopeFilter}
            deleteScopeFilter={deleteScopeFilter}
            editScopeFilter={editScopeFilter}
            computeOperator={computeOperator}
            setComputeOperator={setComputeOperator}
            computeConditions={computeConditions}
            addComputeCondition={addComputeCondition}
            deleteComputeCondition={deleteComputeCondition}
            editComputeCondition={editComputeCondition}
            showDebugger={showDebugger}
            setShowDebugger={setShowDebugger}
            selectedTable={selectedTable}
          />

          {/* Block 2.5: Aggregation & Distribution Strategy */}
          <EscalationMatrix 
            levelConfigs={levelConfigs}
            setLevelConfigs={setLevelConfigs}
            selectedTable={selectedTable}
          />

          {/* Block 3: Lifecycle controls */}
          <RuleLifecycle 
            onBacktestSuccess={() => setShowSubmit(true)} 
            showSubmit={showSubmit} 
            computeConditions={computeConditions}
            selectedTable={selectedTable}
          />
        </div>
      </div>

      {/* Right AST and SQL preview panel */}
      <div className={`bg-gray-950 flex flex-col h-full transition-all duration-300 ${
        showDebugger ? 'w-[40%] border-l border-gray-900' : 'w-0 overflow-hidden opacity-0 invisible'
      }`}>
        <div className="p-4 border-b border-gray-900 bg-gray-950 flex items-center justify-between">
          <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <Code className="h-4 w-4 text-indigo-400" />
            <span>实时 Flink 引擎执行底座 AST / SQL 调试器</span>
          </span>
        </div>

        <div className="flex-1 flex flex-col min-h-0 divide-y divide-gray-900 overflow-hidden">
          {/* JSON AST Preview */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-2.5 bg-gray-900/60 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 border-b border-gray-900">
              <Terminal className="h-3 w-3" />
              <span>Abstract Syntax Tree (AST Json)</span>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-indigo-300 font-mono text-[11px] leading-relaxed bg-[#05070f] select-text">
              {astJson}
            </pre>
          </div>

          {/* SQL Preview */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-4 py-2.5 bg-gray-900/60 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 border-b border-gray-900">
              <Terminal className="h-3 w-3" />
              <span>Generated Stream SQL Clause</span>
            </div>
            <pre className="flex-1 overflow-auto p-4 text-emerald-400 font-mono text-[11px] leading-relaxed bg-[#05070f] select-text whitespace-pre-wrap">
              {pseudoSql}
            </pre>
          </div>
        </div>
      </div>

    </div>
  );
}
