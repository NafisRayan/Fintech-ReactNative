import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bell, 
  Eye, 
  EyeOff, 
  Plus, 
  Send, 
  Smartphone, 
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react-native';
import { useState } from 'react';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);

  const quickActions = [
    { icon: Send, label: 'Send', color: colors.primary },
    { icon: Plus, label: 'Request', color: colors.secondary },
    { icon: Smartphone, label: 'Pay', color: colors.accent },
    { icon: CreditCard, label: 'Cards', color: colors.primary },
  ];

  const recentTransactions = [
    {
      id: '1',
      title: 'Coffee Shop',
      subtitle: 'Today, 9:30 AM',
      amount: '-$4.50',
      type: 'expense',
      icon: '☕',
    },
    {
      id: '2',
      title: 'Salary Deposit',
      subtitle: 'Yesterday, 2:00 PM',
      amount: '+$3,200.00',
      type: 'income',
      icon: '💰',
    },
    {
      id: '3',
      title: 'Netflix',
      subtitle: 'Dec 15, 6:45 PM',
      amount: '-$15.99',
      type: 'expense',
      icon: '🎬',
    },
    {
      id: '4',
      title: 'Transfer from John',
      subtitle: 'Dec 14, 11:20 AM',
      amount: '+$125.00',
      type: 'income',
      icon: '👤',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: user?.avatar }}
              style={styles.avatar}
            />
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>
                Good morning
              </Text>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user?.name}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: colors.surface }]}>
            <Bell size={20} color={colors.text} />
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
            {balanceVisible ? '$12,459.32' : '••••••'}
          </Text>
          <View style={styles.balanceFooter}>
            <View style={styles.balanceChange}>
              <TrendingUp size={16} color="#FFFFFF" />
              <Text style={styles.balanceChangeText}>+2.5% from last month</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickAction}>
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

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity>
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
                    {transaction.amount}
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
});