import { Transaction, Budget } from '../types';

export class FinanceUtils {
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  static formatDate(date: Date, format: 'short' | 'long' = 'short'): string {
    if (format === 'long') {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  static formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  static calculateTotalByType(transactions: Transaction[], type: 'income' | 'expense'): number {
    return transactions
      .filter(transaction => transaction.type === type)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  static calculateTotalSpentByCategory(transactions: Transaction[]): Record<string, number> {
    return transactions
      .filter(transaction => transaction.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);
  }

  static calculateBudgetProgress(budget: Budget): {
    percentage: number;
    remaining: number;
    isOverBudget: boolean;
  } {
    const percentage = (budget.spent / budget.allocated) * 100;
    const remaining = budget.allocated - budget.spent;
    const isOverBudget = budget.spent > budget.allocated;

    return {
      percentage: Math.min(percentage, 100),
      remaining,
      isOverBudget,
    };
  }

  static groupTransactionsByDate(transactions: Transaction[]): Record<string, Transaction[]> {
    return transactions.reduce((groups, transaction) => {
      const dateKey = transaction.date.toLocaleDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }

  static getRelativeDateString(date: Date): string {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return this.formatDate(date);
    }
  }

  static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  static getDaysInMonth(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  static getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  static getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }

  static getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  static getEndOfWeek(date: Date): Date {
    const startOfWeek = this.getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  }

  static validateTransaction(transaction: Partial<Transaction>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!transaction.amount || transaction.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!transaction.description || transaction.description.trim().length === 0) {
      errors.push('Description is required');
    }

    if (!transaction.category || transaction.category.trim().length === 0) {
      errors.push('Category is required');
    }

    if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
      errors.push('Type must be either income or expense');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateBudget(budget: Partial<Budget>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!budget.category || budget.category.trim().length === 0) {
      errors.push('Category is required');
    }

    if (!budget.allocated || budget.allocated <= 0) {
      errors.push('Allocated amount must be greater than 0');
    }

    if (!budget.period || !['weekly', 'monthly', 'yearly'].includes(budget.period)) {
      errors.push('Period must be weekly, monthly, or yearly');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static exportToCSV(transactions: Transaction[]): string {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = transactions.map(transaction => [
      transaction.date.toISOString(),
      transaction.description,
      transaction.category,
      transaction.type,
      transaction.amount.toString(),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  static calculateSavingsRate(transactions: Transaction[]): number {
    const totalIncome = this.calculateTotalByType(transactions, 'income');
    const totalExpenses = this.calculateTotalByType(transactions, 'expense');
    
    if (totalIncome === 0) return 0;
    return ((totalIncome - totalExpenses) / totalIncome) * 100;
  }

  static getTopSpendingCategories(transactions: Transaction[], limit: number = 5): Array<{
    category: string;
    amount: number;
    percentage: number;
  }> {
    const expensesByCategory = this.calculateTotalSpentByCategory(transactions);
    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  }
}