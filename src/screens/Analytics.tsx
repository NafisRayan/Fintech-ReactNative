import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { DemoDataService } from '../services/DemoDataService';

const { width } = Dimensions.get('window');

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [analyticsData, setAnalyticsData] = useState<any>({
    monthlyData: [
      { month: 'Jan', income: 2400, expenses: 1800 },
      { month: 'Feb', income: 2210, expenses: 1650 },
      { month: 'Mar', income: 2290, expenses: 1900 },
      { month: 'Apr', income: 2000, expenses: 1700 },
      { month: 'May', income: 2181, expenses: 1850 },
      { month: 'Jun', income: 2500, expenses: 1950 },
    ],
    categoryData: [
      { category: 'Food & Dining', amount: 423, color: '#6366f1' },
      { category: 'Transportation', amount: 187, color: '#8b5cf6' },
      { category: 'Entertainment', amount: 179, color: '#ec4899' },
      { category: 'Shopping', amount: 446, color: '#f59e0b' },
      { category: 'Bills & Utilities', amount: 789, color: '#10b981' },
      { category: 'Healthcare', amount: 89, color: '#ef4444' },
    ],
    weeklySpending: [120, 145, 89, 200, 156, 178, 134],
    totalIncome: 7200,
    totalExpenses: 5800,
    totalSavings: 1400,
  });

  useEffect(() => {
    const data = DemoDataService.generateDemoAnalyticsData();
    setAnalyticsData(data);
  }, []);

  const monthlyData = {
    labels: analyticsData.monthlyData?.map((m: any) => m.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: analyticsData.monthlyData?.map((m: any) => m.income) || [2400, 2210, 2290, 2000, 2181, 2500],
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: analyticsData.monthlyData?.map((m: any) => m.expenses) || [1800, 1650, 1900, 1700, 1850, 1950],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const categoryData = analyticsData.categoryData?.map((c: any) => ({
    name: c.category,
    population: Math.round(c.amount),
    color: c.color,
    legendFontColor: '#f3f4f6',
  })) || [
    {
      name: 'Food & Dining',
      population: 423,
      color: '#6366f1',
      legendFontColor: '#f3f4f6',
    },
    {
      name: 'Transportation',
      population: 187,
      color: '#8b5cf6',
      legendFontColor: '#f3f4f6',
    },
    {
      name: 'Entertainment',
      population: 179,
      color: '#ec4899',
      legendFontColor: '#f3f4f6',
    },
    {
      name: 'Shopping',
      population: 446,
      color: '#f59e0b',
      legendFontColor: '#f3f4f6',
    },
    {
      name: 'Bills & Utilities',
      population: 789,
      color: '#10b981',
      legendFontColor: '#f3f4f6',
    },
    {
      name: 'Healthcare',
      population: 89,
      color: '#ef4444',
      legendFontColor: '#f3f4f6',
    },
  ];

  const weeklySpending = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: analyticsData.weeklySpending || [120, 145, 89, 200, 156, 178, 134],
      },
    ],
  };

  const insights = [
    {
      title: 'Spending Trend',
      description: 'Your spending increased by 12% this month',
      icon: 'trending-up',
      color: '#ef4444',
      positive: false,
    },
    {
      title: 'Savings Goal',
      description: 'You\'re 75% towards your monthly savings goal',
      icon: 'wallet',
      color: '#10b981',
      positive: true,
    },
    {
      title: 'Top Category',
      description: 'Bills & Utilities is your highest expense category',
      icon: 'receipt',
      color: '#6366f1',
      positive: false,
    },
    {
      title: 'Budget Alert',
      description: '2 categories are close to exceeding budget',
      icon: 'warning',
      color: '#f59e0b',
      positive: false,
    },
  ];

  const financialGoals = DemoDataService.generateDemoFinancialGoals();

  const renderPeriodButton = (period: 'week' | 'month' | 'year') => (
    <TouchableOpacity
      style={[
        styles.periodButton,
        selectedPeriod === period && styles.periodButtonActive
      ]}
      onPress={() => setSelectedPeriod(period)}
    >
      <Text style={[
        styles.periodButtonText,
        selectedPeriod === period && styles.periodButtonTextActive
      ]}>
        {period.charAt(0).toUpperCase() + period.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  const renderInsightCard = (insight: typeof insights[0]) => (
    <View key={insight.title} style={[styles.insightCard, { borderLeftColor: insight.color }]}>
      <View style={styles.insightHeader}>
        <View style={[styles.insightIcon, { backgroundColor: insight.color + '20' }]}>
          <Ionicons name={insight.icon as any} size={20} color={insight.color} />
        </View>
        <View style={styles.insightBadge}>
          <Ionicons 
            name={insight.positive ? 'checkmark-circle' : 'alert-circle'} 
            size={16} 
            color={insight.positive ? '#10b981' : '#ef4444'} 
          />
        </View>
      </View>
      <Text style={styles.insightTitle}>{insight.title}</Text>
      <Text style={styles.insightDescription}>{insight.description}</Text>
    </View>
  );

  const renderGoalProgress = (goal: typeof financialGoals[0]) => {
    const percentage = (goal.current / goal.target) * 100;
    
    return (
      <View key={goal.title} style={styles.goalItem}>
        <View style={styles.goalHeader}>
          <View style={styles.goalInfo}>
            <View style={[styles.goalIcon, { backgroundColor: goal.color + '20' }]}>
              <Ionicons name={goal.icon as any} size={20} color={goal.color} />
            </View>
            <Text style={styles.goalTitle}>{goal.title}</Text>
          </View>
          <Text style={styles.goalPercentage}>{Math.round(percentage)}%</Text>
        </View>
        
        <View style={styles.goalProgress}>
          <View style={[styles.goalProgressBar, { width: `${Math.min(percentage, 100)}%`, backgroundColor: goal.color }]} />
        </View>
        
        <View style={styles.goalDetails}>
          <Text style={styles.goalCurrent}>${goal.current.toFixed(2)}</Text>
          <Text style={styles.goalTarget}>${goal.target.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <View style={styles.periodSelector}>
          {renderPeriodButton('week')}
          {renderPeriodButton('month')}
          {renderPeriodButton('year')}
        </View>
      </View>

      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, { backgroundColor: '#1f2937' }]}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={[styles.summaryValue, { color: '#10b981' }]}>${(analyticsData.totalIncome || 7200).toFixed(2)}</Text>
          <View style={styles.trend}>
            <Ionicons name="trending-up" size={12} color="#10b981" />
            <Text style={styles.trendText}>+8% from last month</Text>
          </View>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: '#1f2937' }]}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={[styles.summaryValue, { color: '#ef4444' }]}>${(analyticsData.totalExpenses || 5800).toFixed(2)}</Text>
          <View style={styles.trend}>
            <Ionicons name="trending-up" size={12} color="#ef4444" />
            <Text style={styles.trendText}>+12% from last month</Text>
          </View>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: '#1f2937' }]}>
          <Text style={styles.summaryLabel}>Net Savings</Text>
          <Text style={[styles.summaryValue, { color: '#6366f1' }]}>${(analyticsData.totalSavings || 1400).toFixed(2)}</Text>
          <View style={styles.trend}>
            <Ionicons name="trending-down" size={12} color="#f59e0b" />
            <Text style={styles.trendText}>-5% from last month</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Income vs Expenses</Text>
        <View style={styles.chartContainer}>
          <LineChart
            data={monthlyData}
            width={width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#1f2937',
              backgroundGradientFrom: '#1f2937',
              backgroundGradientTo: '#1f2937',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
              },
            }}
            bezier
            style={styles.chart}
            {...(Platform.OS === 'web' ? {} : {})}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Spending by Category</Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={categoryData}
            width={width - 32}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[10, 10]}
            absolute
            {...(Platform.OS === 'web' ? {} : {})}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Spending</Text>
        <View style={styles.chartContainer}>
          <BarChart
            data={weeklySpending}
            width={width - 32}
            height={200}
            yAxisLabel="$"
            yAxisSuffix=""
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
            }}
            style={styles.chart}
            {...(Platform.OS === 'web' ? {} : {})}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        <View style={styles.insightsGrid}>
          {insights.map(renderInsightCard)}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Goals</Text>
        {financialGoals.map(renderGoalProgress)}
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f3f4f6',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1f2937',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#6366f1',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  periodButtonTextActive: {
    color: '#f3f4f6',
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
  summaryLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 4,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 12,
  },
  chartContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
  },
  chart: {
    borderRadius: 16,
  },
  insightsGrid: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  goalItem: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f3f4f6',
  },
  goalPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
  },
  goalProgress: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  goalProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalCurrent: {
    fontSize: 14,
    color: '#f3f4f6',
  },
  goalTarget: {
    fontSize: 14,
    color: '#9ca3af',
  },
});

export default Analytics;