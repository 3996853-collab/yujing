'use client';

import React, { useState } from 'react';
import { useRuleStore, AuditRecord } from '../../store/ruleStore';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';
import { Search, Sparkles, Filter, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Conversion Funnel Data
const funnelData = [
  { name: '总触发量 (Total)', value: 1000, rate: '100%', fill: '#6366f1' },
  { name: 'T0 初次核销 (T0 Check)', value: 680, rate: '68.0%', fill: '#10b981' },
  { name: 'T+2 省区升级 (T+2 Escalated)', value: 142, rate: '14.2%', fill: '#f97316' },
  { name: 'T+6 总部告警 (T+6 HQ Alert)', value: 32, rate: '3.2%', fill: '#ef4444' }
];

export default function SmartAuditDashboard() {
  const auditRecords = useRuleStore((state) => state.filteredAuditRecords);
  const searchAuditEvents = useRuleStore((state) => state.searchAuditEvents);
  const auditQuery = useRuleStore((state) => state.auditQuery);
  const setAuditQuery = useRuleStore((state) => state.setAuditQuery);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsQuerying(true);
    setTimeout(() => {
      searchAuditEvents(auditQuery);
      setIsQuerying(false);
    }, 800);
  };

  const handleQuickQuery = (queryText: string) => {
    setAuditQuery(queryText);
    setIsQuerying(true);
    setTimeout(() => {
      searchAuditEvents(queryText);
      setIsQuerying(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg p-6 text-gray-200 overflow-y-auto">
      {/* Top Header */}
      <div className="mb-6 pb-5 border-b border-gray-900 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <span>🛡️ 预警推送流转与协同审计看板</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            监控供应链异常的自动核销链条、接收人触达时间、通道分发效率与阶梯升级审计
          </p>
        </div>
        <div className="text-[10px] text-gray-500 bg-gray-950 px-2.5 py-1 border border-gray-900 rounded font-mono">
          ClickHouse Data Feed: Connected
        </div>
      </div>

      {/* Grid: NLP query box on Left, Recharts Funnel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        
        {/* NLP query panel */}
        <div className="lg:col-span-2 bg-gray-950/60 border border-gray-900 p-4 rounded-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>大模型智能预警数据查询 (NLP Agent Query)</span>
            </div>
            
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={auditQuery}
                onChange={(e) => setAuditQuery(e.target.value)}
                placeholder="支持语义查询，如：'查询昨日已核销的预警' 或 '称重高危'"
                className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-gray-900 border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-indigo-500 transition-all placeholder-gray-500"
              />
              <button 
                type="submit"
                disabled={isQuerying}
                className="absolute right-1.5 top-1.5 h-7 w-7 rounded bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all disabled:opacity-50"
              >
                {isQuerying ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              </button>
            </form>

            {/* Quick Queries tags */}
            <div className="space-y-1.5 pt-2">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">常用智能查询：</div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleQuickQuery('查询昨日触发超时升级的预警')}
                  className="text-[10px] bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-400 hover:text-gray-200 px-2 py-0.8 rounded transition-all"
                >
                  "昨日触发超时"
                </button>
                <button
                  onClick={() => handleQuickQuery('查询今日已核销的设备称重预警')}
                  className="text-[10px] bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-400 hover:text-gray-200 px-2 py-0.8 rounded transition-all"
                >
                  "今日已核销称重"
                </button>
                <button
                  onClick={() => handleQuickQuery('仅查看未核销活跃卡片')}
                  className="text-[10px] bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-400 hover:text-gray-200 px-2 py-0.8 rounded transition-all"
                >
                  "未闭环活跃警报"
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-900/60 pt-3 mt-4 text-[10px] text-gray-500 leading-relaxed">
            💡 NLP 意图解析器支持时间、表字段语义（如设备误差、时效耗时）与核销动作指标的多维关联。
          </div>
        </div>

        {/* Funnel chart panel */}
        <div className="lg:col-span-3 bg-gray-950/60 border border-gray-900 p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-300">📊 预警层级流转与自动核销漏斗图</span>
            <span className="text-[10px] text-gray-500">数据区间: 近 7 天</span>
          </div>

          <div className="w-full h-36">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={funnelData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <XAxis type="number" stroke="#4b5563" fontSize={9} hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#9ca3af" 
                  fontSize={9} 
                  tickLine={false}
                  axisLine={false} 
                />
                <Tooltip
                  contentStyle={{ 
                    background: '#090d16', 
                    border: '1px solid #1f2937', 
                    borderRadius: '6px',
                    fontSize: '10px'
                  }}
                />
                <Bar dataKey="value" barSize={14} radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend Conversion Rates */}
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-1.5 border-t border-gray-900">
            {funnelData.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="font-semibold" style={{ color: item.fill }}>{item.rate}</div>
                <div className="text-gray-500 text-[8px] truncate">{item.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Detail Table */}
      <div className="bg-gray-950/60 border border-gray-900 rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="px-4 py-3 bg-gray-900/60 border-b border-gray-900 flex justify-between items-center text-xs">
          <span className="font-bold text-gray-300">📋 推送触达审计明细表 (Alert Routing Audit Logs)</span>
          <span className="text-[10px] text-gray-500">共筛选出 {auditRecords.length} 项审计记录</span>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-950 text-gray-400 font-bold border-b border-gray-900">
                <th className="p-3">预警ID</th>
                <th className="p-3">规则名称</th>
                <th className="p-3">受控实体</th>
                <th className="p-3">当前流转状态</th>
                <th className="p-3">触达人 UID</th>
                <th className="p-3">推送渠道</th>
                <th className="p-3">是否达成隐性核销</th>
                <th className="p-3">生成触发时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-900 text-gray-300">
              <AnimatePresence mode="popLayout">
                {auditRecords.length > 0 ? (
                  auditRecords.map((record) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={record.id}
                      className="hover:bg-gray-900/30 transition-all font-mono"
                    >
                      <td className="p-3 font-semibold text-gray-400">{record.id}</td>
                      <td className="p-3 font-sans text-gray-200">{record.ruleName}</td>
                      <td className="p-3 text-indigo-400">{record.waybillOrDevice}</td>
                      <td className="p-3">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          record.status === '已核销'
                            ? 'bg-neon-emerald/10 text-neon-emerald'
                            : record.status === 'T+6.总部警告'
                              ? 'bg-neon-red/10 text-neon-red animate-pulse'
                              : record.status === 'T+2.省区升级'
                                ? 'bg-neon-orange/10 text-neon-orange'
                                : 'bg-neon-blue/10 text-neon-blue'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="p-3 text-gray-400">{record.receiverUid}</td>
                      <td className="p-3 text-gray-400">{record.channel}</td>
                      <td className="p-3">
                        {record.isResolved ? (
                          <span className="text-neon-emerald font-bold flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>是 (Implicit)</span>
                          </span>
                        ) : (
                          <span className="text-neon-red font-bold flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>否 (Ticking)</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-gray-500 text-[10px]">{record.triggerTime}</td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-600 italic">
                      🔍 未找到匹配该语义的审计流转记录
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
