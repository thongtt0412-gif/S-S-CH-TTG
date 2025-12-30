
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AIInsights from './components/AIInsights';
import PartnerManager from './components/PartnerManager';
import BudgetSetup from './components/BudgetSetup';
import DatabaseManagement from './components/DatabaseManagement';
import Auth from './components/Auth';
import { Transaction, UserRole, Partner, MonthlyBudget, User } from './types';
import { INITIAL_TRANSACTIONS, INITIAL_CUSTOMERS, INITIAL_VENDORS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Initialize state from LocalStorage or use defaults
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ttg_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [customers, setCustomers] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('ttg_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  
  const [vendors, setVendors] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('ttg_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });
  
  const [budgets, setBudgets] = useState<MonthlyBudget[]>(() => {
    const saved = localStorage.getItem('ttg_budgets');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [openingBalance, setOpeningBalance] = useState<number>(() => {
    const saved = localStorage.getItem('ttg_opening_balance');
    return saved ? JSON.parse(saved) : 0;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Sync state to LocalStorage on every change
  useEffect(() => {
    localStorage.setItem('ttg_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('ttg_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('ttg_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('ttg_budgets', JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem('ttg_opening_balance', JSON.stringify(openingBalance));
  }, [openingBalance]);

  useEffect(() => {
    const savedUser = localStorage.getItem('ttg_session');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ttg_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ttg_session');
  };

  const handleImportData = (data: any) => {
    if (data.transactions) setTransactions(data.transactions);
    if (data.customers) setCustomers(data.customers);
    if (data.vendors) setVendors(data.vendors);
    if (data.budgets) setBudgets(data.budgets);
    if (data.openingBalance !== undefined) setOpeningBalance(data.openingBalance);
    alert('Đã nhập dữ liệu thành công. Hệ thống đã được đồng bộ!');
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const handleSaveTransaction = (newTrx: Transaction) => {
    const trxWithUser = { ...newTrx, createdBy: currentUser.fullName };
    setTransactions(prev => [trxWithUser, ...prev]);
    setActiveTab('history');
  };

  const handleAddPartner = (type: 'Khách hàng' | 'Nhà cung cấp', partner: Partner) => {
    if (type === 'Khách hàng') setCustomers(prev => [...prev, partner]);
    else setVendors(prev => [...prev, partner]);
  };

  const handleDeletePartner = (type: 'Khách hàng' | 'Nhà cung cấp', id: string) => {
    if (type === 'Khách hàng') setCustomers(prev => prev.filter(p => p.id !== id));
    else setVendors(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveBudget = (newBudget: MonthlyBudget) => {
    setBudgets(prev => {
      const filtered = prev.filter(b => b.month !== newBudget.month);
      return [...filtered, newBudget];
    });
  };

  const handleResetData = () => {
    if (window.confirm('CẢNH BÁO: Hành động này sẽ xóa TOÀN BỘ dữ liệu. Bạn có chắc chắn?')) {
      setTransactions([]);
      setCustomers([]);
      setVendors([]);
      setBudgets([]);
      setOpeningBalance(0);
      localStorage.removeItem('ttg_transactions');
      localStorage.removeItem('ttg_customers');
      localStorage.removeItem('ttg_vendors');
      localStorage.removeItem('ttg_budgets');
      localStorage.removeItem('ttg_opening_balance');
      setActiveTab('dashboard');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-12 animate-in fade-in duration-500">
            <Dashboard 
              transactions={transactions} 
              openingBalance={openingBalance} 
              onUpdateOpeningBalance={setOpeningBalance}
              isAdmin={currentUser.role === UserRole.CFO}
              budgets={budgets}
            />
            <AIInsights transactions={transactions} />
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
               <h3 className="text-xl font-black text-ttg-navy uppercase tracking-widest mb-6">Giao dịch vừa thực hiện</h3>
               <TransactionList transactions={transactions.slice(0, 5)} />
            </div>
          </div>
        );
      case 'budget':
        return <BudgetSetup budgets={budgets} onSave={handleSaveBudget} userRole={currentUser.role} />;
      case 'entry':
        if (currentUser.role === UserRole.MANAGER) return <div className="p-20 text-center text-rose-500 font-black uppercase tracking-widest">Bạn không có quyền lập phiếu!</div>;
        return <TransactionForm onSave={handleSaveTransaction} onCancel={() => setActiveTab('dashboard')} customers={customers} vendors={vendors} />;
      case 'history':
        return <TransactionList transactions={transactions} />;
      case 'customers':
        return <PartnerManager type="Khách hàng" partners={customers} onAdd={(p) => handleAddPartner('Khách hàng', p)} onDelete={(id) => handleDeletePartner('Khách hàng', id)} />;
      case 'vendors':
        return <PartnerManager type="Nhà cung cấp" partners={vendors} onAdd={(p) => handleAddPartner('Nhà cung cấp', p)} onDelete={(id) => handleDeletePartner('Nhà cung cấp', id)} />;
      case 'database':
        return <DatabaseManagement 
                data={{ transactions, customers, vendors, budgets, openingBalance }} 
                onImport={handleImportData}
                onReset={handleResetData}
              />;
      default:
        return <div className="p-20 text-center text-slate-400 font-medium italic">Chức năng đang phát triển...</div>;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} onLogout={handleLogout} onResetData={handleResetData}>
      {renderContent()}
    </Layout>
  );
};

export default App;
