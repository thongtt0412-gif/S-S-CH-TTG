
import React, { useState } from 'react';
import { Transaction, TransactionType, PriorityLevel, ExpenseType, BusinessUnit } from '../types';
import { formatCurrency, exportToCSV } from '../utils/helpers';
import { Download, Search, Filter, ChevronRight, FileSpreadsheet, Tag, MoreHorizontal, User, Briefcase, AlertTriangle, ShieldCheck, Eye, X, Paperclip } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(null);

  const filtered = transactions.filter(t => 
    t.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 lg:gap-6">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm chứng từ..." 
            className="w-full pl-14 lg:pl-16 pr-6 lg:pr-8 py-4 lg:py-5 bg-white border border-slate-100 rounded-xl lg:rounded-[2rem] text-[10px] lg:text-sm font-bold text-ttg-navy placeholder:text-slate-200 focus:ring-4 lg:focus:ring-8 focus:ring-ttg-navy/5 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-3 lg:space-x-4">
          <button className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 lg:px-8 py-4 lg:py-5 bg-white text-ttg-navy border border-slate-100 rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Filter size={14} />
            <span>Lọc</span>
          </button>
          <button 
            onClick={() => exportToCSV(transactions)}
            className="flex-1 lg:flex-none flex items-center justify-center space-x-2 px-4 lg:px-8 py-4 lg:py-5 bg-ttg-navy text-ttg-grey rounded-xl lg:rounded-2xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:scale-105 shadow-xl shadow-ttg-navy/20 transition-all"
          >
            <FileSpreadsheet size={16} />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] lg:rounded-[3rem] border border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[1000px] lg:min-w-0">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[8px] lg:text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
                <th className="px-6 lg:px-8 py-5 lg:py-7">ID / Ngày</th>
                <th className="px-6 lg:px-8 py-5 lg:py-7">Đối tác & Diễn giải</th>
                <th className="px-6 lg:px-8 py-5 lg:py-7">Đơn vị / Phòng ban</th>
                <th className="px-6 lg:px-8 py-5 lg:py-7 text-center">Chứng từ</th>
                <th className="px-6 lg:px-8 py-5 lg:py-7 text-right">Số tiền (VNĐ)</th>
                <th className="px-6 lg:px-8 py-5 lg:py-7 text-center">CFO Control</th>
                <th className="px-6 lg:px-8 py-5 lg:py-7 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-6 lg:px-8 py-4 lg:py-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] lg:text-[10px] font-black text-ttg-navy bg-slate-100 px-2 py-1 rounded-md border border-slate-200 tracking-wider w-max mb-1">{t.id}</span>
                      <span className="text-[9px] lg:text-[10px] font-bold text-slate-400 italic">{t.date}</span>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg lg:rounded-xl flex items-center justify-center shrink-0 ${t.type === TransactionType.CASH_IN ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {t.type === TransactionType.CASH_IN ? <User size={16} /> : <Briefcase size={16} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] lg:text-sm font-black text-ttg-navy tracking-tight">{t.clientName || t.vendorName || 'Khách lẻ/NCC'}</span>
                        <span className="text-[8px] lg:text-[10px] text-slate-400 font-bold truncate max-w-[150px] lg:max-w-[240px] mt-1 uppercase tracking-tighter">{t.notes}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6">
                    <div className="flex flex-col">
                      <span className="text-[9px] lg:text-[10px] font-black text-ttg-navy uppercase tracking-widest">{t.businessUnit}</span>
                      <span className="text-[8px] lg:text-[9px] font-bold text-slate-400 uppercase mt-1">{t.department}</span>
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 text-center">
                    {t.attachment ? (
                      <button 
                        onClick={() => setSelectedAttachment(t.attachment!)}
                        className="p-2.5 bg-ttg-navy/5 text-ttg-navy rounded-xl hover:bg-ttg-navy hover:text-ttg-grey transition-all inline-flex items-center space-x-2"
                        title="Xem chứng từ"
                      >
                        <Paperclip size={14} />
                        <span className="text-[9px] font-black uppercase">Xem</span>
                      </button>
                    ) : (
                      <span className="text-slate-200 font-bold text-[9px] uppercase">--</span>
                    )}
                  </td>
                  <td className={`px-6 lg:px-8 py-4 lg:py-6 text-right font-black text-[11px] lg:text-sm accounting-nums ${
                    t.type === TransactionType.CASH_IN ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {t.type === TransactionType.CASH_IN ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6">
                    <div className="flex items-center justify-center space-x-2">
                       {t.isBudgeted ? (
                         <ShieldCheck size={14} className="text-emerald-500" />
                       ) : (
                         <AlertTriangle size={14} className="text-amber-500" />
                       )}
                       {t.isOverBudget && (
                         <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[6px] font-black rounded uppercase">OVER</span>
                       )}
                    </div>
                  </td>
                  <td className="px-6 lg:px-8 py-4 lg:py-6 text-right">
                    <button className="p-2 text-slate-200 hover:text-ttg-navy transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ATTACHMENT MODAL */}
      {selectedAttachment && (
        <div className="fixed inset-0 bg-ttg-navy/90 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="absolute top-6 right-6 z-10">
                 <button 
                  onClick={() => setSelectedAttachment(null)}
                  className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-ttg-navy hover:scale-110 transition-transform"
                >
                  <X size={24} />
                 </button>
              </div>
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center space-x-4">
                 <div className="w-10 h-10 bg-ttg-navy rounded-xl flex items-center justify-center text-ttg-grey shadow-lg">
                    <Eye size={20} />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-ttg-navy uppercase tracking-widest">Xem chứng từ hạch toán</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Chứng thực giao dịch kế toán số</p>
                 </div>
              </div>
              <div className="p-8 flex justify-center bg-slate-100 overflow-auto max-h-[80vh]">
                 <img src={selectedAttachment} alt="Full Attachment" className="max-w-full h-auto rounded-xl shadow-2xl border-4 border-white" />
              </div>
              <div className="p-6 bg-white flex justify-end">
                 <button 
                  onClick={() => setSelectedAttachment(null)}
                  className="px-10 py-4 bg-ttg-navy text-ttg-grey rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ttg-dark transition-all"
                >
                  Đóng cửa sổ
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
