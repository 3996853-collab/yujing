import React, { useState } from 'react';
import { useRuleStore } from '../../store/ruleStore';
import { Search, Filter, Edit, Plus, Box, LayoutGrid, Database, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// Mock data for configured rules that match the query requirements
const mockConfiguredRules = [
  {
    id: 'rule-001',
    name: '上海嘉定仓超时揽收拦截',
    businessLine: '快递业务',
    table: 'WMS_SHIPMENT_PICKUP',
    warehouse: '上海嘉定仓',
    cargoOwner: '李宁体育',
    status: 'active',
    updatedAt: '2026-05-20 14:30:00'
  },
  {
    id: 'rule-002',
    name: '生鲜冷链温度异常告警',
    businessLine: '冷链业务',
    table: 'TMS_REFRIGERATION_RESET',
    warehouse: '全国通用',
    cargoOwner: '盒马鲜生',
    status: 'active',
    updatedAt: '2026-05-21 09:15:00'
  },
  {
    id: 'rule-003',
    name: '高价值保价件防丢校验',
    businessLine: '快运业务',
    table: 'TMS_TRACK_UPDATE',
    warehouse: '杭州转运中心',
    cargoOwner: '苹果中国',
    status: 'inactive',
    updatedAt: '2026-05-22 16:45:00'
  },
  {
    id: 'rule-004',
    name: '双十一特惠件发车阻断',
    businessLine: '快递业务',
    table: 'WMS_GATEWAY_OUTBOUND_SPEEDUP',
    warehouse: '广州花都仓',
    cargoOwner: '通用货主',
    status: 'active',
    updatedAt: '2026-05-25 11:20:00'
  }
];

export default function RuleQueryPage() {
  const [query, setQuery] = useState({
    businessLine: '',
    table: '',
    warehouse: '',
    cargoOwner: ''
  });

  const [filteredRules, setFilteredRules] = useState(mockConfiguredRules);

  const handleSearch = () => {
    const result = mockConfiguredRules.filter(rule => {
      return (
        (query.businessLine === '' || rule.businessLine.includes(query.businessLine)) &&
        (query.table === '' || rule.table.toLowerCase().includes(query.table.toLowerCase())) &&
        (query.warehouse === '' || rule.warehouse.includes(query.warehouse)) &&
        (query.cargoOwner === '' || rule.cargoOwner.includes(query.cargoOwner))
      );
    });
    setFilteredRules(result);
  };

  const handleReset = () => {
    setQuery({ businessLine: '', table: '', warehouse: '', cargoOwner: '' });
    setFilteredRules(mockConfiguredRules);
  };

  // Mock edit action - in a real app, this would change the tab to 'builder' and load the rule
  const handleEditRule = (ruleId: string) => {
    // You could dispatch an event or use a global layout store to switch tabs
    // For now, we simulate an alert or state change
    const event = new CustomEvent('navigate-to-builder', { detail: { ruleId } });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">已配置规则查询</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">多维度检视与维护预警策略，支持按业务线、表、仓、货主交叉筛选。</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
          <Plus className="h-4.5 w-4.5" />
          新建规则
        </button>
      </div>

      <div className="p-8 flex-1 overflow-auto bg-gray-50/50">
        {/* Search Panel */}
        <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Filter className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-bold text-gray-800">多维筛选条件</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                <LayoutGrid className="h-3.5 w-3.5" /> 业务线
              </label>
              <select 
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                value={query.businessLine}
                onChange={(e) => setQuery({...query, businessLine: e.target.value})}
              >
                <option value="">全部业务线</option>
                <option value="快递业务">快递业务</option>
                <option value="冷链业务">冷链业务</option>
                <option value="快运业务">快运业务</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5" /> 依赖表
              </label>
              <input 
                type="text"
                placeholder="例如: WMS_SHIPMENT..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-gray-400"
                value={query.table}
                onChange={(e) => setQuery({...query, table: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                <Box className="h-3.5 w-3.5" /> 仓 (支持模糊搜索)
              </label>
              <input 
                type="text"
                placeholder="例如: 上海嘉定仓"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-gray-400"
                value={query.warehouse}
                onChange={(e) => setQuery({...query, warehouse: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> 货主名称
              </label>
              <input 
                type="text"
                placeholder="例如: 李宁体育"
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium placeholder-gray-400"
                value={query.cargoOwner}
                onChange={(e) => setQuery({...query, cargoOwner: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button 
              onClick={handleReset}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              重置条件
            </button>
            <button 
              onClick={handleSearch}
              className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm shadow-indigo-200"
            >
              <Search className="h-4 w-4" />
              执行查询
            </button>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-150">
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">规则名称 & ID</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">业务线 / 表</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">仓 / 货主</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider">更新时间</th>
                <th className="px-6 py-4 text-xs font-extrabold text-gray-500 uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRules.length > 0 ? (
                filteredRules.map((rule, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={rule.id} 
                    className="hover:bg-indigo-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 text-sm">{rule.name}</div>
                      <div className="text-xs text-gray-400 font-medium mt-0.5 font-mono">{rule.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold mb-1">
                        {rule.businessLine}
                      </div>
                      <div className="text-xs text-gray-500 font-mono font-medium truncate max-w-[150px]" title={rule.table}>
                        {rule.table}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-800 font-medium">{rule.warehouse}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{rule.cargoOwner}</div>
                    </td>
                    <td className="px-6 py-4">
                      {rule.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> 生效中
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400"></span> 已停用
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {rule.updatedAt}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleEditRule(rule.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Edit className="h-4 w-4" /> 修改配置
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                    <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                    <p className="font-medium">未找到符合条件的规则</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
