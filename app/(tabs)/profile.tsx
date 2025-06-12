import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Settings, Bell, Shield, CreditCard, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon, Sun, Monitor } from 'lucide-react-native';

export default function ProfileScreen() {
  const { colors, theme, setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  const profileSections = [
    {
      title: 'Account',
      items: [
        { icon: Settings, label: 'Account Settings', action: () => {} },
        { icon: CreditCard, label: 'Cards & Banking', action: () => {} },
        { icon: Bell, label: 'Notifications', action: () => {} },
        { icon: Shield, label: 'Security & Privacy', action: () => {} },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', action: () => {} },
        { icon: LogOut, label: 'Sign Out', action: handleLogout, danger: true },
      ]
    }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={[styles.userCard, { backgroundColor: colors.surface }]}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email}
            </Text>
          </View>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.primary }]}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>
          <View style={[styles.themeCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.themeLabel, { color: colors.text }]}>Theme</Text>
            <View style={styles.themeOptions}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: theme === option.value ? colors.primary : 'transparent',
                      borderColor: colors.border
                    }
                  ]}
                  onPress={() => setTheme(option.value as any)}
                >
                  <option.icon 
                    size={20} 
                    color={theme === option.value ? '#FFFFFF' : colors.text} 
                  />
                  <Text style={[
                    styles.themeOptionText,
                    { color: theme === option.value ? '#FFFFFF' : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {section.title}
            </Text>
            <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.sectionItem,
                    itemIndex < section.items.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border
                    }
                  ]}
                  onPress={item.action}
                >
                  <View style={styles.sectionItemLeft}>
                    <View style={[
                      styles.sectionItemIcon,
                      { backgroundColor: item.danger ? `${colors.error}10` : `${colors.primary}10` }
                    ]}>
                      <item.icon 
                        size={20} 
                        color={item.danger ? colors.error : colors.primary} 
                      />
                    </View>
                    <Text style={[
                      styles.sectionItemLabel,
                      { color: item.danger ? colors.error : colors.text }
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  <ChevronRight 
                    size={20} 
                    color={item.danger ? colors.error : colors.textMuted} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Version */}
        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: colors.textMuted }]}>
            FinanceApp v1.0.0
          </Text>
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
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 24,
    marginTop: 8,
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  themeCard: {
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  themeLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  themeOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  sectionItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionItemLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});