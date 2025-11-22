
import React, { useState, useEffect } from 'react';
import { FundRealtimeData, FundAnalysisResult } from '../types';
import { analyzeFundTrend } from '../services/geminiService';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Zap, Loader2, BarChart2, Search, Clock, Activity } from 'lucide-react';

// Mock Data for initial state
const INITIAL_FUNDS: FundRealtimeData[] = [
  { id: '1', name: '招商中证白酒', code: '161725', price: 1.245, changePercent: 1.2, volume: '放量', sector: '消费', trend7d: [1.1, 1.12, 1.15, 1.14, 1.18, 1.20, 1.24] },
  { id: '2', name: '诺安成长混合', code: '320007', price: 2.103, changePercent: -0.8, volume: '缩量', sector: '半导体', trend7d: [2.2, 2.18, 2.15, 2.16, 2.14, 2.12, 2.10] },
  { id: '3', name: '易方达蓝筹', code: '005827', price: 1.890, changePercent: 0.3, volume: '正常', sector: '混合', trend7d: [1.85, 1.86, 1.88, 1.88, 1.87, 1.89, 1.89] },
  { id: '4', name: '新能源ETF', code: '516160', price: 0.985, changePercent: 2.5, volume: '巨量', sector: '新能源', trend7d: [0.92, 0.93, 0.95, 0.94, 0.96, 0.97, 0.98] },
  { id: '5', name: '医疗ETF', code: '512170', price: 0.450, changePercent: -1.5, volume: '阴跌', sector: '医药', trend7d: [0.48, 0.47, 0.47, 0.46, 0.46, 0.45, 0.45] },
  { id: '6', name: '中概互联ETF', code: '513050', price: 1.050, changePercent: 0.1, volume: '盘整', sector: '科技', trend7d: [1.02, 1.03, 1.04, 1.04, 1.05, 1.04, 1.05] },
];

export const FundMonitorView: React.FC = () => {
  const [funds, setFunds] = useState<FundRealtimeData[]>(INITIAL_FUNDS);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, FundAnalysisResult>>({});

  // Simulate Real-time price ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setFunds(prevFunds => prevFunds.map(fund => {
        // Random fluctuation between -0.05% and +0.05% per tick
        const tick = (Math.random() - 0.5) * 0.1;
        const newChange = fund.changePercent + tick;
        // Occasionally update price
        const newPrice = fund.price * (1 + tick / 100);
        
        return {
          ...fund,
          changePercent: Number(newChange.toFixed(2)),
          price: Number(newPrice.toFixed(3))
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleAIAnalysis = async (fund: FundRealtimeData) => {
    setAnalyzingId(fund.id);
    // Clear previous result to show freshness
    const newResults = { ...results };
    delete newResults[fund.id];
    setResults(newResults);

    try {
      const analysis = await analyzeFundTrend(fund);
      setResults(prev => ({
        ...prev,
        [fund.id]: analysis
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-emerald-400" />
            热门基金实时监控
          </h1>
          <p className="text-slate-400">
            追踪市场热点基金动态，获取 AI 实时买卖信号。
          </p>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-sm bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          实时行情连接中
        </div>
      </header>

      {/* Search Bar (Visual Only) */}
      <div className="mb-6 relative">
        <input 
          type="text" 
          placeholder="输入基金代码或拼音 (例如: 005827)" 
          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 pl-12 text-slate-200 focus:border-emerald-500 outline-none transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {funds.map((fund) => {
          const isUp = fund.changePercent >= 0;
          const result = results[fund.id];

          return (
            <div key={fund.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all shadow-lg group">
              {/* Card Header */}
              <div className="p-5 border-b border-slate-800 flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {fund.name}
                    <span className="text-xs font-normal text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">{fund.code}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{fund.sector}板块 • {fund.volume}</p>
                </div>
                <div className={`text-right ${isUp ? 'text-rose-400' : 'text-emerald-400'}`}>
                   <div className="text-2xl font-bold tabular-nums">{fund.price.toFixed(3)}</div>
                   <div className="text-sm font-medium flex items-center justify-end gap-1">
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isUp ? '+' : ''}{fund.changePercent.toFixed(2)}%
                   </div>
                </div>
              </div>

              {/* Mini Chart Area */}
              <div className="h-16 bg-slate-950/30 relative border-b border-slate-800">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={fund.trend7d.map((val, i) => ({ i, val }))}>
                      <Line 
                        type="monotone" 
                        dataKey="val" 
                        stroke={isUp ? '#fb7185' : '#34d399'} 
                        strokeWidth={2} 
                        dot={false} 
                      />
                    </LineChart>
                 </ResponsiveContainer>
              </div>

              {/* AI Action Area */}
              <div className="p-5">
                {result ? (
                  <div className={`rounded-xl p-4 border ${
                    result.signal === 'BUY' ? 'bg-emerald-500/10 border-emerald-500/30' :
                    result.signal === 'SELL' ? 'bg-rose-500/10 border-rose-500/30' :
                    'bg-slate-800 border-slate-700'
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                       <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                          result.signal === 'BUY' ? 'bg-emerald-500 text-emerald-950' :
                          result.signal === 'SELL' ? 'bg-rose-500 text-rose-950' :
                          'bg-slate-600 text-slate-200'
                       }`}>
                          {result.signal === 'BUY' ? '建议买入' : result.signal === 'SELL' ? '建议卖出' : '建议观望'}
                       </span>
                       <span className="text-xs text-slate-400 flex items-center gap-1">
                         <Clock className="w-3 h-3" /> 刚刚
                       </span>
                    </div>
                    <p className="text-sm font-medium text-white mb-1">{result.suggestion}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{result.keyReason}</p>
                    
                    <button 
                      onClick={() => handleAIAnalysis(fund)}
                      className="w-full mt-3 py-1 text-xs text-slate-500 hover:text-white transition-colors border-t border-dashed border-slate-600/50 pt-2"
                    >
                      重新分析
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <button
                      onClick={() => handleAIAnalysis(fund)}
                      disabled={analyzingId === fund.id}
                      className={`w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
                        analyzingId === fund.id
                          ? 'bg-slate-800 text-slate-400 cursor-wait' 
                          : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/30'
                      }`}
                    >
                      {analyzingId === fund.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          正在分析盘面...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          AI 智能诊断
                        </>
                      )}
                    </button>
                    <p className="text-xs text-slate-500 mt-2">基于即时涨跌与成交量形态分析</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
