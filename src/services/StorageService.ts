import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Budget, Account } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: '@finance_transactions',
  BUDGETS: '@finance_budgets',
  ACCOUNTS: '@finance_accounts',
  USER_PREFERENCES: '@finance_preferences',
};

export class StorageService {
  static async saveTransactions(transactions: Transaction[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(transactions);
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, jsonValue);
    } catch (error) {
      console.error('Error saving transactions:', error);
      throw error;
    }
  }

  static async loadTransactions(): Promise<Transaction[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading transactions:', error);
      return [];
    }
  }

  static async saveBudgets(budgets: Budget[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(budgets);
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, jsonValue);
    } catch (error) {
      console.error('Error saving budgets:', error);
      throw error;
    }
  }

  static async loadBudgets(): Promise<Budget[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.BUDGETS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading budgets:', error);
      return [];
    }
  }

  static async saveAccounts(accounts: Account[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(accounts);
      await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNTS, jsonValue);
    } catch (error) {
      console.error('Error saving accounts:', error);
      throw error;
    }
  }

  static async loadAccounts(): Promise<Account[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error loading accounts:', error);
      return [];
    }
  }

  static async saveUserPreferences(preferences: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(preferences);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, jsonValue);
    } catch (error) {
      console.error('Error saving user preferences:', error);
      throw error;
    }
  }

  static async loadUserPreferences(): Promise<any> {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return {};
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TRANSACTIONS,
        STORAGE_KEYS.BUDGETS,
        STORAGE_KEYS.ACCOUNTS,
        STORAGE_KEYS.USER_PREFERENCES,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}