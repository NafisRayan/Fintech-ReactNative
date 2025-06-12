import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Eye, EyeOff, Plus, Send, Smartphone, CreditCard, TrendingUp, ArrowUpRight, ArrowDownLeft, Target, ChartPie as PieChart, Zap, Gift, QrCode, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { 
    totalBalance, 
    getRecentTransactions, 
    formatCurrency, 
    calculateSpendingTrend,
    budgets,
    goals,
    portfolioValue,
    portfolioChangePercent
  } = useFinance();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const recentTransactions = getRecentTransactions(4);
  const spendingTrend = calculateSpendingTrend();

  const quickActions = [
    { 
      icon: Send, 
      label: 'Send', 
      color: colors.primary,
      onPress: () => router.push('/modals/send-money')
    },
    { 
      icon: QrCode, 
      label: 'QR Pay', 
      color: colors.secondary,
      onPress: () => router.push('/modals/qr-scanner')
    },
    { 
      icon: Users, 
      label: 'Split', 
      color: colors.accent,
      onPress: () => router.push('/modals/split-bill')
    },
    { 
      icon: Plus, 
      label: 'Request', 
      color: colors.primary,
      onPress: () => router.push('/modals/request-money')
    },
  ];

  const insights = [
    {
      title: 'Monthly Savings',
      value: formatCurrency(1250),
      change: '+12%',
      positive: true,
      icon: Target,
      color: colors.secondary
    },
    {
      title: 'Portfolio',
      value: formatCurrency(portfolioValue),
      change: `${portfolioChangePercent > 0 ? '+' : ''}${portfolioChangePercent.toFixed(1)}%`,
      positive: portfolioChangePercent > 0,
      icon: TrendingUp,
      color: colors.primary
    },
    {
      title: 'Spending',
      value: formatCurrency(2340),
      change: `${spendingTrend > 0 ? '+' : ''}${spendingTrend.toFixed(1)}%`,
      positive: spendingTrend < 0,
      icon: PieChart,
      color: colors.accent
    }
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: user?.avatar }}
              style={styles.avatar}
            />
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                {getGreeting()}
              </Text>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.name}
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.notificationButton, { backgroundColor: colors.surface }]}
            onPress={() => router.push('/modals/notifications')}
          >
            <Bell size={20} color={colors.text} />
            {unreadCount > 0 && (
              <View style={[styles.notificationBadge, { backgroundColor: colors.error }]}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)}>
              {balanceVisible ? (
                <EyeOff size={20} color="#FFFFFF" />
              ) : (
                <Eye size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {balanceVisible ? formatCurrency(totalBalance) : '••••••'}
          </Text>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceChange}>
              <TrendingUp size={16} color="#FFFFFF" />
              <Text style={styles.balanceChangeText}>+2.5% from last month</Text>
            </View>
            <TouchableOpacity style={styles.addMoneyButton}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addMoneyText}>Add Money</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.quickAction}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}10` }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Financial Insights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Financial Insights
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.insights}>
              {insights.map((insight, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.insightCard, { backgroundColor: colors.surface }]}
                >
                  <View style={[styles.insightIcon, { backgroundColor: `${insight.color}10` }]}>
                    <insight.icon size={20} color={insight.color} />
                  </View>
                  <Text style={[styles.insightTitle, { color: colors.textSecondary }]}>
                    {insight.title}
                  </Text>
                  <Text style={[styles.insightValue, { color: colors.text }]}>
                    {insight.value}
                  </Text>
                  <Text style={[
                    styles.insightChange,
                    { color: insight.positive ? colors.secondary : colors.error }
                  ]}>
                    {insight.change}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Budget Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Budget Overview
            </Text>
            <TouchableOpacity onPress={() => router.push('/modals/budget-details')}>
              <Text style={[styles.seeAllButton, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.budgetCards}>
            {budgets.slice(0, 2).map((budget) => (
              <TouchableOpacity
                key={budget.id}
                style={[styles.budgetCard, { backgroundColor: colors.surface }]}
              >
                <View style={styles.budgetHeader}>
                  <Text style={styles.budgetIcon}>{budget.icon}</Text>
                  <Text style={[styles.budgetCategory, { color: colors.text }]}>
                    {budget.category}
                  </Text>
                </View>
                <View style={styles.budgetProgress}>
                  <View style={[styles.budgetProgressBar, { backgroundColor: colors.border }]}>
                    <View 
                      style={[
                        styles.budgetProgressFill,
                        { 
                          backgroundColor: budget.color,
                          width: `${(budget.spent / budget.allocated) * 100}%`
                        }
                      ]}
                    />
                  </View>
                  <Text style={[styles.budgetText, { color: colors.textSecondary }]}>
                    {formatCurrency(budget.spent)} of {formatCurrency(budget.allocated)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={() => router.push('/modals/transaction-history')}>
              <Text style={[styles.seeAllButton, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.transactions}>
            {recentTransactions.map((transaction) => (
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
                  <Text style={[styles.transactionSubtitle, { color: colors.textSecondary }]}>
                    {transaction.subtitle}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[
                    styles.transactionAmountText,
                    { color: transaction.type === 'income' ? colors.secondary : colors.text }
                  ]}>
                    {transaction.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                  </Text>
                  {transaction.type === 'income' ? (
                    <ArrowDownLeft size={16} color={colors.secondary} />
                  ) : (
                    <ArrowUpRight size={16} color={colors.textMuted} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Goals Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Savings Goals
            </Text>
            <TouchableOpacity onPress={() => router.push('/modals/goals')}>
              <Text style={[styles.seeAllButton, { color: colors.primary }]}>
                Manage
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.goals}>
              {goals.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[styles.goalCard, { backgroundColor: colors.surface }]}
                >
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <Text style={[styles.goalTitle, { color: colors.text }]}>
                    {goal.title}
                  </Text>
                  <View style={styles.goalProgress}>
                    <View style={[styles.goalProgressBar, { backgroundColor: colors.border }]}>
                      <View 
                        style={[
                          styles.goalProgressFill,
                          { 
                            backgroundColor: goal.color,
                            width: `${(goal.current / goal.target) * 100}%`
                          }
                        ]}
                      />
                    </View>
                    <Text style={[styles.goalProgressText, { color: colors.textSecondary }]}>
                      {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                    </Text>
                  </View>
                  <Text style={[styles.goalPercentage, { color: goal.color }]}>
                    {Math.round((goal.current / goal.target) * 100)}% complete
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  balanceCard: {
    margin: 24,
    marginTop: 8,
    padding: 24,
    borderRadius: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceChangeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  addMoneyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  addMoneyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  seeAllButton: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  insights: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 24,
  },
  insightCard: {
    width: 140,
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  insightValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  insightChange: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  budgetCards: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetIcon: {
    fontSize: 16,
  },
  budgetCategory: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  budgetProgress: {
    gap: 8,
  },
  budgetProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  budgetText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  transactions: {
    gap: 12,
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
  transactionSubtitle: {
    fontSize: 14,
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
  goals: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 24,
  },
  goalCard: {
    width: 160,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  goalIcon: {
    fontSize: 24,
  },
  goalTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  goalProgress: {
    gap: 8,
  },
  goalProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  goalPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
});