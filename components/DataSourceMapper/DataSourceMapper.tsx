'use client';

import React, { useState } from 'react';
import { useRuleStore } from '../../store/ruleStore';
import { Database, ArrowRight, Settings, Plus, Play, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DataSourceMapper() {
  const datasource = useRuleStore((state) => state.datasource);
  const schemaFields = useRuleStore((state) => state.schemaFields);
  const semanticFields = useRuleStore((state) => state.semanticFields);
  const draggedFields = useRuleStore((state) => state.draggedFields);
  const mapField = useRuleStore((state) => state.mapField);
  const removeMappedField = useRuleStore((state) => state.removeMappedField);
  const publishSkill = useRuleStore((state) => state.publishSkill);

  // Steps state
  const [step, setStep] = useState(1);
  const [mapType, setMapType] = useState<'Dim' | 'Metric'>('Dim');
  const [mapLabel, setMapLabel] = useState('');
  const [mapUnit, setMapUnit] = useState('');
  const [selectedField, setSelectedField] = useState('');

  // Skill Config Packaging state
  const [skillName, setSkillName] = useState('冷链流转时效监控');
  const [skillCategory, setSkillCategory] = useState<'Quality-Safety' | 'Resource-Capacity' | 'Equipment-System' | 'Cost-Finance' | 'Force-Majeure' | 'Sla-Inventory' | 'Actions'>('Quality-Safety');
  const [allowProvinceFilter, setAllowProvinceFilter] = useState(true);
  const [allowNodeTypeFilter, setAllowNodeTypeFilter] = useState(true);
  const [allowThresholdFilter, setAllowThresholdFilter] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAddFieldToMap = (fieldName: string) => {
    setSelectedField(fieldName);
    // Guess default labels/types
    if (fieldName === 'send_prov_name') {
      setMapType('Dim');
      setMapLabel('发件省区');
      setMapUnit('');
    } else if (fieldName === 'curr_node_type') {
      setMapType('Dim');
      setMapLabel('当前节点类型');
      setMapUnit('');
    } else if (fieldName === 'actual_weight') {
      setMapType('Metric');
      setMapLabel('实际称重重量');
      setMapUnit('kg');
    } else if (fieldName === 'duration_mins') {
      setMapType('Metric');
      setMapLabel('环节流转耗时');
      setMapUnit('分钟');
    } else {
      setMapType('Dim');
      setMapLabel(fieldName);
      setMapUnit('');
    }
  };

  const submitFieldMap = () => {
    if (!selectedField || !mapLabel.trim()) return;
    mapField(selectedField, mapType, mapLabel, mapUnit);
    setSelectedField('');
    setMapLabel('');
    setMapUnit('');
  };

  const handlePublish = () => {
    const config: any = {};
    if (allowProvinceFilter) config.province = '上海';
    if (allowNodeTypeFilter) config.nodeType = '分拨中心';
    if (allowThresholdFilter) config.thresholdValue = 120;

    publishSkill(skillName, skillCategory, config);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSkillName('');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg p-6 text-gray-200 overflow-y-auto">
      {/* Top Header */}
      <div className="mb-6 pb-5 border-b border-gray-900 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <span>🗄️ 数据资产与业务经验技能映射台 (Data Source & Skill Mapper)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            将 ClickHouse/Doris 等数仓宽表指标与维度映射为中文业务语义，并打包为前端 AI 画布可配置的校验卡片
          </p>
        </div>
      </div>

      {/* Main Content Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
        
        {/* Left column: Schema binding & Mapping details (8/12 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Step 1: Bind Table */}
          <div className="bg-gray-950/60 border border-gray-900 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-900/30 text-indigo-400 text-[10px] font-bold">1</span>
              <span>第一步：绑定ClickHouse数仓宽表 (Table Binding)</span>
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] text-gray-500 font-bold block mb-1">物理数据接入源</label>
                <select className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none">
                  <option>{datasource.connection}</option>
                  <option>Doris - 离线分析备集群</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold block mb-1">数据库 (Database)</label>
                <select className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none">
                  <option>{datasource.database}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-500 font-bold block mb-1">数仓宽表 (Wide Table)</label>
                <select className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none">
                  <option>{datasource.table}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Columns & Mapping UI */}
          <div className="bg-gray-950/60 border border-gray-900 p-4 rounded-xl space-y-3 flex-1 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-900/30 text-indigo-400 text-[10px] font-bold">2</span>
              <span>第二步：表字段列表与中文语义对齐 (Semantic Layer Dictionary Mapping)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-start">
              {/* Database Schema columns */}
              <div className="border border-gray-900 bg-gray-950/40 rounded-lg overflow-hidden h-96 flex flex-col">
                <div className="p-2 bg-gray-900/60 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-900">
                  ClickHouse 宽表 Schema 物理字段
                </div>
                <div className="p-2 overflow-y-auto divide-y divide-gray-900/60 flex-1 space-y-1">
                  {schemaFields.map((field) => {
                    const isMapped = draggedFields.includes(field.fieldName);
                    return (
                      <div 
                        key={field.fieldName} 
                        onClick={() => !isMapped && handleAddFieldToMap(field.fieldName)}
                        className={`flex items-center justify-between p-2 rounded text-xs transition-all ${
                          isMapped 
                            ? 'bg-gray-900/30 text-gray-600 cursor-not-allowed' 
                            : 'bg-gray-900/80 hover:bg-gray-850 text-gray-300 cursor-pointer border border-transparent hover:border-indigo-600/30'
                        }`}
                      >
                        <div className="font-mono flex items-center gap-1.5">
                          <span className="text-gray-500">#</span>
                          <span>{field.fieldName}</span>
                          <span className="text-[10px] text-gray-500 font-normal">({field.type})</span>
                        </div>
                        {field.isPrimaryKey ? (
                          <span className="text-[9px] bg-indigo-950/50 text-indigo-400 px-1 py-0.2 rounded border border-indigo-900/30 font-bold">
                            🔑 主键
                          </span>
                        ) : isMapped ? (
                          <span className="text-[9px] text-neon-emerald font-bold">已绑定 ✓</span>
                        ) : (
                          <span className="text-[9px] bg-gray-950 border border-gray-800 text-gray-500 px-1 py-0.2 rounded">
                            点击映射
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mapped Dictionary */}
              <div className="border border-gray-900 bg-gray-950/40 rounded-lg overflow-hidden h-96 flex flex-col justify-between">
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-2 bg-gray-900/60 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-900 flex justify-between">
                    <span>已封装的语义词典列表 (Semantic Layer)</span>
                    <span className="text-neon-emerald font-mono font-bold">{semanticFields.length} 项</span>
                  </div>
                  
                  <div className="p-2 overflow-y-auto divide-y divide-gray-900/60 flex-1 space-y-1">
                    {semanticFields.map((field) => (
                      <div key={field.fieldName} className="flex items-center justify-between p-2 rounded bg-gray-900/60 text-xs border border-gray-900 font-mono text-gray-300">
                        <div>
                          <span className={`text-[9px] font-bold px-1 rounded mr-2 ${
                            field.type === 'PK'
                              ? 'bg-indigo-950 text-indigo-400 border border-indigo-900/30'
                              : field.type === 'Dim'
                                ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/25'
                                : 'bg-neon-orange/20 text-neon-orange border border-neon-orange/25'
                          }`}>
                            {field.type}
                          </span>
                          <span className="text-gray-400 mr-1.5">{field.fieldName}</span>
                          <span className="text-gray-500 font-bold">⇒</span>
                          <span className="text-gray-100 font-sans font-bold ml-1.5">{field.label}</span>
                          {field.unit && <span className="text-gray-500 text-[10px] font-normal font-sans"> ({field.unit})</span>}
                        </div>
                        {field.type !== 'PK' && (
                          <button 
                            onClick={() => removeMappedField(field.fieldName)}
                            className="text-gray-600 hover:text-neon-red text-[10px]"
                          >
                            移除
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form to enter map details */}
                <AnimatePresence>
                  {selectedField && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="p-3 bg-gray-950 border-t border-gray-900 space-y-3"
                    >
                      <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5">
                        <Settings className="h-3 w-3 text-indigo-400 animate-spin" />
                        <span>为字段 [ <span className="font-mono text-indigo-300">{selectedField}</span> ] 配置中文标签</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 items-center">
                        <select
                          value={mapType}
                          onChange={(e) => setMapType(e.target.value as any)}
                          className="bg-gray-900 border border-gray-800 rounded p-1.5 text-xs text-gray-300 focus:outline-none"
                        >
                          <option value="Dim">维度 (Dim)</option>
                          <option value="Metric">指标 (Metric)</option>
                        </select>
                        
                        <input
                          type="text"
                          value={mapLabel}
                          onChange={(e) => setMapLabel(e.target.value)}
                          placeholder="中文描述,如:计重相对误差"
                          className="bg-gray-900 border border-gray-800 rounded p-1.5 text-xs text-gray-200 focus:outline-none placeholder-gray-600"
                        />

                        <input
                          type="text"
                          value={mapUnit}
                          onChange={(e) => setMapUnit(e.target.value)}
                          placeholder="单位,如:kg (可空)"
                          className="bg-gray-900 border border-gray-800 rounded p-1.5 text-xs text-gray-200 focus:outline-none placeholder-gray-600"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedField('')}
                          className="flex-1 bg-gray-900 border border-gray-800 text-gray-400 text-xs py-1.5 rounded"
                        >
                          取消
                        </button>
                        <button
                          onClick={submitFieldMap}
                          className="flex-1 bg-indigo-600 text-white text-xs py-1.5 rounded font-bold"
                        >
                          确认对齐
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Packaging skill card (4/12 cols) */}
        <div className="lg:col-span-4 bg-gray-950/60 border border-gray-900 p-4 rounded-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 pb-2 border-b border-gray-900">
              <span className="flex h-5 w-5 items-center justify-center rounded bg-indigo-900/30 text-indigo-400 text-[10px] font-bold">3</span>
              <span>第三步：封装为业务技能 (Skill Packaging)</span>
            </h3>

            {/* Inputs config */}
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-gray-500 font-bold block mb-1">1. 技能名称</label>
                <input
                  type="text"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="如：冷链环节时效校验"
                  className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-gray-500 font-bold block mb-1">2. 所属分类</label>
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none"
                >
                  <option value="Quality-Safety">质量与安全预警 (Quality-Safety)</option>
                  <option value="Resource-Capacity">产能与资源预警 (Resource-Capacity)</option>
                  <option value="Equipment-System">设备与系统底座预警 (Equipment-System)</option>
                  <option value="Cost-Finance">成本与财务预警 (Cost-Finance)</option>
                  <option value="Force-Majeure">外部不可抗力预警 (Force-Majeure)</option>
                  <option value="Sla-Inventory">时效履约与订单库存预警 (Sla-Inventory)</option>
                </select>
              </div>

              {/* Interactive slot checks */}
              <div className="space-y-2">
                <label className="text-gray-500 font-bold block mb-1">3. 开放给业务配置的条件槽位</label>
                
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowProvinceFilter}
                    onChange={(e) => setAllowProvinceFilter(e.target.checked)}
                    className="rounded bg-gray-900 border-gray-800 text-indigo-600 focus:ring-0"
                  />
                  <span>允许业务按 [发件省区 (Dim)] 过滤</span>
                </label>

                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowNodeTypeFilter}
                    onChange={(e) => setAllowNodeTypeFilter(e.target.checked)}
                    className="rounded bg-gray-900 border-gray-800 text-indigo-600 focus:ring-0"
                  />
                  <span>允许业务按 [当前节点类型 (Dim)] 过滤</span>
                </label>

                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowThresholdFilter}
                    onChange={(e) => setAllowThresholdFilter(e.target.checked)}
                    className="rounded bg-gray-900 border-gray-800 text-indigo-600 focus:ring-0"
                  />
                  <span>允许业务设置 [流转环节耗时 (Metric)] 的阈值</span>
                </label>
              </div>

              {/* Preview packaging UI card */}
              <div className="pt-2">
                <label className="text-gray-500 font-bold block mb-1.5">预览前端呈现 (Visual Node Preview)</label>
                <div className="relative border border-dashed border-indigo-500/20 bg-indigo-950/5 p-3 rounded-lg overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500" />
                  <div className="text-[10px] font-bold text-indigo-400 mb-2 uppercase tracking-wide">
                    ⚡ 技能: {skillName || '未命名'}
                  </div>
                  
                  <div className="space-y-2 text-[10px] text-gray-400">
                    {allowProvinceFilter && (
                      <div className="flex items-center gap-1.5">
                        <span>省区包含:</span>
                        <input type="text" disabled placeholder="上海" className="flex-1 bg-gray-950/80 border border-gray-850 rounded px-1.5 py-0.5 text-[9px] text-gray-500" />
                      </div>
                    )}
                    {allowNodeTypeFilter && (
                      <div className="flex items-center gap-1.5">
                        <span>节点属于:</span>
                        <input type="text" disabled placeholder="分拨中心" className="flex-1 bg-gray-950/80 border border-gray-850 rounded px-1.5 py-0.5 text-[9px] text-gray-500" />
                      </div>
                    )}
                    {allowThresholdFilter && (
                      <div className="flex items-center gap-1.5">
                        <span>耗时:</span>
                        <span className="border border-gray-850 rounded px-1 text-[9px]">大于</span>
                        <input type="number" disabled placeholder="120" className="w-12 bg-gray-950/80 border border-gray-850 rounded px-1.5 py-0.5 text-[9px] text-gray-500 text-center" />
                        <span>分钟</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-900">
            <button
              onClick={handlePublish}
              disabled={isSuccess || !skillName.trim()}
              className={`w-full text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] ${
                isSuccess 
                  ? 'bg-neon-emerald text-dark-bg font-extrabold shadow-neon-emerald/20' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'
              }`}
            >
              {isSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  已发布至 AI 规则资源库！
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  保存并发布技能至 AI 画布
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
