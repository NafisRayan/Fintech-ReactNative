import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Target, Calendar, DollarSign, TrendingUp, Edit, Trash2 } from 'lucide-react-native';

export default function GoalsModal() {
  const { colors } = useTheme();
  const { goals, formatCurrency, updateGoalProgress } = useFinance();
  const router = useRouter();
  
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [selectedGoalIcon, setSelectedGoalIcon] = useState('🎯');

  const goalIcons = ['🎯', '🏠', '✈️', '🚗', '💍', '🎓', '💼', '🏖️', '📱', '💎'];

  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalAmount || !newGoalDeadline) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Goal Created!',
      `Your goal "${newGoalTitle}" has been created successfully.`,
      [{ text: 'OK', onPress: () => {
        setShowAddGoal(false);
        setNewGoalTitle('');
        setNewGoalAmount('');
        setNewGoalDeadline('');
        setSelectedGoalIcon('🎯');
      }}]
    );
  };

  const handleAddMoney = (goalId: string, goalTitle: string) => {
    Alert.prompt(
      'Add Money',
      `How much would you like to add to "${goalTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add',
          onPress: (amount) => {
            if (amount && parseFloat(amount) > 0) {
              updateGoalProgress(goalId, parseFloat(amount));
              Alert.alert('Success', `Added ${formatCurrency(parseFloat(amount))} to your goal!`);
            }
          }
        }
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const calculateDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return colors.secondary;
    if (progress >= 75) return colors.primary;
    if (progress >= 50) return colors.accent;
    return colors.error;
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
        <Text style={[styles.title, { color: colors.text }]}>Savings Goals</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddGoal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Overview */}
        <View style={styles.section}>
          <View style={[styles.overviewCard, { backgroundColor: colors.surface }]}>
            <View style={styles.overviewStat}>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                Total Goals
              </Text>
              <Text style={[styles.overviewValue, { color: colors.text }]}>
                {goals.length}
              </Text>
            </View>
            
            <View style={styles.overviewStat}>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                Total Saved
              </Text>
              <Text style={[styles.overviewValue, { color: colors.secondary }]}>
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.current, 0))}
              </Text>
            </View>
            
            <View style={styles.overviewStat}>
              <Text style={[styles.overviewLabel, { color: colors.textSecondary }]}>
                Target Amount
              </Text>
              <Text style={[styles.overviewValue, { color: colors.text }]}>
                {formatCurrency(goals.reduce((sum, goal) => sum + goal.target, 0))}
              </Text>
            </View>
          </View>
        </View>

        {/* Goals List */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Goals</Text>
          
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const daysRemaining = calculateDaysRemaining(goal.deadline);
            const progressColor = getProgressColor(progress);
            
            return (
              <View key={goal.id} style={[styles.goalCard, { backgroundColor: colors.surface }]}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalIcon}>{goal.icon}</Text>
                    <View style={styles.goalDetails}>
                      <Text style={[styles.goalTitle, { color: colors.text }]}>
                        {goal.title}
                      </Text>
                      <Text style={[styles.goalDescription, { color: colors.textSecondary }]}>
                        {goal.description}
                      </Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity style={styles.goalActions}>
                    <Edit size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.goalProgress}>
                  <View style={styles.goalAmounts}>
                    <Text style={[styles.goalCurrent, { color: colors.text }]}>
                      {formatCurrency(goal.current)}
                    </Text>
                    <Text style={[styles.goalTarget, { color: colors.textSecondary }]}>
                      of {formatCurrency(goal.target)}
                    </Text>
                  </View>
                  
                  <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          backgroundColor: progressColor,
                          width: `${Math.min(progress, 100)}%`
                        }
                      ]}
                    />
                  </View>
                  
                  <View style={styles.goalMeta}>
                    <Text style={[styles.goalPercentage, { color: progressColor }]}>
                      {Math.round(progress)}% complete
                    </Text>
                    <View style={styles.goalDeadline}>
                      <Calendar size={12} color={colors.textMuted} />
                      <Text style={[styles.goalDays, { color: colors.textMuted }]}>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.goalButtons}>
                  <TouchableOpacity
                    style={[styles.goalButton, { backgroundColor: `${colors.primary}10` }]}
                    onPress={() => handleAddMoney(goal.id, goal.title)}
                  >
                    <DollarSign size={16} color={colors.primary} />
                    <Text style={[styles.goalButtonText, { color: colors.primary }]}>
                      Add Money
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.goalButton, { backgroundColor: `${colors.secondary}10` }]}
                  >
                    <TrendingUp size={16} color={colors.secondary} />
                    <Text style={[styles.goalButtonText, { color: colors.secondary }]}>
                      Auto Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Add Goal Form */}
        {showAddGoal && (
          <View style={styles.section}>
            <View style={[styles.addGoalCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.addGoalTitle, { color: colors.text }]}>
                Create New Goal
              </Text>
              
              <View style={styles.addGoalForm}>
                <View style={styles.iconSelector}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                    Choose Icon
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.iconOptions}>
                      {goalIcons.map((icon) => (
                        <TouchableOpacity
                          key={icon}
                          style={[
                            styles.iconOption,
                            {
                              backgroundColor: selectedGoalIcon === icon ? colors.primary : colors.border,
                            }
                          ]}
                          onPress={() => setSelectedGoalIcon(icon)}
                        >
                          <Text style={styles.iconOptionText}>{icon}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                    Goal Title
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
                    placeholder="e.g., Emergency Fund"
                    placeholderTextColor={colors.textMuted}
                    value={newGoalTitle}
                    onChangeText={setNewGoalTitle}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                    Target Amount
                  </Text>
                  <View style={[
                    styles.formInputContainer,
                    { backgroundColor: colors.background, borderColor: colors.border }
                  ]}>
                    <DollarSign size={16} color={colors.textMuted} />
                    <TextInput
                      style={[styles.formInputAmount, { color: colors.text }]}
                      placeholder="10000"
                      placeholderTextColor={colors.textMuted}
                      value={newGoalAmount}
                      onChangeText={setNewGoalAmount}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={styles.formField}>
                  <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                    Target Date
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
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textMuted}
                    value={newGoalDeadline}
                    onChangeText={setNewGoalDeadline}
                  />
                </View>

                <View style={styles.formButtons}>
                  <TouchableOpacity
                    style={[styles.formButton, { backgroundColor: colors.border }]}
                    onPress={() => setShowAddGoal(false)}
                  >
                    <Text style={[styles.formButtonText, { color: colors.text }]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.formButton, { backgroundColor: colors.primary }]}
                    onPress={handleAddGoal}
                  >
                    <Text style={[styles.formButtonText, { color: '#FFFFFF' }]}>
                      Create Goal
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
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
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  overviewStat: {
    flex: 1,
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
  goalCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    gap: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  goalIcon: {
    fontSize: 24,
  },
  goalDetails: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  goalDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  goalActions: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalProgress: {
    gap: 8,
  },
  goalAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  goalCurrent: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  goalTarget: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  goalDeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  goalDays: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  goalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  goalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  goalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  addGoalCard: {
    padding: 20,
    borderRadius: 16,
  },
  addGoalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  addGoalForm: {
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
});
