
import React, { useState } from 'react';
import { Transaction } from '../types';
import { getFinancialInsights } from '../services/geminiService';
import { Sparkles, RefreshCw, MessageSquare, ShieldCheck, Zap, Hexagon } from 'lucide-react';

interface AIInsightsProps {
  transactions: Transaction[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const result = await getFinancialInsights(transactions);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-ttg-navy rounded-[4rem] p-12 text-white shadow-3xl relative overflow-hidden group">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 p-16 opacity-[0.05] pointer-events-none group-hover:scale-125 transition-transform duration-[2000ms]">
        <Hexagon size={320} strokeWidth={1} />
      </div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-ttg-grey/10 rounded-full blur-[140px] pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-12">
          <div className="flex items-center space-x-8">
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center shadow-inner group-hover:border-ttg-grey/30 transition-colors">
              <Zap className="text-ttg-grey" size={44} />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight text-white uppercase leading-none mb-3">TTG CFO ADVISOR</h3>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 rounded-full bg-ttg-grey animate-pulse"></div>
                <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em]">Trí tuệ Nhân tạo Phân tích Chiến lược</p>
              </div>
            </div>
          </div>
          
          {!insight && !loading && (
            <button 
              onClick={generate}
              className="bg-ttg-grey text-ttg-navy px-14 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-widest flex items-center space-x-4 hover:scale-105 transition-all shadow-3xl shadow-ttg-grey/10 active:scale-95"
            >
              <Sparkles size={20} />
              <span>Phân tích Hệ thống</span>
            </button>
          )}
        </div>

        {!insight && !loading && (
          <div className="max-w-3xl">
            <p className="text-white/50 mb-0 leading-relaxed font-bold text-sm tracking-wide">
              Kích hoạt mô hình học máy Gemini 3 Pro để đánh giá sức khỏe dòng tiền, phát hiện rủi ro OPEX và nhận khuyến nghị tối ưu hóa tài chính dành riêng cho <span className="text-ttg-grey font-black">TT GARMENT</span>.
            </p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-24">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-white/5 border-t-ttg-grey rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto text-ttg-grey animate-pulse" size={32} />
            </div>
            <p className="text-ttg-grey mt-12 font-black uppercase tracking-[0.5em] text-[10px]">Đang trích xuất dữ liệu tài chính...</p>
          </div>
        )}

        {insight && !loading && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <MessageSquare size={120} />
               </div>
               <div className="flex justify-between items-start mb-12 relative z-10">
                 <div className="flex items-center space-x-4 text-ttg-grey">
                    <MessageSquare size={28} />
                    <span className="text-[12px] font-black uppercase tracking-[0.3em]">Kết quả Phân tích từ AI</span>
                 </div>
                 <button onClick={generate} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all border border-white/5">
                    <RefreshCw size={22} />
                 </button>
               </div>
               <div className="text-white/80 leading-[2] text-[14px] font-bold whitespace-pre-wrap selection:bg-ttg-grey selection:text-ttg-navy prose prose-invert max-w-none relative z-10">
                  {insight}
               </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-10 px-8">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-ttg-grey/30"></div>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Model: Gemini-3-Flash-Preview</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                <ShieldCheck size={16} className="text-ttg-grey" />
                <span className="text-[10px] font-black text-ttg-grey uppercase tracking-widest">Dữ liệu được bảo vệ đa tầng</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
