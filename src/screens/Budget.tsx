import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Budget as BudgetType } from '../types';
import { DemoDataService } from '../services/DemoDataService';

const { width } = Dimensions.get('window');

const BudgetScreen: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [newBudget, setNewBudget] = useState({
    category: '',
    allocated: '',
    period: 'monthly' as 'weekly' | 'monthly' | 'yearly',
  });

  const categories = DemoDataService.generateDemoCategories();

  useEffect(() => {
    // Load demo budgets
    const demoBudgets = DemoDataService.generateDemoBudgets();
    setBudgets(demoBudgets);
  }, []);

  const totalAllocated = budgets.reduce((sum, budget) => sum + budget.allocated, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return '#ef4444';
    if (percentage >= 75) return '#f59e0b';
    return '#10b981';
  };

  const getProgressText = (percentage: number) => {
    if (percentage >= 100) return 'Over Budget';
    if (percentage >= 90) return 'Almost There';
    if (percentage >= 75) return 'Getting Close';
    return 'On Track';
  };

  const addBudget = () => {
    if (!newBudget.category || !newBudget.allocated) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const selectedCategory = categories.find(c => c.name === newBudget.category);
    const budget: BudgetType = {
      id: Date.now().toString(),
      category: newBudget.category,
      allocated: parseFloat(newBudget.allocated),
      spent: 0,
      period: newBudget.period,
      icon: selectedCategory?.icon || 'help-circle',
      color: selectedCategory?.color || '#6b7280',
    };

    setBudgets([...budgets, budget]);
    setModalVisible(false);
    setNewBudget({
      category: '',
      allocated: '',
      period: 'monthly',
    });
  };

  const deleteBudget = (id: string) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setBudgets(budgets.filter(b => b.id !== id))
        },
      ]
    );
  };

  const updateBudgetSpent = (id: string, spent: number) => {
    setBudgets(budgets.map(budget => 
      budget.id === id ? { ...budget, spent } : budget
    ));
  };

  const renderBudgetItem = (budget: BudgetType) => {
    const percentage = (budget.spent / budget.allocated) * 100;
    const remaining = budget.allocated - budget.spent;
    const progressColor = getProgressColor(percentage);

    return (
      <View key={budget.id} style={styles.budgetItem}>
        <View style={styles.budgetHeader}>
          <View style={styles.budgetInfo}>
            <View style={[styles.budgetIcon, { backgroundColor: budget.color + '20' }]}>
              <Ionicons name={budget.icon as any} size={20} color={budget.color} />
            </View>
            <View>
              <Text style={styles.budgetCategory}>{budget.category}</Text>
              <Text style={styles.budgetPeriod}>{budget.period}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => deleteBudget(budget.id)}>
            <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.budgetProgress}>
          <View style={[styles.budgetProgressBar, { width: `${Math.min(percentage, 100)}%`, backgroundColor: progressColor }]} />
        </View>

        <View style={styles.budgetDetails}>
          <View>
            <Text style={styles.budgetSpent}>${budget.spent.toFixed(2)} spent</Text>
            <Text style={[styles.budgetStatus, { color: progressColor }]}>
              {getProgressText(percentage)}
            </Text>
          </View>
          <View style={styles.budgetRight}>
            <Text style={styles.budgetRemaining}>
              ${Math.max(remaining, 0).toFixed(2)} left
            </Text>
            <Text style={styles.budgetAllocated}>
              of ${budget.allocated.toFixed(2)}
            </Text>
          </View>
        </View>

        {percentage > 100 && (
          <View style={styles.overBudgetWarning}>
            <Ionicons name="warning" size={16} color="#ef4444" />
            <Text style={styles.overBudgetText}>
              ${(budget.spent - budget.allocated).toFixed(2)} over budget
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderPeriodButton = (period: 'weekly' | 'monthly' | 'yearly') => (
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

  const renderCategoryItem = (category: typeof categories[0]) => (
    <TouchableOpacity
      key={category.name}
      style={[
        styles.categoryItem,
        newBudget.category === category.name && styles.categoryItemSelected
      ]}
      onPress={() => setNewBudget({...newBudget, category: category.name})}
    >
      <Ionicons 
        name={category.icon as any} 
        size={20} 
        color={newBudget.category === category.name ? '#f3f4f6' : category.color} 
      />
      <Text style={[
        styles.categoryText,
        newBudget.category === category.name && styles.categoryTextSelected
      ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const filteredBudgets = budgets.filter(budget => budget.period === selectedPeriod);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Budget</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#f3f4f6" />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, { backgroundColor: '#1f2937' }]}>
          <Text style={styles.summaryLabel}>Total Allocated</Text>
          <Text style={styles.summaryValue}>${totalAllocated.toFixed(2)}</Text>
          <Text style={styles.summaryTrend}>For {selectedPeriod}</Text>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: '#1f2937' }]}>
          <Text style={styles.summaryLabel}>Total Spent</Text>
          <Text style={styles.summaryValue}>${totalSpent.toFixed(2)}</Text>
          <View style={styles.trend}>
            <Ionicons name="trending-up" size={12} color="#ef4444" />
            <Text style={styles.trendText}>+{Math.round((totalSpent/totalAllocated) * 100)}% from last month</Text>
          </View>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: '#1f2937' }]}>
          <Text style={styles.summaryLabel}>Remaining</Text>
          <Text style={[
            styles.summaryValue,
            { color: totalRemaining >= 0 ? '#10b981' : '#ef4444' }
          ]}>
            ${totalRemaining.toFixed(2)}
          </Text>
          <View style={styles.trend}>
            <Ionicons name={totalRemaining >= 0 ? "checkmark-circle" : "warning"} size={12} color={totalRemaining >= 0 ? "#10b981" : "#ef4444"} />
            <Text style={styles.trendText}>
              {totalRemaining >= 0 ? 'On track' : 'Over budget'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.periodSelector}>
        {renderPeriodButton('weekly')}
        {renderPeriodButton('monthly')}
        {renderPeriodButton('yearly')}
      </View>

      <ScrollView style={styles.budgetsList} showsVerticalScrollIndicator={false}>
        {filteredBudgets.map(renderBudgetItem)}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Budget</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView style={styles.categoriesGrid} horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map(renderCategoryItem)}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Allocated Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  placeholderTextColor="#6b7280"
                  value={newBudget.allocated}
                  onChangeText={(text) => setNewBudget({...newBudget, allocated: text})}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Period</Text>
                <View style={styles.periodSelector}>
                  {(['weekly', 'monthly', 'yearly'] as const).map(period => (
                    <TouchableOpacity
                      key={period}
                      style={[
                        styles.periodButton,
                        newBudget.period === period && styles.periodButtonActive
                      ]}
                      onPress={() => setNewBudget({...newBudget, period})}
                    >
                      <Text style={[
                        styles.periodButtonText,
                        newBudget.period === period && styles.periodButtonTextActive
                      ]}>
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addBudget}
              >
                <Text style={styles.saveButtonText}>Add Budget</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f3f4f6',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCards: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#f3f4f6',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  budgetsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  budgetItem: {
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  budgetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f3f4f6',
  },
  budgetPeriod: {
    fontSize: 12,
    color: '#9ca3af',
    textTransform: 'capitalize',
  },
  budgetProgress: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  budgetProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  budgetSpent: {
    fontSize: 14,
    color: '#f3f4f6',
    marginBottom: 2,
  },
  budgetStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  budgetRight: {
    alignItems: 'flex-end',
  },
  budgetRemaining: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 2,
  },
  budgetAllocated: {
    fontSize: 12,
    color: '#9ca3af',
  },
  overBudgetWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  overBudgetText: {
    fontSize: 12,
    color: '#ef4444',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f3f4f6',
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f3f4f6',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#f3f4f6',
  },
  categoriesGrid: {
    flexDirection: 'row',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    minWidth: 100,
  },
  categoryItemSelected: {
    backgroundColor: '#6366f1',
  },
  categoryText: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 6,
  },
  categoryTextSelected: {
    color: '#f3f4f6',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  saveButton: {
    backgroundColor: '#6366f1',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
  },
  summaryTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 10,
    color: '#9ca3af',
  },
});

export default BudgetScreen;