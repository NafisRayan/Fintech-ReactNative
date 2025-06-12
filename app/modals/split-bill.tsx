import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Minus, Users, DollarSign, Calculator } from 'lucide-react-native';

export default function SplitBillModal() {
  const { colors } = useTheme();
  const { formatCurrency, addTransaction } = useFinance();
  const router = useRouter();
  
  const [totalAmount, setTotalAmount] = useState('');
  const [tipPercentage, setTipPercentage] = useState(18);
  const [participants, setParticipants] = useState([
    { id: '1', name: 'You', selected: true, amount: 0 },
  ]);
  const [newParticipantName, setNewParticipantName] = useState('');

  const tipPresets = [15, 18, 20, 25];

  const addParticipant = () => {
    if (!newParticipantName.trim()) {
      Alert.alert('Error', 'Please enter a name for the participant.');
      return;
    }

    const newParticipant = {
      id: Date.now().toString(),
      name: newParticipantName.trim(),
      selected: true,
      amount: 0
    };

    setParticipants([...participants, newParticipant]);
    setNewParticipantName('');
  };

  const removeParticipant = (id: string) => {
    if (participants.length <= 1) {
      Alert.alert('Error', 'You need at least one participant.');
      return;
    }
    setParticipants(participants.filter(p => p.id !== id));
  };

  const toggleParticipant = (id: string) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const calculateSplit = () => {
    const total = parseFloat(totalAmount) || 0;
    const tip = (total * tipPercentage) / 100;
    const grandTotal = total + tip;
    const selectedParticipants = participants.filter(p => p.selected);
    const perPerson = selectedParticipants.length > 0 ? grandTotal / selectedParticipants.length : 0;

    return {
      subtotal: total,
      tip,
      grandTotal,
      perPerson,
      selectedCount: selectedParticipants.length
    };
  };

  const handleSplitBill = () => {
    const calculation = calculateSplit();
    
    if (calculation.subtotal <= 0) {
      Alert.alert('Error', 'Please enter a valid bill amount.');
      return;
    }

    if (calculation.selectedCount === 0) {
      Alert.alert('Error', 'Please select at least one participant.');
      return;
    }

    // Add transaction for the user's share
    const userParticipant = participants.find(p => p.name === 'You' && p.selected);
    if (userParticipant) {
      const transaction = {
        title: 'Bill Split',
        subtitle: `Split ${calculation.selectedCount} ways`,
        amount: -calculation.perPerson,
        type: 'expense' as const,
        category: 'Food & Drink',
        date: new Date().toISOString(),
        icon: '🧾',
        status: 'completed' as const,
        description: `Split bill with ${calculation.selectedCount} people`
      };

      addTransaction(transaction);
    }

    Alert.alert(
      'Bill Split Successfully!',
      `Each person pays ${formatCurrency(calculation.perPerson)}`,
      [
        {
          text: 'Send Requests',
          onPress: () => {
            Alert.alert('Requests Sent', 'Payment requests have been sent to all participants.');
            router.back();
          }
        },
        {
          text: 'Done',
          onPress: () => router.back()
        }
      ]
    );
  };

  const calculation = calculateSplit();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Split Bill</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bill Amount */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Bill Amount</Text>
          <View style={[styles.amountContainer, { backgroundColor: colors.surface }]}>
            <DollarSign size={24} color={colors.textMuted} />
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={totalAmount}
              onChangeText={setTotalAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Tip */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tip</Text>
          <View style={styles.tipContainer}>
            <View style={styles.tipPresets}>
              {tipPresets.map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={[
                    styles.tipPreset,
                    {
                      backgroundColor: tipPercentage === preset ? colors.primary : colors.surface,
                    }
                  ]}
                  onPress={() => setTipPercentage(preset)}
                >
                  <Text style={[
                    styles.tipPresetText,
                    { color: tipPercentage === preset ? '#FFFFFF' : colors.text }
                  ]}>
                    {preset}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[styles.customTipContainer, { backgroundColor: colors.surface }]}>
              <TextInput
                style={[styles.customTipInput, { color: colors.text }]}
                value={tipPercentage.toString()}
                onChangeText={(value) => setTipPercentage(parseInt(value) || 0)}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text style={[styles.percentSymbol, { color: colors.textMuted }]}>%</Text>
            </View>
          </View>
        </View>

        {/* Participants */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Participants</Text>
          
          {/* Add Participant */}
          <View style={styles.addParticipantContainer}>
            <TextInput
              style={[
                styles.addParticipantInput,
                { 
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              placeholder="Add participant name"
              placeholderTextColor={colors.textMuted}
              value={newParticipantName}
              onChangeText={setNewParticipantName}
              onSubmitEditing={addParticipant}
            />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={addParticipant}
            >
              <Plus size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Participants List */}
          <View style={styles.participantsList}>
            {participants.map((participant) => (
              <View
                key={participant.id}
                style={[
                  styles.participantItem,
                  { 
                    backgroundColor: participant.selected ? `${colors.primary}10` : colors.surface,
                    borderColor: participant.selected ? colors.primary : 'transparent'
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.participantInfo}
                  onPress={() => toggleParticipant(participant.id)}
                >
                  <View style={[
                    styles.checkbox,
                    {
                      backgroundColor: participant.selected ? colors.primary : 'transparent',
                      borderColor: participant.selected ? colors.primary : colors.border
                    }
                  ]}>
                    {participant.selected && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={[styles.participantName, { color: colors.text }]}>
                    {participant.name}
                  </Text>
                </TouchableOpacity>
                
                {participant.name !== 'You' && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeParticipant(participant.id)}
                  >
                    <Minus size={16} color={colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Summary</Text>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {formatCurrency(calculation.subtotal)}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Tip ({tipPercentage}%)
              </Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>
                {formatCurrency(calculation.tip)}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={[styles.summaryLabel, styles.totalLabel, { color: colors.text }]}>
                Total
              </Text>
              <Text style={[styles.summaryValue, styles.totalValue, { color: colors.text }]}>
                {formatCurrency(calculation.grandTotal)}
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.perPersonRow]}>
              <View style={styles.perPersonInfo}>
                <Users size={16} color={colors.primary} />
                <Text style={[styles.perPersonLabel, { color: colors.primary }]}>
                  {calculation.selectedCount} people
                </Text>
              </View>
              <Text style={[styles.perPersonAmount, { color: colors.primary }]}>
                {formatCurrency(calculation.perPerson)} each
              </Text>
            </View>
          </View>
        </View>

        {/* Split Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.splitButton,
              { 
                backgroundColor: calculation.subtotal > 0 && calculation.selectedCount > 0 
                  ? colors.primary : colors.border,
                opacity: calculation.subtotal > 0 && calculation.selectedCount > 0 ? 1 : 0.5
              }
            ]}
            onPress={handleSplitBill}
            disabled={calculation.subtotal <= 0 || calculation.selectedCount === 0}
          >
            <Calculator size={20} color="#FFFFFF" />
            <Text style={styles.splitButtonText}>
              Split Bill
            </Text>
          </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
  },
  tipContainer: {
    gap: 12,
  },
  tipPresets: {
    flexDirection: 'row',
    gap: 8,
  },
  tipPreset: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tipPresetText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  customTipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  customTipInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  percentSymbol: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  addParticipantContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addParticipantInput: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantsList: {
    gap: 8,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  participantName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  removeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotal: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  summaryValue: {
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
  perPersonRow: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  perPersonInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perPersonLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  perPersonAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  splitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  splitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});
