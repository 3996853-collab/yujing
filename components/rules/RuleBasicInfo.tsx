'use client';

import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export interface TableField {
  name: string;
  type: string;
  label: string;
  role: 'Dimension' | 'Metric' | 'Attribute';
}

export interface TableMapping {
  tableName: string;
  comment: string;
  fields: TableField[];
}

interface RuleBasicInfoProps {
  ruleName: string;
  setRuleName: (val: string) => void;
  businessLine: string;
  setBusinessLine: (val: string) => void;
  warningLevel: 'RED' | 'ORANGE' | 'YELLOW';
  setWarningLevel: (val: 'RED' | 'ORANGE' | 'YELLOW') => void;
  selectedTable: TableMapping | null;
  setSelectedTable: (table: TableMapping) => void;
}

export const businessLineToTables: Record<string, TableMapping[]> = {
  '冷链仓配': [
    {
      tableName: 'dm_ll.dwd_cl_shipment_package_out_warehouse_d',
      comment: '冷链出库包裹表',
      fields: [
        { name: 'latest_delivery_time', type: 'DateTime', label: '最晚发货时间', role: 'Metric' },
        { name: 'warehouse_name', type: 'String', label: '仓库名称', role: 'Dimension' },
        { name: 'process_type', type: 'Int', label: '处理类型', role: 'Dimension' },
        { name: 'status', type: 'Int', label: '出库状态', role: 'Dimension' },
        { name: 'receive_time', type: 'DateTime', label: '实际揽收时间', role: 'Attribute' },
        { name: 'shipped_time', type: 'DateTime', label: '发运时间', role: 'Attribute' },
        { name: 'sign_time', type: 'DateTime', label: '签收时间', role: 'Attribute' },
        { name: 'update_time', type: 'DateTime', label: '最新轨迹时间', role: 'Attribute' }
      ]
    },
    {
      tableName: 'dm_ll.dwd_cl_truck_temperature_sensor_hi',
      comment: '冷链车厢温湿度监测流',
      fields: [
        { name: 'current_temperature', type: 'Double', label: '实时车厢温度', role: 'Metric' },
        { name: 'current_humidity', type: 'Double', label: '实时车厢湿度', role: 'Metric' },
        { name: 'sensor_id', type: 'String', label: '传感器设备ID', role: 'Dimension' },
        { name: 'vehicle_no', type: 'String', label: '运输车牌号', role: 'Dimension' },
        { name: 'logistics_status', type: 'String', label: '在途流转状态', role: 'Dimension' }
      ]
    }
  ],
  '仓储仓配': [
    {
      tableName: 'dwd_log_waybill_node_hi',
      comment: '分拨中心时效明细表',
      fields: [
        { name: 'std_duration_hub', type: 'Int', label: '分拨标准耗时', role: 'Metric' },
        { name: 'is_vip', type: 'Boolean', label: 'VIP高端时效件', role: 'Dimension' },
        { name: 'status', type: 'String', label: '运单流转状态', role: 'Dimension' },
        { name: 'send_province', type: 'String', label: '始发省区名称', role: 'Dimension' },
        { name: 'destination_node', type: 'String', label: '到达分拨中心', role: 'Dimension' }
      ]
    },
    {
      tableName: 'dwd_wms_stock_inventory_hi',
      comment: '仓内库存与高水位表',
      fields: [
        { name: 'stock_ratio', type: 'Double', label: '场地库存装载率', role: 'Metric' },
        { name: 'order_count', type: 'Int', label: '积压包裹总量', role: 'Metric' },
        { name: 'warehouse_code', type: 'String', label: '仓库编码', role: 'Dimension' },
        { name: 'category', type: 'String', label: '货品二级品类', role: 'Dimension' }
      ]
    }
  ],
  '干线运输': [
    {
      tableName: 'dwd_sorting_transit_detail_hi',
      comment: '路由干线时效监控表',
      fields: [
        { name: 'transit_duration', type: 'Double', label: '干线在途时长', role: 'Metric' },
        { name: 'departure_delay', type: 'Int', label: '发车延迟时间', role: 'Metric' },
        { name: 'route_line', type: 'String', label: '干线线路名称', role: 'Dimension' },
        { name: 'carrier_name', type: 'String', label: '承运商名称', role: 'Dimension' },
      ]
    }
  ],
  '末端网点': [
    {
      tableName: 'dwd_device_weigher_hi',
      comment: '网点动态称重过磅流',
      fields: [
        { name: 'weight_error_pct', type: 'Double', label: '过磅物理相对误差', role: 'Metric' },
        { name: 'pda_device_id', type: 'String', label: '采集终端设备ID', role: 'Attribute' },
        { name: 'sorting_node', type: 'String', label: '过磅扫码节点', role: 'Dimension' },
      ]
    }
  ],
  '跨境物流': [
    {
      tableName: 'dwd_sorting_transit_detail_hi',
      comment: '路由干线表',
      fields: [
        { name: 'transit_duration', type: 'Double', label: '干线在途时间', role: 'Metric' },
        { name: 'customs_delay', type: 'Int', label: '海关查验耗时', role: 'Metric' },
        { name: 'destination_country', type: 'String', label: '目的国地区', role: 'Dimension' },
      ]
    }
  ]
};

export default function RuleBasicInfo({
  ruleName,
  setRuleName,
  businessLine,
  setBusinessLine,
  warningLevel,
  setWarningLevel,
  selectedTable,
  setSelectedTable
}: RuleBasicInfoProps) {
  const [tablesCollapsed, setTablesCollapsed] = useState(true);
  const tables = businessLineToTables[businessLine] || [];

  useEffect(() => {
    if (tables.length > 0) {
      const exists = tables.some(t => t.tableName === selectedTable?.tableName);
      if (!exists) {
        setSelectedTable(tables[0]);
      }
    }
  }, [businessLine, tables, selectedTable, setSelectedTable]);

  const activeTable = selectedTable || tables[0] || {
    tableName: 'dwd_log_waybill_node_hi',
    comment: '分拨时效表',
    fields: []
  };

  return (
    <div className="space-y-4 bg-white p-5 border border-gray-200 rounded-2xl shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5 border-b border-gray-100 pb-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold">1</span>
        <span>核心规则基本信息定义</span>
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700">规则名称 (Rule Name)</label>
          <input
            type="text"
            value={ruleName}
            onChange={(e) => setRuleName(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-800 outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-700">归属业务线 (Business Line)</label>
          <select
            value={businessLine}
            onChange={(e) => setBusinessLine(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-indigo-500"
          >
            <option value="冷链仓配">冷链仓配 (Cold Chain WMS)</option>
            <option value="仓储仓配">仓储仓配 (WMS)</option>
            <option value="干线运输">干线运输 (TMS)</option>
            <option value="末端网点">末端网点 (LMS)</option>
            <option value="跨境物流">跨境物流 (Cross-Border)</option>
          </select>
        </div>
      </div>

      <div className="p-4 bg-indigo-50/50 border border-indigo-100/70 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
            <Database className="h-4 w-4 text-indigo-600" />
            <span>自动映射数仓物理源表 ({tables.length}个可用)</span>
          </div>
          <button
            type="button"
            onClick={() => setTablesCollapsed(!tablesCollapsed)}
            className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer"
          >
            <span>{tablesCollapsed ? '展开映射明细' : '收起映射明细'}</span>
            {tablesCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] text-gray-500 font-extrabold uppercase">当前规则监控主数据表:</span>
          <div className="flex flex-wrap gap-2">
            {tables.map((t) => {
              const isSelected = activeTable.tableName === t.tableName;
              return (
                <button
                  key={t.tableName}
                  type="button"
                  onClick={() => setSelectedTable(t)}
                  className={`px-3 py-2 rounded-xl text-left border transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-700 text-white font-bold shadow-md shadow-indigo-900/10'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                  <div>
                    <div className="text-[11px] font-bold font-mono">{t.tableName}</div>
                    <div className={`text-[9px] ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>{t.comment}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {!tablesCollapsed && (
          <div className="space-y-2 border-t border-indigo-100/50 pt-2.5 transition-all duration-300">
            <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 bg-white/70 p-2 rounded-lg border border-indigo-50/50">
              <span>活动物理表: <span className="font-mono text-indigo-700 font-extrabold">{activeTable.tableName}</span></span>
              <span className="text-emerald-600 flex items-center gap-0.5">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>语义映射已对齐 {activeTable.fields.length} 个字段</span>
              </span>
            </div>
            
            <div className="space-y-1">
              <span className="block text-[9px] text-gray-500 font-extrabold uppercase">字段结构与业务语义对应关系:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeTable.fields.map((f) => (
                  <span key={f.name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-[10px] font-semibold text-gray-700 shadow-xs">
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      f.role === 'Metric' ? 'bg-indigo-500' :
                      f.role === 'Dimension' ? 'bg-amber-500' :
                      'bg-purple-500'
                    }`} />
                    <span>{f.label}</span>
                    <span className="text-[9px] text-gray-400 font-mono">({f.name})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-gray-700">预警级别标签 (WarningLevel)</label>
        <div className="flex gap-4 items-center mt-1">
          {['RED', 'ORANGE', 'YELLOW'].map((lvl) => (
            <label key={lvl} className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="warningLevelSub"
                value={lvl}
                checked={warningLevel === lvl}
                onChange={() => setWarningLevel(lvl as any)}
                className="text-indigo-600 focus:ring-0 focus:ring-offset-0"
              />
              <span className={`inline-flex px-2.5 py-0.5 rounded border text-[10px] ${
                lvl === 'RED' ? 'bg-red-50 text-red-700 border-red-100' :
                lvl === 'ORANGE' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                'bg-yellow-50 text-yellow-700 border-yellow-100'
              }`}>
                {lvl} 级别
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
