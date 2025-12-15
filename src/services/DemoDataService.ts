import { Transaction, Budget, Account, Category } from '../types';

function getCategoryIcon(category: string): string {
  const categoryIcons: Record<string, string> = {
    'Food & Dining': 'restaurant',
    'Transportation': 'car',
    'Entertainment': 'game-controller',
    'Shopping': 'cart',
    'Bills & Utilities': 'receipt',
    'Healthcare': 'medical',
    'Personal Care': 'person',
    'Education': 'school',
    'Travel': 'airplane',
    'Savings': 'wallet',
    'Salary': 'wallet',
    'Freelance': 'laptop',
    'Investment': 'trending-up',
  };
  return categoryIcons[category] || 'help-circle';
}

export class DemoDataService {
  static generateDemoAccounts(): Account[] {
    return [
      {
        id: '1',
        name: 'PayMee Balance',
        balance: 24.98,
        type: 'checking',
        currency: 'JPY',
      },
      {
        id: '2',
        name: 'Chase Checking',
        balance: 3456.78,
        type: 'checking',
        currency: 'USD',
      },
      {
        id: '3',
        name: 'Bank of America Savings',
        balance: 12500.00,
        type: 'savings',
        currency: 'USD',
      },
      {
        id: '4',
        name: 'Chase Sapphire Credit',
        balance: -892.45,
        type: 'credit',
        currency: 'USD',
      },
      {
        id: '5',
        name: 'Investment Portfolio',
        balance: 28450.32,
        type: 'investment',
        currency: 'USD',
      },
      {
        id: '6',
        name: 'Emergency Fund',
        balance: 8750.00,
        type: 'savings',
        currency: 'USD',
      },
    ];
  }

  static generateDemoTransactions(): Transaction[] {
    const now = new Date();
    const transactions: Transaction[] = [];

    // Current month transactions
    const currentMonthTransactions = [
      // Today
      { amount: 45.99, description: 'Whole Foods Market', category: 'Food & Dining', type: 'expense', icon: 'cart' },
      { amount: 12.50, description: 'Starbucks Coffee', category: 'Food & Dining', type: 'expense', icon: 'restaurant' },
      { amount: 1200.00, description: 'Monthly Salary', category: 'Salary', type: 'income', icon: 'wallet' },
      
      // Yesterday
      { amount: 85.00, description: 'Gas Station - Shell', category: 'Transportation', type: 'expense', icon: 'car' },
      { amount: 29.99, description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', icon: 'tv' },
      { amount: 156.32, description: 'Target Shopping', category: 'Shopping', type: 'expense', icon: 'cart' },
      
      // 2 days ago
      { amount: 250.00, description: 'Freelance Project', category: 'Freelance', type: 'income', icon: 'laptop' },
      { amount: 45.00, description: 'Gym Membership', category: 'Healthcare', type: 'expense', icon: 'medical' },
      { amount: 23.45, description: 'Uber Ride', category: 'Transportation', type: 'expense', icon: 'car' },
      
      // 3 days ago
      { amount: 89.99, description: 'Spotify Premium', category: 'Entertainment', type: 'expense', icon: 'musical-notes' },
      { amount: 234.56, description: 'Electric Bill', category: 'Bills & Utilities', type: 'expense', icon: 'receipt' },
      { amount: 67.89, description: 'Restaurant - Italian Bistro', category: 'Food & Dining', type: 'expense', icon: 'restaurant' },
      
      // 4 days ago
      { amount: 1200.00, description: 'Monthly Salary', category: 'Salary', type: 'income', icon: 'wallet' },
      { amount: 45.00, description: 'Internet Bill', category: 'Bills & Utilities', type: 'expense', icon: 'receipt' },
      { amount: 156.78, description: 'Amazon Purchase', category: 'Shopping', type: 'expense', icon: 'cart' },
      
      // 5 days ago
      { amount: 23.45, description: 'Lunch with Colleagues', category: 'Food & Dining', type: 'expense', icon: 'restaurant' },
      { amount: 89.00, description: 'Car Insurance', category: 'Transportation', type: 'expense', icon: 'car' },
      { amount: 450.00, description: 'Investment Dividend', category: 'Investment', type: 'income', icon: 'trending-up' },
      
      // 6 days ago
      { amount: 78.90, description: 'Grocery Shopping', category: 'Food & Dining', type: 'expense', icon: 'cart' },
      { amount: 34.56, description: 'Movie Tickets', category: 'Entertainment', type: 'expense', icon: 'game-controller' },
      { amount: 125.00, description: 'Phone Bill', category: 'Bills & Utilities', type: 'expense', icon: 'receipt' },
      
      // 7 days ago
      { amount: 56.78, description: 'Clothing Store', category: 'Shopping', type: 'expense', icon: 'cart' },
      { amount: 234.56, description: 'Rent Payment', category: 'Bills & Utilities', type: 'expense', icon: 'receipt' },
      { amount: 75.00, description: 'Doctor Visit', category: 'Healthcare', type: 'expense', icon: 'medical' },
    ];

    // Add current month transactions
    currentMonthTransactions.forEach((trans, index) => {
      const date = new Date(now);
      date.setDate(date.getDate() - index);
      transactions.push({
        id: `current-${index}`,
        amount: trans.amount,
        description: trans.description,
        category: trans.category,
        date,
        type: trans.type as 'income' | 'expense', // Already cast in the loop
        icon: getCategoryIcon(trans.category),
      });
    });

    // Previous month transactions
    const previousMonthTransactions = [
      { amount: 1200.00, description: 'Monthly Salary', category: 'Salary', type: 'income', icon: 'wallet' },
      { amount: 234.56, description: 'Rent Payment', category: 'Bills & Utilities', type: 'expense', icon: 'receipt' },
      { amount: 156.78, description: 'Costco Wholesale', category: 'Shopping', type: 'expense', icon: 'cart' },
      { amount: 89.99, description: 'Netflix Subscription', category: 'Entertainment', type: 'expense', icon: 'tv' },
      { amount: 45.00, description: 'Gym Membership', category: 'Healthcare', type: 'expense', icon: 'medical' },
      { amount: 234.56, description: 'Electric Bill', category: 'Bills & Utilities', type: 'expense', icon: 'receipt' },
      { amount: 156.32, description: 'Target Shopping', category: 'Shopping', type: 'expense', icon: 'cart' },
      { amount: 67.89, description: 'Restaurant - Mexican', category: 'Food & Dining', type: 'expense', icon: 'restaurant' },
      { amount: 450.00, description: 'Investment Dividend', category: 'Investment', type: 'income', icon: 'trending-up' },
      { amount: 23.45, description: 'Coffee Shop', category: 'Food & Dining', type: 'expense', icon: 'restaurant' },
      { amount: 125.00, description: 'Phone Bill', category: 'Bills & Utilities', type: 'expense', icon: 'receipt' },
      { amount: 34.56, description: 'Concert Tickets', category: 'Entertainment', type: 'expense', icon: 'game-controller' },
      { amount: 89.00, description: 'Car Insurance', category: 'Transportation', type: 'expense', icon: 'car' },
      { amount: 56.78, description: 'Pharmacy', category: 'Healthcare', type: 'expense', icon: 'medical' },
      { amount: 1200.00, description: 'Monthly Salary', category: 'Salary', type: 'income', icon: 'wallet' },
    ];

    // Add previous month transactions
    previousMonthTransactions.forEach((trans, index) => {
      const date = new Date(now);
      date.setMonth(date.getMonth() - 1);
      date.setDate(date.getDate() + index);
      transactions.push({
        id: `previous-${index}`,
        amount: trans.amount,
        description: trans.description,
        category: trans.category,
        type: trans.type as 'income' | 'expense',
        icon: trans.icon,
        date,
      });
    });

    // Add some random transactions from 2-3 months ago
    for (let i = 0; i < 20; i++) {
      const randomTrans = [
        { amount: 23.45, description: 'Coffee', category: 'Food & Dining', type: 'expense', icon: 'restaurant' },
        { amount: 156.78, description: 'Shopping', category: 'Shopping', type: 'expense', icon: 'cart' },
        { amount: 89.99, description: 'Subscription', category: 'Entertainment', type: 'expense', icon: 'tv' },
        { amount: 45.00, description: 'Gas', category: 'Transportation', type: 'expense', icon: 'car' },
        { amount: 1200.00, description: 'Salary', category: 'Salary', type: 'income', icon: 'wallet' },
        { amount: 234.56, description: 'Utilities', category: 'Bills & Utilities', type: 'expense', icon: 'receipt' },
      ][Math.floor(Math.random() * 6)];

      const date = new Date(now);
      date.setMonth(date.getMonth() - (2 + Math.floor(Math.random() * 2)));
      date.setDate(Math.floor(Math.random() * 28) + 1);

      transactions.push({
        id: `random-${i}`,
        amount: randomTrans.amount,
        description: randomTrans.description,
        category: randomTrans.category,
        type: randomTrans.type as 'income' | 'expense',
        icon: randomTrans.icon,
        date,
      });
    }

    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  static generateDemoBudgets(): Budget[] {
    return [
      {
        id: '1',
        category: 'Food & Dining',
        allocated: 600,
        spent: 423.45,
        period: 'monthly',
        icon: 'restaurant',
        color: '#6366f1',
      },
      {
        id: '2',
        category: 'Transportation',
        allocated: 250,
        spent: 187.50,
        period: 'monthly',
        icon: 'car',
        color: '#8b5cf6',
      },
      {
        id: '3',
        category: 'Entertainment',
        allocated: 200,
        spent: 178.99,
        period: 'monthly',
        icon: 'game-controller',
        color: '#ec4899',
      },
      {
        id: '4',
        category: 'Shopping',
        allocated: 400,
        spent: 445.67,
        period: 'monthly',
        icon: 'cart',
        color: '#f59e0b',
      },
      {
        id: '5',
        category: 'Bills & Utilities',
        allocated: 800,
        spent: 789.12,
        period: 'monthly',
        icon: 'receipt',
        color: '#10b981',
      },
      {
        id: '6',
        category: 'Healthcare',
        allocated: 150,
        spent: 89.00,
        period: 'monthly',
        icon: 'medical',
        color: '#ef4444',
      },
      {
        id: '7',
        category: 'Personal Care',
        allocated: 100,
        spent: 67.89,
        period: 'monthly',
        icon: 'person',
        color: '#f97316',
      },
      {
        id: '8',
        category: 'Education',
        allocated: 50,
        spent: 45.00,
        period: 'monthly',
        icon: 'school',
        color: '#06b6d4',
      },
      {
        id: '9',
        category: 'Travel',
        allocated: 300,
        spent: 0,
        period: 'monthly',
        icon: 'airplane',
        color: '#84cc16',
      },
      {
        id: '10',
        category: 'Savings',
        allocated: 1000,
        spent: 850.00,
        period: 'monthly',
        icon: 'wallet',
        color: '#10b981',
      },
    ];
  }

  static generateDemoCategories(): Category[] {
    return [
      { id: '1', name: 'Food & Dining', icon: 'restaurant', color: '#6366f1', budget: 600 },
      { id: '2', name: 'Transportation', icon: 'car', color: '#8b5cf6', budget: 250 },
      { id: '3', name: 'Entertainment', icon: 'game-controller', color: '#ec4899', budget: 200 },
      { id: '4', name: 'Shopping', icon: 'cart', color: '#f59e0b', budget: 400 },
      { id: '5', name: 'Bills & Utilities', icon: 'receipt', color: '#10b981', budget: 800 },
      { id: '6', name: 'Healthcare', icon: 'medical', color: '#ef4444', budget: 150 },
      { id: '7', name: 'Personal Care', icon: 'person', color: '#f97316', budget: 100 },
      { id: '8', name: 'Education', icon: 'school', color: '#06b6d4', budget: 50 },
      { id: '9', name: 'Travel', icon: 'airplane', color: '#84cc16', budget: 300 },
      { id: '10', name: 'Savings', icon: 'wallet', color: '#10b981', budget: 1000 },
      { id: '11', name: 'Salary', icon: 'wallet', color: '#10b981', budget: 0 },
      { id: '12', name: 'Freelance', icon: 'laptop', color: '#6366f1', budget: 0 },
      { id: '13', name: 'Investment', icon: 'trending-up', color: '#8b5cf6', budget: 0 },
    ];
  }

  static generateDemoAnalyticsData() {
    const transactions = this.generateDemoTransactions();
    const now = new Date();
    
    // Monthly data for the last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthTransactions = transactions.filter(t => 
        t.date.getMonth() === monthDate.getMonth() && 
        t.date.getFullYear() === monthDate.getFullYear()
      );
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      monthlyData.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        income,
        expenses,
        savings: income - expenses,
      });
    }

    // Category spending data
    const categorySpending: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });

    const categoryData = Object.entries(categorySpending)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / Object.values(categorySpending).reduce((sum: number, a: number) => sum + a, 0)) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);

    // Weekly spending for current month
    const weeklySpending = [0, 0, 0, 0, 0, 0, 0];
    const currentMonthTransactions = transactions.filter(t => 
      t.date.getMonth() === now.getMonth() && 
      t.date.getFullYear() === now.getFullYear()
    );

    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const dayOfWeek = t.date.getDay();
        weeklySpending[dayOfWeek === 0 ? 6 : dayOfWeek - 1] += t.amount;
      });

    return {
      monthlyData,
      categoryData,
      weeklySpending,
      totalIncome: monthlyData.reduce((sum, m) => sum + m.income, 0),
      totalExpenses: monthlyData.reduce((sum, m) => sum + m.expenses, 0),
      totalSavings: monthlyData.reduce((sum, m) => sum + m.savings, 0),
    };
  }

  static generateDemoFinancialGoals() {
    return [
      {
        title: 'Emergency Fund',
        current: 8750,
        target: 15000,
        icon: 'shield-checkmark',
        color: '#10b981',
        description: '6 months of expenses',
      },
      {
        title: 'Vacation Fund',
        current: 1200,
        target: 5000,
        icon: 'airplane',
        color: '#6366f1',
        description: 'Summer 2024 trip',
      },
      {
        title: 'New Laptop',
        current: 450,
        target: 2500,
        icon: 'laptop',
        color: '#8b5cf6',
        description: 'Work upgrade',
      },
      {
        title: 'House Down Payment',
        current: 15000,
        target: 50000,
        icon: 'home',
        color: '#f59e0b',
        description: 'First home purchase',
      },
      {
        title: 'Investment Portfolio',
        current: 28450,
        target: 50000,
        icon: 'trending-up',
        color: '#ec4899',
        description: 'Retirement planning',
      },
    ];
  }

  static generateDemoUserProfile() {
    return {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      avatar: null,
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      memberSince: 'January 2022',
      notifications: true,
      biometric: false,
      darkMode: true,
      autoBackup: true,
    };
  }
}
