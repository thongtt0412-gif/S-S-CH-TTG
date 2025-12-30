
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { ROLES } from '../constants';
import { 
  LayoutDashboard, PlusCircle, Users, Briefcase, Settings, 
  UserCheck, Wallet, RefreshCw, Hexagon, Target, Bell, Search, Menu, X, LogOut, Database
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  onLogout: () => void;
  onResetData: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, currentUser, onLogout, onResetData }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'budget', label: 'Ngân sách', icon: Target, roles: [UserRole.CFO, UserRole.ACCOUNTANT] },
    { id: 'entry', label: 'Lập phiếu', icon: PlusCircle, roles: [UserRole.CFO, UserRole.ACCOUNTANT] },
    { id: 'history', label: 'Sổ cái', icon: Wallet },
    { id: 'customers', label: 'Khách hàng', icon: UserCheck },
    { id: 'vendors', label: 'Đối tác', icon: Briefcase },
    { id: 'database', label: 'Hệ dữ liệu', icon: Database, roles: [UserRole.CFO] },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-ttg-light">
      {/* Overlay for mobile sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-ttg-navy/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - TTG Navy */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 ttg-navy-gradient text-white flex flex-col shadow-2xl z-40 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        <div className="p-8 lg:p-10 flex flex-col items-center relative">
          <button 
            className="lg:hidden absolute top-6 right-6 text-white/40 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/10 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center border border-white/20 relative group transition-all hover:bg-white/20 cursor-pointer">
             <Hexagon size={36} className="text-ttg-grey lg:size-11 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-white mt-1">TG</span>
             </div>
          </div>
          <div className="mt-6 text-center">
            <h1 className="text-xs lg:text-sm font-black tracking-[0.3em] text-ttg-grey uppercase">TT GARMENT</h1>
            <p className="text-[8px] lg:text-[9px] text-white/40 mt-1.5 uppercase font-bold tracking-[0.2em]">Build Your Brand</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 lg:px-6 space-y-1 overflow-y-auto mt-2">
          {navItems.map((item) => {
            if (item.roles && !item.roles.includes(currentUser.role)) return null;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center space-x-4 px-4 py-3.5 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-ttg-grey text-ttg-navy shadow-xl lg:translate-x-1' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-ttg-navy' : 'text-white/30 group-hover:text-ttg-grey transition-colors'} />
                <span className={`font-black text-[10px] lg:text-[11px] uppercase tracking-widest ${isActive ? 'text-ttg-navy' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6 lg:p-8 space-y-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-[9px] uppercase text-white/30 font-black mb-1 tracking-widest">Tài khoản</p>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-ttg-grey flex items-center justify-center text-ttg-navy font-black text-[10px] shadow-lg">
                {currentUser.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-white truncate">{currentUser.fullName}</p>
                <p className="text-[8px] font-bold text-white/40 uppercase truncate">{currentUser.role}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-white/5 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest border border-white/5"
            >
              <LogOut size={12} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 lg:ml-0 overflow-x-hidden">
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-20">
          <div className="flex items-center space-x-4 lg:space-x-8">
            <button 
              className="lg:hidden p-2 text-ttg-navy hover:bg-slate-50 rounded-xl"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="relative group hidden md:block">
              <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-ttg-navy transition-colors" />
              <input type="text" placeholder="Tìm nghiệp vụ..." className="bg-transparent border-none outline-none pl-8 text-xs font-bold text-slate-400 placeholder:text-slate-200 w-48 lg:w-64 focus:w-80 transition-all" />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 lg:space-x-8">
             <button className="relative text-slate-400 hover:text-ttg-navy transition-colors p-2 rounded-xl">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
             </button>

             <div className="h-6 w-[1px] bg-slate-100"></div>

             <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="text-right hidden lg:block">
                  <p className="text-[10px] font-black text-ttg-navy uppercase tracking-widest leading-none">{currentUser.fullName}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{currentUser.role}</p>
                </div>
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl ttg-navy-gradient shadow-lg flex items-center justify-center border-2 border-ttg-grey/20">
                  <span className="text-ttg-grey font-black text-[10px] lg:text-xs uppercase">{currentUser.fullName.substring(0, 2).toUpperCase()}</span>
                </div>
             </div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
