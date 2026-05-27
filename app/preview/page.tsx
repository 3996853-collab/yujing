import React from 'react';
import DingTalkPreview from '@/components/rules/DingTalkPreview';

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">预警接收端预览</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          以下为您配置的预警规则在实际移动端设备上的接收效果预览。左侧为发送至「钉钉预警群」的卡片样式，右侧为触发「钉钉工作通知」的卡片样式。
        </p>
      </div>
      
      <div className="flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-24">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-bold text-gray-700 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100">
            场景 1: 钉钉预警群机器人
          </h2>
          <DingTalkPreview type="group" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-bold text-gray-700 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100">
            场景 2: 钉钉工作通知
          </h2>
          <DingTalkPreview type="notice" />
        </div>
      </div>
    </div>
  );
}
