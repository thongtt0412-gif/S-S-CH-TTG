
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export const getFinancialInsights = async (transactions: Transaction[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
    
    // Prepare a condensed version of the data for the model to analyze
    const summaryData = transactions.map(t => ({
      date: t.date,
      type: t.type,
      amount: t.amount,
      unit: t.businessUnit,
      category: t.expenseGroup || t.source,
      priority: t.priority
    }));

    const prompt = `
      Act as a senior CFO and financial analyst for TTG Group.
      Analyze the following transaction data and provide a concise strategic report in Vietnamese.
      Focus on:
      1. Cash flow health (Liquidity).
      2. Expense optimization (especially over-budget items).
      3. Strategic recommendations for next month.
      4. Any critical warnings.

      Data: ${JSON.stringify(summaryData.slice(0, 50))}
      
      Return your analysis in Markdown format. Be professional, direct, and insightful.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI advisor. Please try again later.";
  }
};
