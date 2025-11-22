
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Terminal, LineChart, CandlestickChart, BrainCircuit, Activity } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: '概览', icon: LayoutDashboard },
    { id: ViewState.FUND_MONITOR, label: '实时监控', icon: Activity },
    { id: ViewState.MARKET_ADVISOR, label: '智能决策', icon: BrainCircuit },
    { id: ViewState.CODE_GENERATOR, label: '代码构建器', icon: Terminal },
    { id: ViewState.SIMULATOR, label: '回测实验室', icon: LineChart },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
          <CandlestickChart className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-lg tracking-tight text-slate-100">QuantFund AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
          <p className="text-xs text-slate-400 mb-1">系统状态</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-emerald-400">Gemini 3.0 运行中</span>
          </div>
        </div>
      </div>
    </div>
  );
};
