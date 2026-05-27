'use client';

import React from 'react';
import { Users } from 'lucide-react';

interface ProfileStatsProps {
  vipCount: number;
  coldChainCount: number;
  total: number;
}

export default function ProfileStats({ vipCount, coldChainCount, total }: ProfileStatsProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
        <Users className="h-4 w-4 text-indigo-600" />
        <span>受影响客户类别构成</span>
      </h3>
      
      <div>
        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
          <span>VIP 高端时效客户 (特批追踪)</span>
          <span>{vipCount} 票 ({total > 0 ? Math.round((vipCount / total) * 100) : 0}%)</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-700" 
            style={{ width: `${total > 0 ? (vipCount / total) * 100 : 0}%` }} 
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
          <span>冷链特种控温包裹</span>
          <span>{coldChainCount} 票 ({total > 0 ? Math.round((coldChainCount / total) * 100) : 0}%)</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-700" 
            style={{ width: `${total > 0 ? (coldChainCount / total) * 100 : 0}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
