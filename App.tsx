
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ViewState } from './types';
import { CodeGeneratorView } from './views/CodeGeneratorView';
import { SimulatorView } from './views/SimulatorView';
import { MarketAdvisorView } from './views/MarketAdvisorView';
import { FundMonitorView } from './views/FundMonitorView';
import { Wallet, ArrowUpRight, Activity } from 'lucide-react';

// Simple Dashboard Component specific to App to keep structure clean
const Dashboard: React.FC<({setView: (view: ViewState) => void})> = ({setView}) => (
  <div className="max-w-6xl mx-auto">
     <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">仪表盘</h1>
        <p className="text-slate-400">市场概览与模型状态。</p>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/20 p-6 rounded-2xl">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Wallet className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2 py-1 rounded">运行中</span>
           </div>
           <div className="text-3xl font-bold text-white mb-1">$124,592.00</div>
           <div className="text-sm text-emerald-400 flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4" /> +2.4% 今日
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
           </div>
           <div className="text-3xl font-bold text-white mb-1">4</div>
           <div className="text-sm text-slate-400">活跃算法</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
             <h3 className="text-slate-300 font-medium mb-4">系统健康度</h3>
             <div className="space-y-3">
                <div className="flex justify-between text-sm">
                   <span className="text-slate-500">API 延迟</span>
                   <span className="text-emerald-400">45ms</span>
                </div>
                <div className="flex justify-between text-sm">
                   <span className="text-slate-500">数据源</span>
                   <span className="text-emerald-400">已连接</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                   <div className="bg-emerald-500 h-full w-[98%]"></div>
                </div>
             </div>
        </div>
     </div>

     <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">推荐工作流</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button onClick={() => setView(ViewState.MARKET_ADVISOR)} className="relative p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-colors group text-left">
               <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center font-bold text-slate-300">1</div>
               <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-emerald-400 transition-colors">智能决策</h3>
               <p className="text-sm text-slate-400">前往 <strong>智能决策</strong> 输入市场参数，获取 AI 对买卖时机的即时判断。</p>
            </button>
            
            <button onClick={() => setView(ViewState.FUND_MONITOR)} className="relative p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-colors group text-left">
               <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center font-bold text-slate-300">2</div>
               <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-emerald-400 transition-colors">实时监控</h3>
               <p className="text-sm text-slate-400">前往 <strong>实时监控</strong> 查看热门基金动态并获取单只基金的 AI 诊断。</p>
            </button>

            <button onClick={() => setView(ViewState.SIMULATOR)} className="relative p-6 bg-slate-950 rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-colors group text-left">
               <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center font-bold text-slate-300">3</div>
               <h3 className="text-lg font-semibold text-slate-200 mb-2 group-hover:text-emerald-400 transition-colors">模拟回测</h3>
               <p className="text-sm text-slate-400">使用 <strong>回测实验室</strong> 验证策略在历史数据中的表现。</p>
            </button>
        </div>
     </div>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 overflow-y-auto p-8">
        {currentView === ViewState.DASHBOARD && <Dashboard setView={setCurrentView} />}
        {currentView === ViewState.MARKET_ADVISOR && <MarketAdvisorView />}
        {currentView === ViewState.FUND_MONITOR && <FundMonitorView />}
        {currentView === ViewState.CODE_GENERATOR && <CodeGeneratorView />}
        {currentView === ViewState.SIMULATOR && <SimulatorView />}
      </main>
    </div>
  );
}
