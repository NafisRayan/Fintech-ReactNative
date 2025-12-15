import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DemoDataService } from '../services/DemoDataService';

const Profile: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [userInfo, setUserInfo] = useState<any>({});

  useEffect(() => {
    const demoUser = DemoDataService.generateDemoUserProfile();
    setUserInfo(demoUser);
    setNotifications(demoUser.notifications);
    setBiometric(demoUser.biometric);
    setDarkMode(demoUser.darkMode);
    setAutoBackup(demoUser.autoBackup);
  }, []);

  const menuItems = [
    {
      title: 'Account Settings',
      icon: 'person-outline',
      color: '#6366f1',
      action: () => Alert.alert('Account Settings', 'Navigate to account settings'),
    },
    {
      title: 'Security',
      icon: 'shield-checkmark-outline',
      color: '#10b981',
      action: () => Alert.alert('Security', 'Navigate to security settings'),
    },
    {
      title: 'Privacy',
      icon: 'lock-closed-outline',
      color: '#8b5cf6',
      action: () => Alert.alert('Privacy', 'Navigate to privacy settings'),
    },
    {
      title: 'Export Data',
      icon: 'download-outline',
      color: '#f59e0b',
      action: () => Alert.alert('Export Data', 'Export your financial data'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      color: '#06b6d4',
      action: () => Alert.alert('Help & Support', 'Navigate to help center'),
    },
    {
      title: 'About',
      icon: 'information-circle-outline',
      color: '#6b7280',
      action: () => Alert.alert('About', 'Finance Manager v1.0.0'),
    },
  ];

  const renderSettingItem = (
    title: string,
    icon: string,
    value: boolean,
    onToggle: (value: boolean) => void,
    color: string = '#6b7280'
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: color + '20' }]}>
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#374151', true: '#6366f1' }}
        thumbColor={value ? '#f3f4f6' : '#9ca3af'}
      />
    </View>
  );

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <TouchableOpacity key={item.title} style={styles.menuItem} onPress={item.action}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#6b7280" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userInfo.name?.split(' ').map((n: string) => n[0]).join('')}
            </Text>
          </View>
          <TouchableOpacity style={styles.editAvatar}>
            <Ionicons name="camera" size={16} color="#f3f4f6" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{userInfo.name || 'Alex Johnson'}</Text>
        <Text style={styles.userEmail}>{userInfo.email || 'alex.johnson@example.com'}</Text>
        <Text style={styles.memberSince}>Member since {userInfo.memberSince || 'January 2022'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingsContainer}>
          {renderSettingItem(
            'Push Notifications',
            'notifications-outline',
            notifications,
            setNotifications,
            '#6366f1'
          )}
          {renderSettingItem(
            'Biometric Authentication',
            'finger-print-outline',
            biometric,
            setBiometric,
            '#10b981'
          )}
          {renderSettingItem(
            'Dark Mode',
            'moon-outline',
            darkMode,
            setDarkMode,
            '#8b5cf6'
          )}
          {renderSettingItem(
            'Auto Backup',
            'cloud-upload-outline',
            autoBackup,
            setAutoBackup,
            '#f59e0b'
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#06b6d420' }]}>
                <Ionicons name="cash-outline" size={20} color="#06b6d4" />
              </View>
              <View>
                <Text style={styles.settingText}>Default Currency</Text>
                <Text style={styles.settingSubtext}>{userInfo.currency || 'USD'}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#ec489920' }]}>
                <Ionicons name="calendar-outline" size={20} color="#ec4899" />
              </View>
              <View>
                <Text style={styles.settingText}>Date Format</Text>
                <Text style={styles.settingSubtext}>{userInfo.dateFormat || 'MM/DD/YYYY'}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More</Text>
        <View style={styles.menuContainer}>
          {menuItems.map(renderMenuItem)}
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive' }
          ])}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Finance Manager</Text>
        <Text style={styles.footerVersion}>Version 1.0.0</Text>
        <Text style={styles.footerCredits}>Made with ❤️ by Alex</Text>
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
  },
  profileCard: {
    backgroundColor: '#1f2937',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f3f4f6',
  },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 12,
    color: '#6b7280',
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
  settingsContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#f3f4f6',
  },
  settingSubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#f3f4f6',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1f2937',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  footerVersion: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  footerCredits: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default Profile;