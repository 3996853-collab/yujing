'use client';

import React, { useState, useEffect } from 'react';
import { useRuleStore, SkillCardData, AlertEvent } from '../../store/ruleStore';
import { 
  Settings, 
  Database, 
  Bell, 
  Users, 
  CheckCircle, 
  RefreshCw, 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  Play, 
  Terminal,
  Activity,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RuleConfigConsole() {
  const selectedSkillId = useRuleStore((state) => state.selectedSkillId);
  const skills = useRuleStore((state) => state.skillsLibrary);
  const updateSkill = useRuleStore((state) => state.updateSkill);
  
  // To inject a simulated alert when user deploys rule
  const alerts = useRuleStore((state) => state.alerts);
  
  const skill = skills.find(s => s.id === selectedSkillId);
  
  // Steps in configuration
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form local states - sync with selected skill
  const [thresholdVal, setThresholdVal] = useState<number>(0);
  const [durationVal, setDurationVal] = useState<number>(0);
  const [eventSource, setEventSource] = useState('');
  const [originSystem, setOriginSystem] = useState('');
  const [checkField, setCheckField] = useState('');
  const [t0Enabled, setT0Enabled] = useState(true);
  const [t0Channel, setT0Channel] = useState('');
  const [t0Receiver, setT0Receiver] = useState('');
  const [t2Enabled, setT2Enabled] = useState(true);
  const [t2Hours, setT2Hours] = useState(2);
  const [t2Channel, setT2Channel] = useState('');
  const [t2Receiver, setT2Receiver] = useState('');
  const [t6Enabled, setT6Enabled] = useState(true);
  const [t6Hours, setT6Hours] = useState(6);
  const [t6Channel, setT6Channel] = useState('');
  const [t6Receiver, setT6Receiver] = useState('');

  useEffect(() => {
    if (skill) {
      setThresholdVal(Number(skill.fields?.threshold || skill.defaultData?.thresholdValue || 0));
      setDurationVal(Number(skill.fields?.duration || 10));
      setEventSource(skill.eventSource || 'TMS_REFRIGERATION_RESET');
      setOriginSystem(skill.originSystem || 'TMS (运输管理系统)');
      setCheckField(skill.checkField || 'temp <= 8.0');
      setT0Enabled(skill.escalationT0?.enabled ?? true);
      setT0Channel(skill.escalationT0?.channel || '钉钉群机器人');
      setT0Receiver(skill.escalationT0?.receiver || '[curr_vehicle_no] => 随车司机与当班调度');
      setT2Enabled(skill.escalationT2?.enabled ?? true);
      setT2Hours(skill.escalationT2?.delayHours ?? 2);
      setT2Channel(skill.escalationT2?.channel || '钉钉工作通知');
      setT2Receiver(skill.escalationT2?.receiver || '[send_prov_name] => 省区业务线主管');
      setT6Enabled(skill.escalationT6?.enabled ?? true);
      setT6Hours(skill.escalationT6?.delayHours ?? 6);
      setT6Channel(skill.escalationT6?.channel || '钉钉工作通知');
      setT6Receiver(skill.escalationT6?.receiver || '总部安全与时效控制中心');
    }
  }, [selectedSkillId, skill]);

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-dark-bg">
        <div className="h-16 w-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 mb-4 animate-pulse">
          <Activity className="h-8 w-8" />
        </div>
        <h3 className="text-sm font-bold text-gray-400">未选择或未加载任何预警场景</h3>
        <p className="text-xs text-gray-600 mt-2 max-w-sm">
          请在左侧“业务预警技能库”中点击一个具体的预警项，或者通过顶部的 AI 助理生成场景规则来进行配置。
        </p>
      </div>
    );
  }

  // Handle input changes and sync back to Zustand store immediately
  const handleThresholdChange = (val: number) => {
    setThresholdVal(val);
    updateSkill(skill.id, {
      fields: { ...skill.fields, threshold: val }
    });
  };

  const handleDurationChange = (val: number) => {
    setDurationVal(val);
    updateSkill(skill.id, {
      fields: { ...skill.fields, duration: val }
    });
  };

  const saveWorkflowDetails = () => {
    updateSkill(skill.id, {
      eventSource,
      originSystem,
      checkField,
      escalationT0: { enabled: t0Enabled, channel: t0Channel, receiver: t0Receiver },
      escalationT2: { enabled: t2Enabled, delayHours: t2Hours, channel: t2Channel, receiver: t2Receiver },
      escalationT6: { enabled: t6Enabled, delayHours: t6Hours, channel: t6Channel, receiver: t6Receiver }
    });
  };

  // Compile and Deploy pipeline simulation
  const handleDeploy = () => {
    setIsDeploying(true);
    setDeployStep(0);
    saveWorkflowDetails();

    const steps = [
      '解析 ClickHouse 关联库表 Schema 与对齐字段对...',
      '注册 Kafka Stream 物理事件监听 topic 并编译表达式...',
      '连接钉钉推送接口，生成降噪升级路由策略...',
      '注入隐性物理闭环动作监听器与回源判定触发器...',
      '规则激活上线成功！进入实时流量计算监控状态。'
    ];

    const runDeployStep = (idx: number) => {
      if (idx < steps.length) {
        setDeployStep(idx);
        setTimeout(() => runDeployStep(idx + 1), 600);
      } else {
        setIsDeploying(false);
        setShowSuccess(true);
        
        // Inject a simulated new alert to show it works!
        const randomWaybill = `ZTO-SH-${Math.floor(10000 + Math.random() * 90000)}`;
        const newAlert: AlertEvent = {
          id: `ALERT-${Math.floor(100 + Math.random() * 900)}`,
          waybill: randomWaybill,
          type: skill.category === 'Quality-Safety' ? 'trajectory' : skill.category === 'Equipment-System' ? 'weighing' : 'extreme',
          anomalyName: `${skill.name}触发 (阈值: ${thresholdVal})`,
          nodeDetail: '华东枢纽分拨中心',
          timeLeft: (skill.category === 'Quality-Safety' ? 120 : 360) * 60,
          expectedAction: `等待回源系统 [${originSystem}] 接收 [${eventSource}] 静默核销事件`,
          status: 'active',
          dingTalkStatus: '⏳ 倒计时中'
        };
        
        // Add to store's alerts array
        useRuleStore.setState({
          alerts: [newAlert, ...alerts]
        });

        setTimeout(() => setShowSuccess(false), 2500);
      }
    };

    runDeployStep(0);
  };

  const stepsLabel = [
    { id: 1, name: '红线与阈值配置' },
    { id: 2, name: '物理闭环隐性核销' },
    { id: 3, name: '推送与升级路由' }
  ];

  return (
    <div className="flex w-full h-full bg-dark-bg text-gray-200">
      
      {/* LEFT: Configuration Wizard Form (60%) */}
      <div className="w-[60%] border-r border-gray-900 flex flex-col justify-between overflow-y-auto">
        <div className="p-5 space-y-6">
          
          {/* Title & Description */}
          <div className="pb-4 border-b border-gray-900">
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
              场景规则配置台 / 极简工作流模式
            </span>
            <h2 className="text-base font-extrabold text-gray-100 flex items-center gap-2 mt-1">
              <span>🛠️ {skill.name}</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              {skill.description}
            </p>
          </div>

          {/* Stepper Wizard Indicator */}
          <div className="flex justify-between items-center bg-gray-950/40 p-2.5 rounded-lg border border-gray-900">
            {stepsLabel.map((s) => (
              <button
                key={s.id}
                onClick={() => { saveWorkflowDetails(); setActiveStep(s.id as any); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all ${
                  activeStep === s.id
                    ? 'bg-indigo-600 font-bold text-white shadow'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] ${
                  activeStep >= s.id ? 'bg-indigo-900/50 text-indigo-300' : 'bg-gray-900 text-gray-500'
                }`}>
                  {s.id}
                </span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>

          {/* Step 1: Redline & Threshold values */}
          {activeStep === 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-xs"
            >
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Settings className="h-3.5 w-3.5" />
                <span>设定触发拦截红线 (Trigger Thresholds)</span>
              </div>

              <div className="bg-gray-950/60 border border-gray-900 p-4 rounded-xl space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">
                      {skill.fieldsConfig.split(',')[0] || '校验触发红线值'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        value={thresholdVal}
                        onChange={(e) => handleThresholdChange(parseFloat(e.target.value) || 0)}
                        className="bg-gray-900 border border-gray-800 rounded px-2 py-1.5 text-xs text-indigo-400 font-bold w-full focus:outline-none focus:border-indigo-600"
                      />
                    </div>
                  </div>

                  {skill.fieldsConfig.split(',')[1] && (
                    <div>
                      <label className="block text-gray-400 font-bold mb-1">
                        {skill.fieldsConfig.split(',')[1].trim()}
                      </label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          value={durationVal}
                          onChange={(e) => handleDurationChange(parseFloat(e.target.value) || 0)}
                          className="bg-gray-900 border border-gray-800 rounded px-2 py-1.5 text-xs text-indigo-400 font-bold w-full focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 font-bold mb-1">数据源表绑定 (数仓拉取)</label>
                  <select className="bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-gray-300 w-full focus:outline-none">
                    <option>logistics_dw.dwt_cold_chain_wide_di (首中心时效冷链大宽表)</option>
                    <option>logistics_dw.dws_device_weighing_status_hi (设备指标监控表)</option>
                    <option>logistics_dw.dwt_waybill_tracking_wide (轨迹主表)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-lg flex items-start gap-2 text-indigo-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed">
                  系统会自动在 Kafka Event Streams 中订阅此数据源，并通过流计算引擎根据红线设定进行秒级比对。
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Verification closed-loop details */}
          {activeStep === 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-xs"
            >
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Database className="h-3.5 w-3.5" />
                <span>物理动作静默闭环核销 (Implicit Quiet Resolution)</span>
              </div>

              <p className="text-gray-500 leading-relaxed text-[11px]">
                控制塔坚守“绝对真实的源头物理闭环”。系统严禁手动结案，必须监听物理作业动作的 Kafka 流（如 TMS 重新发车、设备二次标定）进行静默核销。
              </p>

              <div className="bg-gray-950/60 border border-gray-900 p-4 rounded-xl space-y-4">
                <div>
                  <label className="block text-gray-400 font-bold mb-1">回源物理动作 Kafka Event Source</label>
                  <input 
                    type="text"
                    value={eventSource}
                    onChange={(e) => setEventSource(e.target.value)}
                    placeholder="如：TMS_VEHICLE_DEPART"
                    className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-xs font-mono text-indigo-400 focus:outline-none focus:border-indigo-600"
                  />
                  <p className="text-[9px] text-gray-500 mt-1">监听的 Kafka Topic 包含具体的物理补录指令流</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">物理动作录入源头系统</label>
                    <input 
                      type="text"
                      value={originSystem}
                      onChange={(e) => setOriginSystem(e.target.value)}
                      placeholder="如：TMS (运输管理系统)"
                      className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-xs focus:outline-none focus:border-indigo-600 text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 font-bold mb-1">判定消警核销字段条件</label>
                    <input 
                      type="text"
                      value={checkField}
                      onChange={(e) => setCheckField(e.target.value)}
                      placeholder="如：status == 'DEPARTED'"
                      className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-xs font-mono text-indigo-400 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Notification channels & Escalation routes */}
          {activeStep === 3 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 text-xs"
            >
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                <Bell className="h-3.5 w-3.5" />
                <span>报警推送与阶梯升级通道 (Escalation Path Router)</span>
              </div>

              <div className="space-y-3.5">
                {/* T0 Initial */}
                <div className="bg-gray-950/60 border border-gray-900 p-3 rounded-xl flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={t0Enabled} 
                    onChange={(e) => setT0Enabled(e.target.checked)}
                    className="rounded bg-gray-900 border-gray-800 text-indigo-600 mt-1 focus:ring-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-900/30 px-1.5 py-0.2 rounded uppercase">
                        T0 初次核销派发
                      </span>
                      <span className="text-gray-400 font-bold">即时触发拦截</span>
                    </div>
                    {t0Enabled && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <select 
                          value={t0Channel} 
                          onChange={(e) => setT0Channel(e.target.value)}
                          className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none"
                        >
                          <option>钉钉群机器人</option>
                          <option>钉钉工作通知</option>
                          <option>企业邮件</option>
                        </select>
                        <input 
                          type="text"
                          value={t0Receiver}
                          onChange={(e) => setT0Receiver(e.target.value)}
                          placeholder="路由接收人"
                          className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* T+2 Escalation */}
                <div className="bg-gray-950/60 border border-gray-900 p-3 rounded-xl flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={t2Enabled} 
                    onChange={(e) => setT2Enabled(e.target.checked)}
                    className="rounded bg-gray-900 border-gray-800 text-indigo-600 mt-1 focus:ring-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold bg-amber-950 text-amber-400 border border-amber-900/30 px-1.5 py-0.2 rounded uppercase">
                          T+2 省区升级督办
                        </span>
                        <span className="text-gray-400 font-bold">阶梯升级</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <span>未核销</span>
                        <input 
                          type="number" 
                          value={t2Hours} 
                          onChange={(e) => setT2Hours(parseFloat(e.target.value) || 0)}
                          className="w-10 bg-gray-900 border border-gray-800 text-center text-indigo-400 font-bold rounded focus:outline-none" 
                        />
                        <span>小时</span>
                      </div>
                    </div>
                    {t2Enabled && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <select 
                          value={t2Channel} 
                          onChange={(e) => setT2Channel(e.target.value)}
                          className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none"
                        >
                          <option>钉钉工作通知</option>
                          <option>钉钉群机器人</option>
                          <option>短信通知</option>
                        </select>
                        <input 
                          type="text"
                          value={t2Receiver}
                          onChange={(e) => setT2Receiver(e.target.value)}
                          placeholder="省区接口人"
                          className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* T+6 Headquarters warning */}
                <div className="bg-gray-950/60 border border-gray-900 p-3 rounded-xl flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={t6Enabled} 
                    onChange={(e) => setT6Enabled(e.target.checked)}
                    className="rounded bg-gray-900 border-gray-800 text-indigo-600 mt-1 focus:ring-0"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-extrabold bg-rose-950 text-rose-400 border border-rose-900/30 px-1.5 py-0.2 rounded uppercase">
                          T+6 总部大屏极限警告
                        </span>
                        <span className="text-gray-400 font-bold">最终红线</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <span>未核销</span>
                        <input 
                          type="number" 
                          value={t6Hours} 
                          onChange={(e) => setT6Hours(parseFloat(e.target.value) || 0)}
                          className="w-10 bg-gray-900 border border-gray-800 text-center text-indigo-400 font-bold rounded focus:outline-none" 
                        />
                        <span>小时</span>
                      </div>
                    </div>
                    {t6Enabled && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <select 
                          value={t6Channel} 
                          onChange={(e) => setT6Channel(e.target.value)}
                          className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-300 focus:outline-none"
                        >
                          <option>钉钉工作通知</option>
                          <option>钉钉群机器人</option>
                          <option>报警声呐</option>
                        </select>
                        <input 
                          type="text"
                          value={t6Receiver}
                          onChange={(e) => setT6Receiver(e.target.value)}
                          placeholder="总部决策人"
                          className="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-xs text-gray-200 focus:outline-none focus:border-indigo-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Compile / Deploy Footer Area */}
        <div className="p-4 bg-gray-950/90 border-t border-gray-900 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                saveWorkflowDetails();
                setActiveStep(prev => prev > 1 ? (prev - 1 as any) : 1);
              }}
              disabled={activeStep === 1}
              className="px-3 py-2 text-xs bg-gray-900 hover:bg-gray-800 border border-gray-850 rounded text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              上一步
            </button>
            <button
              onClick={() => {
                saveWorkflowDetails();
                setActiveStep(prev => prev < 3 ? (prev + 1 as any) : 3);
              }}
              disabled={activeStep === 3}
              className="px-3 py-2 text-xs bg-gray-900 hover:bg-gray-800 border border-gray-850 rounded text-gray-400 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              下一步
            </button>
          </div>

          <button
            onClick={handleDeploy}
            disabled={isDeploying || showSuccess}
            className={`px-6 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
              showSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30'
            }`}
          >
            {showSuccess ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>运行中 & 实时拦截中</span>
              </>
            ) : isDeploying ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>绑定流计算中...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>编译部署并激活预警</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* RIGHT: Live Visual Pipeline Flow Preview (40%) */}
      <div className="w-[40%] bg-gray-950/40 p-5 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center justify-between">
            <span>规则全生命周期流转 (LIVE PREVIEW)</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          {/* Modern Vertical connector pipeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gradient-to-b before:from-indigo-600 before:via-purple-500 before:to-pink-500">
            
            {/* Step A: Data Source Input */}
            <div className="relative">
              <span className="absolute -left-6 top-1 h-5 w-5 rounded-full border border-indigo-500/50 bg-[#090f1d] flex items-center justify-center text-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.2)]">
                <Database className="h-3 w-3" />
              </span>
              <div className="bg-gray-950/80 border border-gray-900 p-3 rounded-lg">
                <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-wide">
                  数据流接入 (ClickHouse Live Stream)
                </div>
                <div className="text-xs font-mono mt-1 text-gray-300">
                  {skill.category === 'Quality-Safety' ? 'dwt_cold_chain_wide_di' : 'dwt_waybill_tracking_wide'}
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  监听底层单向物理数据源字段，提取主键与对比列
                </div>
              </div>
            </div>

            {/* Step B: Redline validation */}
            <div className="relative">
              <span className="absolute -left-6 top-1 h-5 w-5 rounded-full border border-purple-500/50 bg-[#090f1d] flex items-center justify-center text-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.2)]">
                <ShieldAlert className="h-3 w-3" />
              </span>
              <div className="bg-gray-950/80 border border-gray-900 p-3 rounded-lg">
                <div className="text-[9px] font-bold text-purple-400 uppercase tracking-wide">
                  物理红线条件匹配 (Redline Checking)
                </div>
                <div className="text-xs mt-1 text-gray-250 font-bold">
                  {skill.name} {'>'} <span className="text-purple-400 font-extrabold">{thresholdVal}</span>
                  {skill.fieldsConfig.split(',')[1] && (
                    <span> 持续 {durationVal} 分钟</span>
                  )}
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  一旦指标命中设定红线，立即生成活跃预警工单，触发 T0 通报
                </div>
              </div>
            </div>

            {/* Step C: Verification Closed-loop */}
            <div className="relative">
              <span className="absolute -left-6 top-1 h-5 w-5 rounded-full border border-amber-500/50 bg-[#090f1d] flex items-center justify-center text-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.2)]">
                <CheckCircle className="h-3 w-3" />
              </span>
              <div className="bg-gray-950/80 border border-gray-900 p-3 rounded-lg">
                <div className="text-[9px] font-bold text-amber-400 uppercase tracking-wide">
                  静默隐性核销校验 (Kafka Resolution Stream)
                </div>
                <div className="text-[11px] font-mono mt-1 text-amber-400/90 font-bold">
                  Kafka Topic: {eventSource}
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">
                  条件: <span className="text-gray-200 font-bold font-mono">{checkField}</span> (回源 {originSystem})
                </div>
                <div className="text-[9px] text-gray-500 mt-1">
                  平台不设“手动结案”按钮，严格监听回源作业物理动作进行闭环消警
                </div>
              </div>
            </div>

            {/* Step D: Escalation Notification Matrix */}
            <div className="relative">
              <span className="absolute -left-6 top-1 h-5 w-5 rounded-full border border-pink-500/50 bg-[#090f1d] flex items-center justify-center text-pink-400 shadow-[0_0_6px_rgba(236,72,153,0.2)]">
                <Users className="h-3 w-3" />
              </span>
              <div className="bg-gray-950/80 border border-gray-900 p-3 rounded-lg space-y-2">
                <div className="text-[9px] font-bold text-pink-400 uppercase tracking-wide">
                  阶梯升级推送矩阵 (Escalation Path)
                </div>

                <div className="space-y-1.5">
                  {t0Enabled && (
                    <div className="flex items-center justify-between text-[10px] bg-emerald-950/40 border border-emerald-900/30 p-1.5 rounded">
                      <span className="text-emerald-400 font-bold">T0 当班主管</span>
                      <span className="text-gray-400 font-mono text-[9px] truncate max-w-[120px]">{t0Receiver}</span>
                    </div>
                  )}

                  {t2Enabled && (
                    <div className="flex items-center justify-between text-[10px] bg-amber-950/40 border border-amber-900/30 p-1.5 rounded">
                      <span className="text-amber-400 font-bold">T+{t2Hours}h 省区负责人</span>
                      <span className="text-gray-400 font-mono text-[9px] truncate max-w-[120px]">{t2Receiver}</span>
                    </div>
                  )}

                  {t6Enabled && (
                    <div className="flex items-center justify-between text-[10px] bg-rose-950/40 border border-rose-900/30 p-1.5 rounded">
                      <span className="text-rose-400 font-bold">T+{t6Hours}h 总部风控</span>
                      <span className="text-gray-400 font-mono text-[9px] truncate max-w-[120px]">{t6Receiver}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Deploy logs simulation panel */}
        <AnimatePresence>
          {isDeploying && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 p-3 bg-gray-950 border border-gray-900 rounded-lg font-mono text-[9px] space-y-1.5 text-gray-400"
            >
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
                <Terminal className="h-3.5 w-3.5 animate-pulse" />
                <span>COMPILING RULE FLOW...</span>
              </div>
              <div className="space-y-0.5 max-h-32 overflow-y-auto">
                <div className="text-gray-500">Executing compiler target v1.4...</div>
                <div className={deployStep >= 0 ? 'text-indigo-300' : 'text-gray-600'}>
                  {deployStep >= 0 ? '✓ ' : '⏳ '} 解析 ClickHouse 关联库表 Schema...
                </div>
                <div className={deployStep >= 1 ? 'text-indigo-300' : 'text-gray-600'}>
                  {deployStep >= 1 ? '✓ ' : '⏳ '} 注册 Kafka Stream 物理事件监听 topic...
                </div>
                <div className={deployStep >= 2 ? 'text-indigo-300' : 'text-gray-600'}>
                  {deployStep >= 2 ? '✓ ' : '⏳ '} 连接钉钉推送接口, 生成路由策略...
                </div>
                <div className={deployStep >= 3 ? 'text-indigo-300' : 'text-gray-600'}>
                  {deployStep >= 3 ? '✓ ' : '⏳ '} 注入隐性物理闭环核销判定条件...
                </div>
                {deployStep >= 4 && (
                  <div className="text-neon-emerald font-bold animate-pulse">
                    ✓ DEPLOY SUCCESS: Rule deployed & monitoring live traffic!
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
