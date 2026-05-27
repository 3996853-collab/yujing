'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Play, 
  CheckCircle2, 
  Settings, 
  Database, 
  AlertTriangle, 
  Sliders, 
  Terminal,
  Activity,
  ArrowRight,
  ShieldCheck,
  Send,
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for Builder V2
interface ScopeFilter {
  id: string;
  field: 'warehouse_name' | 'status' | 'process_type' | 'send_province' | 'carrier_name';
  operator: 'LIKE' | '=' | '!=' | '>' | '<';
  value: string;
}

interface RuleCondition {
  id: string;
  type: 'simple' | 'time_diff';
  field1: 'receive_time' | 'shipped_time' | 'sign_time' | 'update_time' | 'current_time';
  field2?: 'latest_delivery_time' | 'shipped_time' | 'update_time' | 'receive_time';
  operator: 'IS NULL' | 'IS NOT NULL' | '<=' | '>=' | '=' | '>';
  value?: number;
  unit?: '小时' | '分钟' | '天';
}

export default function RuleBuilderV2() {
  const [ruleName, setRuleName] = useState('上海仓出库揽收即将超时预警 V2');
  const [warningLevel, setWarningLevel] = useState<'RED' | 'ORANGE' | 'YELLOW'>('ORANGE');
  const [actionChannel, setActionChannel] = useState<'站长工作台' | '钉钉群机器人' | '企业微信' | 'SMS'>('站长工作台');

  // Block 1 Scope Filters (Pre-filled for Scenario 1 Timeout)
  const [scopeFilters, setScopeFilters] = useState<ScopeFilter[]>([
    { id: 'scope-1', field: 'warehouse_name', operator: 'LIKE', value: '上海' },
    { id: 'scope-2', field: 'status', operator: '=', value: '900' },
    { id: 'scope-3', field: 'process_type', operator: '=', value: '0' }
  ]);

  // Block 2 Rule Conditions (Pre-filled for Scenario 1 Timeout)
  const [ruleConditions, setRuleConditions] = useState<RuleCondition[]>([
    { id: 'rule-1', type: 'simple', field1: 'receive_time', operator: 'IS NULL' },
    { id: 'rule-2', type: 'time_diff', field1: 'current_time', field2: 'latest_delivery_time', operator: '<=', value: 1, unit: '小时' }
  ]);

  // Backtest Simulation States
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [showTestResults, setShowTestResults] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  // Generated SQL state
  const [pseudoSql, setPseudoSql] = useState('');
  const [astJson, setAstJson] = useState('');

  // Re-generate SQL & AST when variables change
  useEffect(() => {
    // Generate Where Clause
    const whereParts = scopeFilters.map(f => {
      const op = f.operator;
      const val = f.operator === 'LIKE' ? `'%${f.value}%'` : (isNaN(Number(f.value)) ? `'${f.value}'` : f.value);
      return `${f.field} ${op} ${val}`;
    });

    // Generate Rules Clause
    const ruleParts = ruleConditions.map(c => {
      if (c.type === 'simple') {
        return `${c.field1} ${c.operator}`;
      } else {
        const intervalUnit = c.unit === '小时' ? 'HOUR' : c.unit === '分钟' ? 'MINUTE' : 'DAY';
        return `TIMESTAMPDIFF(${intervalUnit}, ${c.field2}, ${c.field1 === 'current_time' ? 'NOW()' : c.field1}) ${c.operator} ${c.value}`;
      }
    });

    const fullWhere = [...whereParts, ...ruleParts].join('\n  AND ');

    const sql = `SELECT \n  id AS "预警单号",\n  warehouse_name,\n  latest_delivery_time AS "应揽收时间"\nFROM dm_ll.dwd_cl_shipment_package_out_warehouse_d\nWHERE \n  ${fullWhere};`;
    setPseudoSql(sql);

    // Generate AST
    const ast = {
      ruleName,
      table: 'dm_ll.dwd_cl_shipment_package_out_warehouse_d',
      triggerType: 'ROW_LEVEL_DWD',
      scoping: scopeFilters.map(f => ({ field: f.field, operator: f.operator, value: f.value })),
      conditions: ruleConditions.map(c => ({
        type: c.type,
        leftField: c.field1,
        rightField: c.field2,
        operator: c.operator,
        value: c.value,
        unit: c.unit
      })),
      action: {
        alertLevel: warningLevel,
        channel: actionChannel
      }
    };
    setAstJson(JSON.stringify(ast, null, 2));

  }, [scopeFilters, ruleConditions, ruleName, warningLevel, actionChannel]);

  // Action Handlers
  const handleAddScopeFilter = () => {
    const newItem: ScopeFilter = {
      id: `scope-${Date.now()}`,
      field: 'warehouse_name',
      operator: '=',
      value: ''
    };
    setScopeFilters([...scopeFilters, newItem]);
  };

  const handleRemoveScopeFilter = (id: string) => {
    setScopeFilters(scopeFilters.filter(f => f.id !== id));
  };

  const handleUpdateScopeFilter = (id: string, updates: Partial<ScopeFilter>) => {
    setScopeFilters(scopeFilters.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleAddRuleCondition = () => {
    const newItem: RuleCondition = {
      id: `rule-${Date.now()}`,
      type: 'simple',
      field1: 'receive_time',
      operator: 'IS NULL'
    };
    setRuleConditions([...ruleConditions, newItem]);
  };

  const handleRemoveRuleCondition = (id: string) => {
    setRuleConditions(ruleConditions.filter(r => r.id !== id));
  };

  const handleUpdateRuleCondition = (id: string, updates: Partial<RuleCondition>) => {
    setRuleConditions(ruleConditions.map(r => {
      if (r.id === id) {
        const merged = { ...r, ...updates };
        if (updates.type === 'time_diff' && !merged.field2) {
          merged.field2 = 'latest_delivery_time';
          merged.operator = '<=';
          merged.value = 1;
          merged.unit = '小时';
        } else if (updates.type === 'simple') {
          delete merged.field2;
          delete merged.value;
          delete merged.unit;
          merged.operator = 'IS NULL';
        }
        return merged;
      }
      return r;
    }));
  };

  const handleRunBacktest = () => {
    setIsTesting(true);
    setTestProgress(0);
    setShowTestResults(false);

    const interval = setInterval(() => {
      setTestProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTesting(false);
          setShowTestResults(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleDeploy = () => {
    setIsDeployed(true);
    setTimeout(() => {
      setIsDeployed(false);
    }, 2500);
  };

  // Quick setup Scenario 2
  const loadScenario2 = () => {
    setRuleName('全部已发出快递疑似遗失预警 V2');
    setWarningLevel('ORANGE');
    setActionChannel('站长工作台');
    setScopeFilters([
      { id: 'scope-a1', field: 'process_type', operator: '=', value: '0' }
    ]);
    setRuleConditions([
      { id: 'rule-b1', type: 'simple', field1: 'shipped_time', operator: 'IS NOT NULL' },
      { id: 'rule-b2', type: 'simple', field1: 'sign_time', operator: 'IS NULL' },
      { id: 'rule-b3', type: 'time_diff', field1: 'current_time', field2: 'update_time', operator: '>=', value: 48, unit: '小时' }
    ]);
  };

  const loadScenario1 = () => {
    setRuleName('上海仓出库揽收即将超时预警 V2');
    setWarningLevel('ORANGE');
    setActionChannel('站长工作台');
    setScopeFilters([
      { id: 'scope-1', field: 'warehouse_name', operator: 'LIKE', value: '上海' },
      { id: 'scope-2', field: 'status', operator: '=', value: '900' },
      { id: 'scope-3', field: 'process_type', operator: '=', value: '0' }
    ]);
    setRuleConditions([
      { id: 'rule-1', type: 'simple', field1: 'receive_time', operator: 'IS NULL' },
      { id: 'rule-2', type: 'time_diff', field1: 'current_time', field2: 'latest_delivery_time', operator: '<=', value: 1, unit: '小时' }
    ]);
  };

  return (
    <div className="h-full flex bg-[#f8f9fa] overflow-hidden text-gray-800 font-sans">
      
      {/* LEFT FORM PANEL (60% width) */}
      <div className="w-[60%] border-r border-gray-200 bg-white flex flex-col h-full overflow-y-auto">
        
        {/* Header Branding */}
        <div className="p-6 border-b border-gray-150 bg-[#fafbfc] flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Sliders className="h-5.5 w-5.5 text-indigo-600" />
              <span>智能数据底座：规则配置器 V2 (Material Design 3)</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">支持以零代码连线方式圈定数仓宽表数据并组装物理拦截规则</p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={loadScenario1} 
              className="px-2.5 py-1.5 border border-indigo-200 hover:border-indigo-300 text-indigo-600 rounded-xl text-[10px] font-extrabold bg-indigo-50/50 hover:bg-indigo-50 transition-all flex items-center gap-1 shadow-sm"
            >
              <Sparkles className="h-3 w-3" />
              加载场景一 (揽收超时)
            </button>
            <button 
              onClick={loadScenario2} 
              className="px-2.5 py-1.5 border border-amber-200 hover:border-amber-300 text-amber-600 rounded-xl text-[10px] font-extrabold bg-amber-50/50 hover:bg-amber-50 transition-all flex items-center gap-1 shadow-sm"
            >
              <Sparkles className="h-3 w-3" />
              加载场景二 (疑似遗失)
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Rule Metadata input */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-3xl space-y-3">
            <label className="text-[11px] font-black text-gray-500 uppercase tracking-wider block">规则名称 (Rule Name)</label>
            <input 
              type="text" 
              value={ruleName} 
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-indigo-500 transition-colors shadow-inner"
            />
          </div>

          {/* BLOCK 1: SCOPE FILTERS (Neutral / Blue) */}
          <div className="bg-[#f0f4f9] border border-blue-100/80 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200/50">
              <h3 className="text-xs font-extrabold text-blue-900 tracking-wider flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">1</span>
                <span>第一步：圈定预警数据范围 (WHERE)</span>
              </h3>
              <span className="text-[10px] text-blue-600 font-bold bg-blue-100/50 px-2 py-0.5 rounded-full uppercase">数据过滤层</span>
            </div>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {scopeFilters.map((filter, index) => (
                  <motion.div 
                    key={filter.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {index > 0 && (
                      <div className="flex items-center gap-2 pl-3">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-[9px] font-black tracking-widest text-blue-600 bg-blue-100 rounded-md border border-blue-200">
                          并且 (AND)
                        </span>
                        <div className="flex-1 h-[1px] bg-blue-200/40" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-blue-100/60 shadow-sm">
                      <select
                        value={filter.field}
                        onChange={(e) => handleUpdateScopeFilter(filter.id, { field: e.target.value as any })}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-800 outline-none w-36 focus:border-blue-500 cursor-pointer"
                      >
                        <option value="warehouse_name">仓库名称 (warehouse_name)</option>
                        <option value="status">包裹状态 (status)</option>
                        <option value="process_type">处理类型 (process_type)</option>
                        <option value="send_province">始发省区 (send_province)</option>
                        <option value="carrier_name">承运商 (carrier_name)</option>
                      </select>

                      <select
                        value={filter.operator}
                        onChange={(e) => handleUpdateScopeFilter(filter.id, { operator: e.target.value as any })}
                        className="bg-gray-55 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-700 outline-none w-24 focus:border-blue-500 cursor-pointer"
                      >
                        <option value="=">等于 (=)</option>
                        <option value="LIKE">包含 (LIKE)</option>
                        <option value="!=">不等于 (!=)</option>
                        <option value=">">大于 (&gt;)</option>
                        <option value="<">小于 (&lt;)</option>
                      </select>

                      <input
                        type="text"
                        value={filter.value}
                        onChange={(e) => handleUpdateScopeFilter(filter.id, { value: e.target.value })}
                        placeholder="值，如: 上海"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 outline-none focus:border-blue-500"
                      />

                      <button
                        onClick={() => handleRemoveScopeFilter(filter.id)}
                        disabled={scopeFilters.length <= 1}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              onClick={handleAddScopeFilter}
              className="inline-flex items-center gap-1 px-4 py-2 border-2 border-dashed border-blue-300 hover:border-blue-400 text-blue-600 hover:bg-blue-50/50 rounded-2xl text-xs font-extrabold transition-all bg-transparent cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>添加筛选条件</span>
            </button>
          </div>

          {/* BLOCK 2: RULE CONDITIONS (Warning / Orange) */}
          <div className="bg-[#fef4eb] border border-orange-100/80 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-orange-200/50">
              <h3 className="text-xs font-extrabold text-orange-950 tracking-wider flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-[10px] font-bold">2</span>
                <span>第二步：设定异常触发规则 (判断条件)</span>
              </h3>
              <span className="text-[10px] text-orange-700 font-bold bg-orange-100/50 px-2 py-0.5 rounded-full uppercase">时限/质量规则</span>
            </div>

            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {ruleConditions.map((condition, index) => (
                  <motion.div
                    key={condition.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {index > 0 && (
                      <div className="flex items-center gap-2 pl-3">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-[9px] font-black tracking-widest text-orange-600 bg-orange-100 rounded-md border border-orange-200">
                          并且 (AND)
                        </span>
                        <div className="flex-1 h-[1px] bg-orange-200/40" />
                      </div>
                    )}

                    <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-orange-100/60 shadow-sm flex-wrap md:flex-nowrap">
                      
                      {/* Condition type selector */}
                      <select
                        value={condition.type}
                        onChange={(e) => handleUpdateRuleCondition(condition.id, { type: e.target.value as any })}
                        className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-800 outline-none w-28 cursor-pointer"
                      >
                        <option value="simple">直接数值</option>
                        <option value="time_diff">时间差值</option>
                      </select>

                      {condition.type === 'simple' ? (
                        <>
                          <select
                            value={condition.field1}
                            onChange={(e) => handleUpdateRuleCondition(condition.id, { field1: e.target.value as any })}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-800 outline-none w-44 focus:border-orange-500 cursor-pointer"
                          >
                            <option value="receive_time">实际揽收时间 (receive_time)</option>
                            <option value="shipped_time">发运时间 (shipped_time)</option>
                            <option value="sign_time">签收时间 (sign_time)</option>
                            <option value="update_time">最新轨迹时间 (update_time)</option>
                          </select>

                          <select
                            value={condition.operator}
                            onChange={(e) => handleUpdateRuleCondition(condition.id, { operator: e.target.value as any })}
                            className="bg-gray-55 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-700 outline-none w-32 focus:border-orange-500 cursor-pointer"
                          >
                            <option value="IS NULL">为空 (IS NULL)</option>
                            <option value="IS NOT NULL">不为空 (IS NOT NULL)</option>
                            <option value="=">等于 (=)</option>
                          </select>
                        </>
                      ) : (
                        <>
                          {/* Time Diff logic */}
                          <select
                            value={condition.field1}
                            onChange={(e) => handleUpdateRuleCondition(condition.id, { field1: e.target.value as any })}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-800 outline-none w-32 focus:border-orange-500 cursor-pointer"
                          >
                            <option value="current_time">当前系统时间</option>
                            <option value="update_time">最新轨迹时间</option>
                          </select>

                          <span className="text-gray-500 text-xs font-bold font-sans">减去</span>

                          <select
                            value={condition.field2}
                            onChange={(e) => handleUpdateRuleCondition(condition.id, { field2: e.target.value as any })}
                            className="bg-gray-55 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-800 outline-none w-32 focus:border-orange-500 cursor-pointer"
                          >
                            <option value="latest_delivery_time">应揽收时间 (latest_delivery_time)</option>
                            <option value="shipped_time">发运时间 (shipped_time)</option>
                            <option value="update_time">最新轨迹时间 (update_time)</option>
                          </select>

                          <select
                            value={condition.operator}
                            onChange={(e) => handleUpdateRuleCondition(condition.id, { operator: e.target.value as any })}
                            className="bg-gray-55 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-700 outline-none w-28 focus:border-orange-500 cursor-pointer"
                          >
                            <option value="<=">小于等于 (&lt;=)</option>
                            <option value=">=">大于等于 (&gt;=)</option>
                            <option value=">">大于 (&gt;)</option>
                          </select>

                          <input
                            type="number"
                            value={condition.value || ''}
                            onChange={(e) => handleUpdateRuleCondition(condition.id, { value: parseInt(e.target.value) || 0 })}
                            placeholder="如: 1"
                            className="w-14 bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-extrabold text-indigo-600 text-center outline-none focus:border-orange-500"
                          />

                          <select
                            value={condition.unit}
                            onChange={(e) => handleUpdateRuleCondition(condition.id, { unit: e.target.value as any })}
                            className="bg-gray-55 border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-gray-700 outline-none w-20 cursor-pointer"
                          >
                            <option value="小时">小时</option>
                            <option value="分钟">分钟</option>
                            <option value="天">天</option>
                          </select>
                        </>
                      )}

                      <button
                        onClick={() => handleRemoveRuleCondition(condition.id)}
                        disabled={ruleConditions.length <= 1}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button
              onClick={handleAddRuleCondition}
              className="inline-flex items-center gap-1 px-4 py-2 border-2 border-dashed border-orange-300 hover:border-orange-400 text-orange-700 hover:bg-orange-50/50 rounded-2xl text-xs font-extrabold transition-all bg-transparent cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>添加判断规则</span>
            </button>
          </div>

          {/* BLOCK 3: ACTION CONFIGURATION (Warning / Orange) */}
          <div className="bg-[#fff9f5] border border-orange-100/50 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="pb-2 border-b border-orange-100">
              <h3 className="text-xs font-extrabold text-orange-950 tracking-wider flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-white text-[10px] font-bold">3</span>
                <span>THEN (第三步：触发预警动作)</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-extrabold block">预警级别 (Alert Level)</label>
                <select
                  value={warningLevel}
                  onChange={(e) => setWarningLevel(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="RED">🔴 红色 (SLA违约)</option>
                  <option value="ORANGE">🟠 橙色 (即将超时)</option>
                  <option value="YELLOW">🟡 黄色 (异常波动)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 font-extrabold block">触达渠道 (Channel)</label>
                <select
                  value={actionChannel}
                  onChange={(e) => setActionChannel(e.target.value as any)}
                  className="w-full bg-white border border-gray-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="站长工作台">🖥️ 站长工作台</option>
                  <option value="钉钉群机器人">💬 钉钉群机器人</option>
                  <option value="企业微信">💬 企业微信</option>
                  <option value="SMS">📞 短信推送</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ACTION BAR (Pinned Bottom) */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center gap-4 flex-shrink-0">
          <div className="text-[10px] text-gray-500 font-medium">
            数仓源表: <strong className="font-mono">dwd_cl_shipment_package_out_warehouse_d</strong>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleRunBacktest}
              disabled={isTesting}
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-2xl text-xs font-extrabold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>回测跑批中 ({testProgress}%)</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>运行离线回测 (Run Backtest)</span>
                </>
              )}
            </button>

            <button
              onClick={handleDeploy}
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-extrabold shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              <Send className="h-4 w-4" />
              <span>编译并部署</span>
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT PREVIEW & DEBUGGING SIDEBAR (40% width) */}
      <div className="w-[40%] bg-gray-950 flex flex-col h-full overflow-hidden text-gray-300">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-900 bg-gray-950 flex items-center justify-between flex-shrink-0">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Terminal className="h-4 w-4 text-indigo-400" />
            <span>底座引擎翻译与回测 (Real-time SQL / AST)</span>
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Display SQL, AST, and Backtest results */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-900 bg-[#05070f]">
          
          {/* Dynamic SQL View */}
          <div className="p-4 space-y-2.5">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 border-b border-gray-900 pb-1.5">
              <span>SQL Code Block</span>
            </div>
            <pre className="overflow-x-auto p-4 text-emerald-400 font-mono text-[11px] leading-relaxed bg-black/60 rounded-2xl border border-gray-900 select-text whitespace-pre-wrap">
              {pseudoSql}
            </pre>
          </div>

          {/* Dynamic AST View */}
          <div className="p-4 space-y-2.5">
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1 border-b border-gray-900 pb-1.5">
              <span>Abstract Syntax Tree (AST JSON)</span>
            </div>
            <pre className="overflow-x-auto p-4 text-indigo-300 font-mono text-[11px] leading-relaxed bg-black/60 rounded-2xl border border-gray-900 select-text">
              {astJson}
            </pre>
          </div>

          {/* Backtest & Deploy Results Visual Panel */}
          <div className="p-4 space-y-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 border-b border-gray-900 pb-1.5">
              <span>回测诊断指标 (Backtest Diagnostic)</span>
            </div>

            {isTesting && (
              <div className="space-y-2 bg-gray-900/40 p-4 border border-gray-850 rounded-2xl animate-pulse">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">正在处理数仓近7天历史快照...</span>
                  <span className="font-extrabold text-indigo-400 font-mono">{testProgress}%</span>
                </div>
                <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-150" style={{ width: `${testProgress}%` }} />
                </div>
              </div>
            )}

            {showTestResults && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 bg-gray-900/60 p-4 border border-[#10b981]/25 rounded-2xl text-xs"
              >
                <div className="flex items-center gap-2 text-[#10b981] font-bold">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>历史回测演练完成</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-black/40 p-2.5 rounded-xl border border-gray-850">
                    <span className="block text-[9px] text-gray-500 font-semibold">历史命中数</span>
                    <span className="text-sm font-black text-gray-200 font-mono">142 票 / 周</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-xl border border-gray-850">
                    <span className="block text-[9px] text-gray-500 font-semibold">触发警报风暴概率</span>
                    <span className="text-sm font-black text-[#10b981] font-mono">极低 (2.4%)</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-xl border border-gray-850">
                    <span className="block text-[9px] text-gray-500 font-semibold">SLA时效违约预减缓</span>
                    <span className="text-sm font-black text-indigo-400 font-mono">15.8%</span>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-xl border border-gray-850">
                    <span className="block text-[9px] text-gray-500 font-semibold">推荐降噪周期</span>
                    <span className="text-sm font-black text-gray-300 font-mono">5分钟</span>
                  </div>
                </div>

                <div className="p-3 bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl text-[11px] text-emerald-300 leading-relaxed">
                  💡 评估结果表明，当前设定的过滤条件与规则指标合理，不会引发客服或站长端的告警轰炸，符合灰度发布上线标准。
                </div>
              </motion.div>
            )}

            {!isTesting && !showTestResults && (
              <div className="text-center py-8 text-gray-600 text-xs border border-dashed border-gray-850 rounded-2xl">
                ⏳ 请点击左侧下方的“运行离线回测”按钮生成诊断报告
              </div>
            )}
          </div>

        </div>

        {/* Global Toast Notify */}
        <AnimatePresence>
          {isDeployed && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-6 right-6 z-50 bg-gray-900 border border-gray-800 text-white text-xs px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5"
            >
              <ShieldCheck className="h-5 w-5 text-green-400 animate-bounce" />
              <div>
                <span className="font-bold block text-green-400">部署上线成功！</span>
                <span className="text-[10px] text-gray-400">底座 Flink CEP 引擎规则已动态注入。</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
