import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Modal from '@/components/ui/Modal';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Send, User, Search } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface SendMoneyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SendMoneyModal({ visible, onClose }: SendMoneyModalProps) {
  const { colors } = useTheme();
  const [amount, setAmount] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma@example.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMoney = async () => {
    if (!selectedContact) {
      Alert.alert('Error', 'Please select a contact');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        `$${amount} sent to ${selectedContact.name}`,
        [{ text: 'OK', onPress: handleClose }]
      );
    }, 2000);
  };

  const handleClose = () => {
    setAmount('');
    setSelectedContact(null);
    setNote('');
    setSearchQuery('');
    onClose();
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[
        styles.contactItem,
        { 
          backgroundColor: selectedContact?.id === item.id ? `${colors.primary}20` : colors.surface,
          borderColor: selectedContact?.id === item.id ? colors.primary : colors.border
        }
      ]}
      onPress={() => setSelectedContact(item)}
    >
      <View style={[styles.contactAvatar, { backgroundColor: colors.primary }]}>
        <Text style={styles.contactAvatarText}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.contactEmail, { color: colors.textSecondary }]}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} onClose={handleClose} title="Send Money" size="large">
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Search size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search contacts"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Contacts List */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Contact</Text>
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={item => item.id}
          style={styles.contactsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Amount</Text>
          <View style={[styles.amountInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.currencySymbol, { color: colors.text }]}>$</Text>
            <TextInput
              style={[styles.amountText, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Note Input */}
        <View style={styles.noteSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Note (Optional)</Text>
          <TextInput
            style={[styles.noteInput, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
            placeholder="What's this for?"
            placeholderTextColor={colors.textMuted}
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        {/* Send Button */}
        <AnimatedButton
          title="Send Money"
          onPress={handleSendMoney}
          loading={loading}
          style={styles.sendButton}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  contactsList: {
    maxHeight: 200,
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    gap: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactAvatarText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  contactEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  amountSection: {
    marginBottom: 24,
  },
  amountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  amountText: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
  },
  noteSection: {
    marginBottom: 32,
  },
  noteInput: {
    height: 80,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
  },
  sendButton: {
    marginTop: 'auto',
  },
});
