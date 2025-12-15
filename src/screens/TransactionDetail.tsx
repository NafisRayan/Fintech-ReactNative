import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';

interface TransactionDetailProps {
  route: {
    params?: {
      transaction: Transaction;
    };
  };
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ route }) => {
  // For demo purposes, create a default transaction if none provided
  const transaction = route?.params?.transaction || {
    id: '1',
    amount: 45.99,
    description: 'Sample Transaction',
    category: 'Food & Dining',
    date: new Date(),
    type: 'expense' as const,
    icon: 'cart',
  };

  const handleEdit = () => {
    Alert.alert('Edit Transaction', 'Edit functionality would be implemented here');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Handle delete logic here
            console.log('Transaction deleted');
          }
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert('Share Transaction', 'Share functionality would be implemented here');
  };

  const getCategoryIcon = (category: string) => {
    const categoryIcons: Record<string, string> = {
      'Food & Dining': 'restaurant',
      'Transportation': 'car',
      'Entertainment': 'game-controller',
      'Shopping': 'cart',
      'Bills & Utilities': 'receipt',
      'Healthcare': 'medical',
      'Salary': 'wallet',
      'Freelance': 'laptop',
      'Investment': 'trending-up',
    };
    return categoryIcons[category] || 'help-circle';
  };

  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Food & Dining': '#6366f1',
      'Transportation': '#8b5cf6',
      'Entertainment': '#ec4899',
      'Shopping': '#f59e0b',
      'Bills & Utilities': '#10b981',
      'Healthcare': '#ef4444',
      'Salary': '#10b981',
      'Freelance': '#6366f1',
      'Investment': '#8b5cf6',
    };
    return categoryColors[category] || '#6b7280';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(transaction.category) + '20' }]}>
          <Ionicons 
            name={getCategoryIcon(transaction.category) as any} 
            size={32} 
            color={getCategoryColor(transaction.category)} 
          />
        </View>
        <Text style={styles.amount}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </Text>
        <Text style={styles.description}>{transaction.description}</Text>
        <View style={styles.typeBadge}>
          <Text style={[
            styles.typeText,
            { color: transaction.type === 'income' ? '#10b981' : '#ef4444' }
          ]}>
            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.cardTitle}>Transaction Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Category</Text>
          <View style={styles.categoryContainer}>
            <Ionicons 
              name={getCategoryIcon(transaction.category) as any} 
              size={16} 
              color={getCategoryColor(transaction.category)} 
            />
            <Text style={styles.categoryText}>{transaction.category}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>
            {transaction.date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>
            {transaction.date.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Transaction ID</Text>
          <Text style={styles.detailValue}>{transaction.id}</Text>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Actions</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
          <Ionicons name="create-outline" size={20} color="#6366f1" />
          <Text style={styles.actionText}>Edit Transaction</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color="#10b981" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#ef4444" />
          <Text style={styles.actionText}>Delete Transaction</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.notesCard}>
        <Text style={styles.cardTitle}>Notes</Text>
        <Text style={styles.notesText}>
          No additional notes for this transaction. You can add notes when editing the transaction.
        </Text>
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
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f3f4f6',
    marginBottom: 8,
  },
  description: {
    fontSize: 18,
    color: '#9ca3af',
    marginBottom: 12,
    textAlign: 'center',
  },
  typeBadge: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#1f2937',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  actionsCard: {
    backgroundColor: '#1f2937',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  notesCard: {
    backgroundColor: '#1f2937',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  detailLabel: {
    fontSize: 16,
    color: '#9ca3af',
  },
  detailValue: {
    fontSize: 16,
    color: '#f3f4f6',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#f3f4f6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  actionText: {
    fontSize: 16,
    color: '#f3f4f6',
  },
  notesText: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
});

export default TransactionDetail;