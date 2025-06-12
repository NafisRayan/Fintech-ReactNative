import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, QrCode, Flashlight, Image } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function QRScannerModal() {
  const { colors } = useTheme();
  const router = useRouter();
  const [flashEnabled, setFlashEnabled] = useState(false);

  const handleQRCodeScanned = (data: string) => {
    Alert.alert(
      'QR Code Scanned',
      `Scanned: ${data}`,
      [
        { text: 'Scan Again', style: 'cancel' },
        { text: 'Process Payment', onPress: () => processPayment(data) }
      ]
    );
  };

  const processPayment = (qrData: string) => {
    // Mock QR payment processing
    Alert.alert(
      'Payment Processed',
      'Your QR payment has been processed successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const mockScan = () => {
    const mockData = 'merchant:starbucks:amount:5.75:id:12345';
    handleQRCodeScanned(mockData);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Scan QR Code</Text>
        <TouchableOpacity 
          style={styles.flashButton}
          onPress={() => setFlashEnabled(!flashEnabled)}
        >
          <Flashlight size={24} color={flashEnabled ? colors.accent : "#FFFFFF"} />
        </TouchableOpacity>
      </View>

      <View style={styles.scannerContainer}>
        {/* Mock Camera View */}
        <View style={[styles.cameraView, { backgroundColor: colors.surface }]}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.topRight, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bottomRight, { borderColor: colors.primary }]} />
          </View>
          
          <View style={styles.scanLine} />
          
          <View style={styles.centerContent}>
            <QrCode size={80} color={colors.textMuted} />
            <Text style={[styles.scanInstruction, { color: colors.text }]}>
              Point your camera at a QR code
            </Text>
            
            {/* Mock Scan Button for demo */}
            <TouchableOpacity
              style={[styles.mockScanButton, { backgroundColor: colors.primary }]}
              onPress={mockScan}
            >
              <Text style={styles.mockScanText}>Simulate QR Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <Image size={24} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Gallery
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <QrCode size={24} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              My QR
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Position the QR code within the frame to scan
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    color: '#FFFFFF',
  },
  flashButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraView: {
    width: width - 32,
    height: height * 0.6,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    width: 250,
    height: 2,
    backgroundColor: '#00FF00',
    opacity: 0.8,
  },
  centerContent: {
    alignItems: 'center',
    gap: 16,
    marginTop: 40,
  },
  scanInstruction: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  mockScanButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  mockScanText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
  },
  actionButton: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    minWidth: 80,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});
