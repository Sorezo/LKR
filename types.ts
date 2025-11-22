
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CODE_GENERATOR = 'CODE_GENERATOR',
  SIMULATOR = 'SIMULATOR',
  MARKET_ADVISOR = 'MARKET_ADVISOR',
  FUND_MONITOR = 'FUND_MONITOR'
}

export interface GeneratedCode {
  javaModel: string;
  pythonScraper: string;
  explanation: string;
}

export interface BacktestPoint {
  date: string;
  value: number;
  benchmark: number;
}

export interface SimulationResult {
  data: BacktestPoint[];
  metrics: {
    totalReturn: string;
    annualizedReturn: string;
    maxDrawdown: string;
    sharpeRatio: string;
  };
  analysis: string;
}

export enum StrategyType {
  MA_CROSSOVER = '双均线交叉策略 (MA Crossover)',
  RSI_MEAN_REVERSION = 'RSI 均值回归 (Mean Reversion)',
  MOMENTUM = '动量/趋势跟踪 (Momentum)',
  GRID_TRADING = '网格交易 (Grid Trading)'
}

export interface MarketInput {
  indexLevel: string; // e.g. "3000点" or "High"
  sentiment: string; // e.g. "Fear", "Greed"
  volumeTrend: string; // e.g. "Increasing", "Shrinking"
  sectorFocus: string; // e.g. "Technology", "Consumer"
}

export interface MarketAdvice {
  signal: 'BUY' | 'SELL' | 'HOLD';
  confidence: number; // 0-100
  title: string; // Short summary e.g. "Strong Buy Signal"
  reasoning: string[]; // Bullet points
  riskLevel: 'Low' | 'Medium' | 'High';
  actionPlan: string; // Specific advice
}

export interface FundRealtimeData {
  id: string;
  name: string;
  code: string;
  price: number;
  changePercent: number;
  volume: string; // e.g., "Heavy", "Light"
  trend7d: number[]; // For sparkline
  sector: string;
}

export interface FundAnalysisResult {
  fundId: string;
  signal: 'BUY' | 'SELL' | 'HOLD';
  suggestion: string; // Short suggestion
  keyReason: string;
}
