'use client';

import React, { useState, useEffect } from 'react';
import { useRuleStore } from '../../store/ruleStore';
import AlertCard from './AlertCard';
import { AnimatePresence, motion } from 'framer-motion';
import { Shield, Eye, Layers, Filter } from 'lucide-react';

export default function LivingWaterDashboard() {
  const alerts = useRuleStore((state) => state.alerts);
  const decrementAlertCountdowns = useRuleStore((state) => state.decrementAlertCountdowns);
  
  const [perspective, setPerspective] = useState<'hq' | 'province'>('hq');
  const [anomalyFilter, setAnomalyFilter] = useState('all');
  const [provinceFilter, setProvinceFilter] = useState('all');
  const [countdownFilter, setCountdownFilter] = useState('all');

  // Trigger countdown timer decrements every second
  useEffect(() => {
    const timer = setInterval(() => {
      decrementAlertCountdowns();
    }, 1000);
    return () => clearInterval(timer);
  }, [decrementAlertCountdowns]);

  // Statistics
  const activeAlertsCount = alerts.filter(a => a.status === 'active').length;
  const severeAlertsCount = alerts.filter(a => (a.type === 'trajectory' || a.type === 'extreme') && a.status === 'active').length;
  const deviationAlertsCount = alerts.filter(a => a.type === 'weighing' && a.status === 'active').length;

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (anomalyFilter !== 'all' && alert.type !== anomalyFilter) return false;
    if (provinceFilter !== 'all') {
      if (provinceFilter === 'sh' && !alert.nodeDetail.includes('上海') && !alert.waybill.includes('SH')) return false;
      if (provinceFilter === 'hz' && !alert.nodeDetail.includes('杭州')) return false;
    }
    if (countdownFilter !== 'all') {
      if (countdownFilter === 'under_15m' && alert.timeLeft >= 900) return false;
      if (countdownFilter === 'over_15m' && alert.timeLeft < 900) return false;
    }
    return true;
  });

  // Sort: force descending by timeLeft
  const sortedAlerts = [...filteredAlerts].sort((a, b) => a.timeLeft - b.timeLeft);

  // Group alerts: Trajectory (Red) and Extreme (Black) into HQ column; Weighing (Orange) into Province column
  const hqAlerts = sortedAlerts.filter(a => a.type === 'trajectory' || a.type === 'extreme');
  const provinceAlerts = sortedAlerts.filter(a => a.type === 'weighing');

  return (
    <div className="flex flex-col h-full bg-dark-bg p-6 text-gray-200 overflow-y-auto">
      {/* Top Filter and Perspective Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-5 border-b border-gray-900">
        <div>
          <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-alert-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-alert-red"></span>
            </span>
            <span>“活水池”全链路活跃预警看板 (PC/大屏端)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">源头核销，静默关闭，警报闪烁折叠消失</p>
        </div>

        {/* Toggle Perspective */}
        <div className="flex bg-gray-950 p-1 rounded-lg border border-gray-900">
          <button
            onClick={() => setPerspective('hq')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              perspective === 'hq'
                ? 'bg-brand-indigo text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Shield className="h-3.5 w-3.5" />
            🏢 总部全盘视角
          </button>
          <button
            onClick={() => setPerspective('province')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
              perspective === 'province'
                ? 'bg-brand-indigo text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            📍 省区级视角
          </button>
        </div>
      </div>

      {/* KPI Overviews bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-950/60 border border-gray-900 p-4 rounded-xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold">
            {activeAlertsCount}
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">当前全网活跃预警</div>
            <div className="text-lg font-bold text-gray-200">{activeAlertsCount} 条</div>
          </div>
        </div>

        <div className="bg-gray-950/60 border border-gray-900 p-4 rounded-xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-alert-red/10 text-alert-red flex items-center justify-center font-bold">
            {severeAlertsCount}
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">时效红线/极危警报</div>
            <div className="text-lg font-bold text-alert-red">{severeAlertsCount} 条</div>
          </div>
        </div>

        <div className="bg-gray-950/60 border border-gray-900 p-4 rounded-xl flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-alert-orange/10 text-alert-orange flex items-center justify-center font-bold">
            {deviationAlertsCount}
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium">设备误差高危</div>
            <div className="text-lg font-bold text-alert-orange">{deviationAlertsCount} 条</div>
          </div>
        </div>
      </div>

      {/* Dropdown Filters toolbar */}
      <div className="bg-gray-950/40 border border-gray-900 p-3 rounded-lg flex flex-wrap items-center gap-3.5 mb-6 text-xs text-gray-400">
        <span className="flex items-center gap-1.5 text-gray-300 font-semibold">
          <Filter className="h-3.5 w-3.5 text-brand-indigo" />
          <span>全局过滤：</span>
        </span>
        
        <div className="flex items-center gap-1.5">
          <span>异常类型:</span>
          <select 
            value={anomalyFilter}
            onChange={(e) => setAnomalyFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-brand-indigo"
          >
            <option value="all">全部类型</option>
            <option value="trajectory">时效延误类</option>
            <option value="weighing">设备精度类</option>
            <option value="extreme">极限极危类</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span>发生省区:</span>
          <select 
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-brand-indigo"
          >
            <option value="all">全网省区</option>
            <option value="sh">上海省区</option>
            <option value="hz">浙江省区</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span>倒计时状态:</span>
          <select 
            value={countdownFilter}
            onChange={(e) => setCountdownFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none focus:border-brand-indigo"
          >
            <option value="all">全部时区</option>
            <option value="under_15m">15分钟内临期</option>
            <option value="over_15m">15分钟外正常</option>
          </select>
        </div>
      </div>

      {/* Side by Side columns display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 items-start">
        {/* Column 1: Severe Upgrades */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-alert-red/30 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-alert-red flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-alert-red animate-pulse" />
              <span>🔴 升级与极危预警 - 总部风控监测 (时效/大促阻断)</span>
            </h3>
            <span className="text-[10px] bg-alert-red/10 text-alert-red px-1.5 py-0.2 rounded font-mono font-bold">
              {hqAlerts.length}
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {hqAlerts.length > 0 ? (
                hqAlerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 border border-dashed border-gray-850 rounded-xl text-gray-500 text-xs"
                >
                  🎉 全链路没有严重升级的时效或极危告警
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Column 2: Province Escalations */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-alert-orange/30 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-alert-orange flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-alert-orange animate-pulse" />
              <span>🟠 即将升级 - 省区调度管理 (设备相对精度高危)</span>
            </h3>
            <span className="text-[10px] bg-alert-orange/10 text-alert-orange px-1.5 py-0.2 rounded font-mono font-bold">
              {provinceAlerts.length}
            </span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {provinceAlerts.length > 0 ? (
                provinceAlerts.map(alert => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 border border-dashed border-gray-850 rounded-xl text-gray-500 text-xs"
                >
                  🎉 暂无即将升级的设备精度偏差预警
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
