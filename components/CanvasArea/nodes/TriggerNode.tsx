'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play } from 'lucide-react';

interface TriggerNodeProps {
  data: {
    label: string;
  };
}

export default function TriggerNode({ data }: TriggerNodeProps) {
  return (
    <div className="relative w-64 rounded-xl border border-neon-emerald/30 bg-dark-card p-4 shadow-xl backdrop-blur-xl">
      {/* Top indicator glow bar */}
      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-neon-emerald" />
      
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-emerald/10 text-neon-emerald">
          <Play className="h-4 w-4 fill-neon-emerald/20" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-neon-emerald/80">Trigger (触发)</div>
          <div className="text-sm font-medium text-gray-200">{data.label || '订单状态变更/设备上报'}</div>
        </div>
      </div>
      
      {/* Source port for connection */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="!bg-neon-emerald"
      />
    </div>
  );
}
