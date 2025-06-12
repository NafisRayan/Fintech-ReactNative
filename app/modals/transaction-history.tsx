import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Filter, ArrowUpRight, ArrowDownLeft, Calendar, TrendingUp, TrendingDown } from 'lucide-react-native';

export default function TransactionHistoryModal() {
  const { colors } = useTheme();
  const { transactions, formatCurrency } = useFinance();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expenses' },
    { key: 'transfer', label: 'Transfers' }
  ];

  const periodOptions = [
    { key: 'today', label: 'Today' },
    { key: 'this_week', label: 'This Week' },
    { key: 'this_month', label: 'This Month' },
    { key: 'last_month', label: 'Last Month' },
    { key: 'this_year', label: 'This Year' }
  ];

  // Extended transaction data for demo
  const allTransactions = [
    ...transactions,
    {
      id: '6',
      title: 'Amazon Purchase',
      subtitle: 'Dec 12, 2:30 PM',
      amount: -234.99,
      type: 'expense' as const,
      category: 'Shopping',
      date: '2024-01-10T14:30:00Z',
      icon: '📦',
      status: 'completed' as const,
      merchant: 'Amazon',
      description: 'Electronics purchase'
    },
    {
      id: '7',
      title: 'Freelance Payment',
      subtitle: 'Dec 11, 9:15 AM',
      amount: 850.00,
      type: 'income' as const,
      category: 'Work',
      date: '2024-01-09T09:15:00Z',
      icon: '💼',
      status: 'completed' as const,
      merchant: 'TechCorp',
      description: 'Web development project'
    },
    {
      id: '8',
      title: 'Gym Membership',
      subtitle: 'Dec 10, 6:00 AM',
      amount: -49.99,
      type: 'expense' as const,
      category: 'Health & Fitness',
      date: '2024-01-08T06:00:00Z',
      icon: '💪',
      status: 'completed' as const,
      merchant: 'FitLife Gym',
      description: 'Monthly membership'
    },
    {
      id: '9',
      title: 'Gas Station',
      subtitle: 'Dec 9, 4:45 PM',
      amount: -52.30,
      type: 'expense' as const,
      category: 'Transportation',
      date: '2024-01-07T16:45:00Z',
      icon: '⛽',
      status: 'completed' as const,
      merchant: 'Shell',
      description: 'Fuel purchase'
    },
    {
      id: '10',
      title: 'Dividend Payment',
      subtitle: 'Dec 8, 10:00 AM',
      amount: 125.50,
      type: 'income' as const,
      category: 'Investment',
      date: '2024-01-06T10:00:00Z',
      icon: '📈',
      status: 'completed' as const,
      merchant: 'Investment Account',
      description: 'Quarterly dividend'
    }
  ];

  const filteredTransactions = allTransactions.filter(transaction => {
    // Filter by search query
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.merchant?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by type
    const matchesType = selectedFilter === 'all' || 
                       (selectedFilter === 'transfer' && transaction.category === 'Transfer') ||
                       transaction.type === selectedFilter;

    return matchesSearch && matchesType;
  });

  const groupTransactionsByDate = (transactions: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateKey;
      if (date.toDateString() === today.toDateString()) {
        dateKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateKey = 'Yesterday';
      } else {
        dateKey = date.toLocaleDateString('en-US', { 
          weekday: 'long',
          month: 'short', 
          day: 'numeric' 
        });
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });

    return groups;
  };

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const calculateTotals = () => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { income, expenses, net: income - expenses };
  };

  const totals = calculateTotals();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Transaction History</Text>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.surface }]}>
          <Filter size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.section}>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
            <Search size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search transactions..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filters */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filters}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: selectedFilter === option.key ? colors.primary : colors.surface,
                    }
                  ]}
                  onPress={() => setSelectedFilter(option.key)}
                >
                  <Text style={[
                    styles.filterChipText,
                    { color: selectedFilter === option.key ? '#FFFFFF' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryHeader}>
                <ArrowDownLeft size={16} color={colors.secondary} />
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Income
                </Text>
              </View>
              <Text style={[styles.summaryValue, { color: colors.secondary }]}>
                {formatCurrency(totals.income)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <View style={styles.summaryHeader}>
                <ArrowUpRight size={16} color={colors.error} />
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Expenses
                </Text>
              </View>
              <Text style={[styles.summaryValue, { color: colors.error }]}>
                {formatCurrency(totals.expenses)}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <View style={styles.summaryHeader}>
                {totals.net >= 0 ? (
                  <TrendingUp size={16} color={colors.secondary} />
                ) : (
                  <TrendingDown size={16} color={colors.error} />
                )}
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                  Net
                </Text>
              </View>
              <Text style={[
                styles.summaryValue,
                { color: totals.net >= 0 ? colors.secondary : colors.error }
              ]}>
                {formatCurrency(Math.abs(totals.net))}
              </Text>
            </View>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
            {filteredTransactions.length} transactions found
          </Text>
          
          {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[styles.dateHeader, { color: colors.text }]}>
                {date}
              </Text>
              
              <View style={styles.transactionsList}>
                {dayTransactions.map((transaction) => (
                  <TouchableOpacity
                    key={transaction.id}
                    style={[styles.transactionItem, { backgroundColor: colors.surface }]}
                    onPress={() => router.push(`/modals/transaction-details?id=${transaction.id}`)}
                  >
                    <View style={styles.transactionIcon}>
                      <Text style={styles.transactionEmoji}>{transaction.icon}</Text>
                    </View>
                    
                    <View style={styles.transactionDetails}>
                      <Text style={[styles.transactionTitle, { color: colors.text }]}>
                        {transaction.title}
                      </Text>
                      <Text style={[styles.transactionMerchant, { color: colors.textSecondary }]}>
                        {transaction.merchant} • {transaction.category}
                      </Text>
                      <Text style={[styles.transactionTime, { color: colors.textMuted }]}>
                        {new Date(transaction.date).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                    
                    <View style={styles.transactionAmount}>
                      <Text style={[
                        styles.transactionAmountText,
                        { color: transaction.type === 'income' ? colors.secondary : colors.text }
                      ]}>
                        {transaction.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </Text>
                      <View style={[
                        styles.transactionStatus,
                        { 
                          backgroundColor: transaction.status === 'completed' ? colors.secondary : colors.accent,
                          opacity: 0.1
                        }
                      ]}>
                        <Text style={[
                          styles.transactionStatusText,
                          { color: transaction.status === 'completed' ? colors.secondary : colors.accent }
                        ]}>
                          {transaction.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {filteredTransactions.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No transactions found
              </Text>
              <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  summaryCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  transactionsList: {
    gap: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  transactionMerchant: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactionAmount: {
    alignItems: 'flex-end',
    gap: 4,
  },
  transactionAmountText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  transactionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  transactionStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});
