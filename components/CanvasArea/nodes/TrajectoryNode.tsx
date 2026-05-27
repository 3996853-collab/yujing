'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Clock } from 'lucide-react';
import { useRuleStore } from '../../../store/ruleStore';

interface TrajectoryNodeProps {
  id: string;
  data: {
    label: string;
    thresholdValue?: number;
    operator?: 'greater' | 'less' | 'equal';
    category?: string;
  };
}

export default function TrajectoryNode({ id, data }: TrajectoryNodeProps) {
  const updateNodeData = useRuleStore((state) => state.updateNodeData);

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    updateNodeData(id, { thresholdValue: val });
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(id, { operator: e.target.value as any });
  };

  return (
    <div className="relative w-64 rounded-xl border border-neon-purple/30 bg-dark-card p-4 shadow-xl backdrop-blur-xl">
      {/* Top indicator glow bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-neon-purple" />
      
      {/* Target connection point */}
      <Handle
        type="target"
        position={Position.Top}
        id="t"
        className="!bg-neon-purple"
      />

      <div className="flex items-center gap-3 border-b border-gray-800 pb-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-purple/10 text-neon-purple">
          <Clock className="h-4 w-4" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neon-purple/80">Skill Check (时效校验)</div>
          <div className="text-sm font-semibold text-gray-200">{data.label || '校验全链路轨迹停滞'}</div>
        </div>
      </div>
      
      {/* Core parameters exposed to business user */}
      <div className="space-y-2 text-xs">
        {data.category && (
          <div className="flex items-center justify-between text-gray-400">
            <span>应用场景:</span>
            <span className="font-medium text-gray-300">{data.category}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-300">
          <span>环节耗时:</span>
          <select 
            value={data.operator || 'greater'}
            onChange={handleOperatorChange}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-1 py-0.5 text-xs text-gray-200 focus:outline-none focus:border-neon-purple"
          >
            <option value="greater">大于 (&gt;)</option>
            <option value="less">小于 (&lt;)</option>
            <option value="equal">等于 (=)</option>
          </select>
          <input 
            type="number"
            value={data.thresholdValue ?? 2}
            onChange={handleThresholdChange}
            className="w-12 bg-gray-900 border border-gray-700 rounded px-1 py-0.5 text-center text-xs text-neon-purple font-semibold focus:outline-none focus:border-neon-purple"
          />
          <span>小时</span>
        </div>
      </div>

      {/* Source connection point */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="s"
        className="!bg-neon-purple"
      />
    </div>
  );
}
