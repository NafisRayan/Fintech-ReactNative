import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Eye, EyeOff, Lock, Clock as Unlock, Settings, Wifi, MoveHorizontal as MoreHorizontal, Trees as Freeze, CreditCard as CreditCardIcon, Smartphone, Shield, DollarSign, TrendingUp, Calendar } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function CardsScreen() {
  const { colors } = useTheme();
  const { cards, toggleCardLock, formatCurrency } = useFinance();
  const router = useRouter();
  
  const [selectedCard, setSelectedCard] = useState(0);
  const [showCardNumber, setShowCardNumber] = useState(false);

  const cardActions = [
    { 
      icon: Lock, 
      label: 'Lock Card', 
      action: 'lock',
      onPress: () => handleCardAction('lock')
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      action: 'settings',
      onPress: () => router.push('/modals/card-settings')
    },
    { 
      icon: Plus, 
      label: 'Add Money', 
      action: 'add',
      onPress: () => router.push('/modals/add-money')
    },
    { 
      icon: MoreHorizontal, 
      label: 'More', 
      action: 'more',
      onPress: () => router.push('/modals/card-menu')
    },
  ];

  const cardFeatures = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Advanced encryption & fraud protection'
    },
    {
      icon: Smartphone,
      title: 'Contactless Pay',
      description: 'Tap to pay with your phone or card'
    },
    {
      icon: TrendingUp,
      title: 'Cashback Rewards',
      description: 'Earn up to 3% on all purchases'
    },
    {
      icon: Calendar,
      title: 'Spending Insights',
      description: 'Track and categorize your expenses'
    }
  ];

  const transactions = [
    {
      id: '1',
      merchant: 'Apple Store',
      category: 'Shopping',
      amount: -299.00,
      date: 'Today, 3:45 PM',
      status: 'completed',
      icon: '🛍️',
      location: 'Fifth Avenue, NYC'
    },
    {
      id: '2',
      merchant: 'Uber',
      category: 'Transportation',
      amount: -12.50,
      date: 'Today, 1:20 PM',
      status: 'completed',
      icon: '🚗',
      location: 'Manhattan'
    },
    {
      id: '3',
      merchant: 'Starbucks',
      category: 'Food & Drink',
      amount: -5.75,
      date: 'Yesterday, 8:30 AM',
      status: 'pending',
      icon: '☕',
      location: 'Times Square'
    },
    {
      id: '4',
      merchant: 'Amazon',
      category: 'Shopping',
      amount: -67.99,
      date: 'Dec 13, 2:15 PM',
      status: 'completed',
      icon: '📦',
      location: 'Online'
    }
  ];

  const handleCardAction = (action: string) => {
    const currentCard = cards[selectedCard];
    
    switch (action) {
      case 'lock':
        toggleCardLock(currentCard.id);
        Alert.alert(
          currentCard.isLocked ? 'Card Unlocked' : 'Card Locked',
          currentCard.isLocked 
            ? 'Your card has been unlocked and can be used for transactions.'
            : 'Your card has been locked and cannot be used for transactions.'
        );
        break;
      default:
        break;
    }
  };

  const getCardUtilization = (card: any) => {
    return (card.spent / card.limit) * 100;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Cards</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/modals/add-card')}
        >
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
            <TouchableOpacity
              key={card.id}
              onPress={() => router.push(`/modals/card-details?id=${card.id}`)}
            >
              <LinearGradient
                colors={card.colors}
                style={[styles.card, { width: CARD_WIDTH }]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTypeContainer}>
                    <Text style={styles.cardType}>{card.type}</Text>
                    {card.isVirtual && (
                      <View style={styles.virtualBadge}>
                        <Text style={styles.virtualBadgeText}>Virtual</Text>
                      </View>
                    )}
                  </View>
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

                {/* Card Utilization */}
                <View style={styles.cardUtilization}>
                  <View style={styles.utilizationBar}>
                    <View 
                      style={[
                        styles.utilizationFill,
                        { width: `${getCardUtilization(card)}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.utilizationText}>
                    {formatCurrency(card.spent)} / {formatCurrency(card.limit)}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
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

        {/* Card Status */}
        <View style={styles.section}>
          <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statusHeader}>
              <View style={styles.statusInfo}>
                <Text style={[styles.statusTitle, { color: colors.text }]}>
                  {cards[selectedCard]?.type} Card
                </Text>
                <Text style={[
                  styles.statusText,
                  { color: cards[selectedCard]?.isLocked ? colors.error : colors.secondary }
                ]}>
                  {cards[selectedCard]?.isLocked ? 'Locked' : 'Active'}
                </Text>
              </View>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: cards[selectedCard]?.isLocked ? colors.error : colors.secondary }
              ]} />
            </View>
            <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
              {cards[selectedCard]?.isLocked 
                ? 'This card is currently locked and cannot be used for transactions.'
                : 'This card is active and ready for use.'
              }
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actions}>
            {cardActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionItem, { backgroundColor: colors.surface }]}
                onPress={action.onPress}
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

        {/* Card Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Card Features</Text>
          <View style={styles.features}>
            {cardFeatures.map((feature, index) => (
              <View
                key={index}
                style={[styles.featureItem, { backgroundColor: colors.surface }]}
              >
                <View style={[styles.featureIcon, { backgroundColor: `${colors.primary}10` }]}>
                  <feature.icon size={20} color={colors.primary} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                    {feature.description}
                  </Text>
                </View>
              </View>
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
            {transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={[styles.transactionItem, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/modals/transaction-details?id=${transaction.id}`)}
              >
                <View style={styles.transactionIcon}>
                  <Text style={styles.transactionEmoji}>{transaction.icon}</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={[styles.transactionMerchant, { color: colors.text }]}>
                    {transaction.merchant}
                  </Text>
                  <Text style={[styles.transactionCategory, { color: colors.textSecondary }]}>
                    {transaction.category} • {transaction.location}
                  </Text>
                  <Text style={[styles.transactionDate, { color: colors.textMuted }]}>
                    {transaction.date}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[styles.transactionAmountText, { color: colors.text }]}>
                    {formatCurrency(Math.abs(transaction.amount))}
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
    height: 220,
    borderRadius: 20,
    padding: 24,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardType: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  virtualBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  virtualBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
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
  cardUtilization: {
    marginTop: 12,
    gap: 4,
  },
  utilizationBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  utilizationFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  utilizationText: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
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
    marginBottom: 16,
  },
  seeAllButton: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  statusCard: {
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
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
  features: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
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
  transactionMerchant: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 2,
  },
  transactionDate: {
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
});