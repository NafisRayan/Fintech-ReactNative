import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, Eye, EyeOff, Shield, Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AddCardModal() {
  const { colors } = useTheme();
  const { addCard } = useFinance();
  const router = useRouter();
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCvv, setShowCvv] = useState(false);
  const [cardType, setCardType] = useState('Personal');
  const [selectedColor, setSelectedColor] = useState(0);
  const [isVirtual, setIsVirtual] = useState(false);

  const cardTypes = ['Personal', 'Business', 'Savings', 'Travel'];

  const cardColors = [
    ['#2563EB', '#3B82F6'] as const, // Blue
    ['#10B981', '#14F195'] as const, // Green
    ['#F59E0B', '#FBBF24'] as const, // Orange
    ['#8B5CF6', '#A78BFA'] as const, // Purple
    ['#EF4444', '#F87171'] as const, // Red
    ['#06B6D4', '#22D3EE'] as const, // Cyan
  ];

  const formatCardNumber = (number: string) => {
    const cleaned = number.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return cleaned;
    }
  };

  const handleCardNumberChange = (text: string) => {
    const formatted = formatCardNumber(text);
    if (formatted.length <= 19) { // 16 digits + 3 spaces
      setCardNumber(formatted);
    }
  };

  const handleExpiryMonthChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) {
      setExpiryMonth(cleaned);
    }
  };

  const handleExpiryYearChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 2) {
      setExpiryYear(cleaned);
    }
  };

  const handleCvvChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length <= 4) {
      setCvv(cleaned);
    }
  };

  const validateForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardHolder.trim()) {
      Alert.alert('Error', 'Please enter the cardholder name');
      return false;
    }
    if (!expiryMonth || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
      Alert.alert('Error', 'Please enter a valid expiry month (01-12)');
      return false;
    }
    if (!expiryYear || parseInt(expiryYear) < 24) {
      Alert.alert('Error', 'Please enter a valid expiry year');
      return false;
    }
    if (!cvv || cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handleAddCard = () => {
    if (!validateForm()) return;

    const newCard = {
      type: cardType,
      number: cardNumber,
      holder: cardHolder.toUpperCase(),
      expiry: `${expiryMonth.padStart(2, '0')}/${expiryYear}`,
      cvv: cvv,
      balance: '$0.00',
      colors: [...cardColors[selectedColor]],
      isLocked: false,
      isVirtual: isVirtual,
      limit: 5000,
      spent: 0
    };

    addCard(newCard);

    Alert.alert(
      'Card Added Successfully!',
      `Your ${cardType} card has been added to your wallet.`,
      [
        {
          text: 'Add Another',
          style: 'cancel',
          onPress: () => {
            setCardNumber('');
            setCardHolder('');
            setExpiryMonth('');
            setExpiryYear('');
            setCvv('');
          }
        },
        {
          text: 'Done',
          onPress: () => router.back()
        }
      ]
    );
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
        <Text style={[styles.title, { color: colors.text }]}>Add New Card</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card Preview */}
        <View style={styles.section}>
          <LinearGradient
            colors={cardColors[selectedColor]}
            style={styles.cardPreview}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTypeText}>{cardType}</Text>
              {isVirtual && (
                <View style={styles.virtualBadge}>
                  <Text style={styles.virtualBadgeText}>Virtual</Text>
                </View>
              )}
            </View>
            
            <View style={styles.cardNumber}>
              <Text style={styles.cardNumberText}>
                {cardNumber || '•••• •••• •••• ••••'}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>Card Holder</Text>
                <Text style={styles.cardHolder}>
                  {cardHolder.toUpperCase() || 'YOUR NAME'}
                </Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Expires</Text>
                <Text style={styles.cardExpiry}>
                  {expiryMonth && expiryYear ? `${expiryMonth.padStart(2, '0')}/${expiryYear}` : 'MM/YY'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Card Type */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Card Type</Text>
          <View style={styles.cardTypes}>
            {cardTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.cardTypeOption,
                  {
                    backgroundColor: cardType === type ? colors.primary : colors.surface,
                    borderColor: cardType === type ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setCardType(type)}
              >
                <Text style={[
                  styles.cardTypeOptionText,
                  { color: cardType === type ? '#FFFFFF' : colors.text }
                ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Card Colors */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Card Color</Text>
          <View style={styles.colorOptions}>
            {cardColors.map((colorSet, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  {
                    borderColor: selectedColor === index ? colors.primary : 'transparent',
                    borderWidth: selectedColor === index ? 3 : 0
                  }
                ]}
                onPress={() => setSelectedColor(index)}
              >
                <LinearGradient
                  colors={colorSet}
                  style={styles.colorGradient}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Virtual Card Toggle */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.virtualToggle, { backgroundColor: colors.surface }]}
            onPress={() => setIsVirtual(!isVirtual)}
          >
            <View style={styles.virtualToggleInfo}>
              <Text style={[styles.virtualToggleTitle, { color: colors.text }]}>
                Virtual Card
              </Text>
              <Text style={[styles.virtualToggleDescription, { color: colors.textSecondary }]}>
                Create a virtual card for online purchases
              </Text>
            </View>
            <View style={[
              styles.toggle,
              { backgroundColor: isVirtual ? colors.primary : colors.border }
            ]}>
              <View style={[
                styles.toggleIndicator,
                {
                  backgroundColor: '#FFFFFF',
                  transform: [{ translateX: isVirtual ? 20 : 2 }]
                }
              ]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Card Details Form */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Card Details</Text>
          
          <View style={styles.form}>
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                Card Number
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  { 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border
                  }
                ]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colors.textMuted}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                Cardholder Name
              </Text>
              <TextInput
                style={[
                  styles.formInput,
                  { 
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border
                  }
                ]}
                placeholder="John Doe"
                placeholderTextColor={colors.textMuted}
                value={cardHolder}
                onChangeText={setCardHolder}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formFieldHalf}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                  Expiry Month
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  placeholder="MM"
                  placeholderTextColor={colors.textMuted}
                  value={expiryMonth}
                  onChangeText={handleExpiryMonthChange}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={styles.formFieldHalf}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                  Expiry Year
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { 
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: colors.border
                    }
                  ]}
                  placeholder="YY"
                  placeholderTextColor={colors.textMuted}
                  value={expiryYear}
                  onChangeText={handleExpiryYearChange}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>

              <View style={styles.formFieldHalf}>
                <Text style={[styles.formLabel, { color: colors.textSecondary }]}>
                  CVV
                </Text>
                <View style={[
                  styles.cvvContainer,
                  { backgroundColor: colors.surface, borderColor: colors.border }
                ]}>
                  <TextInput
                    style={[styles.cvvInput, { color: colors.text }]}
                    placeholder="123"
                    placeholderTextColor={colors.textMuted}
                    value={cvv}
                    onChangeText={handleCvvChange}
                    keyboardType="numeric"
                    secureTextEntry={!showCvv}
                    maxLength={4}
                  />
                  <TouchableOpacity onPress={() => setShowCvv(!showCvv)}>
                    {showCvv ? (
                      <EyeOff size={16} color={colors.textMuted} />
                    ) : (
                      <Eye size={16} color={colors.textMuted} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.section}>
          <View style={[styles.securityNotice, { backgroundColor: colors.surface }]}>
            <Shield size={20} color={colors.primary} />
            <Text style={[styles.securityText, { color: colors.textSecondary }]}>
              Your card information is encrypted and secure. We use bank-level security to protect your data.
            </Text>
          </View>
        </View>

        {/* Add Card Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={handleAddCard}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Card</Text>
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
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  cardPreview: {
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
  cardTypeText: {
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
  cardNumber: {
    alignItems: 'center',
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
  cardTypes: {
    flexDirection: 'row',
    gap: 8,
  },
  cardTypeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cardTypeOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    padding: 3,
  },
  colorGradient: {
    flex: 1,
    borderRadius: 21,
  },
  virtualToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  virtualToggleInfo: {
    flex: 1,
  },
  virtualToggleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  virtualToggleDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  form: {
    gap: 16,
  },
  formField: {
    gap: 8,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formFieldHalf: {
    flex: 1,
    gap: 8,
  },
  formLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  formInput: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  cvvContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  cvvInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});
