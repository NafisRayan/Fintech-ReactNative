import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard, Shield, TrendingUp } from 'lucide-react-native';

export function WelcomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const features = [
    {
      icon: CreditCard,
      title: 'Smart Banking',
      description: 'Manage your finances with intelligent insights'
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Your money is protected with advanced encryption'
    },
    {
      icon: TrendingUp,
      title: 'Investment Tools',
      description: 'Grow your wealth with personalized recommendations'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.header}
      >
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.headerContent}>
          <Text style={styles.title}>Welcome to FinanceApp</Text>
          <Text style={styles.subtitle}>
            Your complete financial companion for modern banking
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: colors.surface }]}>
                <feature.icon size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.border }]}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 320,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
  },
  headerContent: {
    padding: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 32,
  },
  features: {
    flex: 1,
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    paddingTop: 24,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});