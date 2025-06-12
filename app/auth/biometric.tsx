import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, Fingerprint, Eye, Scan } from 'lucide-react-native';

export default function BiometricScreen() {
  const { colors } = useTheme();
  const { login } = useAuth();
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [scanAnimation] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isScanning) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnimation, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [isScanning, scanAnimation]);

  const simulateBiometricScan = (type: string) => {
    setIsScanning(true);
    
    // Simulate scanning delay
    setTimeout(() => {
      setIsScanning(false);
      
      // Simulate random success/failure for demo
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        Alert.alert(
          'Authentication Successful',
          `${type} authentication completed successfully.`,
          [
            {
              text: 'Continue',
              onPress: async () => {
                // Mock login with biometric
                const loginSuccess = await login('demo@example.com', 'password');
                if (loginSuccess) {
                  router.replace('/(tabs)');
                }
              }
            }
          ]
        );
      } else {
        Alert.alert(
          'Authentication Failed',
          `${type} authentication failed. Please try again.`,
          [
            { text: 'Retry', style: 'default' },
            { text: 'Use Password', onPress: () => router.push('/auth/login') }
          ]
        );
      }
    }, 2000);
  };

  const biometricOptions = [
    {
      id: 'fingerprint',
      title: 'Fingerprint',
      subtitle: 'Touch the fingerprint sensor',
      icon: Fingerprint,
      color: colors.primary,
      available: true
    },
    {
      id: 'faceId',
      title: 'Face ID',
      subtitle: 'Look at the front camera',
      icon: Scan,
      color: colors.secondary,
      available: true
    },
    {
      id: 'iris',
      title: 'Iris Scan',
      subtitle: 'Look into the camera',
      icon: Eye,
      color: colors.accent,
      available: false
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Biometric Login</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Secure Authentication
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Choose your preferred biometric authentication method
          </Text>
        </View>

        <View style={styles.biometricOptions}>
          {biometricOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.biometricOption,
                { 
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: option.available ? 1 : 0.5
                }
              ]}
              onPress={() => option.available && simulateBiometricScan(option.title)}
              disabled={!option.available || isScanning}
            >
              <Animated.View style={[
                styles.biometricIconContainer,
                { 
                  backgroundColor: `${option.color}10`,
                  transform: isScanning ? [{ scale: scanAnimation }] : [{ scale: 1 }]
                }
              ]}>
                <option.icon size={32} color={option.color} />
              </Animated.View>
              
              <View style={styles.biometricInfo}>
                <Text style={[styles.biometricTitle, { color: colors.text }]}>
                  {option.title}
                </Text>
                <Text style={[styles.biometricSubtitle, { color: colors.textSecondary }]}>
                  {option.subtitle}
                </Text>
                {!option.available && (
                  <Text style={[styles.unavailableText, { color: colors.error }]}>
                    Not available on this device
                  </Text>
                )}
              </View>

              {option.available && (
                <View style={styles.biometricAction}>
                  <Text style={[styles.actionText, { color: option.color }]}>
                    {isScanning ? 'Scanning...' : 'Tap to scan'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.alternativeLogin}>
          <Text style={[styles.alternativeText, { color: colors.textSecondary }]}>
            Having trouble with biometric authentication?
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={[styles.alternativeLink, { color: colors.primary }]}>
              Use Password Instead
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.securityInfo}>
          <View style={[styles.securityCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.securityTitle, { color: colors.text }]}>
              🔒 Your Security
            </Text>
            <Text style={[styles.securityDescription, { color: colors.textSecondary }]}>
              Your biometric data is stored securely on your device and never leaves it. 
              We use advanced encryption to protect your authentication data.
            </Text>
          </View>
        </View>
      </View>

      {isScanning && (
        <View style={[styles.scanningOverlay, { backgroundColor: colors.overlay }]}>
          <View style={[styles.scanningModal, { backgroundColor: colors.surface }]}>
            <Animated.View style={[
              styles.scanningIcon,
              { transform: [{ scale: scanAnimation }] }
            ]}>
              <Fingerprint size={64} color={colors.primary} />
            </Animated.View>
            <Text style={[styles.scanningText, { color: colors.text }]}>
              Scanning...
            </Text>
            <Text style={[styles.scanningSubtext, { color: colors.textSecondary }]}>
              Please keep your finger on the sensor
            </Text>
          </View>
        </View>
      )}
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
  content: {
    flex: 1,
    padding: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  biometricOptions: {
    gap: 16,
    marginBottom: 40,
  },
  biometricOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  biometricIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  biometricInfo: {
    flex: 1,
  },
  biometricTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  biometricSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  unavailableText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  biometricAction: {
    alignItems: 'flex-end',
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  alternativeLogin: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  alternativeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  alternativeLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  securityInfo: {
    marginTop: 'auto',
  },
  securityCard: {
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  securityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningModal: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
    minWidth: 200,
  },
  scanningIcon: {
    marginBottom: 8,
  },
  scanningText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  scanningSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
