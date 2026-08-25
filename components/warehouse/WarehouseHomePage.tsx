'use client';

import React from 'react';
import { 
  X, ChevronDown, RotateCcw, Search, Settings, BarChart2, 
  FileText, ShoppingCart, Truck, Box
} from 'lucide-react';

const CardItem = ({ title, value, type }: { title: string, value: string | number, type: 'todo' | 'fail' }) => {
  const isFail = type === 'fail';
  return (
    <div className={`p-3 rounded flex flex-col justify-between h-20 border-l-2 ${
      isFail 
        ? 'bg-red-50/60 border-l-red-400 border-red-100' 
        : 'bg-orange-50 border-l-orange-400 border-orange-100'
    } border-t border-r border-b`}>
      <div className={`text-xs font-semibold ${isFail ? 'text-red-500' : 'text-orange-500'}`}>
        {title}
      </div>
      <div className={`text-xl font-bold ${isFail ? 'text-red-500' : 'text-orange-500'}`}>
        {value}
      </div>
    </div>
  );
};

export default function WarehouseHomePage() {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden text-gray-800">
      
      {/* 1. Header Tabs (Browser Style) */}
      <div className="flex border-b border-blue-100 bg-blue-50/30 pt-2 px-2">
        <div className="bg-white border-t border-l border-r border-blue-100 rounded-t-lg px-4 py-2 flex items-center gap-2 text-sm font-bold text-blue-600">
          <span>待办事项</span>
          <X className="h-3.5 w-3.5 cursor-pointer hover:bg-blue-50 rounded" />
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-100 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">货主</span>
          <div className="relative">
            <select className="appearance-none border border-gray-200 rounded px-3 py-1 pr-8 focus:outline-none focus:border-blue-400 cursor-pointer text-gray-700 font-medium bg-white">
              <option>全部货主</option>
              <option>苹果中国</option>
              <option>李宁体育</option>
              <option>盒马鲜生</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-medium">仓库</span>
          <div className="relative">
            <select className="appearance-none border border-gray-200 rounded px-3 py-1 pr-8 focus:outline-none focus:border-blue-400 cursor-pointer text-gray-700 font-medium bg-white">
              <option>全部仓库</option>
              <option>上海嘉定仓</option>
              <option>广州黄埔仓</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <span className="text-gray-500 font-medium">显示方案</span>
          <div className="relative">
            <select className="appearance-none border border-gray-200 rounded px-3 py-1 pr-8 focus:outline-none focus:border-blue-400 cursor-pointer text-gray-700 font-medium bg-white">
              <option>待办事项</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium px-2 py-1 rounded">
            <RotateCcw className="h-4 w-4" /> 重置
          </button>
          <button className="text-blue-500 hover:text-blue-600 font-medium px-2 py-1 flex items-center gap-1">
            展开更多 <ChevronDown className="h-4 w-4" />
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-1.5 rounded flex items-center gap-1 shadow-sm">
            <Search className="h-4 w-4" /> 搜索
          </button>
          <label className="flex items-center gap-1.5 cursor-pointer ml-2 text-gray-600 font-medium">
            <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
            自动刷新/5分钟
          </label>
          <ChevronDown className="h-4 w-4 text-gray-400 cursor-pointer" />
          <Settings className="h-5 w-5 text-gray-400 cursor-pointer ml-2 hover:text-gray-600" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#f8f9fc] custom-scrollbar">
        
        {/* 3. Today's Data Banner (PDA Content) */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-150">
          <div className="flex items-center gap-2 mb-4 font-extrabold text-gray-800 text-base">
            <BarChart2 className="h-5 w-5 text-gray-400" />
            今日作业情况
            <span className="ml-auto text-sm font-bold text-gray-500">
              整体履约率：<span className="text-emerald-600">98.5%</span>
            </span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {[
              { label: '已接单', value: '1,394' },
              { label: '面单已获取', value: '1,308' },
              { label: '已回传单号', value: '1,290' },
              { label: '已打单', value: '1,250' },
              { label: '已拣货', value: '1,180' },
              { label: '已复核', value: '1,150' },
              { label: '已打包', value: '1,140' },
              { label: '已称重', value: '1,135' },
              { label: '已发货', value: '1,134' },
              { label: '已取消', value: '12' },
              { label: '已拦截', value: '8' },
              { label: '缺货', value: '24' },
            ].map((stat, i) => (
              <div key={i} className="bg-[#eff9f4] border border-[#d6efe1] rounded p-3 flex flex-col justify-center min-w-[120px] min-h-[70px] shrink-0">
                <div className="text-xs font-semibold text-[#3b8c66] mb-1">{stat.label}</div>
                <div className="text-xl font-extrabold text-[#2d9e60]">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Four Columns Grid (PDA Content in WEB Design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          
          {/* Column 1: 订单履约 (Orders) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-150 p-4">
            <div className="flex items-center gap-2 font-extrabold text-gray-800 text-base mb-4">
              <FileText className="h-5 w-5 text-blue-500" /> 订单履约
            </div>
            
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 mb-3 cursor-pointer">
              <ChevronDown className="h-4 w-4 text-gray-400" /> 待办事项
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <CardItem title="待打单" value="23" type="todo" />
              <CardItem title="待拣货" value="41" type="todo" />
              <CardItem title="待复核" value="17" type="todo" />
              <CardItem title="待打包" value="29" type="todo" />
              <CardItem title="待称重" value="12" type="todo" />
              <CardItem title="待发货" value="35" type="todo" />
            </div>

            <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 mb-3 cursor-pointer">
              <ChevronDown className="h-4 w-4 text-gray-400" /> 仓内异常
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CardItem title="缺货异常" value="24" type="fail" />
              <CardItem title="面单异常" value="12" type="fail" />
              <CardItem title="回传超时" value="45" type="fail" />
              <CardItem title="打单超时" value="18" type="fail" />
              <CardItem title="拣货超时" value="32" type="fail" />
              <CardItem title="发货超时" value="56" type="fail" />
            </div>
          </div>

          {/* Column 2: 采购入库 (Purchasing) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-150 p-4">
            <div className="flex items-center gap-2 font-extrabold text-gray-800 text-base mb-4">
              <ShoppingCart className="h-5 w-5 text-blue-500" /> 采购入库
            </div>
            
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 mb-3 cursor-pointer">
              <ChevronDown className="h-4 w-4 text-gray-400" /> 待办事项
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <CardItem title="待入库" value="15" type="todo" />
            </div>
          </div>
          
          {/* Column 3: 库存管理 (Inventory) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-150 p-4">
            <div className="flex items-center gap-2 font-extrabold text-gray-800 text-base mb-4">
              <Box className="h-5 w-5 text-blue-500" /> 库存管理
            </div>
            
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 mb-3 cursor-pointer">
              <ChevronDown className="h-4 w-4 text-gray-400" /> 待办事项
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <CardItem title="调整单待审核" value="8" type="todo" />
              <CardItem title="盘点任务待盘点" value="3" type="todo" />
              <CardItem title="过期商品" value="12" type="todo" />
              <CardItem title="临期商品" value="45" type="todo" />
            </div>
          </div>

          {/* Column 4: 物流与售后 (Logistics) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-150 p-4">
            <div className="flex items-center gap-2 font-extrabold text-gray-800 text-base mb-4">
              <Truck className="h-5 w-5 text-blue-500" /> 物流与售后
            </div>
            
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 mb-3 cursor-pointer">
              <ChevronDown className="h-4 w-4 text-gray-400" /> 待办事项
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <CardItem title="待拦截" value="3" type="todo" />
              <CardItem title="待回库" value="7" type="todo" />
            </div>

            <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 mb-3 cursor-pointer">
              <ChevronDown className="h-4 w-4 text-gray-400" /> 物流异常
            </div>
            <div className="grid grid-cols-2 gap-3">
              <CardItem title="揽收超时" value="156" type="fail" />
              <CardItem title="未到首中心" value="89" type="fail" />
              <CardItem title="未到末中心" value="45" type="fail" />
              <CardItem title="未派送" value="34" type="fail" />
              <CardItem title="未签收" value="12" type="fail" />
            </div>
          </div>

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}} />
    </div>
  );
}
