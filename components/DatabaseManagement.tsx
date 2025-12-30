
import React, { useRef } from 'react';
import { Download, Upload, RefreshCw, ShieldAlert, Database, FileJson, Share2, Server } from 'lucide-react';

interface DatabaseManagementProps {
  data: {
    transactions: any[];
    customers: any[];
    vendors: any[];
    budgets: any[];
    openingBalance: number;
  };
  onImport: (data: any) => void;
  onReset: () => void;
}

const DatabaseManagement: React.FC<DatabaseManagementProps> = ({ data, onImport, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dbExport = {
      ...data,
      exportDate: new Date().toISOString(),
      version: "1.0.0"
    };
    const blob = new Blob([JSON.stringify(dbExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TTG_DATABASE_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (window.confirm('Hành động này sẽ ghi đè toàn bộ dữ liệu hiện tại. Tiếp tục?')) {
            onImport(imported);
          }
        } catch (err) {
          alert('File không hợp lệ hoặc bị lỗi cấu trúc!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
      {/* Header Section */}
      <div className="bg-ttg-navy rounded-[3rem] p-10 lg:p-14 text-white shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Database size={240} />
         </div>
         <div className="relative z-10">
            <div className="flex items-center space-x-6 mb-8">
               <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 shadow-inner">
                  <Server size={32} className="text-ttg-grey" />
               </div>
               <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight leading-none mb-2">Quản trị Hệ cơ sở dữ liệu</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Corporate Data Synchronization & Backup</p>
               </div>
            </div>
            <p className="max-w-2xl text-white/50 text-sm font-bold leading-relaxed uppercase italic">
              Đảm bảo tính liên tục của dữ liệu tập đoàn. Bạn có thể sao lưu toàn bộ hệ thống ra file JSON để lưu trữ ngoại tuyến hoặc chia sẻ cho các đơn vị kinh doanh khác trong TTG Group.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Export Card */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 ttg-card-shadow flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
           <div>
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
                 <Download size={28} />
              </div>
              <h4 className="text-xl font-black text-ttg-navy uppercase tracking-widest mb-4">Sao lưu Dữ liệu (Backup)</h4>
              <p className="text-xs text-slate-400 font-bold leading-relaxed mb-8 uppercase">
                Tạo bản sao lưu tức thời của toàn bộ Giao dịch, Đối tác và Ngân sách. Dùng để chia sẻ hoặc lưu trữ định kỳ hàng tháng.
              </p>
           </div>
           <button 
            onClick={handleExport}
            className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center space-x-3"
           >
             <FileJson size={18} />
             <span>Tải về file Database (.json)</span>
           </button>
        </div>

        {/* Import Card */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-50 ttg-card-shadow flex flex-col justify-between group hover:border-ttg-navy/30 transition-all">
           <div>
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-ttg-navy mb-8 group-hover:scale-110 transition-transform">
                 <Upload size={28} />
              </div>
              <h4 className="text-xl font-black text-ttg-navy uppercase tracking-widest mb-4">Đồng bộ Dữ liệu (Sync)</h4>
              <p className="text-xs text-slate-400 font-bold leading-relaxed mb-8 uppercase">
                Nhập dữ liệu từ file backup đã có. Hệ thống sẽ được cập nhật ngay lập tức với các thông tin từ đơn vị khác.
              </p>
           </div>
           <div className="relative">
              <input 
                type="file" 
                accept=".json" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-ttg-navy text-ttg-grey py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-ttg-navy/20 hover:bg-ttg-dark transition-all flex items-center justify-center space-x-3"
              >
                <Share2 size={18} />
                <span>Chọn file đồng bộ</span>
              </button>
           </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-rose-50 rounded-[2.5rem] p-10 border border-rose-100">
         <div className="flex items-center space-x-4 mb-6">
            <ShieldAlert className="text-rose-600" size={24} />
            <h4 className="text-sm font-black text-rose-800 uppercase tracking-widest leading-none">Vùng Nguy Hiểm (Danger Zone)</h4>
         </div>
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-[10px] text-rose-700 font-bold uppercase max-w-xl">
              Thực hiện xóa bỏ toàn bộ lịch sử giao dịch và cấu hình của công ty hiện tại để bắt đầu một chu kỳ kế toán mới hoặc chuyển đổi sang đơn vị kinh doanh khác.
            </p>
            <button 
              onClick={onReset}
              className="px-8 py-4 bg-white border-2 border-rose-200 text-rose-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center space-x-2"
            >
              <RefreshCw size={14} />
              <span>Xóa sạch Database</span>
            </button>
         </div>
      </div>
    </div>
  );
};

export default DatabaseManagement;
