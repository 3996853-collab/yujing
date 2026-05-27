'use client';

import React, { useState } from 'react';
import { useRuleStore, TemplateData } from '../../store/ruleStore';
import { Sparkles, Brain, Cpu, FileCheck, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentInputBar() {
  const aiInput = useRuleStore((state) => state.aiInput);
  const setAiInput = useRuleStore((state) => state.setAiInput);
  const isDeepThinking = useRuleStore((state) => state.isDeepThinking);
  const setDeepThinking = useRuleStore((state) => state.setDeepThinking);
  const isThinking = useRuleStore((state) => state.isThinking);
  const triggerAiGenerate = useRuleStore((state) => state.triggerAiGenerate);
  const recommendedTemplate = useRuleStore((state) => state.recommendedTemplate);
  const setRecommendedTemplate = useRuleStore((state) => state.setRecommendedTemplate);
  const applyTemplate = useRuleStore((state) => state.applyTemplate);

  // Fill-in-the-blank modal states inside canvas view
  const [showFormModal, setShowFormModal] = useState(false);
  const [province, setProvince] = useState('浙江');
  const [stage, setStage] = useState('中心发车');
  const [threshold, setThreshold] = useState(240);
  const [channel, setChannel] = useState('钉钉工作通知');
  const [isApplied, setIsApplied] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerAiGenerate();
    }
  };

  const handleOpenForm = () => {
    if (!recommendedTemplate) return;
    setProvince(recommendedTemplate.slots.province);
    setStage(recommendedTemplate.slots.stage);
    setThreshold(recommendedTemplate.slots.threshold);
    setChannel(recommendedTemplate.slots.channel);
    setShowFormModal(true);
  };

  const handleApplyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recommendedTemplate) return;

    applyTemplate(recommendedTemplate.id, {
      province,
      stage,
      threshold,
      channel
    });

    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
      setShowFormModal(false);
      setRecommendedTemplate(null);
    }, 1500);
  };

  return (
    <div className="w-full bg-[#12192d]/85 rounded-xl p-4 border border-gray-900 shadow-2xl relative">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-950/40 text-brand-indigo">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-bold text-gray-200">AI 预警规则构建助手</span>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的业务诉求, 如: 监控上海到杭州冷链车,如果首中心发车超时2小时,或者计重相对误差大于5%，立刻报警。"
            disabled={isThinking}
            className="w-full min-h-[64px] max-h-[120px] bg-gray-950 border border-gray-900 rounded-lg p-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo transition-all resize-none"
          />
          <div className="absolute right-2.5 bottom-2.5 text-[10px] text-gray-600">
            Shift + Enter 换行 | Enter 生成
          </div>
        </div>

        <div className="flex flex-col justify-between w-48 font-sans">
          {/* Toggles */}
          <div className="flex bg-gray-950 p-0.5 rounded-lg border border-gray-900">
            <button
              onClick={() => setDeepThinking(false)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-bold transition-all ${
                !isDeepThinking 
                  ? 'bg-gray-900 text-brand-indigo' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Cpu className="h-3 w-3" />
              快速模式
            </button>
            <button
              onClick={() => setDeepThinking(true)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-bold transition-all ${
                isDeepThinking 
                  ? 'bg-gray-900 text-brand-indigo shadow-sm' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Brain className="h-3 w-3" />
              深度思考
            </button>
          </div>

          {/* Action button */}
          <button
            onClick={triggerAiGenerate}
            disabled={isThinking || !aiInput.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isThinking ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                思考生成中...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                生成规则 (Enter)
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Recommendation Alert box */}
      <AnimatePresence>
        {recommendedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: 5, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 5, height: 0 }}
            className="mt-3 bg-brand-indigo/10 border border-brand-indigo/25 rounded-lg p-3 flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-2 text-gray-300">
              <FileCheck className="h-4 w-4 text-brand-indigo" />
              <span>
                💡 为您找到匹配度 <span className="font-bold text-brand-indigo">95%</span> 的官方模板《{recommendedTemplate.name}》
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRecommendedTemplate(null)}
                className="text-gray-500 hover:text-gray-300 px-2 py-1 text-[10px]"
              >
                忽略
              </button>
              <button
                onClick={handleOpenForm}
                className="bg-brand-indigo text-white text-[10px] font-bold py-1 px-3 rounded hover:bg-indigo-500 transition-all shadow-sm"
              >
                应用并配置
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fill-in Form Modal embedded in Canvas */}
      <AnimatePresence>
        {showFormModal && recommendedTemplate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-gray-950 border border-gray-850 rounded-xl p-5 shadow-2xl relative text-gray-300 font-sans"
            >
              <button 
                onClick={() => setShowFormModal(false)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="mb-4">
                <div className="text-[10px] text-brand-indigo font-bold uppercase tracking-wider mb-0.5">表单填空式配置 (Fill-in-the-blank)</div>
                <h3 className="text-sm font-bold text-gray-200">{recommendedTemplate.name}</h3>
              </div>

              <form onSubmit={handleApplyForm} className="space-y-6">
                <div className="bg-gray-900/40 p-4 rounded-xl border border-gray-900 text-xs text-gray-300 leading-8">
                  <span className="mr-1.5 font-medium">当</span>
                  
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

                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="bg-gray-950 border border-gray-800 rounded px-2 py-0.5 mx-1 text-brand-indigo font-bold focus:outline-none"
                  >
                    <option value="中心发车">中心发车</option>
                    <option value="首中心发车">首中心发车</option>
                    <option value="设备过磅">设备过磅</option>
                    <option value="冷链装车">冷链装车</option>
                  </select>
                  <span className="mx-1 font-medium">环节耗时超过</span>

                  <input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                    className="w-16 bg-gray-950 border border-gray-800 rounded px-1.5 py-0.5 mx-1 text-center text-brand-indigo font-bold focus:outline-none focus:border-brand-indigo text-xs"
                  />
                  <span className="mx-1 font-medium">分钟时，通过</span>

                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className="bg-gray-950 border border-gray-800 rounded px-2 py-0.5 mx-1 text-brand-indigo font-bold focus:outline-none"
                  >
                    <option value="钉钉工作通知">钉钉工作通知</option>
                    <option value="钉钉群机器人">钉钉群机器人</option>
                  </select>
                  <span className="ml-1 text-gray-300 font-medium">通知给第一责任人。</span>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="bg-gray-900 border border-gray-850 hover:bg-gray-850 text-gray-400 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                  >
                    取消
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
