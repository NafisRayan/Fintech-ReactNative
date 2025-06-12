import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, TrendingDown, Plus, ChartPie as PieChart, DollarSign, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;

export default function InvestmentsScreen() {
  const { colors } = useTheme();

  const portfolioValue = 15420.75;
  const dailyChange = 234.56;
  const dailyChangePercent = 1.54;

  const investments = [
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      value: 4250.30,
      change: 45.20,
      changePercent: 1.08,
      shares: 25,
      color: colors.primary,
    },
    {
      id: '2',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      value: 3180.50,
      change: -12.40,
      changePercent: -0.39,
      shares: 12,
      color: colors.secondary,
    },
    {
      id: '3',
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      value: 2890.25,
      change: 78.90,
      changePercent: 2.81,
      shares: 15,
      color: colors.accent,
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
    },
  ];

  const recommendations = [
    {
      id: '1',
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      reason: 'Strong AI growth potential',
      recommendation: 'Buy',
      targetPrice: 520.00,
      currentPrice: 485.30,
    },
    {
      id: '2',
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      reason: 'Metaverse expansion',
      recommendation: 'Hold',
      targetPrice: 320.00,
      currentPrice: 298.45,
    },
  ];

  const quickActions = [
    { icon: Plus, label: 'Invest', color: colors.primary },
    { icon: PieChart, label: 'Portfolio', color: colors.secondary },
    { icon: Target, label: 'Goals', color: colors.accent },
    { icon: DollarSign, label: 'Withdraw', color: colors.primary },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Investments</Text>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.surface }]}>
          <Plus size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Portfolio Summary */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.portfolioCard}
        >
          <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
          <Text style={styles.portfolioValue}>
            ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Text>
          <View style={styles.portfolioChange}>
            <View style={styles.changeContainer}>
              {dailyChange >= 0 ? (
                <TrendingUp size={16} color="#FFFFFF" />
              ) : (
                <TrendingDown size={16} color="#FFFFFF" />
              )}
              <Text style={styles.changeText}>
                ${Math.abs(dailyChange).toFixed(2)} ({dailyChangePercent > 0 ? '+' : ''}{dailyChangePercent}%)
              </Text>
            </View>
            <Text style={styles.changeLabel}>Today</Text>
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

        {/* Your Holdings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Your Holdings
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllButton, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.holdings}>
            {investments.map((investment) => (
              <TouchableOpacity
                key={investment.id}
                style={[styles.holdingItem, { backgroundColor: colors.surface }]}
              >
                <View style={styles.holdingLeft}>
                  <View style={[styles.holdingIcon, { backgroundColor: investment.color }]}>
                    <Text style={styles.holdingSymbol}>
                      {investment.symbol.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.holdingInfo}>
                    <Text style={[styles.holdingName, { color: colors.text }]}>
                      {investment.symbol}
                    </Text>
                    <Text style={[styles.holdingCompany, { color: colors.textSecondary }]}>
                      {investment.shares} shares
                    </Text>
                  </View>
                </View>
                <View style={styles.holdingRight}>
                  <Text style={[styles.holdingValue, { color: colors.text }]}>
                    ${investment.value.toLocaleString()}
                  </Text>
                  <View style={styles.holdingChange}>
                    {investment.change >= 0 ? (
                      <TrendingUp size={12} color={colors.secondary} />
                    ) : (
                      <TrendingDown size={12} color={colors.error} />
                    )}
                    <Text style={[
                      styles.holdingChangeText,
                      { color: investment.change >= 0 ? colors.secondary : colors.error }
                    ]}>
                      {investment.change >= 0 ? '+' : ''}{investment.changePercent}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Recommendations */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            AI Recommendations
          </Text>
          <View style={styles.recommendations}>
            {recommendations.map((rec) => (
              <TouchableOpacity
                key={rec.id}
                style={[styles.recommendationItem, { backgroundColor: colors.surface }]}
              >
                <View style={styles.recommendationHeader}>
                  <View>
                    <Text style={[styles.recommendationSymbol, { color: colors.text }]}>
                      {rec.symbol}
                    </Text>
                    <Text style={[styles.recommendationName, { color: colors.textSecondary }]}>
                      {rec.name}
                    </Text>
                  </View>
                  <View style={[
                    styles.recommendationBadge,
                    { backgroundColor: rec.recommendation === 'Buy' ? colors.secondary : colors.accent }
                  ]}>
                    <Text style={styles.recommendationBadgeText}>
                      {rec.recommendation}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.recommendationReason, { color: colors.textSecondary }]}>
                  {rec.reason}
                </Text>
                <View style={styles.recommendationPrices}>
                  <Text style={[styles.recommendationPrice, { color: colors.text }]}>
                    Current: ${rec.currentPrice}
                  </Text>
                  <Text style={[styles.recommendationTarget, { color: colors.primary }]}>
                    Target: ${rec.targetPrice}
                  </Text>
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
  portfolioCard: {
    margin: 24,
    marginTop: 8,
    padding: 24,
    borderRadius: 20,
  },
  portfolioLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  portfolioValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  portfolioChange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  changeText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  changeLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.8,
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
  },
  holdings: {
    gap: 12,
  },
  holdingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    justifyContent: 'space-between',
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  holdingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  holdingSymbol: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  holdingInfo: {
    gap: 2,
  },
  holdingName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  holdingCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  holdingRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  holdingValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  holdingChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  holdingChangeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  recommendations: {
    gap: 16,
  },
  recommendationItem: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recommendationSymbol: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  recommendationName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  recommendationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  recommendationBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  recommendationReason: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  recommendationPrices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendationPrice: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  recommendationTarget: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});