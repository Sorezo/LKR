import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StrategyType, SimulationResult, BacktestPoint } from '../types';
import { analyzeSimulation } from '../services/geminiService';
import { Play, RefreshCw, TrendingUp, AlertTriangle, BarChart3, PieChart } from 'lucide-react';

// Helper to generate mock curve based on strategy type
const generateMockData = (days: number, volatility: number, trend: number): BacktestPoint[] => {
  const data: BacktestPoint[] = [];
  let currentValue = 10000;
  let benchmarkValue = 10000;
  const startDate = new Date('2023-01-01');

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const dailyChange = (Math.random() - 0.5 + trend) * volatility;
    const benchChange = (Math.random() - 0.5 + 0.0002) * (volatility * 0.8); // Benchmark slightly less volatile, slight upward drift

    currentValue = currentValue * (1 + dailyChange);
    benchmarkValue = benchmarkValue * (1 + benchChange);

    data.push({
      date: date.toISOString().split('T')[0],
      value: Number(currentValue.toFixed(2)),
      benchmark: Number(benchmarkValue.toFixed(2))
    });
  }
  return data;
};

export const SimulatorView: React.FC = () => {
  const [strategyType, setStrategyType] = useState<StrategyType>(StrategyType.MA_CROSSOVER);
  const [initialCapital, setInitialCapital] = useState(10000);
  const [duration, setDuration] = useState(365);
  
  const [simulating, setSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = async () => {
    setSimulating(true);
    
    // 1. Generate local mock numerical data for the chart
    // Different "trends" based on strategy type for demo variety
    let trend = 0.0005; // default
    if (strategyType === StrategyType.MOMENTUM) trend = 0.0012; // higher risk/reward
    if (strategyType === StrategyType.RSI_MEAN_REVERSION) trend = 0.0003; // slower
    
    const mockData = generateMockData(duration, 0.015, trend);

    // 2. Use Gemini to generate the "Analysis" text
    const analysis = await analyzeSimulation(strategyType, { initialCapital, duration });

    setResult({
      data: mockData,
      metrics: analysis.metrics!,
      analysis: analysis.analysis!
    });
    setSimulating(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">策略回测实验室</h1>
          <p className="text-slate-400">使用历史数据模型模拟基金表现。</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-emerald-500" /> 参数配置
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">策略模型</label>
                <select
                  value={strategyType}
                  onChange={(e) => setStrategyType(e.target.value as StrategyType)}
                  className="w-full mt-2 bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:border-emerald-500 outline-none"
                >
                  {Object.values(StrategyType).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">初始资金 ($)</label>
                <input
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value))}
                  className="w-full mt-2 bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg p-2.5 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                 <label className="text-xs text-slate-400 uppercase font-bold tracking-wider">回测周期 (天)</label>
                <input
                  type="range"
                  min="30"
                  max="730"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full mt-2 accent-emerald-500 cursor-pointer"
                />
                <div className="text-right text-xs text-slate-400 mt-1">{duration} 天</div>
              </div>

              <button
                onClick={runSimulation}
                disabled={simulating}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 mt-4 transition-all shadow-lg shadow-emerald-900/20"
              >
                {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                运行回测
              </button>
            </div>
          </div>

          {result && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
               <h3 className="text-slate-100 font-semibold mb-4 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-blue-500" /> 关键指标
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">总收益率</div>
                    <div className={`text-lg font-bold ${result.metrics.totalReturn.startsWith('-') ? 'text-red-400' : 'text-emerald-400'}`}>
                      {result.metrics.totalReturn}
                    </div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">夏普比率</div>
                    <div className="text-lg font-bold text-blue-400">{result.metrics.sharpeRatio}</div>
                  </div>
                   <div className="bg-slate-950 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">最大回撤</div>
                    <div className="text-lg font-bold text-red-400">{result.metrics.maxDrawdown}</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">年化收益</div>
                    <div className="text-lg font-bold text-slate-200">{result.metrics.annualizedReturn}</div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Chart Area */}
        <div className="lg:col-span-9">
          {result ? (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg h-[450px]">
                <h3 className="text-sm font-medium text-slate-400 mb-4 flex justify-between">
                  <span>净值曲线 vs 基准 (S&P 500)</span>
                  <span className="flex items-center gap-2 text-emerald-400"><TrendingUp className="w-4 h-4" /> 预期增长</span>
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickFormatter={(str) => new Date(str).toLocaleDateString('zh-CN', {month:'short', year:'2-digit'})}
                    />
                    <YAxis stroke="#64748b" fontSize={12} domain={['auto', 'auto']} prefix="$" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                      itemStyle={{ color: '#f8fafc' }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString('zh-CN')}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="策略净值" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="benchmark" name="基准指数" stroke="#64748b" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" /> AI 策略分析
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {result.analysis}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[450px] bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500">
              <BarChart3 className="w-20 h-20 mb-6 opacity-20" />
              <p className="text-xl">暂无回测数据</p>
              <p className="text-sm mt-2">请配置左侧参数并点击“运行回测”</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Simple Icon component for Simulator
const Settings2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
);