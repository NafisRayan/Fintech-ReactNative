import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Tag, 
  FileText, 
  Download, 
  Share, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react-native';

export default function TransactionDetailsModal() {
  const { colors } = useTheme();
  const { transactions, formatCurrency } = useFinance();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Mock extended transaction data
  const getTransactionDetails = (transactionId: string) => {
    const baseTransaction = transactions.find(t => t.id === transactionId);
    
    if (!baseTransaction) {
      return {
        id: transactionId,
        title: 'Sample Transaction',
        subtitle: 'Today, 10:30 AM',
        amount: -25.50,
        type: 'expense' as const,
        category: 'Food & Drink',
        date: new Date().toISOString(),
        icon: '🍕',
        status: 'completed' as const,
        merchant: 'Pizza Palace',
        description: 'Lunch with colleagues',
        location: '123 Main St, Downtown',
        card: '**** 9012',
        confirmationNumber: 'TX123456789',
        reference: 'REF-2024-001',
        fee: 0,
        tags: ['food', 'work', 'lunch']
      };
    }

    return {
      ...baseTransaction,
      location: baseTransaction.location || '123 Main St, Downtown',
      card: '**** 9012',
      confirmationNumber: 'TX' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      reference: 'REF-2024-' + baseTransaction.id.padStart(3, '0'),
      fee: baseTransaction.type === 'expense' ? 0.50 : 0,
      tags: ['transaction', baseTransaction.category.toLowerCase().replace(' & ', '-')]
    };
  };

  const transaction = getTransactionDetails(id as string);

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'completed':
        return <CheckCircle size={20} color={colors.secondary} />;
      case 'pending':
        return <Clock size={20} color={colors.accent} />;
      case 'failed':
        return <AlertCircle size={20} color={colors.error} />;
      default:
        return <Clock size={20} color={colors.textMuted} />;
    }
  };

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'completed':
        return colors.secondary;
      case 'pending':
        return colors.accent;
      case 'failed':
        return colors.error;
      default:
        return colors.textMuted;
    }
  };

  const handleShare = () => {
    Alert.alert(
      'Share Transaction',
      'This feature will allow you to share transaction details.',
      [{ text: 'OK' }]
    );
  };

  const handleDownload = () => {
    Alert.alert(
      'Download Receipt',
      'Transaction receipt will be downloaded to your device.',
      [{ text: 'OK' }]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Transaction Details</Text>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Share size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Transaction Header */}
        <View style={styles.section}>
          <View style={[styles.transactionCard, { backgroundColor: colors.surface }]}>
            <View style={styles.transactionHeader}>
              <View style={styles.transactionIcon}>
                <Text style={styles.transactionEmoji}>{transaction.icon}</Text>
              </View>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionTitle, { color: colors.text }]}>
                  {transaction.title}
                </Text>
                <Text style={[styles.transactionMerchant, { color: colors.textSecondary }]}>
                  {transaction.merchant}
                </Text>
              </View>
            </View>

            <View style={styles.amountSection}>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'income' ? colors.secondary : colors.text }
              ]}>
                {transaction.type === 'income' ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
              </Text>
              <View style={styles.statusContainer}>
                {getStatusIcon()}
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transaction Details */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
          
          <View style={[styles.detailsCard, { backgroundColor: colors.surface }]}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Calendar size={16} color={colors.textMuted} />
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Date & Time
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {formatDate(transaction.date)}
              </Text>
            </View>

            {transaction.location && (
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <MapPin size={16} color={colors.textMuted} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Location
                  </Text>
                </View>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {transaction.location}
                </Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Tag size={16} color={colors.textMuted} />
                <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                  Category
                </Text>
              </View>
              <Text style={[styles.detailValue, { color: colors.text }]}>
                {transaction.category}
              </Text>
            </View>

            {transaction.card && (
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <CreditCard size={16} color={colors.textMuted} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Payment Method
                  </Text>
                </View>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  Card ending in {transaction.card}
                </Text>
              </View>
            )}

            {transaction.description && (
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <FileText size={16} color={colors.textMuted} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
                    Description
                  </Text>
                </View>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {transaction.description}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Transaction Breakdown */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Breakdown</Text>
          
          <View style={[styles.breakdownCard, { backgroundColor: colors.surface }]}>
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                Subtotal
              </Text>
              <Text style={[styles.breakdownValue, { color: colors.text }]}>
                {formatCurrency(Math.abs(transaction.amount))}
              </Text>
            </View>

            {transaction.fee && transaction.fee > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: colors.textSecondary }]}>
                  Service Fee
                </Text>
                <Text style={[styles.breakdownValue, { color: colors.text }]}>
                  {formatCurrency(transaction.fee)}
                </Text>
              </View>
            )}

            <View style={[styles.breakdownRow, styles.breakdownTotal]}>
              <Text style={[styles.breakdownLabel, styles.totalLabel, { color: colors.text }]}>
                Total
              </Text>
              <Text style={[styles.breakdownValue, styles.totalValue, { color: colors.text }]}>
                {formatCurrency(Math.abs(transaction.amount) + (transaction.fee || 0))}
              </Text>
            </View>
          </View>
        </View>

        {/* Reference Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Reference</Text>
          
          <View style={[styles.referenceCard, { backgroundColor: colors.surface }]}>
            <View style={styles.referenceRow}>
              <Text style={[styles.referenceLabel, { color: colors.textSecondary }]}>
                Transaction ID
              </Text>
              <Text style={[styles.referenceValue, { color: colors.text }]}>
                {transaction.id}
              </Text>
            </View>

            <View style={styles.referenceRow}>
              <Text style={[styles.referenceLabel, { color: colors.textSecondary }]}>
                Confirmation Number
              </Text>
              <Text style={[styles.referenceValue, { color: colors.text }]}>
                {transaction.confirmationNumber}
              </Text>
            </View>

            <View style={styles.referenceRow}>
              <Text style={[styles.referenceLabel, { color: colors.textSecondary }]}>
                Reference
              </Text>
              <Text style={[styles.referenceValue, { color: colors.text }]}>
                {transaction.reference}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
              onPress={handleDownload}
            >
              <Download size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                Download Receipt
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
              onPress={handleShare}
            >
              <Share size={20} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                Share Details
              </Text>
            </TouchableOpacity>
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
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  transactionCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  transactionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  transactionEmoji: {
    fontSize: 24,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  transactionMerchant: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  amountSection: {
    alignItems: 'center',
    gap: 8,
  },
  transactionAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  detailsCard: {
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
    flex: 1,
  },
  breakdownCard: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownTotal: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 4,
  },
  breakdownLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  breakdownValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  referenceCard: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  referenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referenceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  referenceValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    fontVariant: ['tabular-nums'],
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});
