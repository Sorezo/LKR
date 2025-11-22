import React, { useState } from 'react';
import { BrainCircuit, TrendingUp, Activity, AlertTriangle, CheckCircle2, Loader2, Zap, ArrowRight } from 'lucide-react';
import { getMarketAdvice } from '../services/geminiService';
import { MarketAdvice, MarketInput } from '../types';

export const MarketAdvisorView: React.FC = () => {
  const [inputs, setInputs] = useState<MarketInput>({
    indexLevel: '震荡上行，站稳3000点',
    sentiment: '市场情绪回暖，贪婪指数上升',
    volumeTrend: '温和放量',
    sectorFocus: '科技与新能源领涨'
  });
  
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<MarketAdvice | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await getMarketAdvice(inputs);
      setAdvice(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const quickFill = () => {
    setInputs({
      indexLevel: '大盘缩量下跌，跌破关键支撑位',
      sentiment: '极度恐慌',
      volumeTrend: '严重缩量',
      sectorFocus: '防御性板块（银行、公用事业）抗跌'
    });
  };

  const getSignalColor = (signal: string) => {
    switch(signal) {
      case 'BUY': return 'text-emerald-400 border-emerald-500 bg-emerald-500/10';
      case 'SELL': return 'text-rose-400 border-rose-500 bg-rose-500/10';
      case 'HOLD': return 'text-amber-400 border-amber-500 bg-amber-500/10';
      default: return 'text-slate-400 border-slate-500';
    }
  };

  const getSignalBg = (signal: string) => {
    switch(signal) {
      case 'BUY': return 'from-emerald-900/50 to-slate-900';
      case 'SELL': return 'from-rose-900/50 to-slate-900';
      case 'HOLD': return 'from-amber-900/50 to-slate-900';
      default: return 'from-slate-900 to-slate-950';
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-emerald-400" />
          智能决策顾问
        </h1>
        <p className="text-slate-400">
          输入当前市场特征，获取 AI 驱动的专业买卖建议。
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                市场参数
              </h2>
              <button onClick={quickFill} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <Zap className="w-3 h-3" /> 模拟熊市数据
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">大盘走势 / 点位</label>
                <input 
                  type="text" 
                  value={inputs.indexLevel}
                  onChange={(e) => setInputs({...inputs, indexLevel: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">市场情绪</label>
                <input 
                  type="text" 
                  value={inputs.sentiment}
                  onChange={(e) => setInputs({...inputs, sentiment: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">成交量趋势</label>
                <select 
                  value={inputs.volumeTrend}
                  onChange={(e) => setInputs({...inputs, volumeTrend: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-emerald-500 outline-none transition-all text-sm appearance-none"
                >
                  <option value="放量上涨">放量上涨</option>
                  <option value="温和放量">温和放量</option>
                  <option value="缩量整理">缩量整理</option>
                  <option value="放量下跌">放量下跌 (恐慌盘)</option>
                  <option value="严重缩量">严重缩量 (交投清淡)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">领涨/领跌板块</label>
                <input 
                  type="text" 
                  value={inputs.sectorFocus}
                  onChange={(e) => setInputs({...inputs, sectorFocus: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/30 mt-4 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BrainCircuit className="w-5 h-5" />}
                生成决策建议
              </button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-8">
          {advice ? (
            <div className={`h-full bg-gradient-to-br ${getSignalBg(advice.signal)} border-2 ${getSignalColor(advice.signal).split(' ')[1]} rounded-3xl p-8 shadow-2xl relative overflow-hidden`}>
              
              {/* Background decoration */}
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                {advice.signal === 'BUY' && <TrendingUp className="w-64 h-64" />}
                {advice.signal === 'SELL' && <TrendingUp className="w-64 h-64 rotate-180" />}
                {advice.signal === 'HOLD' && <Activity className="w-64 h-64" />}
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-sm font-bold opacity-70 uppercase tracking-widest mb-2">Model Recommendation</div>
                    <div className={`text-6xl font-black tracking-tighter ${getSignalColor(advice.signal).split(' ')[0]}`}>
                      {advice.signal === 'BUY' ? '建议买入' : advice.signal === 'SELL' ? '建议卖出' : '建议持有'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400 mb-1">AI 置信度</div>
                    <div className="text-3xl font-bold text-white">{advice.confidence}%</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{advice.title}</h3>
                  <p className="text-lg text-slate-300 leading-relaxed">{advice.actionPlan}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/5">
                    <h4 className="text-slate-400 font-bold text-sm uppercase mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> 决策依据
                    </h4>
                    <ul className="space-y-3">
                      {advice.reasoning.map((reason, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2"></span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/5 flex flex-col justify-center">
                     <h4 className="text-slate-400 font-bold text-sm uppercase mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> 风险等级
                    </h4>
                    <div className="flex items-end gap-2">
                      <span className={`text-4xl font-bold ${
                        advice.riskLevel === 'High' ? 'text-rose-400' : 
                        advice.riskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {advice.riskLevel === 'High' ? '高风险' : advice.riskLevel === 'Medium' ? '中等风险' : '低风险'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700/50 h-2 rounded-full mt-4 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          advice.riskLevel === 'High' ? 'bg-rose-500 w-full' : 
                          advice.riskLevel === 'Medium' ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-1/3'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/10 flex justify-between text-sm text-slate-400 opacity-60">
                   <span>Model: Gemini 2.5 Flash</span>
                   <span>Generated at: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-slate-900/50 border border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-500 group">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 group-hover:bg-slate-800/80 transition-colors">
                <BrainCircuit className="w-10 h-10 opacity-40" />
              </div>
              <p className="text-xl font-medium text-slate-400">等待分析</p>
              <p className="text-sm mt-2 max-w-xs text-center">请在左侧填写市场参数，点击“生成决策建议”以获取模型分析结果。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};