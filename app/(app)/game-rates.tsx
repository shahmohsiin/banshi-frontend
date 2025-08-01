import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { theme } from '../theme';

interface GameRate {
  id: string;
  gameType: string;
  ratio: string;
  value: string;
}

export default function GameRatesScreen() {
  const [showToast, setShowToast] = useState(false);

  const gameRates: GameRate[] = [
    {
      id: '1',
      gameType: 'Single Digit',
      ratio: '10',
      value: '100',
    },
    {
      id: '2',
      gameType: 'Jodi Digit',
      ratio: '10',
      value: '1000',
    },
    {
      id: '3',
      gameType: 'Single Panna',
      ratio: '10',
      value: '1600',
    },
    {
      id: '4',
      gameType: 'Double Panna',
      ratio: '10',
      value: '3200',
    },
    {
      id: '5',
      gameType: 'Triple Panna',
      ratio: '10',
      value: '7000',
    },
    {
      id: '6',
      gameType: 'Half Sangam',
      ratio: '10',
      value: '10000',
    },
    {
      id: '7',
      gameType: 'Full Sangam',
      ratio: '10',
      value: '100000',
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch game rates
    const fetchGameRates = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setShowToast(true);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      } catch (error) {
        // Handle error silently
      }
    };

    fetchGameRates();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game Rates</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Game Win Ratio for all Bids</Text>
        </View>

        {/* Game Rates List */}
        <View style={styles.ratesSection}>
          {gameRates.map((rate) => (
            <View key={rate.id} style={styles.rateCard}>
              <View style={styles.rateInfo}>
                <Text style={styles.gameType}>{rate.gameType}</Text>
                <Text style={styles.rateValue}>
                  {rate.ratio} / {rate.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Toast Message */}
      {showToast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>Successfully Fetched</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingTop: 50,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.gray,
  },
  banner: {
    backgroundColor: theme.colors.primary,
    margin: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
    textAlign: 'center',
  },
  ratesSection: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  rateCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameType: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.black,
  },
  rateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  toast: {
    position: 'absolute',
    bottom: 30,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.darkGray,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  toastText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
}); 