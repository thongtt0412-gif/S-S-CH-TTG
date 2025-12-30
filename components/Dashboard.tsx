
import React, { useState } from 'react';
import { Transaction, TransactionType, ExpenseType, MonthlyBudget } from '../types';
import { calculateTotals, formatCurrency, parseAccountingInput, numberToVnText } from '../utils/helpers';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, Edit2, X, 
  Target, LayoutGrid, ArrowUpRight, ArrowDownRight, Info
} from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  openingBalance: number;
  onUpdateOpeningBalance: (amount: number) => void;
  isAdmin: boolean;
  budgets: MonthlyBudget[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  transactions, 
  openingBalance, 
  onUpdateOpeningBalance, 
  isAdmin,
  budgets
}) => {
  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [tempBalanceInput, setTempBalanceInput] = useState(openingBalance.toString());
  const [parsedBalance, setParsedBalance] = useState(openingBalance);
  
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const activeBudget = budgets.find(b => b.month === currentMonthStr);

  const { totalIn, totalOut, net } = calculateTotals(transactions);
  const closingBalance = openingBalance + net;

  const fixedExp = transactions.filter(t => t.type === TransactionType.CASH_OUT && t.expenseType === ExpenseType.FIXED).reduce((sum, t) => sum + t.amount, 0);
  const varExp = transactions.filter(t => t.type === TransactionType.CASH_OUT && t.expenseType === ExpenseType.VARIABLE).reduce((sum, t) => sum + t.amount, 0);
  
  const totalBudgetedRevenue = activeBudget?.revenueItems.reduce((sum, i) => sum + i.amount, 0) || 0;
  const totalBudgetedExpense = activeBudget?.expenseItems.reduce((sum, i) => sum + i.amount, 0) || 0;
  
  const chartData = [
    { name: 'MỤC TIÊU', thu: totalBudgetedRevenue / 1000000, chi: totalBudgetedExpense / 1000000 },
    { name: 'THỰC TẾ', thu: totalIn / 1000000, chi: totalOut / 1000000 },
  ];

  const pieData = [
    { name: 'Định phí', value: fixedExp || 1 },
    { name: 'Biến phí', value: varExp || 1 },
  ];
  const COLORS = ['#002B3D', '#BEB8B5'];

  const handleEditBalance = () => {
    setTempBalanceInput(openingBalance.toString());
    setParsedBalance(openingBalance);
    setIsEditingBalance(true);
  };

  const handleBalanceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTempBalanceInput(val);
    setParsedBalance(parseAccountingInput(val));
  };

  const handleSaveBalance = () => {
    onUpdateOpeningBalance(parsedBalance);
    setIsEditingBalance(false);
  };

  return (
    <div className="space-y-8 lg:space-y-10 animate-in fade-in duration-1000">
      {/* Metric Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] ttg-card-shadow border border-slate-50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 lg:w-24 lg:h-24 bg-slate-50 rounded-bl-[3rem] lg:rounded-bl-[4rem] flex items-center justify-center">
            <DollarSign size={20} className="text-slate-200" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-4 lg:mb-6">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-ttg-navy rounded-xl lg:rounded-2xl flex items-center justify-center text-ttg-grey shadow-lg shadow-ttg-navy/20">
                <DollarSign size={18} />
              </div>
              {isAdmin && (
                <button onClick={handleEditBalance} className="p-2 text-slate-300 hover:text-ttg-navy transition-colors">
                  <Edit2 size={12} />
                </button>
              )}
            </div>
            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2">Số dư đầu kỳ</p>
            <h3 className="text-xl lg:text-2xl font-black text-ttg-navy accounting-nums">{formatCurrency(openingBalance)}</h3>
          </div>
        </div>

        <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] ttg-card-shadow border border-slate-50">
          <div className="flex justify-between items-start mb-4 lg:mb-6">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-50 rounded-xl lg:rounded-2xl flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
            <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-lg border border-emerald-100">
               {totalBudgetedRevenue > 0 ? `${Math.round((totalIn / totalBudgetedRevenue) * 100)}%` : 'Live'}
            </div>
          </div>
          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2">Tổng thu lũy kế</p>
          <h3 className="text-xl lg:text-2xl font-black text-emerald-600 accounting-nums">{formatCurrency(totalIn)}</h3>
        </div>

        <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] ttg-card-shadow border border-slate-50">
          <div className="flex justify-between items-start mb-4 lg:mb-6">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-rose-50 rounded-xl lg:rounded-2xl flex items-center justify-center text-rose-600">
              <TrendingDown size={20} />
            </div>
            <div className={`px-2 py-1 text-[8px] font-black uppercase rounded-lg border ${totalOut > totalBudgetedExpense ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
               {totalOut > totalBudgetedExpense ? 'Vượt định mức' : 'Ổn định'}
            </div>
          </div>
          <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 lg:mb-2">Tổng chi thực tế</p>
          <h3 className="text-xl lg:text-2xl font-black text-rose-600 accounting-nums">{formatCurrency(totalOut)}</h3>
        </div>

        <div className="bg-ttg-navy p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl shadow-ttg-navy/30 relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-white/5 rounded-full -mb-12 -mr-12 transition-transform group-hover:scale-150 duration-1000"></div>
          <div className="relative z-10">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/10 text-ttg-grey rounded-xl lg:rounded-2xl flex items-center justify-center mb-4 lg:mb-6 border border-white/10">
              <Activity size={20} />
            </div>
            <p className="text-[9px] lg:text-[10px] font-black text-white/40 uppercase tracking-widest mb-1 lg:mb-2">Số dư cuối kỳ</p>
            <h3 className="text-xl lg:text-2xl font-black text-ttg-grey accounting-nums">{formatCurrency(closingBalance)}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-8 bg-white p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] ttg-card-shadow border border-slate-50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8 lg:mb-12">
            <div>
              <h3 className="text-xs lg:text-sm font-black text-ttg-navy uppercase tracking-[0.2em] leading-none">Đối soát Ngân sách</h3>
              <p className="text-[8px] lg:text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest italic">Kế hoạch vs Thực tế (Triệu VNĐ)</p>
            </div>
            <div className="flex space-x-3">
               <div className="flex items-center space-x-2 px-3 py-1.5 bg-ttg-navy/5 rounded-lg border border-ttg-navy/10">
                  <div className="w-2 h-2 rounded-full bg-ttg-navy"></div>
                  <span className="text-[8px] font-black text-ttg-navy uppercase tracking-widest">Mục tiêu</span>
               </div>
               <div className="flex items-center space-x-2 px-3 py-1.5 bg-ttg-grey/10 rounded-lg border border-ttg-grey/20">
                  <div className="w-2 h-2 rounded-full bg-ttg-grey"></div>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Thực tế</span>
               </div>
            </div>
          </div>
          <div className="h-[300px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{top: 0, right: 0, left: -25, bottom: 0}}>
                <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}} 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '15px', backgroundColor: '#002B3D', color: '#BEB8B5'}} 
                  itemStyle={{fontSize: '10px', fontWeight: '900', textTransform: 'uppercase'}}
                />
                <Bar dataKey="thu" fill="#002B3D" radius={[8, 8, 0, 0]} barSize={35} />
                <Bar dataKey="chi" fill="#BEB8B5" radius={[8, 8, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] ttg-card-shadow border border-slate-50 flex flex-col">
          <div className="mb-8 lg:mb-10 text-center">
            <h3 className="text-xs lg:text-sm font-black text-ttg-navy uppercase tracking-[0.2em] leading-none">Cấu trúc Dòng chi</h3>
            <p className="text-[8px] lg:text-[9px] font-bold text-ttg-grey mt-2 uppercase tracking-widest italic">Tỷ trọng chi phí OPEX</p>
          </div>
          <div className="flex-1 min-h-[250px] lg:min-h-[300px] relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl lg:text-4xl font-black text-ttg-navy tracking-tighter">
                {totalOut > 0 ? ((fixedExp / totalOut) * 100).toFixed(0) : 0}%
              </span>
              <span className="text-[7px] lg:text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Định phí</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} lg:innerRadius={90} lg:outerRadius={125} paddingAngle={8} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 lg:mt-10 space-y-3">
             <div className="flex items-center justify-between p-4 lg:p-5 bg-ttg-navy rounded-xl lg:rounded-2xl shadow-xl shadow-ttg-navy/10">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-5 bg-ttg-grey rounded-full"></div>
                  <span className="text-[8px] lg:text-[9px] font-black text-ttg-grey uppercase tracking-widest">Định phí</span>
                </div>
                <span className="text-xs lg:text-sm font-black text-white accounting-nums">{formatCurrency(fixedExp)}</span>
             </div>
             <div className="flex items-center justify-between p-4 lg:p-5 bg-slate-50 rounded-xl lg:rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="w-1.5 h-5 bg-ttg-navy rounded-full"></div>
                  <span className="text-[8px] lg:text-[9px] font-black text-slate-500 uppercase tracking-widest">Biến phí</span>
                </div>
                <span className="text-xs lg:text-sm font-black text-ttg-navy accounting-nums">{formatCurrency(varExp)}</span>
             </div>
          </div>
        </div>
      </div>

      {isEditingBalance && (
        <div className="fixed inset-0 bg-ttg-navy/90 backdrop-blur-md z-50 flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div className="px-8 py-8 lg:px-12 lg:py-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-black text-ttg-navy uppercase tracking-widest text-xs leading-none">Thiết lập Số dư</h3>
                <p className="text-[8px] text-slate-400 font-bold uppercase mt-2 tracking-widest">Số dư tồn quỹ hiện tại</p>
              </div>
              <button onClick={() => setIsEditingBalance(false)} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-300 hover:text-rose-500 transition-all border border-slate-100"><X size={18}/></button>
            </div>
            <div className="p-8 lg:p-12 text-center space-y-6">
               <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Nhập số dư (VNĐ)</label>
               <div className="space-y-4">
                 <input 
                  type="text" 
                  autoFocus
                  value={tempBalanceInput}
                  onChange={handleBalanceInputChange}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-3xl lg:text-5xl font-black text-ttg-navy focus:border-ttg-navy focus:bg-white outline-none transition-all text-center"
                  placeholder="0"
                />
                <div className="flex justify-center space-x-2">
                   <span className="text-[8px] font-black bg-ttg-navy/10 text-ttg-navy px-2 py-1 rounded">K=NGÀN</span>
                   <span className="text-[8px] font-black bg-ttg-navy/10 text-ttg-navy px-2 py-1 rounded">M=TRIỆU</span>
                   <span className="text-[8px] font-black bg-ttg-navy/10 text-ttg-navy px-2 py-1 rounded">B=TỶ</span>
                </div>
                {parsedBalance > 0 && (
                   <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 animate-in slide-in-from-top-2">
                      <div className="flex items-center space-x-2 justify-center text-emerald-600">
                        <Info size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Xác nhận: {numberToVnText(parsedBalance)}</span>
                      </div>
                   </div>
                )}
               </div>
            </div>
            <div className="px-8 pb-8 lg:px-12 lg:pb-12 grid grid-cols-2 gap-4">
              <button onClick={() => setIsEditingBalance(false)} className="py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Hủy</button>
              <button onClick={handleSaveBalance} className="bg-ttg-navy text-ttg-grey py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-ttg-navy/20">Lưu số dư</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
