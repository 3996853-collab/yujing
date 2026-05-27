'use client';

import React, { useState } from 'react';
import { useRuleStore } from '../../store/ruleStore';
import { Settings, ShieldAlert, ArrowRight, MessageSquare, AlertTriangle, Layers, Save, CheckCircle } from 'lucide-react';

export default function PushActionConfig() {
  const pushTemplate = useRuleStore((state) => state.pushTemplate);
  const pushFilter = useRuleStore((state) => state.pushFilter);
  const escalationNodes = useRuleStore((state) => state.escalationNodes);
  const setPushTemplate = useRuleStore((state) => state.setPushTemplate);
  const setPushFilter = useRuleStore((state) => state.setPushFilter);
  const updateEscalationNode = useRuleStore((state) => state.updateEscalationNode);

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  // Compile template preview with mock data
  const renderTemplatePreview = (template: string) => {
    return template
      .replace(/\${send_prov_name}/g, '上海分公司')
      .replace(/\${waybill_no}/g, 'ZTO-CC-10293')
      .replace(/\${curr_node_type}/g, '嘉定中心流水线')
      .replace(/\${duration_mins}/g, '120');
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg p-6 text-gray-200 overflow-y-auto">
      {/* Top Header */}
      <div className="mb-6 pb-5 border-b border-gray-900 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <span>🚀 推送动作与分发引擎配置台 (Push Action Configuration)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            设置警报触发后的下游文案通道、降噪合并视窗、以及根据物理宽表字段动态映射的阶梯升级接收矩阵
          </p>
        </div>
      </div>

      {/* Main Configurations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        
        {/* Left Columns: Template & Merging (7/12 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Module A: Template Engine */}
          <div className="bg-gray-950/60 border border-gray-900 p-4 rounded-xl space-y-3.5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neon-blue flex items-center gap-1.5 pb-2 border-b border-gray-900/60">
                <MessageSquare className="h-4 w-4" />
                <span>模块 A：动态文案模板 (使用 \${} 引用宽表数据)</span>
              </h3>

              <div className="space-y-3 mt-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 font-bold block mb-1">标题栏高亮色带</label>
                    <select 
                      value={pushTemplate.titleColor}
                      onChange={(e) => setPushTemplate({ titleColor: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none"
                    >
                      <option>🔴 红色 (严重/升级)</option>
                      <option>🟠 橙色 (警告/中度)</option>
                      <option>🔵 蓝色 (提示/常规)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold block mb-1">Markdown 消息模板内容</label>
                  <textarea
                    value={pushTemplate.markdownTemplate}
                    onChange={(e) => setPushTemplate({ markdownTemplate: e.target.value })}
                    rows={6}
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2.5 text-xs font-mono text-gray-300 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                  />
                </div>
              </div>
            </div>

            {/* Template Visual Preview */}
            <div className="mt-3 bg-gray-900/40 p-3 rounded-lg border border-gray-900/60 text-xs">
              <div className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide">
                📱 模拟 DingTalk 消息流转呈现效果
              </div>
              <div className="bg-gray-950 border border-gray-850 rounded-xl overflow-hidden shadow-lg">
                <div className={`h-1.5 ${
                  pushTemplate.titleColor.includes('红') 
                    ? 'bg-neon-red' 
                    : pushTemplate.titleColor.includes('橙') 
                      ? 'bg-neon-orange' 
                      : 'bg-neon-blue'
                }`} />
                <div className="p-3 text-xs text-gray-300 font-sans leading-relaxed whitespace-pre-line">
                  {renderTemplatePreview(pushTemplate.markdownTemplate)}
                </div>
              </div>
            </div>
          </div>

          {/* Module B: Noise Reduction merging */}
          <div className="bg-gray-950/60 border border-gray-900 p-4 rounded-xl space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neon-blue flex items-center gap-1.5 pb-2 border-b border-gray-900/60">
              <Layers className="h-4 w-4" />
              <span>模块 B：智能降噪与合并策略 (Anti-fatigue Alert Merging)</span>
            </h3>

            <div className="space-y-3 mt-1.5">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushFilter.antiStorm}
                  onChange={(e) => setPushFilter({ antiStorm: e.target.checked })}
                  className="rounded bg-gray-900 border-gray-800 text-indigo-600 focus:ring-0"
                />
                <span className="font-bold">开启防告警风暴系统</span>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold block mb-1">流转合并依据 (物理字段维度)</label>
                  <select 
                    value={pushFilter.mergeDim}
                    onChange={(e) => setPushFilter({ mergeDim: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none"
                  >
                    <option value="curr_node_type">curr_node_type (当前节点类型)</option>
                    <option value="curr_node_code">curr_node_code (节点代码)</option>
                    <option value="send_prov_name">send_prov_name (发件省区)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 font-bold block mb-1">时间滑动合并窗口 (分钟)</label>
                  <input
                    type="number"
                    value={pushFilter.windowMinutes}
                    onChange={(e) => setPushFilter({ windowMinutes: parseInt(e.target.value) || 1 })}
                    className="w-full bg-gray-900 border border-gray-800 rounded px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-neon-blue"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed pt-1 flex items-start gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-neon-orange flex-shrink-0" />
                <span>
                  开启后，在 {pushFilter.windowMinutes} 分钟内的同类节点预警，合并为一条摘要清单发送，防范物流大面积卡件引发的管理风暴。
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Columns: Escalation Matrix (5/12 cols) */}
        <div className="lg:col-span-5 bg-gray-950/60 border border-gray-900 p-4 rounded-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neon-blue flex items-center gap-1.5 pb-2 border-b border-gray-900/60">
              <ShieldAlert className="h-4 w-4" />
              <span>模块 C：组织架构路由与阶梯升级 (Escalation Matrix)</span>
            </h3>

            <div className="text-[10px] text-gray-500 leading-relaxed mb-2 bg-gray-900/40 p-2 rounded">
              ⚠️ 说明：由于系统采用“隐性核销”，倒计时仅在数仓产生对应核销物理数据时自动停止。若持续未见物理闭环数据，警报将强制逐级向下游延展触达。
            </div>

            {/* Steps configuration list */}
            <div className="space-y-4">
              {escalationNodes.map((node) => (
                <div key={node.id} className="relative border border-gray-850 bg-gray-900/40 p-3 rounded-lg flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-200">{node.title}</span>
                    <span className="text-[10px] bg-indigo-950 text-indigo-400 px-1.5 py-0.2 rounded border border-indigo-900/30 font-bold">
                      延时: {node.timeTrigger}
                    </span>
                  </div>

                  <div className="text-[10px] text-gray-400">
                    <div className="flex items-center justify-between mb-1">
                      <span>触发机制:</span>
                      <span className="text-gray-300 font-semibold">{node.condition}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-gray-950 border border-gray-800 text-gray-400 px-1 py-0.5 rounded text-[9px]">
                        {node.receiverType}
                      </span>
                      <ArrowRight className="h-3 w-3 text-gray-600" />
                      <input 
                        type="text"
                        value={node.receiverVal}
                        onChange={(e) => updateEscalationNode(node.id, { receiverVal: e.target.value })}
                        className="flex-1 bg-gray-950 border border-gray-850 rounded px-1.5 py-0.5 text-[10px] text-indigo-300 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm controls */}
          <div className="mt-4 pt-4 border-t border-gray-900">
            <button
              onClick={handleSave}
              disabled={isSaved}
              className={`w-full text-xs font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98] ${
                isSaved 
                  ? 'bg-neon-emerald text-dark-bg font-extrabold shadow-neon-emerald/20' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/20'
              }`}
            >
              {isSaved ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  推送与路由升级规则保存成功！
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  保存推送引擎配置
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
