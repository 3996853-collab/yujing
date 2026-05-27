'use client';

import React from 'react';
import { AlertEvent, useRuleStore } from '../../store/ruleStore';
import { Clock, HelpCircle, User, Bell, ChevronRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlertCardProps {
  alert: AlertEvent;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const triggerDingTalkUrge = useRuleStore((state) => state.triggerDingTalkUrge);

  // Format countdown seconds into [ HH : MM : SS ]
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h} : ${m} : ${s}`;
  };

  const isClosing = alert.status === 'closing';

  // PRD Color Bands:
  // - Orange for Initial T0 (即将升级)
  // - Red for Escalated T+2 (严重超时)
  // - Black for Extreme T+6 (极限告警)
  const getSeverityStyle = () => {
    if (isClosing) {
      return {
        cardBorder: 'border-brand-emerald bg-brand-emerald/10 scale-[0.98]',
        badge: 'bg-brand-emerald/15 text-brand-emerald border-brand-emerald/20',
        badgeLabel: '✅ 异常已消除',
        timerText: 'text-brand-emerald',
        barColor: 'bg-brand-emerald'
      };
    }

    switch (alert.type) {
      case 'weighing': // ORANGE
        return {
          cardBorder: 'border-alert-orange/30 bg-dark-card hover:border-alert-orange/50 glow-pulse-orange',
          badge: 'bg-alert-orange/15 text-alert-orange border-alert-orange/20',
          badgeLabel: '🟠 即将升级 - 省区处理中',
          timerText: 'text-alert-orange',
          barColor: 'bg-alert-orange'
        };
      case 'trajectory': // RED
        return {
          cardBorder: 'border-alert-red/30 bg-dark-card hover:border-alert-red/50 glow-pulse-red',
          badge: 'bg-alert-red/15 text-alert-red border-alert-red/20',
          badgeLabel: '🔴 严重超时 - 已上报总部',
          timerText: 'text-alert-red',
          barColor: 'bg-alert-red'
        };
      case 'extreme': // BLACK
      default:
        return {
          cardBorder: 'border-gray-800 bg-gray-950/80 hover:border-gray-700 glow-pulse-black',
          badge: 'bg-gray-900 text-gray-400 border-gray-800',
          badgeLabel: '⚫ 极危阶段 - 总部介入中',
          timerText: 'text-gray-400',
          barColor: 'bg-gray-850'
        };
    }
  };

  const style = getSeverityStyle();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, scale: 0.9, marginBottom: 0, padding: 0, border: 0 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className={`border rounded-xl p-4 shadow-lg backdrop-blur-xl relative transition-all duration-500 overflow-hidden ${style.cardBorder}`}
    >
      {/* Dynamic top color bar */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${style.barColor}`} />

      {/* Visual Flash overlay when closing */}
      {isClosing && (
        <div className="absolute inset-0 bg-brand-emerald/10 animate-pulse pointer-events-none" />
      )}

      {/* Header Badge */}
      <div className="flex items-center justify-between mb-3 border-b border-gray-900/60 pb-2 mt-1">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${style.badge} tracking-wide`}>
          {style.badgeLabel}
        </span>
        <span className="text-[10px] text-gray-500 font-mono">#{alert.id}</span>
      </div>

      {/* Primary Details */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">
            {alert.type === 'trajectory' ? '运单：' : alert.type === 'weighing' ? '设备：' : '受控实体：'}
          </span>
          <span className="text-xs font-bold text-gray-300 font-mono">{alert.waybill}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">异常指标：</span>
          <span className={`text-xs font-bold ${style.timerText}`}>
            {alert.anomalyName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">节点信息：</span>
          <span className="text-xs text-gray-300 font-medium">{alert.nodeDetail}</span>
        </div>
      </div>

      {/* Countdown Timer Area */}
      <div className="bg-gray-950/90 border border-gray-900/60 rounded-lg p-2.5 mb-4 text-center">
        <div className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold mb-1">
          {alert.type === 'extreme' ? '⏳ 警报存续时长' : alert.type === 'trajectory' ? '⏳ 距离最高级断崖还剩' : '⏳ 距离通报总部还剩'}
        </div>
        <div className={`text-lg font-bold font-mono tracking-widest ${style.timerText}`}>
          [ {formatTime(alert.timeLeft)} ]
        </div>
      </div>

      {/* Implicit Action Target */}
      <div className="border-t border-gray-900/60 pt-3 mb-4 text-xs">
        <div className="text-gray-500 font-medium mb-1">物理闭环核销条件：</div>
        <div className="text-gray-300 bg-gray-900/30 p-2 rounded border border-gray-900 font-mono leading-relaxed text-[10px]">
          {alert.expectedAction}
        </div>
      </div>

      {/* Dynamic Actions */}
      <div className="flex gap-2">
        <button className="flex-1 bg-gray-900 hover:bg-gray-850 border border-gray-850 text-[10px] font-bold py-1.5 rounded text-gray-400 transition-colors flex items-center justify-center gap-1">
          <HelpCircle className="h-3.5 w-3.5" />
          {alert.type === 'trajectory' ? '轨迹溯源' : '诊断报告'}
        </button>
        
        <button 
          onClick={() => triggerDingTalkUrge(alert.id)}
          className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all flex items-center justify-center gap-1 ${
            alert.dingTalkStatus?.includes('已催办')
              ? 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20 cursor-default'
              : 'bg-brand-indigo/10 hover:bg-brand-indigo/20 border border-brand-indigo/20 text-brand-indigo'
          }`}
        >
          {alert.dingTalkStatus?.includes('已催办') ? (
            <>
              <Check className="h-3.5 w-3.5" />
              已催办
            </>
          ) : (
            <>
              <Bell className="h-3.5 w-3.5" />
              {alert.type === 'trajectory' ? '钉钉催办省区' : '一键推流现场'}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
