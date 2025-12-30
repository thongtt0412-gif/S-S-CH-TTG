
import React, { useState, useEffect } from 'react';
import { MonthlyBudget, BudgetItem, UserRole } from '../types';
import { formatCurrency, parseAccountingInput, numberToVnText } from '../utils/helpers';
import { 
  Save, Calendar, Target, Plus, Trash2, TrendingUp, TrendingDown, 
  LayoutGrid, History, CheckCircle2, Copy, AlertCircle, Info, ChevronRight
} from 'lucide-react';

interface BudgetSetupProps {
  budgets: MonthlyBudget[];
  onSave: (budget: MonthlyBudget) => void;
  userRole: UserRole;
}

const BudgetSetup: React.FC<BudgetSetupProps> = ({ budgets, onSave, userRole }) => {
  const isCFO = userRole === UserRole.CFO;
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const existingBudget = budgets.find(b => b.month === month);

  const [month, setMonth] = useState(currentMonthStr);
  const [revenueItems, setRevenueItems] = useState<BudgetItem[]>([]);
  const [expenseItems, setExpenseItems] = useState<BudgetItem[]>([]);

  useEffect(() => {
    const b = budgets.find(x => x.month === month);
    if (b) {
      setRevenueItems(b.revenueItems);
      setExpenseItems(b.expenseItems);
    } else {
      setRevenueItems([{ id: 'rev-1', label: 'Doanh thu dự kiến', amount: 0 }]);
      setExpenseItems([{ id: 'exp-1', label: 'Chi phí định mức', amount: 0 }]);
    }
  }, [month, budgets]);

  const handleAddItem = (type: 'revenue' | 'expense') => {
    const newItem = { id: `${type}-${Date.now()}`, label: '', amount: 0 };
    if (type === 'revenue') setRevenueItems([...revenueItems, newItem]);
    else setExpenseItems([...expenseItems, newItem]);
  };

  const handleRemoveItem = (type: 'revenue' | 'expense', id: string) => {
    if (type === 'revenue') setRevenueItems(revenueItems.filter(item => item.id !== id));
    else setExpenseItems(expenseItems.filter(item => item.id !== id));
  };

  const handleUpdateItem = (type: 'revenue' | 'expense', id: string, field: keyof BudgetItem, value: string) => {
    const update = (items: BudgetItem[]) => items.map(item => {
      if (item.id === id) {
        if (field === 'amount') {
          return { ...item, amount: parseAccountingInput(value) };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    
    if (type === 'revenue') setRevenueItems(update(revenueItems));
    else setExpenseItems(update(expenseItems));
  };

  const handleCopyFromPrevious = () => {
    const prevMonthDate = new Date(month + "-01");
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    const prevMonthStr = prevMonthDate.toISOString().slice(0, 7);
    
    const prevBudget = budgets.find(b => b.month === prevMonthStr);
    if (prevBudget) {
      setRevenueItems(prevBudget.revenueItems.map(i => ({ ...i, id: `rev-${Date.now()}-${Math.random()}` })));
      setExpenseItems(prevBudget.expenseItems.map(i => ({ ...i, id: `exp-${Date.now()}-${Math.random()}` })));
      alert(`Đã sao chép dữ liệu từ tháng ${prevMonthStr}`);
    } else {
      alert("Không tìm thấy dữ liệu ngân sách tháng trước.");
    }
  };

  const totalRev = revenueItems.reduce((sum, i) => sum + i.amount, 0);
  const totalExp = expenseItems.reduce((sum, i) => sum + i.amount, 0);
  const netGoal = totalRev - totalExp;

  const handleSave = () => {
    if (revenueItems.some(i => !i.label) || expenseItems.some(i => !i.label)) {
      alert("Vui lòng nhập đầy đủ tên khoản mục!");
      return;
    }
    onSave({
      id: `BGT-${month}`,
      month,
      revenueItems,
      expenseItems
    });
    alert(isCFO ? `Đã phê duyệt ngân sách tháng ${month}!` : `Đã lưu bản thảo kế hoạch tháng ${month}!`);
  };

  return (
    <div className="space-y-8 lg:space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="bg-slate-900 rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 p-8 lg:p-12 opacity-5 pointer-events-none rotate-12">
          <Target size={160} lg:size={240} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 lg:gap-8 mb-10 lg:mb-12">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <LayoutGrid size={24} lg:size={32} className="text-slate-900" />
              </div>
              <div>
                <h3 className="text-xl lg:text-3xl font-black uppercase tracking-tight leading-none mb-2 lg:mb-3">Kế hoạch Tài chính</h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <Calendar size={14} className="text-emerald-400" />
                    <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} className="bg-transparent border-none text-emerald-400 font-black text-xs lg:text-sm focus:ring-0 outline-none cursor-pointer" />
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${existingBudget ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/20 border-amber-500/30 text-amber-400'}`}>
                    {existingBudget ? 'Đã phê duyệt' : 'Chưa có kế hoạch'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
               <button 
                onClick={handleCopyFromPrevious}
                className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-4 bg-white/5 text-white border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
               >
                 <Copy size={14} />
                 <span>Sao chép tháng trước</span>
               </button>
               <button 
                onClick={handleSave} 
                className={`flex-1 md:flex-none px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center space-x-3 shadow-xl ${isCFO ? 'bg-emerald-500 text-slate-900 shadow-emerald-500/20' : 'bg-ttg-grey text-ttg-navy shadow-ttg-grey/20'}`}
               >
                <Save size={16} />
                <span>{isCFO ? 'Phê duyệt & Khóa' : 'Lưu bản thảo'}</span>
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem]">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <p className="text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Doanh thu dự kiến</p>
                </div>
                <ChevronRight size={14} className="text-white/20" />
              </div>
              <p className="text-xl lg:text-3xl font-black text-emerald-400 accounting-nums">{formatCurrency(totalRev)}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem]">
              <div className="flex items-center justify-between mb-3 lg:mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown size={14} className="text-rose-400" />
                  <p className="text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Hạn mức chi phí</p>
                </div>
                <ChevronRight size={14} className="text-white/20" />
              </div>
              <p className="text-xl lg:text-3xl font-black text-rose-400 accounting-nums">{formatCurrency(totalExp)}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-3 lg:mb-4">
                <Target size={14} className="text-emerald-500" />
                <p className="text-[8px] lg:text-[10px] font-black text-emerald-500 uppercase tracking-widest">Lợi nhuận mục tiêu</p>
              </div>
              <p className={`text-xl lg:text-3xl font-black accounting-nums ${netGoal >= 0 ? 'text-white' : 'text-rose-500'}`}>{formatCurrency(netGoal)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        {/* REVENUE SECTION */}
        <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <TrendingUp size={20} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs lg:text-sm leading-none">Nguồn thu dự kiến</h4>
                <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Các khoản thu trong kỳ</p>
              </div>
            </div>
            <button onClick={() => handleAddItem('revenue')} className="w-9 h-9 lg:w-10 lg:h-10 bg-ttg-navy text-ttg-grey rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Plus size={18} /></button>
          </div>
          
          <div className="space-y-3 flex-1">
            {revenueItems.map((item) => (
              <div key={item.id} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-1 flex group focus-within:border-emerald-500/40 transition-all">
                    <input type="text" value={item.label} onChange={(e) => handleUpdateItem('revenue', item.id, 'label', e.target.value)} className="flex-1 bg-transparent border-none text-[10px] lg:text-xs font-bold text-slate-700 px-3 py-2.5 outline-none" placeholder="Tên nguồn thu..." />
                    <input 
                      type="text" 
                      defaultValue={item.amount === 0 ? '' : item.amount.toString()} 
                      onBlur={(e) => handleUpdateItem('revenue', item.id, 'amount', e.target.value)} 
                      className="w-24 lg:w-32 bg-transparent border-none text-[10px] lg:text-xs font-black text-emerald-600 px-3 py-2.5 text-right outline-none" 
                      placeholder="Số tiền..." 
                    />
                  </div>
                  <button onClick={() => handleRemoveItem('revenue', item.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2"><Trash2 size={16} /></button>
                </div>
                {item.amount > 0 && <p className="text-[8px] font-black text-emerald-500 text-right uppercase tracking-widest px-12">{numberToVnText(item.amount)}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* EXPENSE SECTION */}
        <div className="bg-white rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-9 h-9 lg:w-10 lg:h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                <TrendingDown size={20} />
              </div>
              <div>
                <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs lg:text-sm leading-none">Hạn mức chi phí</h4>
                <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">Định phí & Biến phí</p>
              </div>
            </div>
            <button onClick={() => handleAddItem('expense')} className="w-9 h-9 lg:w-10 lg:h-10 bg-ttg-navy text-rose-400 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"><Plus size={18} /></button>
          </div>

          <div className="space-y-3 flex-1">
            {expenseItems.map((item) => (
              <div key={item.id} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-1 flex focus-within:border-rose-500/40 transition-all">
                    <input type="text" value={item.label} onChange={(e) => handleUpdateItem('expense', item.id, 'label', e.target.value)} className="flex-1 bg-transparent border-none text-[10px] lg:text-xs font-bold text-slate-700 px-3 py-2.5 outline-none" placeholder="Tên khoản chi..." />
                    <input 
                      type="text" 
                      defaultValue={item.amount === 0 ? '' : item.amount.toString()} 
                      onBlur={(e) => handleUpdateItem('expense', item.id, 'amount', e.target.value)} 
                      className="w-24 lg:w-32 bg-transparent border-none text-[10px] lg:text-xs font-black text-rose-600 px-3 py-2.5 text-right outline-none" 
                      placeholder="Số tiền..." 
                    />
                  </div>
                  <button onClick={() => handleRemoveItem('expense', item.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-2"><Trash2 size={16} /></button>
                </div>
                {item.amount > 0 && <p className="text-[8px] font-black text-rose-500 text-right uppercase tracking-widest px-12">{numberToVnText(item.amount)}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-6 lg:p-8 rounded-[1.5rem] border border-slate-200 flex items-start space-x-4">
           <div className="p-3 bg-white rounded-xl text-ttg-navy shadow-sm">
              <Info size={20} />
           </div>
           <div>
              <h5 className="text-[10px] font-black text-ttg-navy uppercase tracking-widest mb-1">Mẹo nghiệp vụ</h5>
              <p className="text-[9px] font-bold text-slate-500 leading-relaxed uppercase">
                Sử dụng các phím tắt <span className="text-ttg-navy">k, m, b</span> để nhập số tiền nhanh. Hệ thống tự động chuyển đổi sang giá trị thực.
              </p>
           </div>
        </div>
        <div className="bg-emerald-50 p-6 lg:p-8 rounded-[1.5rem] border border-emerald-100 flex items-start space-x-4">
           <div className="p-3 bg-white rounded-xl text-emerald-600 shadow-sm">
              <AlertCircle size={20} />
           </div>
           <div>
              <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Quy trình CFO Control</h5>
              <p className="text-[9px] font-bold text-emerald-800 leading-relaxed uppercase">
                Mọi kế hoạch ngân sách cần được <span className="font-black underline">Phê duyệt</span> bởi CFO trước khi các khoản chi vượt hạn mức được hệ thống cảnh báo.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetSetup;
