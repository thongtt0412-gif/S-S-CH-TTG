
export enum TransactionType {
  CASH_IN = 'Thu (Cash In)',
  CASH_OUT = 'Chi (Cash Out)'
}

export enum BusinessUnit {
  TT_GARMENT = 'TT Garment',
  AFC = 'AFC',
  OTHER_SUBSIDIARY = 'Công ty con khác',
  TTG_GROUP = 'TTG Group'
}

export enum Department {
  FINANCE = 'Tài chính',
  SALES = 'Kinh doanh',
  HR = 'Nhân sự',
  PRODUCTION = 'Sản xuất',
  LOGISTICS = 'Logistics',
  MARKETING = 'Marketing',
  MANAGEMENT = 'Ban giám đốc'
}

export enum CashInSource {
  SALES = 'Bán hàng',
  PROJECT = 'Dự án',
  CUSTOMER = 'Khách hàng',
  OTHER = 'Thu khác'
}

export enum ExpenseGroup {
  SALARY = 'Lương',
  FABRIC = 'Vải & phụ liệu',
  OUTSOURCING = 'Gia công ngoài',
  LOGISTICS = 'Logistics',
  MARKETING = 'Marketing',
  OFFICE = 'Văn phòng',
  MAINTENANCE = 'Máy móc – bảo trì',
  OTHER = 'Chi khác'
}

export enum PaymentMethod {
  CASH = 'Tiền mặt',
  TRANSFER = 'Chuyển khoản',
  OTHER = 'Khác'
}

export enum ExpenseType {
  FIXED = 'Chi phí cố định',
  VARIABLE = 'Chi phí biến đổi'
}

export enum PriorityLevel {
  LOW = 'Thấp',
  MEDIUM = 'Trung bình',
  HIGH = 'Cao'
}

export enum FlowWarning {
  NEGATIVE = 'Âm',
  NORMAL = 'Bình thường'
}

export enum UserRole {
  CFO = 'Admin (CFO)',
  ACCOUNTANT = 'Kế toán',
  MANAGER = 'Quản lý'
}

export interface User {
  id: string;
  username: string;
  password?: string;
  fullName: string;
  role: UserRole;
}

export interface Partner {
  id: string;
  name: string;
  taxCode: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface BudgetItem {
  id: string;
  label: string;
  amount: number;
}

export interface MonthlyBudget {
  id: string;
  month: string; // YYYY-MM
  revenueItems: BudgetItem[];
  expenseItems: BudgetItem[];
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  businessUnit: BusinessUnit;
  department: Department;
  createdBy: string;
  
  // Cash In specific
  source?: CashInSource;
  clientId?: string; 
  clientName?: string;
  invoiceNumber?: string;
  
  // Cash Out specific
  expenseGroup?: ExpenseGroup;
  vendorId?: string; 
  vendorName?: string;
  expenseType?: ExpenseType;
  
  paymentMethod: PaymentMethod;
  amount: number;
  expectedDate: string;
  notes: string;
  
  // CFO Control
  isBudgeted: boolean;
  isOverBudget: boolean;
  priority: PriorityLevel;
  flowWarning: FlowWarning;

  // New: Attachment
  attachment?: string; // Base64 image data
}

export interface AppState {
  transactions: Transaction[];
  customers: Partner[];
  vendors: Partner[];
  budgets: MonthlyBudget[];
  currentRole: UserRole;
  openingBalance: number;
}
