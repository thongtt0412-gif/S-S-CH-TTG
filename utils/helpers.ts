
import { Transaction, TransactionType } from "../types";

/**
 * Định dạng tiền tệ theo tiêu chuẩn kế toán Việt Nam
 */
export const formatCurrency = (amount: number): string => {
  if (amount === undefined || amount === null) return '0 VNĐ';
  const formattedNumber = Math.abs(amount).toLocaleString('vi-VN');
  return `${amount < 0 ? '-' : ''}${formattedNumber} VNĐ`;
};

/**
 * Chuyển đổi chuỗi nhập liệu có phím tắt (k, m, b) sang số thực tế
 * 10k -> 10.000
 * 5.5m -> 5.500.000
 * 2b -> 2.000.000.000
 */
export const parseAccountingInput = (input: string): number => {
  if (!input) return 0;
  
  // Xóa tất cả khoảng trắng và dấu phân cách cũ
  let cleanInput = input.toLowerCase().replace(/[,.\s]/g, '').replace(/vnđ/g, '');
  
  const multipliers: { [key: string]: number } = {
    'k': 1000,
    'ng': 1000,
    'm': 1000000,
    'tr': 1000000,
    'b': 1000000000,
    'ty': 1000000000,
    'tỷ': 1000000000
  };

  for (const [unit, multiplier] of Object.entries(multipliers)) {
    if (cleanInput.endsWith(unit)) {
      const value = parseFloat(cleanInput.replace(unit, ''));
      return isNaN(value) ? 0 : value * multiplier;
    }
  }

  const finalValue = parseFloat(cleanInput);
  return isNaN(finalValue) ? 0 : finalValue;
};

/**
 * Đọc số tiền thành chữ (Đơn giản hóa cho VNĐ)
 */
export const numberToVnText = (amount: number): string => {
  if (amount === 0) return "";
  if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(2)} Tỷ VNĐ`;
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(2)} Triệu VNĐ`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)} Ngàn VNĐ`;
  return `${amount} VNĐ`;
};

export const generateTrxId = (): string => {
  const prefix = 'TRX';
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(100 + Math.random() * 899).toString();
  return `${prefix}-${timestamp}${random}`;
};

export const calculateTotals = (transactions: Transaction[]) => {
  const totalIn = transactions
    .filter(t => t.type === TransactionType.CASH_IN)
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalOut = transactions
    .filter(t => t.type === TransactionType.CASH_OUT)
    .reduce((sum, t) => sum + t.amount, 0);

  return { totalIn, totalOut, net: totalIn - totalOut };
};

export const exportToCSV = (transactions: Transaction[]) => {
  const headers = ['ID', 'Ngày', 'Loại', 'Đơn vị', 'Phòng ban', 'Số tiền (VNĐ)', 'Ghi chú'];
  const rows = transactions.map(t => [
    t.id,
    t.date,
    t.type,
    t.businessUnit,
    t.department,
    t.amount.toString(),
    t.notes.replace(/,/g, ';')
  ]);

  const csvContent = "data:text/csv;charset=utf-8,\uFEFF"
    + headers.join(",") + "\n"
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `TTG_CashFlow_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
