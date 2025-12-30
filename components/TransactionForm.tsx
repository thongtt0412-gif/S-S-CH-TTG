
import React, { useState, useRef } from 'react';
import { 
  Transaction, 
  TransactionType, 
  BusinessUnit, 
  Department, 
  CashInSource, 
  ExpenseGroup, 
  PaymentMethod, 
  ExpenseType, 
  PriorityLevel, 
  FlowWarning,
  Partner
} from '../types';
import { BUSINESS_UNITS, DEPARTMENTS } from '../constants';
import { generateTrxId, formatCurrency, parseAccountingInput, numberToVnText } from '../utils/helpers';
import { Save, X, Camera, Paperclip, Image as ImageIcon, Trash2, CheckCircle2, Info } from 'lucide-react';

interface TransactionFormProps {
  onSave: (trx: Transaction) => void;
  onCancel: () => void;
  customers: Partner[];
  vendors: Partner[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onCancel, customers, vendors }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayAmount, setDisplayAmount] = useState('');
  const [formData, setFormData] = useState<Partial<Transaction>>({
    id: generateTrxId(),
    date: new Date().toISOString().split('T')[0],
    type: TransactionType.CASH_IN,
    businessUnit: BusinessUnit.TT_GARMENT,
    department: Department.SALES,
    createdBy: 'Kế toán viên',
    paymentMethod: PaymentMethod.TRANSFER,
    amount: 0,
    expectedDate: new Date().toISOString().split('T')[0],
    notes: '',
    isBudgeted: true,
    isOverBudget: false,
    priority: PriorityLevel.MEDIUM,
    flowWarning: FlowWarning.NORMAL,
    expenseType: ExpenseType.VARIABLE,
    source: CashInSource.SALES,
    expenseGroup: ExpenseGroup.FABRIC,
    attachment: undefined
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplayAmount(val);
    const numericValue = parseAccountingInput(val);
    setFormData(prev => ({ ...prev, amount: numericValue }));
  };

  const handleAmountBlur = () => {
    if (formData.amount) {
      setDisplayAmount(formData.amount.toLocaleString('vi-VN'));
    }
  };

  const handleAmountFocus = () => {
    if (formData.amount) {
      setDisplayAmount(formData.amount.toString());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file quá lớn (tối đa 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, attachment: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setFormData(prev => ({ ...prev, attachment: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount && formData.amount > 0) {
      let finalData = { ...formData };
      if (formData.type === TransactionType.CASH_IN) {
        const c = customers.find(x => x.id === formData.clientId);
        finalData.clientName = c?.name || 'Khách lẻ';
      } else {
        const v = vendors.find(x => x.id === formData.vendorId);
        finalData.vendorName = v?.name || 'NCC lẻ';
      }
      onSave(finalData as Transaction);
    } else {
      alert("Vui lòng nhập số tiền hợp lệ!");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isCashIn = formData.type === TransactionType.CASH_IN;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-10 bg-white p-6 lg:p-12 rounded-[2.5rem] lg:rounded-[3.5rem] ttg-card-shadow border border-slate-50 max-w-6xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
      {/* SECTION I: THÔNG TIN GIAO DỊCH */}
      <section>
        <div className="flex items-center space-x-4 lg:space-x-6 mb-8 border-b border-slate-50 pb-6 lg:pb-8">
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-[1.5rem] bg-ttg-navy flex items-center justify-center font-black text-ttg-grey shadow-lg">I</div>
          <div>
            <h3 className="text-base lg:text-xl font-black text-ttg-navy uppercase tracking-widest leading-none">Thông tin Giao dịch</h3>
            <p className="text-[8px] lg:text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest italic">Chứng từ hệ thống</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="space-y-2">
            <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã giao dịch (Auto)</label>
            <div className="bg-slate-50 border border-slate-100 rounded-xl lg:rounded-2xl p-4 text-[10px] lg:text-xs font-black text-ttg-navy tracking-widest shadow-inner">{formData.id}</div>
          </div>
          <div className="space-y-2">
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Ngày giao dịch *</label>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full border-2 border-slate-50 bg-slate-50/50 rounded-xl lg:rounded-2xl p-4 text-[10px] lg:text-xs font-black text-ttg-navy focus:border-ttg-navy outline-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Loại giao dịch</label>
            <div className="flex bg-slate-100 p-1.5 rounded-xl lg:rounded-2xl">
              <button type="button" onClick={() => setFormData(p => ({...p, type: TransactionType.CASH_IN}))} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${isCashIn ? 'bg-ttg-navy text-white shadow-lg' : 'text-slate-400'}`}>Thu</button>
              <button type="button" onClick={() => setFormData(p => ({...p, type: TransactionType.CASH_OUT}))} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${!isCashIn ? 'bg-ttg-navy text-white shadow-lg' : 'text-slate-400'}`}>Chi</button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION II & III: CHI TIẾT SỐ TIỀN & ĐỐI TÁC */}
      <section className={`p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] border-t-[8px] lg:border-t-[12px] transition-all shadow-inner ${isCashIn ? 'bg-emerald-50/30 border-emerald-500/30' : 'bg-rose-50/30 border-rose-500/30'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center font-black text-white shadow-lg ${isCashIn ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {isCashIn ? 'II' : 'III'}
              </div>
              <h3 className={`text-sm lg:text-lg font-black uppercase tracking-widest ${isCashIn ? 'text-emerald-800' : 'text-rose-800'}`}>
                Kê khai {isCashIn ? 'Khoản thu' : 'Khoản chi'}
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2 relative group">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Số tiền (VNĐ) *</label>
                  <div className="flex space-x-2">
                     <span className="text-[7px] font-black bg-ttg-navy/10 text-ttg-navy px-1.5 py-0.5 rounded uppercase">k=ngàn</span>
                     <span className="text-[7px] font-black bg-ttg-navy/10 text-ttg-navy px-1.5 py-0.5 rounded uppercase">m=triệu</span>
                     <span className="text-[7px] font-black bg-ttg-navy/10 text-ttg-navy px-1.5 py-0.5 rounded uppercase">b=tỷ</span>
                  </div>
                </div>
                <input 
                  type="text" 
                  value={displayAmount}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  onFocus={handleAmountFocus}
                  required 
                  className={`w-full bg-white border-2 rounded-[1.5rem] p-6 lg:p-8 text-3xl lg:text-5xl font-black focus:ring-[15px] outline-none transition-all text-center ${isCashIn ? 'border-emerald-100 focus:ring-emerald-500/5 text-emerald-600' : 'border-rose-100 focus:ring-rose-500/5 text-rose-600'}`} 
                  placeholder="0" 
                />
                {formData.amount && formData.amount > 0 ? (
                  <div className="mt-4 p-4 bg-white/50 border border-white rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center space-x-2 justify-center">
                      <Info size={14} className="text-slate-400" />
                      <span className="text-[10px] lg:text-xs font-black text-slate-500 uppercase tracking-widest">Bằng chữ: </span>
                      <span className={`text-[10px] lg:text-xs font-black uppercase ${isCashIn ? 'text-emerald-600' : 'text-rose-600'}`}>{numberToVnText(formData.amount)}</span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Đối tác / Phân loại</label>
                  <select name={isCashIn ? "clientId" : "vendorId"} value={isCashIn ? formData.clientId : formData.vendorId} onChange={handleInputChange} className="w-full border-2 border-slate-100 bg-white rounded-xl p-4 text-[10px] font-black text-ttg-navy outline-none">
                    <option value="">-- Chọn đối tác --</option>
                    {(isCashIn ? customers : vendors).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Nhóm nghiệp vụ</label>
                  <select name={isCashIn ? "source" : "expenseGroup"} value={isCashIn ? formData.source : formData.expenseGroup} onChange={handleInputChange} className="w-full border-2 border-slate-100 bg-white rounded-xl p-4 text-[10px] font-black text-ttg-navy outline-none">
                    {isCashIn 
                      ? Object.values(CashInSource).map(s => <option key={s} value={s}>{s}</option>)
                      : Object.values(ExpenseGroup).map(eg => <option key={eg} value={eg}>{eg}</option>)
                    }
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ATTACHMENT SECTION */}
          <div className="space-y-6">
             <div className="flex items-center space-x-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-slate-900 flex items-center justify-center text-ttg-grey shadow-lg">
                   <Paperclip size={20} />
                </div>
                <h3 className="text-sm lg:text-lg font-black uppercase tracking-widest text-slate-800">Chứng từ thanh toán</h3>
             </div>

             <div className={`relative border-2 border-dashed rounded-[2rem] p-6 transition-all flex flex-col items-center justify-center min-h-[220px] ${formData.attachment ? 'bg-white border-ttg-navy' : 'bg-slate-50 border-slate-200 hover:border-ttg-navy/40 hover:bg-slate-100/50'}`}>
                {formData.attachment ? (
                  <div className="w-full flex flex-col items-center">
                    <div className="relative w-full max-w-[200px] h-[140px] rounded-xl overflow-hidden shadow-xl border-4 border-white mb-4">
                       <img src={formData.attachment} alt="Attachment" className="w-full h-full object-cover" />
                       <button 
                        type="button" 
                        onClick={removeAttachment}
                        className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg shadow-lg hover:scale-110 transition-transform"
                      >
                        <Trash2 size={14} />
                       </button>
                    </div>
                    <p className="text-[9px] font-black text-ttg-navy uppercase tracking-widest">Đã tải lên chứng từ</p>
                  </div>
                ) : (
                  <>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      ref={fileInputRef} 
                    />
                    <div className="flex flex-col items-center space-y-4">
                       <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm">
                          <ImageIcon size={24} />
                       </div>
                       <div className="text-center">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Click để tải lên hóa đơn</p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase">JPG, PNG (Tối đa 5MB)</p>
                       </div>
                       <div className="flex space-x-2">
                         <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="px-6 py-2.5 bg-ttg-navy text-ttg-grey rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-ttg-dark transition-all"
                         >
                           Chọn File
                         </button>
                         <button 
                          type="button" 
                          className="px-6 py-2.5 bg-white text-ttg-navy border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center space-x-2"
                         >
                           <Camera size={14} />
                           <span>Chụp ảnh</span>
                         </button>
                       </div>
                    </div>
                  </>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* SECTION IV: KIỂM SOÁT */}
      <section className="bg-slate-900 rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div>
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-ttg-grey flex items-center justify-center font-black text-ttg-navy shadow-xl">IV</div>
                <h3 className="text-sm lg:text-lg font-black uppercase tracking-widest text-ttg-grey">Ghi chú & Phân loại</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <label className="block text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Quan trọng</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-[9px] font-black uppercase tracking-widest outline-none">
                    {Object.values(PriorityLevel).map(p => <option key={p} value={p} className="bg-ttg-navy">{p}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Cảnh báo</label>
                  <select name="flowWarning" value={formData.flowWarning} onChange={handleInputChange} className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-[9px] font-black uppercase tracking-widest outline-none">
                    {Object.values(FlowWarning).map(w => <option key={w} value={w} className="bg-ttg-navy">{w}</option>)}
                  </select>
                </div>
              </div>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-bold text-white outline-none min-h-[80px] focus:bg-white/10" placeholder="Diễn giải chi tiết nội dung nghiệp vụ..."></textarea>
           </div>
           
           <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                 <CheckCircle2 size={32} />
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">Kiểm soát Ngân sách</h4>
              <p className="text-[10px] text-white/40 leading-relaxed max-w-xs">
                Hệ thống tự động kiểm tra hạn mức {isCashIn ? 'thu' : 'chi'} trong ngân sách tháng {formData.date?.slice(0, 7)}. Dữ liệu sẽ được khóa sau khi CFO phê duyệt.
              </p>
           </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-6 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="text-slate-300 font-black hover:text-rose-500 transition-colors text-[10px] uppercase tracking-widest">Hủy phiếu</button>
        <button type="submit" className="w-full sm:w-auto bg-ttg-navy text-ttg-grey px-16 py-5 lg:py-6 rounded-xl lg:rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 shadow-2xl shadow-ttg-navy/40 active:scale-95 transition-all flex items-center justify-center space-x-3">
          <Save size={18} />
          <span>Ghi sổ Nghiệp vụ</span>
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
