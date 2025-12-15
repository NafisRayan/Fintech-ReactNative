import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Transaction, Budget, Account } from '../types';
import { DemoDataService } from '../services/DemoDataService';

const { width } = Dimensions.get('window');

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [weeklyData, setWeeklyData] = useState<any>({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0, 0],
      color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
      strokeWidth: 2,
    }],
  });

  useEffect(() => {
    // Load demo data
    const demoAccounts = DemoDataService.generateDemoAccounts();
    const demoTransactions = DemoDataService.generateDemoTransactions();
    const demoBudgets = DemoDataService.generateDemoBudgets();
    const analyticsData = DemoDataService.generateDemoAnalyticsData();

    setAccounts(demoAccounts);
    setRecentTransactions(demoTransactions.slice(0, 6));
    setBudgets(demoBudgets.slice(0, 3)); // Show top 3 budgets

    // Prepare weekly data for chart - ensure weeklySpending is always an array
    const weeklySpending = analyticsData.weeklySpending || [0, 0, 0, 0, 0, 0, 0];
    setWeeklyData({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: weeklySpending.map(value => value || 0), // Ensure no undefined values
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 2,
      }],
    });
  }, []);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = recentTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = recentTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const renderAccountCard = (account: Account) => (
    <View key={account.id} style={[styles.accountCard, { borderLeftColor: '#6366f1' }]}>
      <View style={styles.accountHeader}>
        <Text style={styles.accountName}>{account.name}</Text>
        <Text style={styles.accountType}>{account.type}</Text>
      </View>
      <Text style={styles.accountBalance}>
        {account.currency} {account.balance.toFixed(2)}
      </Text>
    </View>
  );

  const renderTransaction = (transaction: Transaction) => (
    <View key={transaction.id} style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Ionicons 
          name={transaction.icon as any} 
          size={20} 
          color={transaction.type === 'income' ? '#10b981' : '#ef4444'} 
        />
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{transaction.description}</Text>
        <Text style={styles.transactionCategory}>{transaction.category}</Text>
      </View>
      <Text style={[
        styles.transactionAmount,
        { color: transaction.type === 'income' ? '#10b981' : '#ef4444' }
      ]}>
        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
      </Text>
    </View>
  );

  const renderBudgetItem = (budget: Budget) => {
    const percentage = (budget.spent / budget.allocated) * 100;
    const remaining = budget.allocated - budget.spent;
    
    return (
      <View key={budget.id} style={styles.budgetItem}>
        <View style={styles.budgetHeader}>
          <View style={styles.budgetInfo}>
            <Ionicons name={budget.icon as any} size={20} color={budget.color} />
            <Text style={styles.budgetCategory}>{budget.category}</Text>
          </View>
          <Text style={styles.budgetRemaining}>
            ${remaining.toFixed(2)} left
          </Text>
        </View>
        <View style={styles.budgetProgress}>
          <View style={[styles.budgetProgressBar, { width: `${Math.min(percentage, 100)}%`, backgroundColor: budget.color }]} />
        </View>
        <View style={styles.budgetDetails}>
          <Text style={styles.budgetSpent}>${budget.spent.toFixed(2)} spent</Text>
          <Text style={styles.budgetAllocated}>${budget.allocated.toFixed(2)} allocated</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, Alex! 👋</Text>
        <Text style={styles.totalBalance}>${totalBalance.toFixed(2)}</Text>
        <Text style={styles.balanceLabel}>Total Balance</Text>
      </View>

      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, { backgroundColor: '#1f2937' }]}>
          <View style={styles.summaryIcon}>
            <Ionicons name="trending-up" size={24} color="#10b981" />
          </View>
          <Text style={styles.summaryLabel}>Income</Text>
          <Text style={styles.summaryValue}>+${totalIncome.toFixed(2)}</Text>
          <Text style={styles.summaryTrend}>+12% from last month</Text>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: '#1f2937' }]}>
          <View style={styles.summaryIcon}>
            <Ionicons name="trending-down" size={24} color="#ef4444" />
          </View>
          <Text style={styles.summaryLabel}>Expenses</Text>
          <Text style={styles.summaryValue}>-${totalExpenses.toFixed(2)}</Text>
          <Text style={styles.summaryTrend}>+8% from last month</Text>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: '#1f2937' }]}>
          <View style={styles.summaryIcon}>
            <Ionicons name="wallet" size={24} color="#6366f1" />
          </View>
          <Text style={styles.summaryLabel}>Savings Rate</Text>
          <Text style={styles.summaryValue}>23%</Text>
          <Text style={styles.summaryTrend}>On track</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Weekly Spending</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chartContainer}>
          <LineChart
            data={weeklyData}
            width={width - 32}
            height={200}
            chartConfig={{
              backgroundColor: '#1f2937',
              backgroundGradientFrom: '#1f2937',
              backgroundGradientTo: '#1f2937',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#6366f1',
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        {accounts.slice(0, 3).map(renderAccountCard)}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsList}>
          {recentTransactions.map(renderTransaction)}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Budget Overview</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Manage</Text>
          </TouchableOpacity>
        </View>
        {budgets.map(renderBudgetItem)}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="add-circle" size={24} color="#6366f1" />
            <Text style={styles.quickActionText}>Add Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="pie-chart" size={24} color="#10b981" />
            <Text style={styles.quickActionText}>View Analytics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="wallet" size={24} color="#f59e0b" />
            <Text style={styles.quickActionText}>Manage Budget</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="receipt" size={24} color="#8b5cf6" />
            <Text style={styles.quickActionText}>Pay Bills</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 8,
  },
  totalBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f3f4f6',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryIcon: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f3f4f6',
  },
  summaryTrend: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f3f4f6',
  },
  seeAll: {
    fontSize: 14,
    color: '#6366f1',
  },
  chartContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
  },
  chart: {
    borderRadius: 16,
  },
  accountCard: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f3f4f6',
  },
  accountType: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'capitalize',
  },
  accountBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f3f4f6',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f3f4f6',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#9ca3af',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetItem: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f3f4f6',
  },
  budgetRemaining: {
    fontSize: 14,
    color: '#9ca3af',
  },
  budgetProgress: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  budgetProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetSpent: {
    fontSize: 12,
    color: '#f3f4f6',
  },
  budgetAllocated: {
    fontSize: 12,
    color: '#9ca3af',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '48%',
  },
  quickActionText: {
    fontSize: 12,
    color: '#f3f4f6',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default Dashboard;
