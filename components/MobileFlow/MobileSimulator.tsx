'use client';

import React, { useState } from 'react';
import { useRuleStore } from '../../store/ruleStore';
import { MessageSquare, PhoneCall, RefreshCw, Send, CheckCircle, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MobileSimulator() {
  const alerts = useRuleStore((state) => state.alerts);
  const triggerMobileWeighingClosedLoop = useRuleStore((state) => state.triggerMobileWeighingClosedLoop);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [chatOpened, setChatOpened] = useState(false);

  const weighingAlert = alerts.find(a => a.type === 'weighing');

  const resetSimulator = () => {
    setStep(1);
    setMessages([]);
    setChatOpened(false);
  };

  const handleNextStep = () => {
    if (step === 2) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(3);
        setMessages([
          '省区负责人: 嘉定分拨中心称重设备-02精度偏差达到 8.2%，请立刻现场排查！',
          '网点班长: 收到，我立刻让操作工去现场检查设备！'
        ]);
        setChatOpened(true);
      }, 800);
    } else if (step === 3) {
      setLoading(true);
      // Trigger the Zustand action to update state, flash green and delete card
      triggerMobileWeighingClosedLoop();
      
      setTimeout(() => {
        setLoading(false);
        setStep(4);
      }, 1000);
    } else {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg p-6 text-gray-200 justify-between items-center overflow-y-auto">
      <div className="w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-100 mb-1 flex items-center gap-2">
          <span>📱 移动端协同闭环演示器 (Mobile Flow)</span>
        </h2>
        <p className="text-xs text-gray-500 mb-6">操作员线下过磅，中台隐性核销，全程无“复选框”与“结案按钮”</p>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl items-center flex-1 py-4">
        {/* Left Side: Mock Phone Frame */}
        <div className="flex justify-center">
          <div className="w-68 h-[480px] bg-black rounded-[32px] border-[5px] border-gray-800 p-2 shadow-2xl relative flex flex-col overflow-hidden">
            {/* Phone notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900 ml-auto mr-4" />
            </div>

            {/* Phone screen container */}
            <div className="w-full h-full bg-gray-950 rounded-[24px] overflow-hidden flex flex-col relative text-[11px]">
              
              {/* DingTalk header app bar */}
              <div className="bg-[#1f2937] px-3 pt-6 pb-2.5 text-white font-semibold flex items-center justify-between border-b border-gray-900">
                <span>钉钉 (DingTalk)</span>
                <span className="h-1.5 w-1.5 rounded-full bg-neon-emerald" />
              </div>

              {/* Chat / Notifications area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {step === 1 && (
                  <div className="space-y-3">
                    <div className="text-[10px] text-gray-500 text-center">系统推送 T0 触达</div>
                    {weighingAlert ? (
                      <div className="bg-dark-card border border-neon-red/40 rounded-xl p-3 shadow-md relative">
                        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-neon-red" />
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-[9px] font-bold bg-neon-red/10 text-neon-red border border-neon-red/20 px-1 rounded">警报升级通知</span>
                          <span className="text-gray-500 ml-auto font-mono text-[9px]">{weighingAlert.id}</span>
                        </div>
                        
                        <div className="font-bold text-gray-200 text-xs mb-1.5">🚨 设备精度严重超限</div>
                        <div className="text-gray-400 space-y-0.5">
                          <div>受影响节点: {weighingAlert.nodeDetail}</div>
                          <div>检测误差: <span className="text-neon-orange font-bold font-mono">8.2%</span> (阈值: &gt;5%)</div>
                        </div>

                        {/* Countdown inside mobile */}
                        <div className="mt-2.5 bg-gray-950/60 p-1.5 rounded text-center border border-gray-900">
                          <span className="text-gray-500 text-[8px] uppercase">升级总部倒计时</span>
                          <div className="text-neon-red font-bold font-mono tracking-widest text-xs mt-0.5">
                            01 : 45 : 22
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-dark-card border border-gray-850 rounded-xl p-4 text-center text-gray-500 italic">
                        请确保在画布上生成规则，并保持右侧预警开启
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && weighingAlert && (
                  <div className="space-y-3">
                    <div className="bg-dark-card border border-neon-red/40 rounded-xl p-3 shadow-md">
                      <div className="font-bold text-gray-200 text-xs mb-1.5">🚨 设备精度严重超限</div>
                      <div className="text-gray-400 space-y-0.5 mb-3">
                        <div>受影响节点: {weighingAlert.nodeDetail}</div>
                        <div>检测误差: <span className="text-neon-orange font-bold font-mono">8.2%</span></div>
                      </div>
                      
                      {/* Interactive Button */}
                      <button 
                        onClick={handleNextStep}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded text-[10px] flex items-center justify-center gap-1 transition-all"
                      >
                        <Send className="h-3 w-3" />
                        一键推流网点负责人
                      </button>
                    </div>
                  </div>
                )}

                {chatOpened && (
                  <div className="space-y-2.5">
                    <div className="text-[10px] text-gray-500 text-center">网点协同聊天组</div>
                    {messages.map((m, i) => (
                      <div key={i} className={`flex flex-col max-w-[85%] rounded-lg p-2 ${
                        m.startsWith('省区') 
                          ? 'bg-indigo-950/50 text-indigo-200 self-end border border-indigo-900/40 ml-auto' 
                          : 'bg-gray-900 text-gray-300 mr-auto'
                      }`}>
                        <div className="font-bold text-[9px] mb-0.5 text-gray-400">
                          {m.split(':')[0]}
                        </div>
                        <div>{m.split(':')[1]}</div>
                      </div>
                    ))}
                    
                    {step === 3 && (
                      <div className="bg-gray-900/60 border border-gray-800 p-2.5 rounded-lg space-y-1.5 text-center">
                        <div className="text-[10px] text-neon-orange font-bold">现场排查指示:</div>
                        <p className="text-gray-400 text-[10px]">检查称重台异物杂物，清理后在设备控制台执行“二次校准”</p>
                      </div>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-3">
                    <div className="text-[10px] text-gray-500 text-center">Kafka 数据接入完成</div>
                    <div className="bg-neon-emerald/5 border border-neon-emerald/30 rounded-xl p-3 text-center">
                      <CheckCircle className="h-6 w-6 text-neon-emerald mx-auto mb-2" />
                      <div className="font-bold text-neon-emerald text-xs mb-1">✅ 异常已于刚才消除</div>
                      <p className="text-gray-400 text-[10px] leading-relaxed">
                        最新称重设备相对误差已降至 1.0% (&lt; 阈值 5.0%)。倒计时已静默关闭。
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Footer Status */}
              <div className="bg-gray-950 px-3 py-2 border-t border-gray-900 flex items-center justify-between text-gray-500 text-[9px]">
                <span>无复选框安全机制</span>
                <span>ZTO Link</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Step-by-Step Scenario Wizard */}
        <div className="space-y-4">
          <div className="bg-gray-950/60 border border-gray-900 p-4 rounded-xl space-y-3.5">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              演练交互流程控制
            </h4>

            {/* Step list indicator */}
            <div className="space-y-3 text-xs">
              <div className={`flex items-start gap-2.5 p-2 rounded ${step === 1 ? 'bg-gray-900 border border-gray-800' : ''}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                  step > 1 ? 'bg-neon-emerald text-dark-bg' : step === 1 ? 'bg-indigo-600 text-white animate-pulse' : 'bg-gray-900 text-gray-500'
                }`}>
                  1
                </span>
                <div>
                  <div className={`font-semibold ${step === 1 ? 'text-indigo-400 font-bold' : step > 1 ? 'text-gray-400' : 'text-gray-600'}`}>
                    步骤 1：接收强推送消息 (T0)
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">钉钉群机器人发送异常警报，开启 6 小时上报总部倒计时。</p>
                </div>
              </div>

              <div className={`flex items-start gap-2.5 p-2 rounded ${step === 2 ? 'bg-gray-900 border border-gray-800' : ''}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                  step > 2 ? 'bg-neon-emerald text-dark-bg' : step === 2 ? 'bg-indigo-600 text-white animate-pulse' : 'bg-gray-900 text-gray-500'
                }`}>
                  2
                </span>
                <div>
                  <div className={`font-semibold ${step === 2 ? 'text-indigo-400 font-bold' : step > 2 ? 'text-gray-400' : 'text-gray-600'}`}>
                    步骤 2：下探与推流网点负责人 (T+5)
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">省区负责人确认后，一键推流给分拨现场值班长开始排查。</p>
                </div>
              </div>

              <div className={`flex items-start gap-2.5 p-2 rounded ${step === 3 ? 'bg-gray-900 border border-gray-800' : ''}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                  step > 3 ? 'bg-neon-emerald text-dark-bg' : step === 3 ? 'bg-indigo-600 text-white animate-pulse' : 'bg-gray-900 text-gray-500'
                }`}>
                  3
                </span>
                <div>
                  <div className={`font-semibold ${step === 3 ? 'text-indigo-400 font-bold' : step > 3 ? 'text-gray-400' : 'text-gray-600'}`}>
                    步骤 3：源头物理校准闭环 (T+30)
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">操作工线下检查并排除异物，在设备终端触发“重新校磅”。</p>
                </div>
              </div>

              <div className={`flex items-start gap-2.5 p-2 rounded ${step === 4 ? 'bg-gray-900 border border-gray-800' : ''}`}>
                <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                  step === 4 ? 'bg-neon-emerald text-dark-bg' : 'bg-gray-900 text-gray-500'
                }`}>
                  4
                </span>
                <div>
                  <div className={`font-semibold ${step === 4 ? 'text-neon-emerald font-bold' : 'text-gray-600'}`}>
                    步骤 4：中台监听并隐性核销 (T+31)
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5">Kafka 拦截设备新数据计算误差降至 1%，PC 看板异常卡片平滑折叠消失。</p>
                </div>
              </div>
            </div>

            {/* Simulated Action triggers */}
            <div className="pt-2 border-t border-gray-900/60 flex gap-2">
              {step < 4 ? (
                <button
                  onClick={handleNextStep}
                  disabled={loading || (step === 1 && !weighingAlert)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      运行仿真中...
                    </>
                  ) : step === 1 ? (
                    '查看消息卡片'
                  ) : step === 2 ? (
                    '触发一键推流'
                  ) : (
                    '模拟设备二次校准过磅'
                  )}
                </button>
              ) : (
                <button
                  onClick={resetSimulator}
                  className="flex-1 bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-300 font-bold py-2 rounded text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  重新开始演练
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
