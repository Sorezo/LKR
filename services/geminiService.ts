
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedCode, SimulationResult, MarketInput, MarketAdvice, FundRealtimeData, FundAnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuantCode = async (
  strategyDescription: string,
  indicators: string[]
): Promise<GeneratedCode> => {
  try {
    const prompt = `
      你是一名资深量化开发工程师。用户希望构建一个基金交易系统。
      
      需求 Requirements:
      1. **Java (策略模型)**: 编写一个完整、生产就绪的 Java 类结构，实现基于以下描述的策略: "${strategyDescription}"。
         - 包含 'Strategy' 接口。
         - 包含使用以下指标的实现类: ${indicators.join(', ')}。
         - 包含一个基础的 'BacktestEngine' 类存根 (Stub)。
         - 使用严格的类型定义，并**必须使用中文注释**解释关键逻辑。
      
      2. **Python (爬虫)**: 编写一个健壮的 Python 脚本来抓取基金净值 (NAV) 数据。
         - 使用 'requests' 和 'pandas'。
         - 假设通用的 API 或 HTML 结构（例如天天基金、蛋卷基金等通用结构）。
         - 包含错误处理和重试逻辑。
         - 将数据保存为 CSV 格式。
         - **代码注释必须使用中文**。

      3. **说明 (Explanation)**: 用中文简要说明如何运行此系统。

      输出格式 Output Format (JSON):
      {
        "javaModel": "完整的 Java 代码字符串...",
        "pythonScraper": "完整的 Python 代码字符串...",
        "explanation": "Markdown 格式的中文说明..."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            javaModel: { type: Type.STRING },
            pythonScraper: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ['javaModel', 'pythonScraper', 'explanation']
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data as GeneratedCode;
    }
    throw new Error("AI 未返回响应");

  } catch (error) {
    console.error("Code generation failed:", error);
    throw error;
  }
};

export const analyzeSimulation = async (
  strategyName: string,
  params: any
): Promise<Partial<SimulationResult>> => {
  try {
    const prompt = `
      扮演一名量化分析师。
      分析一个策略为 "${strategyName}" 的基金模拟回测，参数如下: ${JSON.stringify(params)}。
      
      1. 生成一段逼真的中文分析，解释为什么该策略在当前市场环境下可能成功或失败。
      2. 估算未来 1 年的现实性能指标（总回报率、夏普比率）。
      
      输出 JSON (Output JSON):
      {
        "analysis": "详细的市场分析（中文）...",
        "metrics": {
          "totalReturn": "+15.4%",
          "annualizedReturn": "15.4%",
          "maxDrawdown": "-8.2%",
          "sharpeRatio": "1.8"
        }
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                totalReturn: { type: Type.STRING },
                annualizedReturn: { type: Type.STRING },
                maxDrawdown: { type: Type.STRING },
                sharpeRatio: { type: Type.STRING }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { analysis: "分析暂时不可用。", metrics: { totalReturn: "0%", annualizedReturn: "0%", maxDrawdown: "0%", sharpeRatio: "0" } };

  } catch (error) {
    console.error("Analysis failed", error);
    return { analysis: "生成分析时出错。", metrics: { totalReturn: "N/A", annualizedReturn: "N/A", maxDrawdown: "N/A", sharpeRatio: "N/A" } };
  }
};

export const getMarketAdvice = async (input: MarketInput): Promise<MarketAdvice> => {
  try {
    const prompt = `
      Role: Senior Fund Manager & Market Analyst.
      Task: Analyze the current market conditions provided by the user and give a clear Buy/Sell/Hold recommendation for a general equity fund portfolio.

      User Input Market Data:
      - Index Level/Trend: ${input.indexLevel}
      - Market Sentiment: ${input.sentiment}
      - Trading Volume: ${input.volumeTrend}
      - Key Sector Performance: ${input.sectorFocus}

      Requirements:
      1. Determine a signal: BUY (Opportunity), SELL (Risk), or HOLD (Observation).
      2. Provide a confidence score (0-100).
      3. List 3 specific reasons in Chinese.
      4. Determine Risk Level.
      5. Provide a short, actionable plan (Chinese).

      Output JSON Schema:
      {
        "signal": "BUY" | "SELL" | "HOLD",
        "confidence": number,
        "title": "Short Chinese Headline (e.g. '右侧交易机会显现')",
        "reasoning": ["Reason 1", "Reason 2", "Reason 3"],
        "riskLevel": "Low" | "Medium" | "High",
        "actionPlan": "Specific action advice in Chinese"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: { type: Type.STRING, enum: ['BUY', 'SELL', 'HOLD'] },
            confidence: { type: Type.NUMBER },
            title: { type: Type.STRING },
            reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            actionPlan: { type: Type.STRING }
          },
          required: ['signal', 'confidence', 'title', 'reasoning', 'riskLevel', 'actionPlan']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MarketAdvice;
    }
    throw new Error("No advice generated");
  } catch (error) {
    console.error("Advice generation failed", error);
    throw error;
  }
};

export const analyzeFundTrend = async (fund: FundRealtimeData): Promise<FundAnalysisResult> => {
  try {
    const prompt = `
      Role: High-Frequency Trading Algorithm.
      Task: Analyze specific fund data and give a quick technical decision.

      Fund Data:
      - Name: ${fund.name}
      - Current Change: ${fund.changePercent.toFixed(2)}%
      - Volume Status: ${fund.volume}
      - Recent Trend (7 days): ${JSON.stringify(fund.trend7d)}

      Requirements:
      1. Signal: BUY (Bottom fishing/Trend following), SELL (Stop loss/Profit taking), or HOLD.
      2. Suggestion: Very short, punchy text in Chinese (max 15 chars).
      3. Key Reason: One sentence technical reason in Chinese.

      Output JSON:
      {
        "fundId": "${fund.id}",
        "signal": "BUY" | "SELL" | "HOLD",
        "suggestion": "Short text",
        "keyReason": "Detailed reason"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fundId: { type: Type.STRING },
            signal: { type: Type.STRING, enum: ['BUY', 'SELL', 'HOLD'] },
            suggestion: { type: Type.STRING },
            keyReason: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FundAnalysisResult;
    }
    throw new Error("Failed to analyze fund");

  } catch (error) {
    console.error("Fund analysis failed", error);
    return {
      fundId: fund.id,
      signal: 'HOLD',
      suggestion: '分析服务繁忙',
      keyReason: '请稍后重试'
    };
  }
}
