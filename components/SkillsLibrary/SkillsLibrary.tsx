'use client';

import React, { useState } from 'react';
import { useRuleStore, SkillCardData } from '../../store/ruleStore';
import { 
  Search, 
  Clock, 
  Scale, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  ShieldCheck, 
  Cpu, 
  DollarSign, 
  CloudLightning, 
  Trash2, 
  Settings,
  HelpCircle,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardProps {
  skill: SkillCardData;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function SkillLibraryCard({ skill, isSelected, onSelect, onDelete }: CardProps) {
  // Get color and icon based on category
  const getStyle = () => {
    switch (skill.category) {
      case 'Quality-Safety':
        return {
          border: 'border-l-4 border-l-purple-500',
          bg: isSelected ? 'bg-purple-950/30 border-purple-500/50' : 'bg-purple-950/5 hover:bg-purple-950/10 border-gray-850',
          icon: <ShieldCheck className="h-4 w-4 text-purple-400" />,
          badgeColor: 'bg-purple-950 text-purple-400 border-purple-900/30'
        };
      case 'Resource-Capacity':
        return {
          border: 'border-l-4 border-l-blue-500',
          bg: isSelected ? 'bg-blue-950/30 border-blue-500/50' : 'bg-blue-950/5 hover:bg-blue-950/10 border-gray-850',
          icon: <Cpu className="h-4 w-4 text-blue-400" />,
          badgeColor: 'bg-blue-950 text-blue-400 border-blue-900/30'
        };
      case 'Equipment-System':
        return {
          border: 'border-l-4 border-l-amber-500',
          bg: isSelected ? 'bg-amber-950/30 border-amber-500/50' : 'bg-amber-950/5 hover:bg-amber-950/10 border-gray-850',
          icon: <Scale className="h-4 w-4 text-amber-400" />,
          badgeColor: 'bg-amber-950 text-amber-400 border-amber-900/30'
        };
      case 'Cost-Finance':
        return {
          border: 'border-l-4 border-l-emerald-500',
          bg: isSelected ? 'bg-emerald-950/30 border-emerald-500/50' : 'bg-emerald-950/5 hover:bg-emerald-950/10 border-gray-850',
          icon: <DollarSign className="h-4 w-4 text-emerald-400" />,
          badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-900/30'
        };
      case 'Force-Majeure':
        return {
          border: 'border-l-4 border-l-rose-500',
          bg: isSelected ? 'bg-rose-950/30 border-rose-500/50' : 'bg-rose-950/5 hover:bg-rose-950/10 border-gray-850',
          icon: <CloudLightning className="h-4 w-4 text-rose-400" />,
          badgeColor: 'bg-rose-950 text-rose-400 border-rose-900/30'
        };
      case 'Sla-Inventory':
        return {
          border: 'border-l-4 border-l-pink-500',
          bg: isSelected ? 'bg-pink-950/30 border-pink-500/50' : 'bg-pink-950/5 hover:bg-pink-950/10 border-gray-850',
          icon: <Clock className="h-4 w-4 text-pink-400" />,
          badgeColor: 'bg-pink-950 text-pink-400 border-pink-900/30'
        };
      default:
        return {
          border: 'border-l-4 border-l-gray-600',
          bg: isSelected ? 'bg-gray-800/40 border-gray-600' : 'bg-gray-800/10 hover:bg-gray-800/20 border-gray-850',
          icon: <HelpCircle className="h-4 w-4 text-gray-400" />,
          badgeColor: 'bg-gray-900 text-gray-400 border-gray-800'
        };
    }
  };

  const style = getStyle();

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-lg border p-3 mb-2 transition-all duration-200 flex flex-col justify-between ${style.border} ${style.bg} ${
        isSelected ? 'ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-950/20' : ''
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5">{style.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-1">
            <div className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors truncate">
              {skill.name}
            </div>
            <button
              onClick={onDelete}
              className="text-gray-600 hover:text-red-400 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              title="删除场景"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {skill.description}
          </div>
          
          <div className="mt-2.5 flex items-center justify-between">
            <span className="text-[8px] font-mono text-gray-500 bg-gray-950 px-1 py-0.5 rounded border border-gray-900">
              源: {skill.originSystem || 'KAFKA_STREAM'}
            </span>
            <span className="text-[8px] font-bold text-indigo-400 flex items-center gap-0.5 hover:underline">
              点击编辑红线 →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SkillsLibrary() {
  const skills = useRuleStore((state) => state.skillsLibrary);
  const selectedSkillId = useRuleStore((state) => state.selectedSkillId);
  const setSelectedSkillId = useRuleStore((state) => state.setSelectedSkillId);
  const createSkill = useRuleStore((state) => state.createSkill);
  const deleteSkill = useRuleStore((state) => state.deleteSkill);
  
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for creating a new skill
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCardData['category']>('Quality-Safety');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [newSkillEvent, setNewSkillEvent] = useState('');
  const [newSkillOrigin, setNewSkillOrigin] = useState('');
  const [newSkillCheckField, setNewSkillCheckField] = useState('');

  // Expand states for categories
  const [expanded, setExpanded] = useState({
    quality: true,
    capacity: true,
    equipment: true,
    cost: true,
    force: true,
    sla: true
  });

  const toggleCategory = (key: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter skills
  const filteredSkills = skills.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  const catSkills = {
    quality: filteredSkills.filter(s => s.category === 'Quality-Safety'),
    capacity: filteredSkills.filter(s => s.category === 'Resource-Capacity'),
    equipment: filteredSkills.filter(s => s.category === 'Equipment-System'),
    cost: filteredSkills.filter(s => s.category === 'Cost-Finance'),
    force: filteredSkills.filter(s => s.category === 'Force-Majeure'),
    sla: filteredSkills.filter(s => s.category === 'Sla-Inventory')
  };

  const handleCreateSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    createSkill({
      name: newSkillName,
      category: newSkillCategory,
      description: newSkillDesc || '用户自定义业务经验监控指标场景',
      fieldsConfig: '监控阈值',
      fields: { threshold: 10 },
      eventSource: newSkillEvent || 'KAFKA_STREAM_RESOLVE',
      originSystem: newSkillOrigin || 'WMS/TMS',
      checkField: newSkillCheckField || 'status == 1',
      escalationT0: { enabled: true, channel: '钉钉工作通知', receiver: '[curr_node_code] => 责任人' },
      escalationT2: { enabled: true, delayHours: 2, channel: '钉钉工作通知', receiver: '省区接口人' },
      escalationT6: { enabled: false, delayHours: 6, channel: '钉钉工作通知', receiver: '总部保障群' },
      defaultData: {
        label: newSkillName,
        thresholdValue: 10,
        operator: 'greater'
      }
    });

    // Reset Form & Close Modal
    setNewSkillName('');
    setNewSkillDesc('');
    setNewSkillEvent('');
    setNewSkillOrigin('');
    setNewSkillCheckField('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg border-r border-gray-900 p-4">
      {/* Header */}
      <div className="mb-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
            📊 场景预警技能库
          </h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 text-[10px] bg-indigo-600 hover:bg-indigo-500 font-bold text-white rounded transition-colors"
          >
            <Plus className="h-3 w-3" />
            <span>维护场景</span>
          </button>
        </div>
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-500" />
          <input
            type="text"
            placeholder="搜索预警场景..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-gray-950 border border-gray-900 focus:outline-none focus:border-indigo-600 text-gray-300"
          />
        </div>
      </div>

      {/* Categories Scrollable area */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-2">
        {/* 1. Quality & Safety */}
        <div>
          <button 
            onClick={() => toggleCategory('quality')}
            className="w-full flex items-center justify-between py-1.5 px-2 text-[10px] font-bold text-purple-400 hover:bg-purple-950/10 rounded"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>质量与安全预警 ({catSkills.quality.length})</span>
            </span>
            {expanded.quality ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          {expanded.quality && (
            <div className="mt-1 pl-1">
              {catSkills.quality.map(skill => (
                <SkillLibraryCard 
                  key={skill.id} 
                  skill={skill} 
                  isSelected={selectedSkillId === skill.id} 
                  onSelect={() => setSelectedSkillId(skill.id)}
                  onDelete={(e) => { e.stopPropagation(); deleteSkill(skill.id); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. Resource & Capacity */}
        <div>
          <button 
            onClick={() => toggleCategory('capacity')}
            className="w-full flex items-center justify-between py-1.5 px-2 text-[10px] font-bold text-blue-400 hover:bg-blue-950/10 rounded"
          >
            <span className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5" />
              <span>产能与资源预警 ({catSkills.capacity.length})</span>
            </span>
            {expanded.capacity ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          {expanded.capacity && (
            <div className="mt-1 pl-1">
              {catSkills.capacity.map(skill => (
                <SkillLibraryCard 
                  key={skill.id} 
                  skill={skill} 
                  isSelected={selectedSkillId === skill.id} 
                  onSelect={() => setSelectedSkillId(skill.id)}
                  onDelete={(e) => { e.stopPropagation(); deleteSkill(skill.id); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3. Equipment & System */}
        <div>
          <button 
            onClick={() => toggleCategory('equipment')}
            className="w-full flex items-center justify-between py-1.5 px-2 text-[10px] font-bold text-amber-400 hover:bg-amber-950/10 rounded"
          >
            <span className="flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5" />
              <span>设备与系统底座 ({catSkills.equipment.length})</span>
            </span>
            {expanded.equipment ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          {expanded.equipment && (
            <div className="mt-1 pl-1">
              {catSkills.equipment.map(skill => (
                <SkillLibraryCard 
                  key={skill.id} 
                  skill={skill} 
                  isSelected={selectedSkillId === skill.id} 
                  onSelect={() => setSelectedSkillId(skill.id)}
                  onDelete={(e) => { e.stopPropagation(); deleteSkill(skill.id); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 4. Cost & Finance */}
        <div>
          <button 
            onClick={() => toggleCategory('cost')}
            className="w-full flex items-center justify-between py-1.5 px-2 text-[10px] font-bold text-emerald-400 hover:bg-emerald-950/10 rounded"
          >
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              <span>成本与财务预警 ({catSkills.cost.length})</span>
            </span>
            {expanded.cost ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          {expanded.cost && (
            <div className="mt-1 pl-1">
              {catSkills.cost.map(skill => (
                <SkillLibraryCard 
                  key={skill.id} 
                  skill={skill} 
                  isSelected={selectedSkillId === skill.id} 
                  onSelect={() => setSelectedSkillId(skill.id)}
                  onDelete={(e) => { e.stopPropagation(); deleteSkill(skill.id); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 5. Force Majeure */}
        <div>
          <button 
            onClick={() => toggleCategory('force')}
            className="w-full flex items-center justify-between py-1.5 px-2 text-[10px] font-bold text-rose-400 hover:bg-rose-950/10 rounded"
          >
            <span className="flex items-center gap-1.5">
              <CloudLightning className="h-3.5 w-3.5" />
              <span>外部不可抗力预警 ({catSkills.force.length})</span>
            </span>
            {expanded.force ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          {expanded.force && (
            <div className="mt-1 pl-1">
              {catSkills.force.map(skill => (
                <SkillLibraryCard 
                  key={skill.id} 
                  skill={skill} 
                  isSelected={selectedSkillId === skill.id} 
                  onSelect={() => setSelectedSkillId(skill.id)}
                  onDelete={(e) => { e.stopPropagation(); deleteSkill(skill.id); }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 6. SLA & Inventory */}
        <div>
          <button 
            onClick={() => toggleCategory('sla')}
            className="w-full flex items-center justify-between py-1.5 px-2 text-[10px] font-bold text-pink-400 hover:bg-pink-950/10 rounded"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>时效履约与订单库存 ({catSkills.sla.length})</span>
            </span>
            {expanded.sla ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          {expanded.sla && (
            <div className="mt-1 pl-1">
              {catSkills.sla.map(skill => (
                <SkillLibraryCard 
                  key={skill.id} 
                  skill={skill} 
                  isSelected={selectedSkillId === skill.id} 
                  onSelect={() => setSelectedSkillId(skill.id)}
                  onDelete={(e) => { e.stopPropagation(); deleteSkill(skill.id); }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Maintain Skills Modal (Modal Overlay) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-gray-950 border border-gray-800 rounded-xl shadow-2xl p-6 text-gray-200"
            >
              <h3 className="text-sm font-bold border-b border-gray-900 pb-3 mb-4 flex items-center gap-2">
                <span>🔧 新增/维护业务预警场景</span>
              </h3>
              
              <form onSubmit={handleCreateSkill} className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">场景规则名称</label>
                  <input
                    type="text"
                    required
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    placeholder="如：冷藏冷链车超温停滞报警"
                    className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-xs focus:outline-none focus:border-indigo-600 text-gray-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">物理数据回源系统</label>
                    <input
                      type="text"
                      value={newSkillOrigin}
                      onChange={(e) => setNewSkillOrigin(e.target.value)}
                      placeholder="如：WMS、TMS、DWS"
                      className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-xs focus:outline-none focus:border-indigo-600 text-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">预警大类划分</label>
                    <select
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value as any)}
                      className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-xs focus:outline-none text-gray-300"
                    >
                      <option value="Quality-Safety">质量与安全预警 (Quality-Safety)</option>
                      <option value="Resource-Capacity">产能与资源预警 (Resource-Capacity)</option>
                      <option value="Equipment-System">设备与系统底座预警 (Equipment-System)</option>
                      <option value="Cost-Finance">成本与财务预警 (Cost-Finance)</option>
                      <option value="Force-Majeure">外部不可抗力预警 (Force-Majeure)</option>
                      <option value="Sla-Inventory">时效履约与订单库存 (Sla-Inventory)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">场景定义说明</label>
                  <textarea
                    value={newSkillDesc}
                    onChange={(e) => setNewSkillDesc(e.target.value)}
                    rows={2}
                    placeholder="简述该警报触发红线定义条件，例如：冷库关门时间连续超过 20 分钟"
                    className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-xs focus:outline-none focus:border-indigo-600 text-gray-200 resize-none"
                  />
                </div>

                <div className="border-t border-gray-900/60 pt-3 mt-2 space-y-3">
                  <div className="text-[10px] font-bold text-indigo-400 flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5" />
                    <span>隐性核销配置 (PRD核心静默闭环)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">回源物理动作 Kafka Event</label>
                      <input
                        type="text"
                        value={newSkillEvent}
                        onChange={(e) => setNewSkillEvent(e.target.value)}
                        placeholder="如：TMS_VEHICLE_DEPART"
                        className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-[10px] font-mono focus:outline-none text-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-500 font-bold mb-1">自动核销判定字段/状态</label>
                      <input
                        type="text"
                        value={newSkillCheckField}
                        onChange={(e) => setNewSkillCheckField(e.target.value)}
                        placeholder="如：is_recalibrated == 1"
                        className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-[10px] font-mono focus:outline-none text-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 border border-gray-850 text-gray-400 py-2 rounded text-xs"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded text-xs"
                  >
                    确认保存场景
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
