'use client';

import React from 'react';
import { useRuleStore } from '../../store/ruleStore';
import { Brain, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThinkingProcess() {
  const thinkingSteps = useRuleStore((state) => state.thinkingSteps);
  const isThinking = useRuleStore((state) => state.isThinking);
  const isDeepThinking = useRuleStore((state) => state.isDeepThinking);

  if (!isDeepThinking || (thinkingSteps.length === 0 && !isThinking)) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full bg-gray-950/90 border border-indigo-950/60 rounded-xl p-4 shadow-xl overflow-hidden mt-3"
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-900">
        <Brain className="h-4 w-4 text-purple-400 animate-pulse" />
        <span className="text-xs font-bold text-gray-300">系统内置可视化面板 - 正在呈现思维拆解过程...</span>
        {isThinking && <Loader2 className="h-3 w-3 text-indigo-400 animate-spin ml-auto" />}
      </div>

      <div className="space-y-2.5 font-mono text-[11px]">
        <AnimatePresence>
          {thinkingSteps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2.5"
            >
              <div className="mt-0.5">
                {step.status === 'done' ? (
                  <CheckCircle className="h-3.5 w-3.5 text-neon-emerald" />
                ) : step.status === 'active' ? (
                  <Loader2 className="h-3.5 w-3.5 text-neon-purple animate-spin" />
                ) : (
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-800" />
                )}
              </div>
              <div className="flex-1">
                <span className="text-gray-500 mr-2">├──</span>
                <span className={
                  step.status === 'done' 
                    ? 'text-gray-400' 
                    : step.status === 'active' 
                      ? 'text-neon-purple font-bold' 
                      : 'text-gray-600'
                }>
                  {step.text}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isThinking && thinkingSteps.length === 0 && (
          <div className="text-gray-600 italic flex items-center gap-2 pl-6">
            <Loader2 className="h-3 w-3 animate-spin" />
            意图分析与数据实体对齐中...
          </div>
        )}
      </div>
    </motion.div>
  );
}
