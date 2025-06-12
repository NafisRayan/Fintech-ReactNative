import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Eye, EyeOff, Lock, Settings, Wifi, MoreHorizontal, Pause, Play, Copy, Share, CreditCard as CardIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function CardsScreen() {
  const { colors } = useTheme();
  const [selectedCard, setSelectedCard] = useState(0);
  const [showCardNumber, setShowCardNumber] = useState(false);

  const cards = [
    {
      id: '1',
      type: 'Primary',
      number: '4532 1234 5678 9012',
      holder: 'JOHN DOE',
      expiry: '12/27',
      cvv: '123',
      balance: '$2,459.32',
      colors: [colors.primary, colors.primaryLight],
      isLocked: false,
    },
    {
      id: '2',
      type: 'Savings',
      number: '4532 9876 5432 1098',
      holder: 'JOHN DOE',
      expiry: '08/26',
      cvv: '456',
      balance: '$8,920.15',
      colors: [colors.secondary, '#14F195'],
      isLocked: false,
    },
    {
      id: '3',
      type: 'Business',
      number: '4532 5555 4444 3333',
      holder: 'JOHN DOE',
      expiry: '03/28',
      cvv: '789',
      balance: '$1,079.85',
      colors: [colors.accent, '#FBBF24'],
      isLocked: true,
    },
  ];

  const handleCardAction = (action: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (action) {
      case 'lock':
        Alert.alert('Lock Card', 'Are you sure you want to lock this card?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Lock', style: 'destructive', onPress: () => Alert.alert('Success', 'Card has been locked') }
        ]);
        break;
      case 'settings':
        Alert.alert('Card Settings', 'Card settings functionality coming soon!');
        break;
      case 'add':
        Alert.alert('Add Money', 'Add money to card functionality coming soon!');
        break;
      case 'more':
        Alert.alert('More Options', 'Additional card options coming soon!');
        break;
    }
  };

  const cardActions = [
    { icon: Lock, label: 'Lock Card', action: 'lock' },
    { icon: Settings, label: 'Settings', action: 'settings' },
    { icon: Plus, label: 'Add Money', action: 'add' },
    { icon: MoreHorizontal, label: 'More', action: 'more' },
  ];

  const transactions = [
    {
      id: '1',
      merchant: 'Apple Store',
      category: 'Shopping',
      amount: '-$299.00',
      date: 'Today, 3:45 PM',
      status: 'completed',
    },
    {
      id: '2',
      merchant: 'Uber',
      category: 'Transportation',
      amount: '-$12.50',
      date: 'Today, 1:20 PM',
      status: 'completed',
    },
    {
      id: '3',
      merchant: 'Starbucks',
      category: 'Food & Drink',
      amount: '-$5.75',
      date: 'Yesterday, 8:30 AM',
      status: 'pending',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Cards</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.surface }]}>
          <Plus size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
          onMomentumScrollEnd={(event) => {
            const cardIndex = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + 16));
            setSelectedCard(cardIndex);
          }}
        >
          {cards.map((card, index) => (
            <LinearGradient
              key={card.id}
              colors={card.colors}
              style={[styles.card, { width: CARD_WIDTH }]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardType}>{card.type}</Text>
                <View style={styles.cardIcons}>
                  <Wifi size={20} color="#FFFFFF" style={{ opacity: 0.8 }} />
                  {card.isLocked && <Lock size={16} color="#FFFFFF" />}
                </View>
              </View>
              
              <View style={styles.cardNumber}>
                <Text style={styles.cardNumberText}>
                  {showCardNumber ? card.number : '•••• •••• •••• ' + card.number.slice(-4)}
                </Text>
                <TouchableOpacity onPress={() => setShowCardNumber(!showCardNumber)}>
                  {showCardNumber ? (
                    <EyeOff size={20} color="#FFFFFF" />
                  ) : (
                    <Eye size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>Card Holder</Text>
                  <Text style={styles.cardHolder}>{card.holder}</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>Expires</Text>
                  <Text style={styles.cardExpiry}>{card.expiry}</Text>
                </View>
                <View>
                  <Text style={styles.cardLabel}>Balance</Text>
                  <Text style={styles.cardBalance}>{card.balance}</Text>
                </View>
              </View>
            </LinearGradient>
          ))}
        </ScrollView>

        {/* Card Indicators */}
        <View style={styles.indicators}>
          {cards.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: index === selectedCard ? colors.primary : colors.border,
                  width: index === selectedCard ? 24 : 8,
                }
              ]}
            />
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actions}>
            {cardActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionItem, { backgroundColor: colors.surface }]}
                onPress={() => handleCardAction(action.action)}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${colors.primary}10` }]}>
                  <action.icon size={20} color={colors.primary} />
                </View>
                <Text style={[styles.actionLabel, { color: colors.text }]}>
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
            {transactions.map((transaction) => (
              <View
                key={transaction.id}
                style={[styles.transactionItem, { backgroundColor: colors.surface }]}
              >
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionMerchant, { color: colors.text }]}>
                    {transaction.merchant}
                  </Text>
                  <Text style={[styles.transactionCategory, { color: colors.textSecondary }]}>
                    {transaction.category} • {transaction.date}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[styles.transactionAmountText, { color: colors.text }]}>
                    {transaction.amount}
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
              </View>
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  card: {
    height: 200,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  cardIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardNumber: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  cardNumberText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.7,
    marginBottom: 4,
  },
  cardHolder: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cardExpiry: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cardBalance: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
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
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  transactions: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'space-between',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionMerchant: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  transactionCategory: {
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
});
