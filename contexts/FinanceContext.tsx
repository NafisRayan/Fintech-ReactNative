import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  icon: string;
  status: 'completed' | 'pending' | 'failed';
  merchant?: string;
  location?: string;
  description?: string;
}

export interface Card {
  id: string;
  type: string;
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
  balance: string;
  colors: string[];
  isLocked: boolean;
  isVirtual: boolean;
  limit: number;
  spent: number;
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  shares: number;
  color: string;
  price: number;
  dayHigh: number;
  dayLow: number;
  marketCap: string;
}

export interface Budget {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  color: string;
  icon: string;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
  icon: string;
  description: string;
}

interface FinanceContextType {
  // Account data
  totalBalance: number;
  savingsBalance: number;
  checkingBalance: number;
  creditScore: number;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  getTransactionsByCategory: (category: string) => Transaction[];
  getRecentTransactions: (limit?: number) => Transaction[];
  
  // Cards
  cards: Card[];
  addCard: (card: Omit<Card, 'id'>) => void;
  toggleCardLock: (cardId: string) => void;
  
  // Investments
  investments: Investment[];
  portfolioValue: number;
  portfolioChange: number;
  portfolioChangePercent: number;
  
  // Budgets
  budgets: Budget[];
  updateBudget: (budgetId: string, spent: number) => void;
  
  // Goals
  goals: Goal[];
  updateGoalProgress: (goalId: string, amount: number) => void;
  
  // Analytics
  monthlySpending: { [key: string]: number };
  categorySpending: { [key: string]: number };
  
  // Utility functions
  formatCurrency: (amount: number) => string;
  calculateSpendingTrend: () => number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [totalBalance] = useState(12459.32);
  const [savingsBalance] = useState(8920.15);
  const [checkingBalance] = useState(3539.17);
  const [creditScore] = useState(742);
  
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      title: 'Coffee Shop',
      subtitle: 'Today, 9:30 AM',
      amount: -4.50,
      type: 'expense',
      category: 'Food & Drink',
      date: '2024-01-15T09:30:00Z',
      icon: '☕',
      status: 'completed',
      merchant: 'Starbucks',
      location: 'Downtown',
      description: 'Morning coffee'
    },
    {
      id: '2',
      title: 'Salary Deposit',
      subtitle: 'Yesterday, 2:00 PM',
      amount: 3200.00,
      type: 'income',
      category: 'Salary',
      date: '2024-01-14T14:00:00Z',
      icon: '💰',
      status: 'completed',
      merchant: 'TechCorp Inc.',
      description: 'Monthly salary'
    },
    {
      id: '3',
      title: 'Netflix',
      subtitle: 'Dec 15, 6:45 PM',
      amount: -15.99,
      type: 'expense',
      category: 'Entertainment',
      date: '2024-01-13T18:45:00Z',
      icon: '🎬',
      status: 'completed',
      merchant: 'Netflix',
      description: 'Monthly subscription'
    },
    {
      id: '4',
      title: 'Transfer from John',
      subtitle: 'Dec 14, 11:20 AM',
      amount: 125.00,
      type: 'income',
      category: 'Transfer',
      date: '2024-01-12T11:20:00Z',
      icon: '👤',
      status: 'completed',
      description: 'Dinner split payment'
    },
    {
      id: '5',
      title: 'Grocery Store',
      subtitle: 'Dec 13, 4:15 PM',
      amount: -87.32,
      type: 'expense',
      category: 'Groceries',
      date: '2024-01-11T16:15:00Z',
      icon: '🛒',
      status: 'completed',
      merchant: 'Whole Foods',
      description: 'Weekly groceries'
    }
  ]);

  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      type: 'Primary',
      number: '4532 1234 5678 9012',
      holder: 'JOHN DOE',
      expiry: '12/27',
      cvv: '123',
      balance: '$2,459.32',
      colors: ['#2563EB', '#3B82F6'],
      isLocked: false,
      isVirtual: false,
      limit: 5000,
      spent: 2540.68
    },
    {
      id: '2',
      type: 'Savings',
      number: '4532 9876 5432 1098',
      holder: 'JOHN DOE',
      expiry: '08/26',
      cvv: '456',
      balance: '$8,920.15',
      colors: ['#10B981', '#14F195'],
      isLocked: false,
      isVirtual: false,
      limit: 10000,
      spent: 1079.85
    },
    {
      id: '3',
      type: 'Business',
      number: '4532 5555 4444 3333',
      holder: 'JOHN DOE',
      expiry: '03/28',
      cvv: '789',
      balance: '$1,079.85',
      colors: ['#F59E0B', '#FBBF24'],
      isLocked: true,
      isVirtual: true,
      limit: 3000,
      spent: 1920.15
    }
  ]);

  const [investments] = useState<Investment[]>([
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      value: 4250.30,
      change: 45.20,
      changePercent: 1.08,
      shares: 25,
      color: '#2563EB',
      price: 170.01,
      dayHigh: 172.50,
      dayLow: 168.30,
      marketCap: '2.65T'
    },
    {
      id: '2',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      value: 3180.50,
      change: -12.40,
      changePercent: -0.39,
      shares: 12,
      color: '#10B981',
      price: 265.04,
      dayHigh: 268.90,
      dayLow: 262.15,
      marketCap: '1.68T'
    },
    {
      id: '3',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      value: 2890.25,
      change: 78.90,
      changePercent: 2.81,
      shares: 15,
      color: '#F59E0B',
      price: 192.68,
      dayHigh: 195.20,
      dayLow: 188.45,
      marketCap: '612B'
    },
    {
      id: '4',
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      value: 5099.70,
      change: 23.15,
      changePercent: 0.46,
      shares: 18,
      color: '#8B5CF6',
      price: 283.32,
      dayHigh: 285.75,
      dayLow: 280.90,
      marketCap: '2.11T'
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      category: 'Food & Drink',
      allocated: 500,
      spent: 287.50,
      remaining: 212.50,
      color: '#F59E0B',
      icon: '🍽️'
    },
    {
      id: '2',
      category: 'Transportation',
      allocated: 300,
      spent: 145.30,
      remaining: 154.70,
      color: '#10B981',
      icon: '🚗'
    },
    {
      id: '3',
      category: 'Entertainment',
      allocated: 200,
      spent: 89.99,
      remaining: 110.01,
      color: '#8B5CF6',
      icon: '🎬'
    },
    {
      id: '4',
      category: 'Shopping',
      allocated: 400,
      spent: 324.75,
      remaining: 75.25,
      color: '#EF4444',
      icon: '🛍️'
    }
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      target: 10000,
      current: 6500,
      deadline: '2024-12-31',
      color: '#10B981',
      icon: '🛡️',
      description: '6 months of expenses'
    },
    {
      id: '2',
      title: 'Vacation Fund',
      target: 5000,
      current: 2300,
      deadline: '2024-08-15',
      color: '#F59E0B',
      icon: '✈️',
      description: 'Europe trip savings'
    },
    {
      id: '3',
      title: 'New Car',
      target: 25000,
      current: 8750,
      deadline: '2025-06-01',
      color: '#2563EB',
      icon: '🚗',
      description: 'Down payment for new car'
    }
  ]);

  const portfolioValue = investments.reduce((sum, inv) => sum + inv.value, 0);
  const portfolioChange = investments.reduce((sum, inv) => sum + inv.change, 0);
  const portfolioChangePercent = (portfolioChange / (portfolioValue - portfolioChange)) * 100;

  const monthlySpending = {
    'Jan': 2450,
    'Feb': 2180,
    'Mar': 2890,
    'Apr': 2340,
    'May': 2670,
    'Jun': 2520
  };

  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as { [key: string]: number });

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const getTransactionsByCategory = (category: string) => {
    return transactions.filter(t => t.category === category);
  };

  const getRecentTransactions = (limit = 5) => {
    return transactions.slice(0, limit);
  };

  const addCard = (card: Omit<Card, 'id'>) => {
    const newCard = {
      ...card,
      id: Date.now().toString()
    };
    setCards(prev => [...prev, newCard]);
  };

  const toggleCardLock = (cardId: string) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isLocked: !card.isLocked } : card
    ));
  };

  const updateBudget = (budgetId: string, spent: number) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === budgetId 
        ? { ...budget, spent, remaining: budget.allocated - spent }
        : budget
    ));
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, current: Math.min(goal.current + amount, goal.target) }
        : goal
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateSpendingTrend = () => {
    const thisMonth = Object.values(monthlySpending).slice(-1)[0];
    const lastMonth = Object.values(monthlySpending).slice(-2, -1)[0];
    return ((thisMonth - lastMonth) / lastMonth) * 100;
  };

  return (
    <FinanceContext.Provider value={{
      totalBalance,
      savingsBalance,
      checkingBalance,
      creditScore,
      transactions,
      addTransaction,
      getTransactionsByCategory,
      getRecentTransactions,
      cards,
      addCard,
      toggleCardLock,
      investments,
      portfolioValue,
      portfolioChange,
      portfolioChangePercent,
      budgets,
      updateBudget,
      goals,
      updateGoalProgress,
      monthlySpending,
      categorySpending,
      formatCurrency,
      calculateSpendingTrend
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}