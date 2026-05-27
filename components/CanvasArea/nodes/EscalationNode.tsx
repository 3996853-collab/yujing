'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useRuleStore } from '../../../store/ruleStore';

interface EscalationNodeProps {
  id: string;
  data: {
    label: string;
    targetRole?: string;
    thresholdValue?: number;
    receivers?: string[];
  };
}

export default function EscalationNode({ id, data }: EscalationNodeProps) {
  const updateNodeData = useRuleStore((state) => state.updateNodeData);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    updateNodeData(id, { thresholdValue: val });
  };

  const defaultReceivers = data.receivers || ['当班现场主管', '省区调度负责人', '总部时效风控大群'];

  return (
    <div className="relative w-68 rounded-xl border border-neon-pink/30 bg-dark-card p-4 shadow-xl backdrop-blur-xl">
      {/* Top indicator glow bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-neon-pink" />
      
      {/* Target connection point */}
      <Handle
        type="target"
        position={Position.Top}
        id="t"
        className="!bg-neon-pink"
      />

      <div className="flex items-center gap-3 border-b border-gray-800 pb-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-pink/10 text-neon-pink">
          <ShieldAlert className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neon-pink/80">Action Flow (动作流转)</div>
          <div className="text-sm font-semibold text-gray-200">{data.label || '组织架构阶梯升级'}</div>
        </div>
      </div>
      
      {/* Core parameters exposed to business user */}
      <div className="space-y-3 text-xs">
        <div className="space-y-1.5">
          <div className="text-gray-400 font-medium">推送链路矩阵 (Escalation Path):</div>
          <div className="space-y-1 bg-gray-950/60 p-2 rounded border border-gray-900">
            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="text-[10px] font-bold bg-neon-emerald/20 text-neon-emerald px-1 rounded">T0</span>
              <ArrowRight className="h-3 w-3 text-gray-500" />
              <span>钉钉推送: {defaultReceivers[0]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="text-[10px] font-bold bg-neon-orange/20 text-neon-orange px-1 rounded">T+2</span>
              <ArrowRight className="h-3 w-3 text-gray-500" />
              <span>阶梯督办: {defaultReceivers[1]}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-300">
              <span className="text-[10px] font-bold bg-neon-red/20 text-neon-red px-1 rounded">T+6</span>
              <ArrowRight className="h-3 w-3 text-gray-500" />
              <span>极限告警: {defaultReceivers[2]}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-300 pt-1">
          <span>延迟触发限时:</span>
          <input 
            type="number"
            value={data.thresholdValue ?? 6}
            onChange={handleHoursChange}
            className="w-12 bg-gray-900 border border-gray-700 rounded px-1 py-0.5 text-center text-xs text-neon-pink font-semibold focus:outline-none focus:border-neon-pink"
          />
          <span>小时未核销</span>
        </div>
      </div>

      {/* Source connection point (if any other actions follow) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="s"
        className="!bg-neon-pink"
      />
    </div>
  );
}
