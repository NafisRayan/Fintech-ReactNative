import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  icon?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Payment Received',
      message: 'You received $125.00 from John Doe',
      type: 'success',
      timestamp: '2024-01-15T10:30:00Z',
      read: false,
      icon: '💰'
    },
    {
      id: '2',
      title: 'Card Transaction',
      message: 'Your card ending in 9012 was used for $4.50 at Starbucks',
      type: 'info',
      timestamp: '2024-01-15T09:30:00Z',
      read: false,
      icon: '💳'
    },
    {
      id: '3',
      title: 'Budget Alert',
      message: 'You\'ve spent 80% of your Food & Drink budget this month',
      type: 'warning',
      timestamp: '2024-01-14T18:00:00Z',
      read: true,
      icon: '⚠️'
    },
    {
      id: '4',
      title: 'Investment Update',
      message: 'Your portfolio is up 2.5% today (+$234.56)',
      type: 'success',
      timestamp: '2024-01-14T16:00:00Z',
      read: true,
      icon: '📈'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}