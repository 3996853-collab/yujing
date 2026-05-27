'use client';

import React from 'react';
import { Settings } from 'lucide-react';

interface MappingItem {
  id: string;
  physicalName: string;
  type: string;
  semanticName: string;
  role: 'Dimension' | 'Metric' | 'Attribute';
}

interface SemanticTableProps {
  mappings: MappingItem[];
  handleSemanticNameChange: (id: string, val: string) => void;
  handleRoleChange: (id: string, val: 'Dimension' | 'Metric' | 'Attribute') => void;
  onConfigureDict: (physicalName: string) => void;
}

export default function SemanticTable({
  mappings,
  handleSemanticNameChange,
  handleRoleChange,
  onConfigureDict,
}: SemanticTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#fcfdfe] text-[11px] font-extrabold text-gray-500 border-b border-gray-155 uppercase tracking-wider">
            <th className="py-4 px-6 w-1/4">物理字段名</th>
            <th className="py-4 px-6 w-1/6">字段类型</th>
            <th className="py-4 px-6 w-1/4">业务语义名</th>
            <th className="py-4 px-6 w-1/6">业务角色</th>
            <th className="py-4 px-6 w-1/6 text-right">字典枚举值</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-xs">
          {mappings.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
              <td className="py-4 px-6 font-mono font-bold text-gray-900">{item.physicalName}</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200/50">
                  {item.type}
                </span>
              </td>
              <td className="py-4 px-6">
                <input
                  type="text"
                  value={item.semanticName}
                  onChange={(e) => handleSemanticNameChange(item.id, e.target.value)}
                  placeholder="自定义描述"
                  className="w-full bg-gray-55/60 hover:bg-gray-100 focus:bg-white border-b-2 border-transparent focus:border-indigo-600 rounded px-2.5 py-1.5 text-xs font-semibold text-gray-800 transition-all outline-none"
                />
              </td>
              <td className="py-4 px-6">
                <select
                  value={item.role}
                  onChange={(e) => handleRoleChange(item.id, e.target.value as any)}
                  className="bg-gray-55/60 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-700 outline-none focus:border-indigo-500"
                >
                  <option value="Dimension">维度 (Dimension)</option>
                  <option value="Metric">指标 (Metric)</option>
                  <option value="Attribute">属性 (Attribute)</option>
                </select>
              </td>
              <td className="py-4 px-6 text-right">
                {item.role === 'Dimension' ? (
                  <button
                    type="button"
                    onClick={() => onConfigureDict(item.physicalName)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all"
                  >
                    <Settings className="h-3 w-3" />
                    <span>配置字典</span>
                  </button>
                ) : (
                  <span className="text-gray-400 text-[10px] pr-4">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
