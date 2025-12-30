
import React, { useState } from 'react';
import { Partner } from '../types';
import { Search, Plus, Mail, Phone, MapPin, Hash, User, Trash2, Edit2 } from 'lucide-react';

interface PartnerManagerProps {
  type: 'Khách hàng' | 'Nhà cung cấp';
  partners: Partner[];
  onAdd: (partner: Partner) => void;
  onDelete: (id: string) => void;
}

const PartnerManager: React.FC<PartnerManagerProps> = ({ type, partners, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPartner, setNewPartner] = useState<Partial<Partner>>({
    name: '',
    taxCode: '',
    address: '',
    contactPerson: '',
    phone: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPartner.name) {
      onAdd({
        ...newPartner as Partner,
        id: `${type === 'Khách hàng' ? 'CUS' : 'VEN'}-${Date.now()}`
      });
      setIsAdding(false);
      setNewPartner({ name: '', taxCode: '', address: '', contactPerson: '', phone: '', email: '' });
    }
  };

  const filtered = partners.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.taxCode.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={`Tìm ${type} theo tên hoặc MST...`} 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
        >
          <Plus size={18} />
          <span>Thêm {type}</span>
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800">Thêm {type} mới</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 font-bold">X</button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên {type} *</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input required value={newPartner.name} onChange={e => setNewPartner(p => ({...p, name: e.target.value}))} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-emerald-500 focus:border-emerald-500" placeholder="Công ty CP TTG..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mã số thuế</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input value={newPartner.taxCode} onChange={e => setNewPartner(p => ({...p, taxCode: e.target.value}))} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm" placeholder="010xxxxxxx" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Người liên hệ</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input value={newPartner.contactPerson} onChange={e => setNewPartner(p => ({...p, contactPerson: e.target.value}))} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm" placeholder="Nguyễn Văn A" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input value={newPartner.phone} onChange={e => setNewPartner(p => ({...p, phone: e.target.value}))} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm" placeholder="090..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input type="email" value={newPartner.email} onChange={e => setNewPartner(p => ({...p, email: e.target.value}))} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm" placeholder="contact@ttg.vn" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Địa chỉ</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input value={newPartner.address} onChange={e => setNewPartner(p => ({...p, address: e.target.value}))} className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm" placeholder="Địa chỉ trụ sở..." />
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:text-slate-800 transition-colors">Hủy</button>
              <button type="submit" className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-600/20">Lưu thông tin</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                <Briefcase size={24} />
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"><Edit2 size={16} /></button>
                 <button onClick={() => onDelete(p.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-1 leading-tight">{p.name}</h4>
            <div className="flex items-center space-x-2 text-slate-400 text-xs mb-4">
              <span className="px-2 py-0.5 bg-slate-100 rounded-md font-bold">{p.id}</span>
              <span>MST: {p.taxCode || 'N/A'}</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center space-x-3 text-slate-600 text-sm">
                <User size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{p.contactPerson || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 text-sm">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <span>{p.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600 text-sm">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{p.address || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Chưa có thông tin {type.toLowerCase()} nào được ghi nhận.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Briefcase = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

export default PartnerManager;
