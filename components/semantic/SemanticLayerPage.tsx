'use client';

import React, { useState } from 'react';
import SemanticTable from './SemanticTable';
import { Check, BookOpen, CheckCircle } from 'lucide-react';

interface MappingItem {
  id: string;
  physicalName: string;
  type: string;
  semanticName: string;
  role: 'Dimension' | 'Metric' | 'Attribute';
}

const initialMappings: MappingItem[] = [
  { id: '1', physicalName: 'id', type: 'String', semanticName: '包裹唯一ID', role: 'Attribute' },
  { id: '2', physicalName: 'warehouse_name', type: 'String', semanticName: '仓库名称', role: 'Dimension' },
  { id: '3', physicalName: 'process_type', type: 'Int', semanticName: '处理类型', role: 'Dimension' },
  { id: '4', physicalName: 'status', type: 'Int', semanticName: '出库状态', role: 'Dimension' },
  { id: '5', physicalName: 'receive_time', type: 'DateTime', semanticName: '实际揽收时间', role: 'Attribute' },
  { id: '6', physicalName: 'latest_delivery_time', type: 'DateTime', semanticName: '最晚发货时间', role: 'Metric' },
  { id: '7', physicalName: 'shipped_time', type: 'DateTime', semanticName: '发运时间', role: 'Attribute' },
  { id: '8', physicalName: 'sign_time', type: 'DateTime', semanticName: '签收时间', role: 'Attribute' },
  { id: '9', physicalName: 'update_time', type: 'DateTime', semanticName: '最新轨迹更新时间', role: 'Attribute' },
];

export default function SemanticLayerPage() {
  const [datasource, setDatasource] = useState('dm_ll.dwd_cl_shipment_package_out_warehouse_d');
  const [mappings, setMappings] = useState<MappingItem[]>(initialMappings);

  const handleDatasourceChange = (newDs: string) => {
    setDatasource(newDs);
    if (newDs === 'dm_ll.dwd_cl_shipment_package_out_warehouse_d') {
      setMappings([
        { id: '1', physicalName: 'id', type: 'String', semanticName: '包裹唯一ID', role: 'Attribute' },
        { id: '2', physicalName: 'warehouse_name', type: 'String', semanticName: '仓库名称', role: 'Dimension' },
        { id: '3', physicalName: 'process_type', type: 'Int', semanticName: '处理类型', role: 'Dimension' },
        { id: '4', physicalName: 'status', type: 'Int', semanticName: '出库状态', role: 'Dimension' },
        { id: '5', physicalName: 'receive_time', type: 'DateTime', semanticName: '实际揽收时间', role: 'Attribute' },
        { id: '6', physicalName: 'latest_delivery_time', type: 'DateTime', semanticName: '最晚发货时间', role: 'Metric' },
        { id: '7', physicalName: 'shipped_time', type: 'DateTime', semanticName: '发运时间', role: 'Attribute' },
        { id: '8', physicalName: 'sign_time', type: 'DateTime', semanticName: '签收时间', role: 'Attribute' },
        { id: '9', physicalName: 'update_time', type: 'DateTime', semanticName: '最新轨迹更新时间', role: 'Attribute' },
      ]);
    } else if (newDs === 'dwd_log_waybill_node_hi') {
      setMappings([
        { id: '1', physicalName: 'std_duration_hub', type: 'Int', semanticName: '分拨标准耗时', role: 'Metric' },
        { id: '2', physicalName: 'is_vip', type: 'Boolean', semanticName: 'VIP高端时效件', role: 'Dimension' },
        { id: '3', physicalName: 'status', type: 'String', semanticName: '运单流转状态', role: 'Dimension' },
        { id: '4', physicalName: 'send_province', type: 'String', semanticName: '始发省区名称', role: 'Dimension' },
      ]);
    } else if (newDs === 'dwd_device_weigher_hi') {
      setMappings([
        { id: '1', physicalName: 'weight_error_pct', type: 'Double', semanticName: '过磅物理相对误差', role: 'Metric' },
        { id: '2', physicalName: 'pda_device_id', type: 'String', semanticName: '采集终端设备ID', role: 'Attribute' },
        { id: '3', physicalName: 'sorting_node', type: 'String', semanticName: '过磅扫码节点', role: 'Dimension' },
      ]);
    } else if (newDs === 'dwd_sorting_transit_detail_hi') {
      setMappings([
        { id: '1', physicalName: 'transit_duration', type: 'Double', semanticName: '干线在途时长', role: 'Metric' },
        { id: '2', physicalName: 'departure_delay', type: 'Int', semanticName: '发车延迟时间', role: 'Metric' },
        { id: '3', physicalName: 'route_line', type: 'String', semanticName: '干线线路名称', role: 'Dimension' },
        { id: '4', physicalName: 'carrier_name', type: 'String', semanticName: '承运商名称', role: 'Dimension' },
      ]);
    }
  };
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showEnumModal, setShowEnumModal] = useState<string | null>(null);
  const [enumValue, setEnumValue] = useState('1: 是\n0: 否\n-1: 未知');

  const handleSemanticNameChange = (id: string, value: string) => {
    setMappings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, semanticName: value } : item))
    );
  };

  const handleRoleChange = (id: string, value: 'Dimension' | 'Metric' | 'Attribute') => {
    setMappings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, role: value } : item))
    );
  };

  const handlePublish = () => {
    setShowSnackbar(true);
    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] overflow-hidden text-gray-800 relative">
      
      {/* Snackbar Alert */}
      {showSnackbar && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 transition-all duration-300 animate-slide-up border border-gray-800">
          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          <span className="text-xs font-bold tracking-wide">
            语义字典发布成功，已同步至规则引擎！
          </span>
        </div>
      )}

      {/* Header bar styled in MD3 tonal style */}
      <div className="p-6 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <span>数仓语义映射层配置 (Semantic Config)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">对物理库表结构进行业务含义翻译与抽象，服务上层规则配置</p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-555">选择数据源:</span>
            <select
              value={datasource}
              onChange={(e) => handleDatasourceChange(e.target.value)}
              className="bg-gray-55 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 outline-none w-64 focus:border-indigo-500"
            >
              <option value="dm_ll.dwd_cl_shipment_package_out_warehouse_d">dm_ll.dwd_cl_shipment_package_out_warehouse_d [冷链出库包裹表]</option>
              <option value="dwd_log_waybill_node_hi">dwd_log_waybill_node_hi [分拨时效表]</option>
              <option value="dwd_device_weigher_hi">dwd_device_weigher_hi [过磅误差流]</option>
              <option value="dwd_sorting_transit_detail_hi">dwd_sorting_transit_detail_hi [路由干线表]</option>
            </select>
          </div>

          <button
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95"
          >
            <Check className="h-4 w-4" />
            <span>发布至业务字典</span>
          </button>
        </div>
      </div>

      {/* Main Table view */}
      <div className="flex-1 p-6 overflow-y-auto">
        <SemanticTable 
          mappings={mappings} 
          handleSemanticNameChange={handleSemanticNameChange} 
          handleRoleChange={handleRoleChange} 
          onConfigureDict={(fieldName) => setShowEnumModal(fieldName)} 
        />
      </div>

      {/* Dictionary enum configurator modal */}
      {showEnumModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              配置字典枚举映射: <span className="font-mono text-indigo-600">{showEnumModal}</span>
            </h3>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] text-gray-500 font-bold">映射关系关系表 (每行一组键值对)</label>
              <textarea
                value={enumValue}
                onChange={(e) => setEnumValue(e.target.value)}
                rows={5}
                className="w-full bg-gray-55 border border-gray-200 rounded-xl p-3 text-xs font-mono outline-none focus:border-indigo-500 text-gray-800"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowEnumModal(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => setShowEnumModal(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                确认保存
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
