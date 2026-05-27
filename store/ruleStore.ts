import { create } from 'zustand';
import { 
  Connection, 
  Edge, 
  Node, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  NodeChange,
  EdgeChange
} from '@xyflow/react';

// Define Custom Node Data Type
export interface RuleNodeData extends Record<string, unknown> {
  label: string;
  thresholdValue?: number;
  operator?: 'greater' | 'less' | 'equal';
  targetRole?: string;
  category?: string;
  sourceField?: string;
  timeWindow?: string;
  receivers?: string[];
  routeBy?: string;
  dimFilters?: {
    province?: string;
    nodeType?: string;
  };
}

// Custom Node interface
export type RuleNode = Node<RuleNodeData>;

// Define Alert Card Data Type
export interface AlertEvent {
  id: string;
  waybill: string;
  type: 'trajectory' | 'weighing' | 'extreme'; // trajectory is red (T+2), weighing is orange (T0), extreme is black (T+6)
  anomalyName: string;
  nodeDetail: string;
  timeLeft: number; // in seconds
  expectedAction: string;
  status: 'active' | 'closing' | 'resolved';
  dingTalkStatus?: string;
}

// Define Schema Fields for Mapping Page
export interface SchemaField {
  fieldName: string;
  type: string;
  isPrimaryKey?: boolean;
}

// Define Mapped Semantic Dictionary
export interface SemanticField {
  fieldName: string;
  type: 'PK' | 'Dim' | 'Metric';
  label: string;
  unit?: string;
}

// Define Saved Skills in Left Library
export interface SkillCardData {
  id: string;
  name: string;
  category: 'Quality-Safety' | 'Resource-Capacity' | 'Equipment-System' | 'Cost-Finance' | 'Force-Majeure' | 'Sla-Inventory' | 'Actions';
  description: string;
  fieldsConfig: string;
  defaultData: RuleNodeData;
  // New workflow fields for business maintenance
  fields?: Record<string, string | number>;
  eventSource?: string; // e.g. 'TMS_REFRIGERATION_RESET'
  originSystem?: string; // e.g. 'TMS'
  checkField?: string; // e.g. 'temp <= 8.0'
  escalationT0?: { enabled: boolean; channel: string; receiver: string };
  escalationT2?: { enabled: boolean; delayHours: number; channel: string; receiver: string };
  escalationT6?: { enabled: boolean; delayHours: number; channel: string; receiver: string };
}

// Define Push Action Escalation Steps
export interface EscalationNode {
  id: string;
  title: string;
  timeTrigger: string;
  condition: string;
  receiverType: string;
  receiverVal: string;
}

// Audit record type
export interface AuditRecord {
  id: string;
  ruleName: string;
  triggerTime: string;
  waybillOrDevice: string;
  receiverUid: string;
  channel: string;
  status: 'T0.派发主管' | 'T+2.省区升级' | 'T+6.总部警告' | '已核销';
  isResolved: boolean;
  eventDetails: string;
}

// Define Template Center Data Type
export interface TemplateData {
  id: string;
  name: string;
  category: 'official' | 'enterprise';
  description: string;
  slots: {
    province: string;
    stage: string;
    threshold: number;
    channel: string;
  };
}

interface RuleState {
  // Canvas State
  nodes: RuleNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: RuleNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  updateNodeData: (id: string, data: Partial<RuleNodeData>) => void;
  addNode: (nodeType: string, position: { x: number; y: number }, skillData?: any) => void;
  clearCanvas: () => void;

  // AI Dialog State
  isThinking: boolean;
  isDeepThinking: boolean;
  thinkingSteps: { id: string; text: string; status: 'pending' | 'active' | 'done' }[];
  aiInput: string;
  setAiInput: (input: string) => void;
  setDeepThinking: (enabled: boolean) => void;
  triggerAiGenerate: () => void;
  recommendedTemplate: TemplateData | null;
  setRecommendedTemplate: (t: TemplateData | null) => void;

  // Template Center State
  templates: TemplateData[];
  applyTemplate: (templateId: string, formValues: { province: string; stage: string; threshold: number; channel: string }) => void;

  // Alerts State (Living Water Dashboard)
  alerts: AlertEvent[];
  decrementAlertCountdowns: () => void;
  triggerMobileWeighingClosedLoop: () => void;
  triggerDingTalkUrge: (alertId: string) => void;

  // Data Source & Skill Mapper State
  datasource: {
    connection: string;
    database: string;
    table: string;
  };
  schemaFields: SchemaField[];
  semanticFields: SemanticField[];
  draggedFields: string[];
  skillsLibrary: SkillCardData[];
  selectedSkillId: string | null;
  setSelectedSkillId: (id: string | null) => void;
  updateSkill: (id: string, updated: Partial<SkillCardData>) => void;
  deleteSkill: (id: string) => void;
  createSkill: (skill: Omit<SkillCardData, 'id'>) => void;
  setDatasource: (ds: { connection: string; database: string; table: string }) => void;
  mapField: (fieldName: string, type: 'PK' | 'Dim' | 'Metric', label: string, unit?: string) => void;
  removeMappedField: (fieldName: string) => void;
  publishSkill: (name: string, category: any, config: any) => void;

  // Push Action Configuration State
  pushTemplate: {
    titleColor: string;
    markdownTemplate: string;
  };
  pushFilter: {
    antiStorm: boolean;
    mergeDim: string;
    windowMinutes: number;
  };
  escalationNodes: EscalationNode[];
  setPushTemplate: (template: Partial<{ titleColor: string; markdownTemplate: string }>) => void;
  setPushFilter: (filter: Partial<{ antiStorm: boolean; mergeDim: string; windowMinutes: number }>) => void;
  updateEscalationNode: (id: string, field: Partial<EscalationNode>) => void;

  // Smart Audit Data State
  auditRecords: AuditRecord[];
  filteredAuditRecords: AuditRecord[];
  auditQuery: string;
  setAuditQuery: (query: string) => void;
  searchAuditEvents: (query: string) => void;
}

const initialSkills: SkillCardData[] = [
  {
    id: 'skill-shanghai-pickup-timeout',
    name: '上海仓出库揽收超时拦截',
    category: 'Quality-Safety',
    description: '针对上海仓库（如嘉定仓）已出库完成（status = 900）但物流商迟迟未实际揽收（receive_time 为空）的包裹进行即将超时校验',
    fieldsConfig: '应揽收临界值 (分钟)',
    fields: {
      threshold: 60
    },
    eventSource: 'WMS_SHIPMENT_PICKUP',
    originSystem: 'WMS (仓储管理系统)',
    checkField: 'receive_time != null',
    escalationT0: { enabled: true, channel: '钉钉群机器人', receiver: '[warehouse_name] => 嘉定仓主管与派件调度' },
    escalationT2: { enabled: true, delayHours: 1, channel: '钉钉工作通知', receiver: '[send_prov_name] => 省区仓配总监' },
    escalationT6: { enabled: true, delayHours: 4, channel: '钉钉工作通知', receiver: '总部时效风控大屏' },
    defaultData: {
      label: '上海仓出库揽收超时拦截',
      thresholdValue: 60,
      operator: 'less',
      dimFilters: { province: '上海' }
    }
  },
  {
    id: 'skill-dispatched-package-lost',
    name: '已发出包裹疑似遗失诊断',
    category: 'Sla-Inventory',
    description: '针对已正常发运且有发件时间（shipped_time）但未签收（sign_time为空）且最新轨迹已超过48小时未更新的包裹进行高危异常检测',
    fieldsConfig: '无动静限值 (小时)',
    fields: {
      threshold: 48
    },
    eventSource: 'TMS_TRACK_UPDATE',
    originSystem: 'TMS (运输管理系统)',
    checkField: 'sign_time != null || update_time > DATE_SUB(NOW(), INTERVAL 48 HOUR)',
    escalationT0: { enabled: true, channel: '钉钉工作通知', receiver: '当班网点客服组长' },
    escalationT2: { enabled: true, delayHours: 2, channel: '钉钉群机器人', receiver: '[send_prov_name] => 省区客服部经理' },
    escalationT6: { enabled: true, delayHours: 24, channel: '钉钉工作通知', receiver: '总部服务品质监督中心' },
    defaultData: {
      label: '已发出包裹疑似遗失诊断',
      thresholdValue: 48,
      operator: 'greater'
    }
  },
  {
    id: 'skill-temp-humidity',
    name: '温控车厢温度连续偏高校验',
    category: 'Quality-Safety',
    description: '冷链干线运输中，针对车载温湿度传感器回传数据，校验车厢温度是否连续高于设定安全温区上限',
    fieldsConfig: '温度上限 (°C), 连续时间 (分钟)',
    fields: {
      threshold: 8,
      duration: 10
    },
    eventSource: 'TMS_REFRIGERATION_RESET',
    originSystem: 'TMS (运输管理系统)',
    checkField: 'current_temperature <= 8.0',
    escalationT0: { enabled: true, channel: '钉钉群机器人', receiver: '[curr_vehicle_no] => 随车司机与当班调度' },
    escalationT2: { enabled: true, delayHours: 1, channel: '钉钉工作通知', receiver: '[send_prov_name] => 省区冷链业务线主管' },
    escalationT6: { enabled: true, delayHours: 4, channel: '钉钉工作通知', receiver: '总部时效与安全控制中心大屏' },
    defaultData: {
      label: '温控车厢温度连续偏高校验',
      thresholdValue: 8,
      operator: 'greater',
      dimFilters: { province: '上海' }
    }
  },
  {
    id: 'skill-damage-toss',
    name: '仓内抛掷视频 AI 监控异常',
    category: 'Quality-Safety',
    description: '结合视频监控与 AI 计算机视觉算法，自动识别暴力分拣、违规抛掷抛摔包裹等高危作业行为',
    fieldsConfig: 'AI 置信度 (%), 连续触发频次 (次)',
    fields: {
      confidence: 85,
      frequency: 3
    },
    eventSource: 'WMS_WORKER_COMPLIANCE_PASS',
    originSystem: 'WMS (仓储管理系统)',
    checkField: 'toss_count_reset == 1',
    escalationT0: { enabled: true, channel: '钉钉工作通知', receiver: '[curr_node_code] => 当班现场质控主管' },
    escalationT2: { enabled: true, delayHours: 2, channel: '钉钉群机器人', receiver: '[send_prov_name] => 省区质控部负责人' },
    escalationT6: { enabled: false, delayHours: 6, channel: '钉钉工作通知', receiver: '总部质控管理群' },
    defaultData: {
      label: '仓内抛掷视频 AI 监控异常',
      thresholdValue: 85,
      operator: 'greater'
    }
  },
  {
    id: 'skill-dangerous-goods',
    name: '航空件高危违禁品安全拦截',
    category: 'Quality-Safety',
    description: '通过机场安检 X 光机图像识别接口与标签分类，智能分析拦截航空包裹中的易燃易爆等违禁品',
    fieldsConfig: '威胁置信度 (%), 防范级别',
    fields: {
      threatLevel: 90,
      safetyLevel: 3
    },
    eventSource: 'SECURITY_PHYSICAL_INSPECTION_PASS',
    originSystem: 'WMS安检通道系统',
    checkField: 'hazard_resolved == 1',
    escalationT0: { enabled: true, channel: '钉钉群机器人', receiver: '[curr_node_code] => 安全监管组当班主管' },
    escalationT2: { enabled: true, delayHours: 0.5, channel: '钉钉工作通知', receiver: '[send_prov_name] => 省区安全总监' },
    escalationT6: { enabled: true, delayHours: 2, channel: '钉钉工作通知', receiver: '总部安保红线中心' },
    defaultData: {
      label: '航空件高危违禁品安全拦截',
      thresholdValue: 90,
      operator: 'greater'
    }
  },
  {
    id: 'skill-overflow',
    name: '转运中心库存高水位线预警',
    category: 'Resource-Capacity',
    description: '监控场地实际库存件数与最大设计容量比率。当处于临界或超负荷爆仓状态时拦截派单并报警',
    fieldsConfig: '容量使用率 (%), 安全水位线 (%)',
    fields: {
      usageRatio: 90,
      safetyLimit: 85
    },
    eventSource: 'WMS_GATEWAY_OUTBOUND_SPEEDUP',
    originSystem: 'WMS (仓储管理系统)',
    checkField: 'stock_ratio <= 80.0',
    escalationT0: { enabled: true, channel: '钉钉群机器人', receiver: '[curr_node_code] => 场地排班调度主管' },
    escalationT2: { enabled: true, delayHours: 1, channel: '钉钉工作通知', receiver: '[send_prov_name] => 省区网格经理' },
    escalationT6: { enabled: true, delayHours: 4, channel: '钉钉工作通知', receiver: '总部网络路由中心' },
    defaultData: {
      label: '转运中心库存高水位线预警',
      thresholdValue: 90,
      operator: 'greater'
    }
  },
  {
    id: 'skill-capacity-imbalance',
    name: '干线计划运力与货量严重失衡',
    category: 'Resource-Capacity',
    description: '分析计划发车任务与实际可用车队台数，预测运力缺口，或拦截装载率极低的空跑浪费行为',
    fieldsConfig: '车辆缺口 (台), 满载率下限 (%)',
    fields: {
      carGap: 5,
      loadRatio: 60
    },
    eventSource: 'TMS_ADDITIONAL_TRUCK_DISPATCH',
    originSystem: 'TMS (运输管理系统)',
    checkField: 'available_truck_count >= plan_truck_count',
    escalationT0: { enabled: true, channel: '钉钉工作通知', receiver: '[curr_node_code] => 运力调度班长' },
    escalationT2: { enabled: true, delayHours: 2, channel: '钉钉工作通知', receiver: '[send_prov_name] => 省区车管部负责人' },
    escalationT6: { enabled: false, delayHours: 6, channel: '钉钉工作通知', receiver: '总部干线保障组' },
    defaultData: {
      label: '干线计划运力与货量严重失衡',
      thresholdValue: 5,
      operator: 'greater'
    }
  },
  {
    id: 'skill-dws-deviation',
    name: 'DWS 动态称重误差超标诊断',
    category: 'Equipment-System',
    description: '实时追踪 DWS 称重扫码一体机的称重物理漂移与异常波动，防止漏计费与客诉',
    fieldsConfig: '计重相对误差 (%), 异常频次阈值 (包)',
    fields: {
      weightError: 5,
      freqCount: 10
    },
    eventSource: 'DWS_DEVICE_RECALIBRATION',
    originSystem: 'DWS 控制器驱动层',
    checkField: 'calibration_status == 1',
    escalationT0: { enabled: true, channel: '钉钉群机器人', receiver: '[curr_node_code] => 设备机电维护组' },
    escalationT2: { enabled: true, delayHours: 4, channel: '钉钉工作通知', receiver: '[send_prov_name] => 省区营运技术部' },
    escalationT6: { enabled: false, delayHours: 12, channel: '钉钉工作通知', receiver: '总部设备工程部' },
    defaultData: {
      label: 'DWS 动态称重误差超标诊断',
      thresholdValue: 5,
      operator: 'greater'
    }
  },
  {
    id: 'skill-finance-deviation',
    name: '实际运费偏离系统预估偏差校验',
    category: 'Cost-Finance',
    description: '自动对账模块，校验承运商实际结算运费是否大幅超出预估计费上限，控制企业经营成本利润率',
    fieldsConfig: '偏差阈值 (%), 额外收费上限 (元)',
    fields: {
      deviationRatio: 15,
      maxExtraCost: 200
    },
    eventSource: 'BILLING_SYSTEM_ADJUSTMENT',
    originSystem: 'FIN (财务结算系统)',
    checkField: 'cost_deviation_approved == 1',
    escalationT0: { enabled: true, channel: '钉钉工作通知', receiver: '大区结算财务主管' },
    escalationT2: { enabled: true, delayHours: 6, channel: '钉钉工作通知', receiver: '[send_prov_name] => 省区财务总监' },
    escalationT6: { enabled: true, delayHours: 24, channel: '钉钉工作通知', receiver: '总部经营分析部' },
    defaultData: {
      label: '实际运费偏离系统预估偏差校验',
      thresholdValue: 15,
      operator: 'greater'
    }
  },
  {
    id: 'skill-weather-impact',
    name: '干线路由遭遇暴雪台风气象干扰',
    category: 'Force-Majeure',
    description: '接入中国气象局预警API，与当前干线车辆GPS轨迹及路由交叉对齐，超前预测暴风雨雪导致的高速封路延误风险',
    fieldsConfig: '气象警告级别, 路由交汇半径 (公里)',
    fields: {
      alertLevel: 3,
      radiusKm: 50
    },
    eventSource: 'METEOROLOGY_ROUTE_REDISPATCH',
    originSystem: '气象预警接口 & TMS 路由引擎',
    checkField: 'weather_warning_cleared == 1',
    escalationT0: { enabled: true, channel: '钉钉群机器人', receiver: '干线路由调度大班长' },
    escalationT2: { enabled: true, delayHours: 1, channel: '钉钉工作通知', receiver: '省区车辆督导安全组' },
    escalationT6: { enabled: true, delayHours: 3, channel: '钉钉工作通知', receiver: '总部安全应急委员会' },
    defaultData: {
      label: '干线路由遭遇暴雪台风气象干扰',
      thresholdValue: 3,
      operator: 'greater'
    }
  },
  {
    id: 'skill-node-timeout',
    name: '全链路节点流转超时校验',
    category: 'Sla-Inventory',
    description: '监控揽收、分拣、出库、干线、派件、签收全环节，任意环节停滞时间超出标准 SLA 承诺时报警',
    fieldsConfig: '超时阈值 (分钟)',
    fields: {
      timeoutMins: 120
    },
    eventSource: 'WMS_PACKAGE_DEPARTURE',
    originSystem: 'WMS (仓储管理系统) / TMS (运输管理系统)',
    checkField: 'package_status == \'DEPARTED\'',
    escalationT0: { enabled: true, channel: '钉钉工作通知', receiver: '[curr_node_code] => 当班操作组长' },
    escalationT2: { enabled: true, delayHours: 2, channel: '钉钉工作通知', receiver: '[send_prov_name] => 省区调度负责人' },
    escalationT6: { enabled: true, delayHours: 6, channel: '钉钉工作通知', receiver: '总部时效风控大群' },
    defaultData: {
      label: '全链路节点流转超时校验',
      thresholdValue: 120,
      operator: 'greater'
    }
  }
];

// Alerts aligned with PRD severity colors:
// Orange for T0 Initial (即将升级)
// Red for T+2 Escalated (严重超时)
// Black for T+6 Extreme (极危断崖段)
const initialAlerts: AlertEvent[] = [
  {
    id: 'ALERT-001',
    waybill: 'ZTO-CC-10293',
    type: 'trajectory', // RED (T+2)
    anomalyName: '首中心发车严重超时',
    nodeDetail: '华东枢纽 -> 华南分拨',
    timeLeft: 899, // 14m 59s
    expectedAction: '等待 WMS 产生 [出库装车] 轨迹',
    status: 'active',
    dingTalkStatus: '⏳ 倒计时中'
  },
  {
    id: 'ALERT-002',
    waybill: 'SH-Jiading-Weigher-02',
    type: 'weighing', // ORANGE (T0)
    anomalyName: '计重相对误差达 8.2%',
    nodeDetail: '嘉定分拨中心流水线',
    timeLeft: 6322, // 1h 45m 22s
    expectedAction: '等待设备产生 [二次校准校验] 数据',
    status: 'active',
    dingTalkStatus: '⏳ 倒计时中'
  },
  {
    id: 'ALERT-003',
    waybill: 'HQ-Control-Tower-01',
    type: 'extreme', // BLACK (T+6)
    anomalyName: '分拨中心大面积瘫痪预警',
    nodeDetail: '全国网络风控大厅',
    timeLeft: 21622, // 6h 0m 22s
    expectedAction: '等待总部特派突击队下发系统重启信号',
    status: 'active',
    dingTalkStatus: '🚨 总部极限通报中'
  },
  {
    id: 'ALERT-004',
    waybill: '测试包裹ID_001',
    type: 'trajectory',
    anomalyName: '上海仓揽收即将超时预警',
    nodeDetail: '上海嘉定仓 (出库完成未揽收)',
    timeLeft: 1800, // 30 mins
    expectedAction: '等待物流商实际揽收更新 receive_time',
    status: 'active',
    dingTalkStatus: '⏳ 倒计时中'
  },
  {
    id: 'ALERT-005',
    waybill: '测试包裹ID_002',
    type: 'extreme',
    anomalyName: '已发出包裹疑似遗失预警',
    nodeDetail: '上海仓 -> 杭州 (发货5天未签收且2天无轨迹)',
    timeLeft: 0,
    expectedAction: '联系物流网点核实物理包裹状态并补录轨迹',
    status: 'active',
    dingTalkStatus: '🚨 疑似遗失预警中'
  }
];

const initialAuditRecords: AuditRecord[] = [
  {
    id: 'AUDIT-805',
    ruleName: '上海仓出库揽收超时拦截',
    triggerTime: '2026-05-26 15:45:00',
    waybillOrDevice: '测试包裹ID_001',
    receiverUid: 'dingtalk_user_sh01',
    channel: '钉钉群机器人',
    status: 'T0.派发主管',
    isResolved: false,
    eventDetails: '包裹出库完成后，超过30分钟未被快递公司实际揽收，触发即将超时预警。'
  },
  {
    id: 'AUDIT-806',
    ruleName: '已发出包裹疑似遗失诊断',
    triggerTime: '2026-05-26 16:00:00',
    waybillOrDevice: '测试包裹ID_002',
    receiverUid: 'dingtalk_user_lms02',
    channel: '钉钉工作通知',
    status: 'T+2.省区升级',
    isResolved: false,
    eventDetails: '包裹已正常发运（shipped_time）且未签收（sign_time为空），最新轨迹超过48小时未更新。'
  },
  {
    id: 'AUDIT-801',
    ruleName: '上海冷链干线延误预警规则',
    triggerTime: '2026-05-25 09:30:15',
    waybillOrDevice: 'ZTO-CC-10293',
    receiverUid: 'dingtalk_user_9921',
    channel: '钉钉工作通知',
    status: 'T+2.省区升级',
    isResolved: false,
    eventDetails: '华东枢纽发出后，超过120分钟无路由跟踪，自动通知省区调度员。'
  },
  {
    id: 'AUDIT-802',
    ruleName: '称重设备精度高危异常规则',
    triggerTime: '2026-05-25 11:15:00',
    waybillOrDevice: 'SH-Jiading-Weigher-02',
    receiverUid: 'dingtalk_user_2209',
    channel: '钉钉群机器人',
    status: 'T0.派发主管',
    isResolved: false,
    eventDetails: '检测到设备SH-Jiading-Weigher-02计重相对误差达8.2%，已推流给当班班长。'
  },
  {
    id: 'AUDIT-803',
    ruleName: '冷链干线延误预警规则',
    triggerTime: '2026-05-24 16:22:11',
    waybillOrDevice: 'ZTO-CC-20448',
    receiverUid: 'dingtalk_user_4491',
    channel: '钉钉工作通知',
    status: '已核销',
    isResolved: true,
    eventDetails: '运单发生超2小时未装车，触发省区督办。5分钟后WMS生成出库装车轨迹，预警隐性核销。'
  },
  {
    id: 'AUDIT-804',
    ruleName: '称重设备精度高危异常规则',
    triggerTime: '2026-05-24 08:12:44',
    waybillOrDevice: 'SH-Qingpu-Weigher-01',
    receiverUid: 'dingtalk_user_1020',
    channel: '钉钉工作通知',
    status: '已核销',
    isResolved: true,
    eventDetails: '相对称重误差达 6.1%，推送网点整改。次日设备回传二次校准成功指标，相对误差降至 0.8%，告警自动消警。'
  }
];

const initialTemplates: TemplateData[] = [
  {
    id: 'tpl-end-to-end',
    name: '端到端时效断链预警模板',
    category: 'official',
    description: '中通快递官方标准干线时效超时阻断检测规则，自动追踪链路停滞点。',
    slots: { province: '上海', stage: '首中心发车', threshold: 120, channel: '钉钉工作通知' }
  },
  {
    id: 'tpl-weighing-drift',
    name: '称重设备精度漂移告警模板',
    category: 'official',
    description: '针对仓内过磅动态秤的相对误差持续性波动进行监控校验。',
    slots: { province: '上海', stage: '设备过磅', threshold: 5, channel: '钉钉群机器人' }
  },
  {
    id: 'tpl-congestion',
    name: '双十一波次发车超时预警',
    category: 'official',
    description: '大促期间高密集运输发车延迟，并支持双轨通知升级。',
    slots: { province: '浙江', stage: '中心发车', threshold: 240, channel: '钉钉工作通知' }
  },
  {
    id: 'tpl-fresh-produce',
    name: '生鲜件冷链阻断校验模板',
    category: 'enterprise',
    description: '企业内部自定义，用于监督温控冷链包裹在重要节点卡点流转。',
    slots: { province: '山东', stage: '冷链装车', threshold: 60, channel: '钉钉工作通知' }
  }
];

export const useRuleStore = create<RuleState>((set, get) => ({
  // Canvas State Initial
  nodes: [
    {
      id: 'node-trigger',
      type: 'trigger',
      position: { x: 250, y: 50 },
      data: { label: '运单状态变更 / 设备流转上报' }
    },
    {
      id: 'node-delay',
      type: 'trajectory',
      position: { x: 80, y: 200 },
      data: { label: '校验全链路轨迹停滞', thresholdValue: 2, operator: 'greater' }
    },
    {
      id: 'node-weighing',
      type: 'weighing',
      position: { x: 420, y: 200 },
      data: { label: '提取设备计重相对误差', thresholdValue: 5, operator: 'greater' }
    },
    {
      id: 'node-escalation',
      type: 'escalation',
      position: { x: 250, y: 400 },
      data: { 
        label: '触发组织架构阶梯升级', 
        targetRole: '省区调度负责人',
        thresholdValue: 2,
        receivers: ['当班现场主管', '省区调度负责人', '总部时效风控大群']
      }
    }
  ],
  edges: [
    { id: 'edge-1', source: 'node-trigger', target: 'node-delay', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
    { id: 'edge-2', source: 'node-trigger', target: 'node-weighing', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
    { id: 'edge-3', source: 'node-delay', target: 'node-escalation', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
    { id: 'edge-4', source: 'node-weighing', target: 'node-escalation', style: { stroke: '#6366f1', strokeWidth: 1.5 } }
  ],

  onNodesChange: (changes) => set((state) => ({
    nodes: applyNodeChanges(changes, state.nodes) as RuleNode[]
  })),

  onEdgesChange: (changes) => set((state) => ({
    edges: applyEdgeChanges(changes, state.edges) as Edge[]
  })),

  onConnect: (connection) => set((state) => ({
    edges: addEdge({ ...connection, style: { stroke: '#6366f1', strokeWidth: 1.5 } }, state.edges)
  })),

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  updateNodeData: (id, data) => set((state) => ({
    nodes: state.nodes.map((node) => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, ...data } };
      }
      return node;
    })
  })),

  addNode: (nodeType, position, skillData) => set((state) => {
    const id = `node-${Date.now()}`;
    const newNode: RuleNode = {
      id,
      type: nodeType,
      position,
      data: skillData ? { ...skillData.defaultData } : { label: `自定义 ${nodeType}` }
    };
    return {
      nodes: [...state.nodes, newNode]
    };
  }),

  clearCanvas: () => set({ nodes: [], edges: [] }),

  // AI Agent States
  isThinking: false,
  isDeepThinking: true,
  thinkingSteps: [],
  aiInput: '监控上海到杭州冷链车，如果首中心发车超时2小时，或者计重相对误差大于5%，立刻预警给省区调度，超过6小时上报总部。',
  recommendedTemplate: null,
  
  setAiInput: (aiInput) => set({ aiInput }),
  setDeepThinking: (isDeepThinking) => set({ isDeepThinking }),
  setRecommendedTemplate: (recommendedTemplate) => set({ recommendedTemplate }),

  triggerAiGenerate: () => {
    set({ isThinking: true, thinkingSteps: [], recommendedTemplate: null });
    
    const steps = [
      { id: '1', text: '解析语义：提取关键时效与精度指标 [发车超时]、[计重相对误差]', status: 'pending' as const },
      { id: '2', text: '匹配业务经验技能：拉取 [校验全链路轨迹停滞] (delay) 与 [提取设备计重相对误差] (weighing)', status: 'pending' as const },
      { id: '3', text: '匹配官方模板：大促期间超时检测，关联《双十一波次发车超时预警》模板', status: 'pending' as const }
    ];

    let currentStep = 0;
    
    // Simulate thinking process steps (1 second interval)
    const runStep = () => {
      if (currentStep < steps.length) {
        set((state) => {
          const updatedSteps = [...state.thinkingSteps];
          if (currentStep > 0) {
            updatedSteps[currentStep - 1].status = 'done';
          }
          updatedSteps.push({ ...steps[currentStep], status: 'active' });
          return { thinkingSteps: updatedSteps };
        });
        currentStep++;
        setTimeout(runStep, 1000);
      } else {
        // Complete generation, recommend template and populate canvas nodes
        set((state) => {
          const finalSteps = state.thinkingSteps.map(s => ({ ...s, status: 'done' as const }));
          
          // Recommends template matching the input context
          const matchedTemplate = state.templates.find(t => t.id === 'tpl-congestion') || null;

          const userNodes: RuleNode[] = [
            {
              id: 'node-trigger',
              type: 'trigger',
              position: { x: 250, y: 40 },
              data: { label: '运单状态变更: [发车超时] / [设备过磅]' }
            },
            {
              id: 'node-delay',
              type: 'trajectory',
              position: { x: 80, y: 180 },
              data: { label: '首中心发车延误校验', thresholdValue: 2, operator: 'greater', category: '冷链车监控' }
            },
            {
              id: 'node-weighing',
              type: 'weighing',
              position: { x: 420, y: 180 },
              data: { label: '计重相对误差诊断', thresholdValue: 5, operator: 'greater' }
            },
            {
              id: 'node-escalation',
              type: 'escalation',
              position: { x: 250, y: 360 },
              data: { 
                label: '触发组织架构阶梯升级', 
                targetRole: '省区调度',
                thresholdValue: 6,
                receivers: ['当班现场主管', '省区调度', '总部时效风控大群']
              }
            }
          ];

          const userEdges: Edge[] = [
            { id: 'edge-1', source: 'node-trigger', target: 'node-delay', animated: true, style: { stroke: '#6366f1', strokeWidth: 1.5 } },
            { id: 'edge-2', source: 'node-trigger', target: 'node-weighing', animated: true, style: { stroke: '#6366f1', strokeWidth: 1.5 } },
            { id: 'edge-3', source: 'node-delay', target: 'node-escalation', style: { stroke: '#6366f1', strokeWidth: 1.5 } },
            { id: 'edge-4', source: 'node-weighing', target: 'node-escalation', style: { stroke: '#6366f1', strokeWidth: 1.5 } }
          ];

          return {
            isThinking: false,
            thinkingSteps: finalSteps,
            recommendedTemplate: matchedTemplate,
            nodes: userNodes,
            edges: userEdges
          };
        });
      }
    };

    setTimeout(runStep, 500);
  },

  // Templates list state
  templates: initialTemplates,

  applyTemplate: (templateId, formValues) => {
    const matchedTemplate = get().templates.find(t => t.id === templateId);
    if (!matchedTemplate) return;

    set((state) => {
      // Create Canvas nodes using fill-in inputs parameters
      const templateNodes: RuleNode[] = [
        {
          id: 'node-trigger',
          type: 'trigger',
          position: { x: 250, y: 40 },
          data: { label: `运单状态变更 / [${formValues.stage}] 事件` }
        },
        {
          id: 'node-delay',
          type: 'trajectory',
          position: { x: 250, y: 190 },
          data: { 
            label: matchedTemplate.name.replace('模板', ''), 
            thresholdValue: formValues.threshold, 
            operator: 'greater',
            category: `省区包含: ${formValues.province}`
          }
        },
        {
          id: 'node-escalation',
          type: 'escalation',
          position: { x: 250, y: 350 },
          data: { 
            label: '配置下游动作与升级', 
            thresholdValue: 4,
            receivers: ['当班现场主管', '省区调度负责人', `总部群: ${formValues.channel}`]
          }
        }
      ];

      const templateEdges: Edge[] = [
        { id: 'edge-1', source: 'node-trigger', target: 'node-delay', animated: true, style: { stroke: '#6366f1', strokeWidth: 1.5 } },
        { id: 'edge-2', source: 'node-delay', target: 'node-escalation', style: { stroke: '#6366f1', strokeWidth: 1.5 } }
      ];

      // Insert alarms matching the template parameters
      const newAlert: AlertEvent = {
        id: `ALERT-${Math.floor(200 + Math.random() * 800)}`,
        waybill: `ZTO-${formValues.province === '上海' ? 'SH' : 'ZJ'}-22081`,
        type: templateId === 'tpl-weighing-drift' ? 'weighing' : 'trajectory',
        anomalyName: `${formValues.stage}超时预警 (${formValues.threshold}分钟)`,
        nodeDetail: `${formValues.province}核心分拨中心`,
        timeLeft: formValues.threshold * 60,
        expectedAction: `等待 WMS 系统上传 [已出库装车] 消息流`,
        status: 'active',
        dingTalkStatus: '⏳ 倒计时中'
      };

      return {
        nodes: templateNodes,
        edges: templateEdges,
        recommendedTemplate: null,
        alerts: [newAlert, ...state.alerts]
      };
    });
  },

  // Alerts State
  alerts: initialAlerts,
  
  decrementAlertCountdowns: () => set((state) => ({
    alerts: state.alerts.map((alert) => {
      if (alert.status === 'active' && alert.timeLeft > 0) {
        return { ...alert, timeLeft: alert.timeLeft - 1 };
      }
      return alert;
    })
  })),

  triggerDingTalkUrge: (alertId) => set((state) => ({
    alerts: state.alerts.map((alert) => {
      if (alert.id === alertId) {
        return { 
          ...alert, 
          dingTalkStatus: '🔔 已催办网点负责人' 
        };
      }
      return alert;
    })
  })),

  triggerMobileWeighingClosedLoop: () => {
    // Finds active weighing alerts, sets status to closing (gives 1s flash duration)
    // Then removes the alert after 1.5 seconds.
    const activeWeighingAlert = get().alerts.find(a => a.type === 'weighing' && a.status === 'active');
    
    if (!activeWeighingAlert) return;
    
    // Set status to closing
    set((state) => ({
      alerts: state.alerts.map((alert) => {
        if (alert.id === activeWeighingAlert.id) {
          return { 
            ...alert, 
            status: 'closing', 
            dingTalkStatus: '✅ 异常已消除' 
          };
        }
        return alert;
      }),
      // Append an audit log showing it resolved!
      auditRecords: [
        {
          id: `AUDIT-${Math.floor(805 + Math.random() * 100)}`,
          ruleName: '称重设备精度高危异常规则',
          triggerTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          waybillOrDevice: activeWeighingAlert.waybill,
          receiverUid: 'dingtalk_user_2209',
          channel: '钉钉群机器人',
          status: '已核销',
          isResolved: true,
          eventDetails: '检测到二次校准数据。相对误差回落至 1.0%，低于 5% 阈值，告警执行隐性核销。'
        },
        ...get().auditRecords
      ]
    }));

    // Wait and then delete
    setTimeout(() => {
      set((state) => ({
        alerts: state.alerts.filter((alert) => alert.id !== activeWeighingAlert.id)
      }));
    }, 1500);
  },

  // Data Source & Skill Mapper State
  datasource: {
    connection: 'ClickHouse - 生产集群',
    database: 'dm_ll',
    table: 'dwd_cl_shipment_package_out_warehouse_d'
  },
  schemaFields: [
    { fieldName: 'id', type: 'String', isPrimaryKey: true },
    { fieldName: 'warehouse_name', type: 'String' },
    { fieldName: 'process_type', type: 'Int' },
    { fieldName: 'status', type: 'Int' },
    { fieldName: 'receive_time', type: 'DateTime' },
    { fieldName: 'latest_delivery_time', type: 'DateTime' },
    { fieldName: 'shipped_time', type: 'DateTime' },
    { fieldName: 'sign_time', type: 'DateTime' },
    { fieldName: 'update_time', type: 'DateTime' }
  ],
  semanticFields: [
    { fieldName: 'id', type: 'PK', label: '包裹唯一ID' },
    { fieldName: 'warehouse_name', type: 'Dim', label: '仓库名称' },
    { fieldName: 'process_type', type: 'Dim', label: '处理类型' },
    { fieldName: 'status', type: 'Dim', label: '出库状态' },
    { fieldName: 'receive_time', type: 'Dim', label: '实际揽收时间' },
    { fieldName: 'latest_delivery_time', type: 'Metric', label: '最晚发货时间' },
    { fieldName: 'shipped_time', type: 'Dim', label: '发运时间' },
    { fieldName: 'sign_time', type: 'Dim', label: '签收时间' },
    { fieldName: 'update_time', type: 'Dim', label: '最新轨迹更新时间' }
  ],
  draggedFields: ['id'],
  skillsLibrary: initialSkills,
  selectedSkillId: 'skill-temp-humidity',
  setSelectedSkillId: (id) => set({ selectedSkillId: id }),
  updateSkill: (id, updated) => set((state) => ({
    skillsLibrary: state.skillsLibrary.map((skill) => 
      skill.id === id ? { ...skill, ...updated } : skill
    )
  })),
  deleteSkill: (id) => set((state) => ({
    skillsLibrary: state.skillsLibrary.filter((skill) => skill.id !== id),
    selectedSkillId: state.selectedSkillId === id ? null : state.selectedSkillId
  })),
  createSkill: (skill) => set((state) => {
    const newId = `skill-${Date.now()}`;
    const newSkill = { ...skill, id: newId };
    return {
      skillsLibrary: [...state.skillsLibrary, newSkill],
      selectedSkillId: newId
    };
  }),

  setDatasource: (datasource) => set({ datasource }),
  
  mapField: (fieldName, type, label, unit) => set((state) => {
    const existing = state.semanticFields.find(f => f.fieldName === fieldName);
    const updated = existing 
      ? state.semanticFields.map(f => f.fieldName === fieldName ? { ...f, type, label, unit } : f)
      : [...state.semanticFields, { fieldName, type, label, unit }];
    
    return {
      semanticFields: updated,
      draggedFields: Array.from(new Set([...state.draggedFields, fieldName]))
    };
  }),

  removeMappedField: (fieldName) => set((state) => ({
    semanticFields: state.semanticFields.filter(f => f.fieldName !== fieldName),
    draggedFields: state.draggedFields.filter(f => f !== fieldName)
  })),

  publishSkill: (name, category, config) => set((state) => {
    const newSkill: SkillCardData = {
      id: `skill-${Date.now()}`,
      name,
      category,
      description: `基于宽表属性动态打包的 ${name} 校验组件`,
      fieldsConfig: Object.keys(config).join(', '),
      defaultData: {
        label: name,
        thresholdValue: 10,
        operator: 'greater',
        ...config
      }
    };
    return {
      skillsLibrary: [...state.skillsLibrary, newSkill]
    };
  }),

  // Push Action Configuration State
  pushTemplate: {
    titleColor: '🔴 红色 (严重/升级)',
    markdownTemplate: `### 🚨 \${send_prov_name} - 节点停滞预警
**受影响单号**：\${waybill_no}
**当前停滞节点**：\${curr_node_type}
**已耗时**：\${duration_mins} 分钟
> 系统提示：底层数据未见下一步流转，请立即核实现场作业情况。`
  },
  pushFilter: {
    antiStorm: true,
    mergeDim: 'curr_node_type',
    windowMinutes: 5
  },
  escalationNodes: [
    { id: '1', title: '节点 1 (T0 触达)', timeTrigger: '0分钟', condition: '规则命中即触发', receiverType: '动态路由', receiverVal: '[curr_node_code] => 当班现场主管' },
    { id: '2', title: '节点 2 (T+2 阶梯升级)', timeTrigger: '2小时', condition: '预警存续2小时，数仓无核销', receiverType: '动态路由', receiverVal: '[send_prov_name] => 省区调度负责人' },
    { id: '3', title: '节点 3 (T+6 极限告警)', timeTrigger: '6小时', condition: '预警存续6小时，数仓无核销', receiverType: '静态路由', receiverVal: '企业群 => 总部时效风控大群' }
  ],

  setPushTemplate: (template) => set((state) => ({
    pushTemplate: { ...state.pushTemplate, ...template }
  })),

  setPushFilter: (filter) => set((state) => ({
    pushFilter: { ...state.pushFilter, ...filter }
  })),

  updateEscalationNode: (id, field) => set((state) => ({
    escalationNodes: state.escalationNodes.map((n) => n.id === id ? { ...n, ...field } : n)
  })),

  // Smart Audit Data State
  auditRecords: initialAuditRecords,
  filteredAuditRecords: initialAuditRecords,
  auditQuery: '',
  setAuditQuery: (auditQuery) => set({ auditQuery }),
  searchAuditEvents: (query) => set((state) => {
    if (!query.trim()) {
      return { filteredAuditRecords: state.auditRecords };
    }
    
    // Simulating semantic model parsing for query
    const q = query.toLowerCase();
    let results = state.auditRecords;

    if (q.includes('昨日') || q.includes('24日')) {
      results = results.filter(r => r.triggerTime.includes('2026-05-24'));
    }
    if (q.includes('今日') || q.includes('今日') || q.includes('25日')) {
      results = results.filter(r => r.triggerTime.includes('2026-05-25'));
    }
    if (q.includes('核销') || q.includes('闭环') || q.includes('完成')) {
      results = results.filter(r => r.isResolved === true);
    }
    if (q.includes('未核销') || q.includes('活动') || q.includes('活跃')) {
      results = results.filter(r => r.isResolved === false);
    }
    if (q.includes('超时') || q.includes('升级') || q.includes('警告')) {
      results = results.filter(r => r.status.includes('升级') || r.status.includes('警告'));
    }
    if (q.includes('称重') || q.includes('误差') || q.includes('精密') || q.includes('设备')) {
      results = results.filter(r => r.ruleName.includes('称重') || r.waybillOrDevice.includes('Weigher'));
    }
    if (q.includes('冷链') || q.includes('轨迹') || q.includes('延误')) {
      results = results.filter(r => r.ruleName.includes('冷链') || r.waybillOrDevice.startsWith('ZTO'));
    }

    // Fallback simple search if no special keywords matched
    if (results.length === state.auditRecords.length) {
      results = state.auditRecords.filter(r => 
        r.ruleName.toLowerCase().includes(q) ||
        r.waybillOrDevice.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.eventDetails.toLowerCase().includes(q)
      );
    }

    return { filteredAuditRecords: results };
  })
}));
