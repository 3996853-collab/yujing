'use client';

import React from 'react';
import { 
  BookOpen, 
  ShieldAlert, 
  TrendingUp, 
  BarChart3, 
  CheckSquare, 
  Cpu, 
  Database, 
  Zap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function PlatformIntroPage() {
  return (
    <div className="h-full flex flex-col bg-[#f8f9fa] overflow-hidden text-gray-800">
      
      {/* 1. Header with premium tonal gradient */}
      <div className="p-6 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BookOpen className="h-5.5 w-5.5 text-indigo-600" />
            <span>预警控制塔平台战略说明书</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">业务核心价值、数字化战略意义与双态预警计算模型技术抽象</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700">
          <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
          <span>控制塔数字化战略 V1.0</span>
        </div>
      </div>

      {/* 2. Main Content Container */}
      <div className="flex-1 p-6 overflow-y-auto space-y-8">
        
        {/* Section 1: Business Core Value & Strategy */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-150 pb-2">
            <ShieldAlert className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              一、业务核心价值与数字化战略意义
            </h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed max-w-4xl">
            本平台不仅是一个风险拦截工具，更是推动整个供应链物流网络实现<strong className="text-gray-900 font-extrabold font-sans">“业物融合”</strong>与<strong className="text-gray-900 font-extrabold">“权责数字化”</strong>的核心抓手。平台致力于在组织内部实现以下三大战略价值：
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            {/* Level 1 Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-extrabold text-gray-900">
                第一层：推动业务数据化认知 <span className="text-gray-400 font-normal">（打破经验主义）</span>
              </h4>
              <div className="space-y-2 text-[11px] leading-relaxed">
                <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100/60 text-red-800">
                  <strong className="block text-[10px] uppercase font-bold text-red-900">现状痛点</strong>
                  过去，一线调度与管理高度依赖个人经验与主观体感（如：“今天感觉有点压车”、“最近破损好像变多了”），缺乏客观标尺。
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 text-emerald-800">
                  <strong className="block text-[10px] uppercase font-bold text-emerald-900">平台价值</strong>
                  通过将所有异常场景沉淀为平台底层的“条件格式与时间戳差值”，强制倒逼业务动作在线化。让管理层的认知从“定性的感觉”转变为“定量的态势”（如：“嘉定仓当前卸车效率下降，已产生 150 票超时积压”），真正建立用数据说话的管理文化。
                </div>
              </div>
            </div>

            {/* Level 2 Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-extrabold text-gray-900">
                第二层：业务结果指标化 <span className="text-gray-400 font-normal">（定义管理边界）</span>
              </h4>
              <div className="space-y-2 text-[11px] leading-relaxed">
                <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100/60 text-red-800">
                  <strong className="block text-[10px] uppercase font-bold text-red-900">现状痛点</strong>
                  业务标准的模糊导致执行变形。什么是“慢”？什么是“异常”？各个省区、各个网点的定义往往不一致。
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 text-emerald-800">
                  <strong className="block text-[10px] uppercase font-bold text-emerald-900">平台价值</strong>
                  平台的【策略配置器】本质上是一个“指标翻译器”。它强制要求业务管理者必须将模糊的业务诉求，转化为绝对清晰的数学逻辑（即：维度 + 指标 + 阈值）。这促使全网建立起统一的、不可篡改的时效与质量红线标准。
                </div>
              </div>
            </div>

            {/* Level 3 Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <CheckSquare className="h-5 w-5" />
              </div>
              <h4 className="text-xs font-extrabold text-gray-900">
                第三层：过程闭环与责任人绑定 <span className="text-gray-400 font-normal">（终结权责模糊）</span>
              </h4>
              <div className="space-y-2 text-[11px] leading-relaxed">
                <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100/60 text-red-800">
                  <strong className="block text-[10px] uppercase font-bold text-red-900">现状痛点</strong>
                  传统报表系统只能发现问题，但无法追踪问题由谁解决，极易产生跨部门扯皮。
                </div>
                <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60 text-emerald-800">
                  <strong className="block text-[10px] uppercase font-bold text-emerald-900">平台价值</strong>
                  结合平台坚守的“单向分发 + 强制源头隐性核销”机制，每一条生成的聚合预警卡片，都精准路由至对应的网点、省区或具体管理者。预警的消除，唯一依赖于责任人在物理世界推动业务向前流转并在源头系统产生真实记录。这在系统中形成了一道无法作伪的“权责映射链”，做到了真正的权责对等与结果追踪。
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Technical Alert Classification */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-150 pb-2">
            <Cpu className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              二、预警模型抽象与核心引擎逻辑
            </h3>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed max-w-4xl">
            为了对千万级实时数据流进行计算，平台将所有复杂的业务预警场景抽象为两种截然不同的数据逻辑模型：
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Model One Card (OLAP/BI) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                  <Database className="h-3 w-3" />
                  <span>模型一：维度指标的条件格式</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400">BI / OLAP 逻辑</span>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600">
                <p className="font-semibold text-gray-800">
                  <strong className="text-indigo-600">适用场景：</strong>状态的累积、水位的监控、均值的偏移（即时业务健康度）。
                </p>
                <div className="bg-gray-950 text-indigo-300 font-mono p-4 rounded-xl text-[11px] leading-relaxed relative border border-gray-900">
                  <span className="absolute top-2.5 right-3 text-[9px] uppercase font-bold text-gray-600">抽象公式</span>
                  <span className="text-gray-400">预警 =</span> [维度 (Dimension)] + [度量指标 (Metric)] + [运算符] + [阈值 (Threshold)]
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  <strong>计算本质：</strong>定期或准实时扫描底层数据库（如 ClickHouse/Doris 等 OLAP 数据库），执行带 <code>GROUP BY</code> 和 <code>HAVING</code> 过滤的高效聚合查询。
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3.5 space-y-2">
                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">典型应用示例：</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-gray-55 p-2 rounded-lg border border-gray-150 text-[10px]">
                    <strong className="block text-gray-700 mb-0.5">时效/积压预警</strong>
                    <div className="text-gray-500 font-medium">维度: 上海嘉定仓-分拣环节</div>
                    <div className="text-indigo-600 font-bold mt-1">未处理包裹数 &gt; 1000票</div>
                  </div>
                  <div className="bg-gray-55 p-2 rounded-lg border border-gray-150 text-[10px]">
                    <strong className="block text-gray-700 mb-0.5">产能/爆仓预警</strong>
                    <div className="text-gray-500 font-medium">维度: 广州转运中心</div>
                    <div className="text-indigo-600 font-bold mt-1">场地库存装载率 &gt; 90%</div>
                  </div>
                  <div className="bg-gray-55 p-2 rounded-lg border border-gray-150 text-[10px]">
                    <strong className="block text-gray-700 mb-0.5">财务/成本预警</strong>
                    <div className="text-gray-500 font-medium">维度: 承运商A-华东干线</div>
                    <div className="text-indigo-600 font-bold mt-1">单票均干线偏差 &gt; 15%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Model Two Card (CEP) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                  <Zap className="h-3 w-3 animate-bounce" />
                  <span>模型二：复杂事件流时序监控</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400">事件流 / CEP 逻辑</span>
              </div>

              <div className="space-y-2.5 text-xs text-gray-600">
                <p className="font-semibold text-gray-800">
                  <strong className="text-purple-600">适用场景：</strong>瞬时状态变更、时间序列上的先后顺序、复杂动作组合（防错与拦截）。
                </p>
                <div className="bg-gray-950 text-purple-300 font-mono p-4 rounded-xl text-[11px] leading-relaxed relative border border-gray-900">
                  <span className="absolute top-2.5 right-3 text-[9px] uppercase font-bold text-gray-600">计算机制</span>
                  Flink CEP (Complex Event Processing) 内存滑窗匹配机制
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  <strong>典型业务场景（DWS 连续未识别扫描拦截）：</strong>
                  <br />
                  在自动分拣线上，DWS（动态称重扫码仪）镜头被灰尘或油污脏污，导致包裹连续扫不出条码。
                  <br />
                  <strong className="text-gray-800">🎯 CEP 匹配模式：</strong>在一个 <span className="text-indigo-600 font-bold">3 秒</span> 的滑动时间窗内，针对同一个扫码仪ID，连续发生 <span className="text-indigo-600 font-bold">3 次</span> “扫码失败”事件。
                </p>
              </div>

              <div className="border-t border-gray-100 pt-3.5 space-y-2 bg-[#fafaff] -mx-5 -mb-5 p-5 rounded-b-2xl">
                <strong className="block text-[10px] text-purple-900 font-bold uppercase tracking-wider">为什么必须使用 CEP：</strong>
                <p className="text-[10px] text-purple-950 leading-relaxed">
                  OLAP 无法捕捉高频且极短时间窗（如3秒内）的连续序列动作。而 Flink CEP 可以在事件发生的 <strong className="text-purple-600">10毫秒内</strong> 在内存中匹配成功，向分拣 PLC 控制器下发信号把流水线紧急停机，直接防止几百个包裹沦为无法投递的“无头件”，实现物理级的防错拦截。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Strategic Decision Summary */}
        <section className="bg-gradient-to-r from-indigo-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5" />
            <span>三、架构决策分水岭（指标态 vs 事件态）</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/10">
                <Database className="h-5 w-5 text-indigo-300 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-indigo-200">指标态 (走 OLAP 架构)</span>
                  <p className="text-[11px] text-indigo-50 mt-1 leading-relaxed">
                    如果业务的管理诉求是 <strong>“看宏观大盘、防水位越线、抓长期未操作的静默单据、分析时效损耗”</strong>，则配置规则指向 OLAP 静态扫描，侧重于展现全局状态和深度汇总。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/10">
                <Zap className="h-5 w-5 text-indigo-300 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block text-xs font-bold text-indigo-200">事件态 (走 CEP 实时流)</span>
                  <p className="text-[11px] text-indigo-50 mt-1 leading-relaxed">
                    如果业务的管理诉求是 <strong>“抓生产设备上的异常动作组合、拦截连续触发的频发错误、监听轨迹状态在小时内的异常缺环”</strong>，则配置规则编译为 CEP 流计算作业，侧重于瞬时拦截和事件响应。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
              <span className="block text-[10px] text-indigo-300 font-extrabold uppercase">战略价值决策链条:</span>
              <div className="flex items-center gap-2.5 text-xs text-indigo-100 font-semibold">
                <span>业务诉求诊断</span>
                <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                <span>数仓语义表绑定</span>
                <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                <span>引擎模式自动适配</span>
              </div>
              <p className="text-[11px] text-indigo-200 leading-relaxed pt-1.5">
                通过让业务层明确感知物理源表和绑定逻辑，本控制塔把复杂的流计算语法（Flink CEP）和多维分析查询（ClickHouse SQL）隐藏在 AI 配置层以下，在前端实现了“以自然语言定义战略红线，底层引擎按需自适应装配”的终极业技对齐。
              </p>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
