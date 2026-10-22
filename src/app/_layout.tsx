import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#071521',
        },
        headerTintColor: '#F7FBFC',
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#071521',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="deliveries/[id]"
        options={{
          title: 'Delivery',
        }}
      />
    </Stack>
  );
}
