import React, { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { generateQuantCode } from '../services/geminiService';
import { GeneratedCode } from '../types';
import { Cpu, Loader2, PlayCircle, Settings2, FileJson, Coffee } from 'lucide-react';

export const CodeGeneratorView: React.FC = () => {
  const [description, setDescription] = useState('编写一个基于双均线（MA50/MA200）和RSI指标的基金交易策略模型。当短期均线上穿长期均线且RSI低于70时买入，反之卖出。');
  const [indicators, setIndicators] = useState<string>('SMA, RSI, Volume');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedCode | null>(null);
  const [activeTab, setActiveTab] = useState<'java' | 'python'>('java');

  const handleGenerate = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const indicatorArray = indicators.split(',').map(s => s.trim());
      const data = await generateQuantCode(description, indicatorArray);
      setResult(data);
    } catch (e) {
      alert("生成失败，请检查 API Key 或重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">量化模型架构师</h1>
        <p className="text-slate-400">
          使用 AI 生成生产级 <span className="text-emerald-400">Java</span> 策略模型和 <span className="text-blue-400">Python</span> 数据爬虫。
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-white">策略配置</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">策略逻辑描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none resize-none transition-all text-sm"
                  placeholder="描述你的交易策略（例如：布林带突破，网格交易...）"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">技术指标</label>
                <input
                  type="text"
                  value={indicators}
                  onChange={(e) => setIndicators(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all text-sm"
                  placeholder="SMA, EMA, MACD..."
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20 mt-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>正在构建系统...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-5 h-5" />
                    <span>生成代码系统</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {result && (
             <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                   <Coffee className="w-4 h-4 text-yellow-500" /> 
                   AI 分析说明
                </h3>
                <div className="prose prose-invert prose-sm max-w-none text-slate-400 leading-relaxed">
                  <p>{result.explanation}</p>
                </div>
             </div>
          )}
        </div>

        {/* Output Section */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col h-[800px]">
              <div className="flex border-b border-slate-800 bg-slate-950/50">
                <button
                  onClick={() => setActiveTab('java')}
                  className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'java' ? 'text-emerald-400 border-b-2 border-emerald-500 bg-slate-900' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <FileJson className="w-4 h-4" />
                  Java 策略模型
                </button>
                <button
                  onClick={() => setActiveTab('python')}
                  className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    activeTab === 'python' ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-900' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <FileJson className="w-4 h-4" />
                  Python 数据爬虫
                </button>
              </div>
              
              <div className="flex-1 overflow-auto bg-slate-950 p-4">
                {activeTab === 'java' ? (
                  <CodeBlock code={result.javaModel} language="java" title="QuantStrategy.java" />
                ) : (
                  <CodeBlock code={result.pythonScraper} language="python" title="FundScraper.py" />
                )}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600">
              <PlayCircle className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">准备生成</p>
              <p className="text-sm">请在左侧配置您的策略以开始生成。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};