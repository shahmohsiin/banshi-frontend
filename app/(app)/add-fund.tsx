import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useUser } from '../contexts/UserContext';
import { usePayment } from '../hooks/usePayment';
import { theme } from '../theme';

const AddFundScreen: React.FC = () => {
  const [points, setPoints] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const { userData } = useUser();
  const { processPayment, isLoading, error } = usePayment();
  const currentPoints = userData?.walletBalance || 0;

  const pointOptions = [500, 1000, 2000, 3000, 5000, 10000];

  const handlePointSelection = (selectedPoints: number) => {
    setPoints(selectedPoints.toString());
  };

  const handleSubmit = async () => {
    if (!points || parseInt(points) < 300) {
      Alert.alert('Error', 'Minimum deposit is 300 points');
      return;
    }

    const amount = parseInt(points);
    
    Alert.alert(
      'Confirm Payment',
      `You are about to add ${points} points to your account for ₹${amount}. Proceed with payment?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Proceed',
          onPress: async () => {
            try {
              await processPayment(amount);
            } catch (error) {
              console.error('Payment error:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Point</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Current Points Display */}
        <View style={styles.currentPointsContainer}>
          <View style={styles.pointsIcon}>
            <Ionicons name="diamond" size={32} color="#4FC3F7" />
          </View>
          <View style={styles.pointsTextContainer}>
            <Text style={styles.pointsNumber}>{currentPoints}</Text>
            <Text style={styles.pointsLabel}>Current Points</Text>
          </View>
        </View>

        {/* Add Fund Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>!!Add Fund Notice!!</Text>
          <Text style={styles.noticeText}>MINIMUM DEPOSIT 300</Text>
          <Text style={styles.noticeText}>पेमेंट ऐड करने के बाद एप को रिफ्रेश करे।</Text>
          <Text style={styles.noticeText}>अगर आपका पेमेंट आपके वॉलेट में नही आता है तो</Text>
          <Text style={styles.noticeText}>पेमेंट का स्क्रीन शॉट व्हाट्सएप पर एडमिन को भेजे।</Text>
        </View>

        {/* Points Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons 
              name="swap-vertical" 
              size={20} 
              color={theme.colors.darkGray} 
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Points"
              placeholderTextColor={theme.colors.darkGray}
              value={points}
              onChangeText={setPoints}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Point Selection Buttons */}
        <View style={styles.pointButtonsContainer}>
          <View style={styles.pointButtonsRow}>
            {pointOptions.slice(0, 3).map((point) => (
              <TouchableOpacity
                key={point}
                style={[
                  styles.pointButton,
                  points === point.toString() && styles.selectedPointButton
                ]}
                onPress={() => handlePointSelection(point)}
                disabled={isLoading}
              >
                <Text style={[
                  styles.pointButtonText,
                  points === point.toString() && styles.selectedPointButtonText
                ]}>
                  {point}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.pointButtonsRow}>
            {pointOptions.slice(3, 6).map((point) => (
              <TouchableOpacity
                key={point}
                style={[
                  styles.pointButton,
                  points === point.toString() && styles.selectedPointButton
                ]}
                onPress={() => handlePointSelection(point)}
                disabled={isLoading}
              >
                <Text style={[
                  styles.pointButtonText,
                  points === point.toString() && styles.selectedPointButtonText
                ]}>
                  {point}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.colors.white} />
              <Text style={styles.submitButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>SUBMIT</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  headerSpacer: {
    width: 40,
  },
  currentPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  pointsIcon: {
    marginRight: theme.spacing.md,
  },
  pointsTextContainer: {
    flex: 1,
  },
  pointsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
  },
  pointsLabel: {
    fontSize: 16,
    color: theme.colors.black,
  },
  noticeContainer: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  noticeText: {
    fontSize: 14,
    color: theme.colors.black,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: theme.spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.black,
    paddingVertical: theme.spacing.sm,
  },
  pointButtonsContainer: {
    marginTop: theme.spacing.lg,
  },
  pointButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  pointButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  selectedPointButton: {
    backgroundColor: theme.colors.secondary,
  },
  pointButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  selectedPointButtonText: {
    color: theme.colors.white,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.darkGray,
    opacity: 0.6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
    marginLeft: theme.spacing.sm,
  },
});

export default AddFundScreen; 