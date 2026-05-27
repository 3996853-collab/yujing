'use client';

import React from 'react';
import { AlertCardData } from './AlertInboxPage';

interface AlertCardProps {
  alert: AlertCardData;
  isSelected: boolean;
  isFading: boolean;
  onClick: () => void;
}

export default function AlertCard({ alert, isSelected, isFading, onClick }: AlertCardProps) {
  let badgeColor = 'bg-yellow-50 text-yellow-700 border-yellow-200';
  if (alert.level === 'RED') badgeColor = 'bg-red-50 text-red-700 border-red-200';
  if (alert.level === 'ORANGE') badgeColor = 'bg-orange-50 text-orange-700 border-orange-200';

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden select-none hover:shadow-md ${
        isSelected 
          ? 'border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/20' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      } ${isFading ? 'opacity-0 scale-95 translate-x-[-10px] duration-500' : 'opacity-100'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
          {alert.level} 预警
        </span>
        <span className="text-[11px] text-gray-500 font-medium">
          持续: {alert.duration}
        </span>
      </div>
      
      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
        {alert.title}
      </h3>

      <div className="flex justify-between items-end mt-4">
        <div className="text-xs text-gray-400 font-medium">
          下级单据智能跟踪中...
        </div>
        <div className="text-right">
          <span className="text-3xl font-extrabold text-gray-900 font-mono tracking-tight">
            {alert.count}
          </span>
          <span className="text-xs text-gray-500 font-medium ml-1">票</span>
        </div>
      </div>
    </div>
  );
}
