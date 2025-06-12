import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Send, 
  QrCode, 
  Users, 
  Receipt, 
  Smartphone,
  Apple,
  CreditCard,
  Search,
  History
} from 'lucide-react-native';

export default function PaymentsScreen() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const paymentMethods = [
    {
      id: '1',
      name: 'Apple Pay',
      icon: Apple,
      description: 'Quick and secure payments',
      color: colors.text,
    },
    {
      id: '2',
      name: 'Google Pay',
      icon: Smartphone,
      description: 'Pay with your phone',
      color: colors.primary,
    },
    {
      id: '3',
      name: 'PayPal',
      icon: CreditCard,
      description: 'Online payments made easy',
      color: '#0070BA',
    },
  ];

  const quickActions = [
    { icon: Send, label: 'Send Money', color: colors.primary },
    { icon: QrCode, label: 'QR Pay', color: colors.secondary },
    { icon: Users, label: 'Split Bill', color: colors.accent },
    { icon: Receipt, label: 'Pay Bills', color: colors.primary },
  ];

  const recentContacts = [
    {
      id: '1',
      name: 'Sarah Wilson',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      lastAmount: '$25.00',
    },
    {
      id: '2',
      name: 'Mike Johnson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      lastAmount: '$150.00',
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      lastAmount: '$85.50',
    },
  ];

  const recentPayments = [
    {
      id: '1',
      recipient: 'Netflix',
      type: 'Subscription',
      amount: '$15.99',
      date: 'Today',
      status: 'completed',
    },
    {
      id: '2',
      recipient: 'Electric Company',
      type: 'Utility Bill',
      amount: '$127.45',
      date: 'Yesterday',
      status: 'completed',
    },
    {
      id: '3',
      recipient: 'Internet Provider',
      type: 'Monthly Bill',
      amount: '$79.99',
      date: 'Dec 15',
      status: 'pending',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Payments</Text>
        <TouchableOpacity style={[styles.historyButton, { backgroundColor: colors.surface }]}>
          <History size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <Search size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search contacts or merchants"
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

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

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Payment Methods
          </Text>
          <View style={styles.paymentMethods}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentMethod, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.paymentMethodIcon, { backgroundColor: `${method.color}10` }]}>
                  <method.icon size={24} color={method.color} />
                </View>
                <View style={styles.paymentMethodInfo}>
                  <Text style={[styles.paymentMethodName, { color: colors.text }]}>
                    {method.name}
                  </Text>
                  <Text style={[styles.paymentMethodDescription, { color: colors.textSecondary }]}>
                    {method.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Contacts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Contacts
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.contacts}>
              {recentContacts.map((contact) => (
                <TouchableOpacity key={contact.id} style={styles.contact}>
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactAvatarText}>
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <Text style={[styles.contactName, { color: colors.text }]}>
                    {contact.name.split(' ')[0]}
                  </Text>
                  <Text style={[styles.contactAmount, { color: colors.textSecondary }]}>
                    {contact.lastAmount}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Recent Payments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Payments
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllButton, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.payments}>
            {recentPayments.map((payment) => (
              <TouchableOpacity
                key={payment.id}
                style={[styles.paymentItem, { backgroundColor: colors.surface }]}
              >
                <View style={styles.paymentIcon}>
                  <Receipt size={20} color={colors.primary} />
                </View>
                <View style={styles.paymentDetails}>
                  <Text style={[styles.paymentRecipient, { color: colors.text }]}>
                    {payment.recipient}
                  </Text>
                  <Text style={[styles.paymentType, { color: colors.textSecondary }]}>
                    {payment.type} • {payment.date}
                  </Text>
                </View>
                <View style={styles.paymentAmount}>
                  <Text style={[styles.paymentAmountText, { color: colors.text }]}>
                    -{payment.amount}
                  </Text>
                  <View style={[
                    styles.paymentStatus,
                    { 
                      backgroundColor: payment.status === 'completed' ? colors.secondary : colors.accent,
                      opacity: 0.1
                    }
                  ]}>
                    <Text style={[
                      styles.paymentStatusText,
                      { color: payment.status === 'completed' ? colors.secondary : colors.accent }
                    ]}>
                      {payment.status}
                    </Text>
                  </View>
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
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  historyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
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
    marginBottom: 16,
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
    textAlign: 'center',
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  paymentMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  contacts: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 24,
  },
  contact: {
    alignItems: 'center',
    gap: 8,
    width: 80,
  },
  contactAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactAvatarText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
  },
  contactName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  contactAmount: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  payments: {
    gap: 12,
  },
  paymentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentDetails: {
    flex: 1,
  },
  paymentRecipient: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  paymentType: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  paymentAmount: {
    alignItems: 'flex-end',
    gap: 4,
  },
  paymentAmountText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  paymentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
  },
});