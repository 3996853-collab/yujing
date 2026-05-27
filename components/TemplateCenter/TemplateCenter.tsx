'use client';

import React, { useState } from 'react';
import { useRuleStore, TemplateData } from '../../store/ruleStore';
import { LayoutGrid, Users, FileCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TemplateCenter() {
  const templates = useRuleStore((state) => state.templates);
  const applyTemplate = useRuleStore((state) => state.applyTemplate);

  const [activeCategory, setActiveCategory] = useState<'all' | 'official' | 'enterprise'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  
  // Fill-in-the-blank form states
  const [province, setProvince] = useState('上海');
  const [stage, setStage] = useState('首中心发车');
  const [threshold, setThreshold] = useState(120);
  const [channel, setChannel] = useState('钉钉工作通知');
  const [isApplied, setIsApplied] = useState(false);

  // Categories count
  const officialCount = templates.filter(t => t.category === 'official').length;
  const enterpriseCount = templates.filter(t => t.category === 'enterprise').length;

  const filteredTemplates = templates.filter((t) => {
    if (activeCategory === 'all') return true;
    return t.category === activeCategory;
  });

  const handleOpenConfigModal = (tpl: TemplateData) => {
    setSelectedTemplate(tpl);
    setProvince(tpl.slots.province);
    setStage(tpl.slots.stage);
    setThreshold(tpl.slots.threshold);
    setChannel(tpl.slots.channel);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    applyTemplate(selectedTemplate.id, {
      province,
      stage,
      threshold,
      channel
    });

    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
      setSelectedTemplate(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg p-6 text-gray-200 overflow-y-auto relative">
      {/* Header */}
      <div className="mb-6 pb-5 border-b border-gray-900 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <span>🗃️ 开箱即用的场景模板中心 (Template Center)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            免去无限画布连线门槛，通过极简“填空式”界面，一键生成物理预警校验与流转升级逻辑
          </p>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex bg-gray-950/80 p-1 rounded-lg border border-gray-900 self-start mb-6 text-xs font-bold text-gray-400">
        <button
          onClick={() => setActiveCategory('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded transition-all ${
            activeCategory === 'all'
              ? 'bg-gray-800 text-indigo-400 font-bold'
              : 'hover:text-gray-200'
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          全部模板 ({templates.length})
        </button>
        <button
          onClick={() => setActiveCategory('official')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded transition-all ${
            activeCategory === 'official'
              ? 'bg-gray-800 text-indigo-400 font-bold'
              : 'hover:text-gray-200'
          }`}
        >
          <FileCheck className="h-3.5 w-3.5" />
          官方/行业模板 ({officialCount})
        </button>
        <button
          onClick={() => setActiveCategory('enterprise')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded transition-all ${
            activeCategory === 'enterprise'
              ? 'bg-gray-800 text-indigo-400 font-bold'
              : 'hover:text-gray-200'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          企业/自定义模板 ({enterpriseCount})
        </button>
      </div>

      {/* Templates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 items-start">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((tpl) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={tpl.id}
              className="bg-gray-950/60 border border-gray-900 hover:border-gray-850 p-4 rounded-xl shadow-lg flex flex-col justify-between h-44 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                    tpl.category === 'official'
                      ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20'
                      : 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20'
                  }`}>
                    {tpl.category === 'official' ? '官方标准' : '企业自定义'}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono">#{tpl.id}</span>
                </div>
                <h4 className="text-sm font-bold text-gray-200 mb-1.5">{tpl.name}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-900/60 text-xs">
                <span className="text-gray-500 font-medium">配置参数槽位：{Object.keys(tpl.slots).length}个</span>
                <button
                  onClick={() => handleOpenConfigModal(tpl)}
                  className="bg-brand-indigo/10 hover:bg-brand-indigo/20 border border-brand-indigo/20 text-brand-indigo text-[10px] font-bold py-1 px-2.5 rounded flex items-center gap-1 transition-all"
                >
                  配置并应用
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Form modal for Fill-in-the-blank interaction */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-gray-950 border border-gray-850 rounded-xl p-5 shadow-2xl relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedTemplate(null)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-4">
                <div className="text-[10px] text-brand-indigo font-bold uppercase tracking-wider mb-0.5">表单填空式配置 (Fill-in-the-blank)</div>
                <h3 className="text-sm font-bold text-gray-200">{selectedTemplate.name}</h3>
              </div>

              {/* Interactive Sentence blanks */}
              <form onSubmit={handleApply} className="space-y-6">
                <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-900 text-xs text-gray-300 leading-8">
                  <span className="mr-1.5 font-medium">当</span>
                  
                  {/* Slot 1: Province Dropdown */}
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="bg-gray-950 border border-gray-800 rounded px-2 py-0.5 mx-1 text-brand-indigo font-bold focus:outline-none focus:border-brand-indigo cursor-pointer text-xs"
                  >
                    <option value="上海">上海</option>
                    <option value="浙江">浙江</option>
                    <option value="江苏">江苏</option>
                    <option value="广东">广东</option>
                  </select>
                  <span className="mx-1 font-medium">的生鲜快件，在</span>

                  {/* Slot 2: Working Stage Dropdown */}
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="bg-gray-950 border border-gray-800 rounded px-2 py-0.5 mx-1 text-brand-indigo font-bold focus:outline-none focus:border-brand-indigo cursor-pointer text-xs"
                  >
                    <option value="首中心发车">首中心发车</option>
                    <option value="揽收发运">揽收发运</option>
                    <option value="设备过磅">设备过磅</option>
                    <option value="中心发车">中心发车</option>
                    <option value="冷链装车">冷链装车</option>
                  </select>
                  <span className="mx-1 font-medium">环节耗时超过</span>

                  {/* Slot 3: Threshold Minute Input */}
                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                    className="w-16 bg-gray-950 border border-gray-800 rounded px-1.5 py-0.5 mx-1 text-center text-brand-indigo font-bold focus:outline-none focus:border-brand-indigo text-xs"
                  />
                  <span className="mx-1 font-medium">{selectedTemplate.id === 'tpl-weighing-drift' ? '%' : '分钟'} 时，通过</span>

                  {/* Slot 4: Push channel Dropdown */}
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="bg-gray-950 border border-gray-800 rounded px-2 py-0.5 mx-1 text-brand-indigo font-bold focus:outline-none focus:border-brand-indigo cursor-pointer text-xs"
                  >
                    <option value="钉钉工作通知">钉钉工作通知</option>
                    <option value="钉钉群机器人">钉钉群机器人</option>
                    <option value="钉钉现场催办大群">钉钉现场催办大群</option>
                  </select>
                  <span className="ml-1 text-gray-300 font-medium">通知给第一责任人。</span>
                </div>

                {/* Footer buttons */}
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(null)}
                    className="bg-gray-900 border border-gray-850 hover:bg-gray-850 text-gray-400 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                  >
                    返回模板库
                  </button>
                  <button
                    type="submit"
                    disabled={isApplied}
                    className={`text-xs font-bold px-5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-md ${
                      isApplied 
                        ? 'bg-brand-emerald text-dark-bg font-extrabold shadow-brand-emerald/10' 
                        : 'bg-brand-indigo hover:bg-indigo-500 text-white shadow-indigo-900/10'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        已应用，规则编译发布成功！
                      </>
                    ) : (
                      '确认并编译上线此规则'
                    )}
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
