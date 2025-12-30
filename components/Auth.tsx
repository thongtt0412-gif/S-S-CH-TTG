
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ROLES } from '../constants';
import { Hexagon, User as UserIcon, Lock, UserPlus, LogIn, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: UserRole.MANAGER
  });

  const getStoredUsers = (): User[] => {
    const users = localStorage.getItem('ttg_users');
    return users ? JSON.parse(users) : [];
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const users = getStoredUsers();

    if (isRegistering) {
      if (users.find(u => u.username === formData.username)) {
        alert("Tên đăng nhập đã tồn tại!");
        return;
      }
      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role
      };
      const updatedUsers = [...users, newUser];
      localStorage.setItem('ttg_users', JSON.stringify(updatedUsers));
      alert("Đăng ký tài khoản thành công! Hãy đăng nhập.");
      setIsRegistering(false);
    } else {
      const user = users.find(u => u.username === formData.username && u.password === formData.password);
      if (user) {
        onLogin(user);
      } else {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
      }
    }
  };

  return (
    <div className="min-h-screen ttg-navy-gradient flex items-center justify-center p-6">
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-700">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-between p-16 ttg-navy-gradient relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <Hexagon size={400} />
          </div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 mb-8">
              <Hexagon size={40} className="text-ttg-grey" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase leading-none mb-4">TT GARMENT</h1>
            <p className="text-ttg-grey font-bold tracking-[0.3em] uppercase text-xs">Cash Flow Pro System</p>
          </div>

          <div className="relative z-10">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <ShieldCheck className="text-emerald-400" size={20} />
                </div>
                <p className="text-white/60 text-sm font-medium">Bảo mật 3 cấp độ phân quyền doanh nghiệp.</p>
              </div>
              <p className="text-white/30 text-xs italic leading-relaxed">
                Hệ thống quản trị tài chính nội bộ dành riêng cho tập đoàn TTG. Vui lòng đăng nhập để truy cập dữ liệu.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-20 flex flex-col justify-center">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-black text-ttg-navy uppercase tracking-tight">
              {isRegistering ? 'Đăng ký tài khoản' : 'Chào mừng trở lại'}
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
              {isRegistering ? 'Tạo tài khoản theo cấp bậc quản trị' : 'Đăng nhập để quản lý dòng tiền'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {isRegistering && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Họ và tên</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required 
                    type="text"
                    placeholder="Nguyễn Văn A" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-ttg-navy focus:bg-white outline-none transition-all text-sm font-bold text-ttg-navy"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tên đăng nhập</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required 
                  type="text"
                  placeholder="username_ttg" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-ttg-navy focus:bg-white outline-none transition-all text-sm font-bold text-ttg-navy"
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  required 
                  type="password"
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-ttg-navy focus:bg-white outline-none transition-all text-sm font-bold text-ttg-navy"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {isRegistering && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Cấp bậc tài khoản</label>
                <select 
                  className="w-full px-4 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-ttg-navy focus:bg-white outline-none transition-all text-sm font-black text-ttg-navy uppercase tracking-widest"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                >
                  {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-ttg-navy text-ttg-grey py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-ttg-navy/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 mt-4"
            >
              {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
              <span>{isRegistering ? 'Tạo tài khoản' : 'Đăng nhập hệ thống'}</span>
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">
              {isRegistering ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
            </p>
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-ttg-navy font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 mx-auto hover:text-ttg-dark transition-colors"
            >
              <span>{isRegistering ? 'Đăng nhập ngay' : 'Đăng ký tài khoản mới'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
