import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Edit, Trash2, DollarSign, Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react-native';

export default function BudgetDetailsModal() {
  const { colors } = useTheme();
  const { budgets, formatCurrency, updateBudget } = useFinance();
  const router = useRouter();
  
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('🛍️');

  const budgetIcons = ['🛍️', '🍽️', '🚗', '🏠', '💡', '🎬', '💪', '✈️', '📱', '🎓'];

  const handleAddBudget = () => {
    if (!newBudgetCategory.trim() || !newBudgetAmount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Budget Created!',
      `Your ${newBudgetCategory} budget has been created successfully.`,
      [{ text: 'OK', onPress: () => {
        setShowAddBudget(false);
        setNewBudgetCategory('');
        setNewBudgetAmount('');
        setSelectedIcon('🛍️');
      }}]
    );
  };

  const handleAddSpending = (budgetId: string, budgetCategory: string) => {
    Alert.prompt(
      'Add Spending',
      `How much did you spend on ${budgetCategory}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add',
          onPress: (amount) => {
            if (amount && parseFloat(amount) > 0) {
              const budget = budgets.find(b => b.id === budgetId);
              if (budget) {
                const newSpent = budget.spent + parseFloat(amount);
                updateBudget(budgetId, newSpent);
                Alert.alert('Spending Added', `Added ${formatCurrency(parseFloat(amount))} to ${budgetCategory} budget.`);
              }
            }
          }
        }
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const getBudgetStatus = (budget: any) => {
    const percentage = (budget.spent / budget.allocated) * 100;
    if (percentage >= 100) return { status: 'exceeded', color: colors.error, icon: AlertTriangle };
    if (percentage >= 75) return { status: 'warning', color: colors.accent, icon: AlertTriangle };
    return { status: 'good', color: colors.secondary, icon: CheckCircle };
  };

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Budget Details</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddBudget(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Budget Overview */}
        <View style={styles.section}>
          <View style={[styles.overviewCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.overviewTitle, { color: colors.text }]}>
              Monthly Budget Overview
            </Text>
            
            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                  Total Budget
                </Text>
                <Text style={[styles.overviewValue, { color: colors.text }]}>
                  {formatCurrency(totalAllocated)}
                </Text>
              </View>
              
              <View style={styles.overviewStat}>
                <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                  Total Spent
                </Text>
                <Text style={[styles.overviewValue, { color: colors.error }]}>
                  {formatCurrency(totalSpent)}
                </Text>
              </View>
              
              <View style={styles.overviewStat}>
                <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                  Remaining
                </Text>
                <Text style={[
                  styles.overviewValue,
                  { color: totalRemaining >= 0 ? colors.secondary : colors.error }
                ]}>
                  {formatCurrency(totalRemaining)}
                </Text>
              </View>
            </View>

            <View style={styles.overallProgress}>
              <View style={styles.overallProgressInfo}>
                <Text style={[styles.overallProgressLabel, { color: colors.textSecondary }]}>
                  Overall Progress
                </Text>
                <Text style={[styles.overallProgressPercentage, { color: colors.text }]}>
                  {Math.round((totalSpent / totalAllocated) * 100)}%
                </Text>
              </View>
              <View style={[styles.overallProgressBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.overallProgressFill,
                    { 
                      backgroundColor: totalSpent > totalAllocated ? colors.error : colors.primary,
                      width: `${Math.min((totalSpent / totalAllocated) * 100, 100)}%`
                    }
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Budget Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Budget Categories</Text>
          
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.allocated) * 100;
            const status = getBudgetStatus(budget);
            
            return (
              <View key={budget.id} style={[styles.budgetCard, { backgroundColor: colors.surface }]}>
                <View style={styles.budgetHeader}>
                  <View style={styles.budgetInfo}>
                    <Text style={styles.budgetIcon}>{budget.icon}</Text>
                    <View style={styles.budgetDetails}>
                      <Text style={[styles.budgetCategory, { color: colors.text }]}>
                        {budget.category}
                      </Text>
                      <View style={styles.budgetStatusContainer}>
                        <status.icon size={12} color={status.color} />
                        <Text style={[styles.budgetStatus, { color: status.color }]}>
                          {status.status === 'exceeded' ? 'Over Budget' : 
                           status.status === 'warning' ? 'Near Limit' : 'On Track'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.budgetActions}>
                    <Edit size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.budgetAmounts}>
                  <Text style={[styles.budgetSpent, { color: colors.text }]}>
                    {formatCurrency(budget.spent)}
                  </Text>
                  <Text style={[styles.budgetAllocated, { color: colors.textSecondary }]}>
                    of {formatCurrency(budget.allocated)}
                  </Text>
                  <Text style={[styles.budgetRemaining, { color: budget.remaining >= 0 ? colors.secondary : colors.error }]}>
                    {budget.remaining >= 0 ? formatCurrency(budget.remaining) : `-${formatCurrency(Math.abs(budget.remaining))}`} left
                  </Text>
                </View>

                <View style={styles.budgetProgress}>
                  <View style={[styles.budgetProgressBar, { backgroundColor: colors.border }]}>
                    <View 
                      style={[
                        styles.budgetProgressFill,
                        { 
                          backgroundColor: budget.color,
                          width: `${Math.min(percentage, 100)}%`
                        }
                      ]}
                    />
                  </View>
                  <Text style={[styles.budgetPercentage, { color: colors.textMuted }]}>
                    {Math.round(percentage)}% used
                  </Text>
                </View>

                <View style={styles.budgetButtons}>
                  <TouchableOpacity
                    style={[styles.budgetButton, { backgroundColor: `${colors.primary}10` }]}
                    onPress={() => handleAddSpending(budget.id, budget.category)}
                  >
                    <DollarSign size={16} color={colors.primary} />
                    <Text style={[styles.budgetButtonText, { color: colors.primary }]}>
                      Add Spending
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.budgetButton, { backgroundColor: `${colors.secondary}10` }]}
                  >
                    <TrendingUp size={16} color={colors.secondary} />
                    <Text style={[styles.budgetButtonText, { color: colors.secondary }]}>
                      View History
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Add Budget Form */}
        {showAddBudget && (
          <View style={styles.section}>
            <View style={[styles.addBudgetCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.addBudgetTitle, { color: colors.text }]}>
                Create New Budget
              </Text>
              
              <View style={styles.addBudgetForm}>
                <View style={styles.iconSelector}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                    Choose Icon
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.iconOptions}>
                      {budgetIcons.map((icon) => (
                        <TouchableOpacity
                          key={icon}
                          style={[
                            styles.iconOption,
                            {
                              backgroundColor: selectedIcon === icon ? colors.primary : colors.border,
                            }
                          ]}
                          onPress={() => setSelectedIcon(icon)}
                        >
                          <Text style={styles.iconOptionText}>{icon}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                    Category Name
                  </Text>
                  <TextInput
                    style={[
                      styles.formInput,
                      { 
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border
                      }
                    ]}
                    placeholder="e.g., Travel, Entertainment"
                    placeholderTextColor={colors.textMuted}
                    value={newBudgetCategory}
                    onChangeText={setNewBudgetCategory}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                    Monthly Budget Amount
                  </Text>
                  <View style={[
                    styles.formInputContainer,
                    { backgroundColor: colors.background, borderColor: colors.border }
                  ]}>
                    <DollarSign size={16} color={colors.textMuted} />
                    <TextInput
                      style={[styles.formInputAmount, { color: colors.text }]}
                      placeholder="500"
                      placeholderTextColor={colors.textMuted}
                      value={newBudgetAmount}
                      onChangeText={setNewBudgetAmount}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.formButton, { backgroundColor: colors.border }]}
                    onPress={() => setShowAddBudget(false)}
                  >
                    <Text style={[styles.formButtonText, { color: colors.text }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.formButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddBudget}
                  >
                    <Text style={[styles.formButtonText, { color: '#FFFFFF' }]}>
                      Create Budget
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Tips */}
        <View style={styles.section}>
          <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.tipsTitle, { color: colors.text }]}>
              💡 Budget Tips
            </Text>
            <View style={styles.tips}>
              <Text style={[styles.tip, { color: colors.textSecondary }]}>
                • Track your spending regularly to stay on budget
              </Text>
              <Text style={[styles.tip, { color: colors.textSecondary }]}>
                • Set realistic budgets based on your actual spending patterns
              </Text>
              <Text style={[styles.tip, { color: colors.textSecondary }]}>
                • Review and adjust your budgets monthly
              </Text>
              <Text style={[styles.tip, { color: colors.textSecondary }]}>
                • Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings
              </Text>
            </View>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginBottom: 16,
  },
  overviewCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  overviewStat: {
    alignItems: 'center',
    gap: 4,
  },
  overviewLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  overviewValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  overallProgress: {
    gap: 8,
  },
  overallProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallProgressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  overallProgressPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  overallProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    gap: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  budgetIcon: {
    fontSize: 24,
  },
  budgetDetails: {
    flex: 1,
  },
  budgetCategory: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  budgetStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  budgetStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  budgetActions: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  budgetSpent: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  budgetAllocated: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  budgetRemaining: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  budgetProgress: {
    gap: 8,
  },
  budgetProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  budgetProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
  },
  budgetButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  budgetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  budgetButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  addBudgetCard: {
    padding: 20,
    borderRadius: 16,
  },
  addBudgetTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  addBudgetForm: {
    gap: 16,
  },
  iconSelector: {
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  iconOptions: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOptionText: {
    fontSize: 18,
  },
  formField: {
    gap: 8,
  },
  formInput: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  formInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  formInputAmount: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  formButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  formButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  tipsCard: {
    padding: 16,
    borderRadius: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  tips: {
    gap: 8,
  },
  tip: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});
