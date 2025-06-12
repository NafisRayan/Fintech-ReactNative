import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, User, DollarSign, Send } from 'lucide-react-native';

export default function SendMoneyModal() {
  const { colors } = useTheme();
  const { formatCurrency, addTransaction } = useFinance();
  const router = useRouter();
  
  const [amount, setAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const contacts = [
    {
      id: '1',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: '👩‍💼',
      recent: true
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: '👨‍💻',
      recent: true
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      avatar: '👩‍🎨',
      recent: false
    },
    {
      id: '4',
      name: 'Alex Chen',
      email: 'alex@example.com',
      avatar: '👨‍🔬',
      recent: false
    }
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentContacts = contacts.filter(contact => contact.recent);

  const handleSendMoney = () => {
    if (!selectedContact) {
      Alert.alert('Error', 'Please select a contact to send money to.');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    const transaction = {
      title: `Sent to ${selectedContact.name}`,
      subtitle: 'Just now',
      amount: -parseFloat(amount),
      type: 'expense' as const,
      category: 'Transfer',
      date: new Date().toISOString(),
      icon: '💸',
      status: 'completed' as const,
      merchant: selectedContact.name,
      description: note || 'Money transfer'
    };

    addTransaction(transaction);
    
    Alert.alert(
      'Money Sent!',
      `${formatCurrency(parseFloat(amount))} has been sent to ${selectedContact.name}.`,
      [
        {
          text: 'OK',
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
        <Text style={[styles.title, { color: colors.text }]}>Send Money</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Amount</Text>
          <View style={[styles.amountContainer, { backgroundColor: colors.surface }]}>
            <DollarSign size={24} color={colors.textMuted} />
            <TextInput
              style={[styles.amountInput, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Recent Contacts */}
        {recentContacts.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.recentContacts}>
                {recentContacts.map((contact) => (
                  <TouchableOpacity
                    key={contact.id}
                    style={[
                      styles.recentContact,
                      { 
                        backgroundColor: selectedContact?.id === contact.id ? colors.primary : colors.surface,
                      }
                    ]}
                    onPress={() => setSelectedContact(contact)}
                  >
                    <Text style={styles.contactAvatar}>{contact.avatar}</Text>
                    <Text style={[
                      styles.contactName,
                      { color: selectedContact?.id === contact.id ? '#FFFFFF' : colors.text }
                    ]}>
                      {contact.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Search Contacts */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Send To</Text>
          <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
            <Search size={20} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search contacts"
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.contacts}>
            {filteredContacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={[
                  styles.contactItem,
                  { 
                    backgroundColor: selectedContact?.id === contact.id ? `${colors.primary}10` : colors.surface,
                    borderColor: selectedContact?.id === contact.id ? colors.primary : 'transparent'
                  }
                ]}
                onPress={() => setSelectedContact(contact)}
              >
                <Text style={styles.contactItemAvatar}>{contact.avatar}</Text>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactItemName, { color: colors.text }]}>
                    {contact.name}
                  </Text>
                  <Text style={[styles.contactItemEmail, { color: colors.textSecondary }]}>
                    {contact.email}
                  </Text>
                </View>
                {selectedContact?.id === contact.id && (
                  <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Note (Optional)</Text>
          <TextInput
            style={[
              styles.noteInput,
              { 
                backgroundColor: colors.surface,
                color: colors.text,
                borderColor: colors.border
              }
            ]}
            placeholder="What's this for?"
            placeholderTextColor={colors.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Send Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.sendButton,
              { 
                backgroundColor: selectedContact && amount ? colors.primary : colors.border,
                opacity: selectedContact && amount ? 1 : 0.5
              }
            ]}
            onPress={handleSendMoney}
            disabled={!selectedContact || !amount}
          >
            <Send size={20} color="#FFFFFF" />
            <Text style={styles.sendButtonText}>
              Send {amount ? formatCurrency(parseFloat(amount)) : 'Money'}
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
  recentContacts: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 16,
  },
  recentContact: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    minWidth: 80,
  },
  contactAvatar: {
    fontSize: 24,
  },
  contactName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  contacts: {
    gap: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
  },
  contactItemAvatar: {
    fontSize: 20,
  },
  contactInfo: {
    flex: 1,
  },
  contactItemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  contactItemEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteInput: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
    minHeight: 80,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  sendButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});