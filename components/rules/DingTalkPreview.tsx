import React from 'react';
import { ChevronLeft, Phone, Video, MoreHorizontal, Bot, Bell, AlertCircle, Mic, Smile, Plus, ThumbsUp } from 'lucide-react';

interface DingTalkPreviewProps {
  type: 'group' | 'notice';
}

export default function DingTalkPreview({ type }: DingTalkPreviewProps) {
  const isGroup = type === 'group';

  return (
    <div className="w-[375px] h-[812px] bg-[#f2f2f2] rounded-[40px] shadow-2xl border-[8px] border-white flex flex-col overflow-hidden relative font-sans">
      {/* Status Bar */}
      <div className="h-11 bg-white flex justify-between items-center px-6 text-[14px] font-medium text-black">
        <span>10:30</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-4 h-3 bg-black rounded-sm" />
          <div className="w-4 h-3 bg-black rounded-sm" />
          <div className="w-6 h-3 bg-black rounded-sm" />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="h-14 bg-white flex items-center justify-between px-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] font-semibold text-gray-900">
                {isGroup ? '揽收预警群' : '工作通知'}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${isGroup ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                {isGroup ? '内部' : '政府'}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">归属于 网钉科技 &gt;</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-800">
          <Phone className="w-5 h-5" />
          <Video className="w-5 h-5" />
          <MoreHorizontal className="w-5 h-5" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="flex justify-center">
          <span className="bg-gray-200/60 text-gray-500 text-[11px] px-2 py-0.5 rounded">10:30</span>
        </div>

        <div className="flex gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-[#1677ff] rounded-[10px] flex items-center justify-center flex-shrink-0 text-white">
            {isGroup ? <Bot className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
          </div>

          <div className="flex flex-col gap-1 w-full max-w-[280px]">
            {/* Sender Name */}
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] text-gray-500">{isGroup ? '预警机器人' : '钉钉通知'}</span>
              <span className="text-[10px] bg-gray-200/50 text-gray-400 px-1 rounded border border-gray-200">
                {isGroup ? 'BOT' : '机器人'}
              </span>
            </div>

            {/* Message Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="p-4 space-y-4">
                {/* Header */}
                <div className={`flex items-center gap-2 text-[17px] font-bold ${isGroup ? 'text-[#d32029]' : 'text-[#1677ff]'}`}>
                  {isGroup ? <AlertCircle className="w-5 h-5 fill-current text-white" /> : <Bell className="w-5 h-5 fill-current text-white" />}
                  {isGroup ? '揽收超时预警' : '工作通知'}
                </div>

                {/* Subtitle */}
                <div className="text-[15px] text-gray-800 font-medium leading-snug">
                  {isGroup ? '有 ' : '您好，系统检测到有 '}
                  <span className="text-[#d32029] font-bold">10</span> 
                  {' 票订单即将揽收超时，请及时处理！'}
                </div>

                {/* Fields */}
                <div className="space-y-2 text-[13px] pt-1">
                  <div className="flex">
                    <span className="text-gray-500 w-[70px] shrink-0">{isGroup ? '预警类型:' : '通知类型:'}</span>
                    <span className="text-gray-800 font-medium">{isGroup ? '揽收超时预警' : '揽收超时提醒'}</span>
                  </div>
                  {isGroup && (
                    <div className="flex">
                      <span className="text-gray-500 w-[70px] shrink-0">预警等级:</span>
                      <span className="text-[#d97706] font-bold">重要</span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="text-gray-500 w-[70px] shrink-0">{isGroup ? '预警时间:' : '通知时间:'}</span>
                    <span className="text-gray-800 font-medium">2024-05-23 10:30:00</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-[70px] shrink-0">涉及票数:</span>
                    <span className="text-[#d32029] font-bold">10 票</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-[70px] shrink-0">截止时间:</span>
                    <span className="text-gray-800 font-medium">2024-05-23 23:59:59</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-[70px] shrink-0">备注:</span>
                    <span className="text-gray-800 font-medium leading-relaxed">请尽快安排揽收，避免超时产生不良影响。</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="border-t border-gray-100 py-3 text-center">
                <span className="text-[#1677ff] text-[15px] font-medium">查看详情</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Input Area */}
      {isGroup && (
        <div className="bg-[#f7f7f7] border-t border-gray-200 flex flex-col pb-6">
          <div className="px-4 py-2 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
              <span className="text-orange-400">📢</span> 群公告
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
              <span className="text-green-500">➕</span> 群助手
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
              <span className="text-blue-400">❄️</span> 更多
            </div>
          </div>
          <div className="px-3 pb-2 pt-1 flex items-center gap-3">
            <Mic className="w-7 h-7 text-gray-600 p-1 border border-gray-400 rounded-full" />
            <div className="flex-1 bg-white h-9 rounded-md border border-gray-300" />
            <ThumbsUp className="w-6 h-6 text-gray-600" />
            <Smile className="w-6 h-6 text-gray-600" />
            <Plus className="w-7 h-7 text-gray-600 p-0.5 border border-gray-400 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}
