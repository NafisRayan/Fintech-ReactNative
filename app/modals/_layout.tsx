import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="notifications" />
      <Stack.Screen name="send-money" />
      <Stack.Screen name="qr-scanner" />
      <Stack.Screen name="split-bill" />
      <Stack.Screen name="request-money" />
      <Stack.Screen name="budget-details" />
      <Stack.Screen name="transaction-history" />
      <Stack.Screen name="transaction-details" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="add-card" />
      <Stack.Screen name="card-details" />
      <Stack.Screen name="card-settings" />
      <Stack.Screen name="add-money" />
      <Stack.Screen name="card-menu" />
    </Stack>
  );
}