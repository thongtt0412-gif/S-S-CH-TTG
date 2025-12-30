
import { BusinessUnit, Department, UserRole, Partner, Transaction } from './types';

export const BUSINESS_UNITS = Object.values(BusinessUnit);
export const DEPARTMENTS = Object.values(Department);
export const ROLES = Object.values(UserRole);

// Dữ liệu khởi tạo được để trống theo yêu cầu người dùng
export const INITIAL_CUSTOMERS: Partner[] = [];

export const INITIAL_VENDORS: Partner[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];
