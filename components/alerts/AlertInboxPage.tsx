'use client';

import React, { useState, useEffect } from 'react';
import AlertCard from './AlertCard';
import AlertDetail from './AlertDetail';
import DrilldownPanel from '../drilldown/DrilldownPanel';
import { Activity, ShieldCheck } from 'lucide-react';

export interface AlertCardData {
  id: string;
  title: string;
  count: number;
  level: 'RED' | 'ORANGE' | 'YELLOW';
  duration: string;
  source: string;
  destination: string;
  vipCount: number;
  coldChainCount: number;
}

const initialAlerts: AlertCardData[] = [
  {
    id: '1',
    title: '上海仓库揽收即将超时预警',
    count: 85,
    level: 'RED',
    duration: '2小时15分',
    source: '上海仓',
    destination: '杭州分拨中心',
    vipCount: 30,
    coldChainCount: 25,
  },
  {
    id: '2',
    title: '杭州分拨中心-干线运输延误',
    count: 42,
    level: 'ORANGE',
    duration: '1小时30分',
    source: '杭州分拨中心',
    destination: '北京朝阳分拨',
    vipCount: 12,
    coldChainCount: 15,
  },
  {
    id: '3',
    title: '苏州仓-波次生成延迟',
    count: 23,
    level: 'YELLOW',
    duration: '45分钟',
    source: '苏州仓',
    destination: '上海青浦仓',
    vipCount: 5,
    coldChainCount: 2,
  },
  {
    id: '4',
    title: '南京末端网点-派送超时',
    count: 67,
    level: 'ORANGE',
    duration: '3小时20分',
    source: '南京末端网点',
    destination: '秦淮网点辖区',
    vipCount: 20,
    coldChainCount: 8,
  },
];

export default function AlertInboxPage() {
  const [alerts, setAlerts] = useState<AlertCardData[]>(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<AlertCardData | null>(null);
  const [fadingId, setFadingId] = useState<string | null>(null);

  // Dynamic simulation timer (decrementing count of the first card every 3s)
  useEffect(() => {
    const timer = setInterval(() => {
      setAlerts((prevAlerts) => {
        if (prevAlerts.length === 0) return prevAlerts;
        
        // Find first card with count > 0 to decrement
        const targetIndex = prevAlerts.findIndex(a => a.count > 0);
        if (targetIndex === -1) return prevAlerts;

        const updated = [...prevAlerts];
        const nextCount = Math.max(0, updated[targetIndex].count - 5);
        updated[targetIndex] = {
          ...updated[targetIndex],
          count: nextCount,
        };

        // If count becomes 0, initiate fade-out animation and then remove
        if (nextCount === 0) {
          const finishedId = updated[targetIndex].id;
          setFadingId(finishedId);
          setTimeout(() => {
            setAlerts((latestAlerts) => {
              const filtered = latestAlerts.filter((a) => a.id !== finishedId);
              // Clear selection if deleted
              setSelectedAlert((currSelected) => 
                currSelected?.id === finishedId ? null : currSelected
              );
              return filtered;
            });
            setFadingId(null);
          }, 600); // match duration of fade animation
        }

        // Update the selected details view in real-time if active
        setSelectedAlert((currSelected) => {
          if (currSelected && currSelected.id === updated[targetIndex].id) {
            return updated[targetIndex];
          }
          return currSelected;
        });

        return updated;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const totalWarnings = alerts.reduce((acc, curr) => acc + curr.count, 0);
  const redWarnings = alerts.filter((a) => a.level === 'RED').reduce((acc, curr) => acc + curr.count, 0);
  const orangeWarnings = alerts.filter((a) => a.level === 'ORANGE').reduce((acc, curr) => acc + curr.count, 0);
  const yellowWarnings = alerts.filter((a) => a.level === 'YELLOW').reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="flex h-full w-full bg-[#f8f9fa] text-gray-800">
      {/* Left side (35% width) - Aggregated warning list */}
      <div className="w-[35%] border-r border-gray-200 bg-white flex flex-col h-full shadow-sm">
        <div className="p-5 border-b border-gray-100 bg-[#fbfcfd]">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            <span>聚合预警收件箱</span>
          </h2>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-semibold text-gray-500">自动实时隐性核销中</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {alerts.length} 个活跃聚合层
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <ShieldCheck className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-sm font-medium">暂无未核销预警</p>
              <p className="text-xs text-gray-400 mt-1">底层包裹流转已完成全部隐性自动核销</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                isSelected={selectedAlert?.id === alert.id}
                isFading={fadingId === alert.id}
                onClick={() => setSelectedAlert(alert)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right side (65% width) - Dashboard or Detail Panel */}
      <div className="w-[65%] h-full bg-[#f8f9fa] flex flex-col overflow-hidden">
        {selectedAlert ? (
          <DrilldownPanel alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
        ) : (
          <AlertDetail 
            totalWarnings={totalWarnings}
            redWarnings={redWarnings}
            orangeWarnings={orangeWarnings}
            yellowWarnings={yellowWarnings}
          />
        )}
      </div>
    </div>
  );
}
