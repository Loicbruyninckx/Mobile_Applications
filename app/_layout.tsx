import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk/500Medium';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk/700Bold';
import { useAuthStore } from '../src/state/useAuthStore';

export default function RootLayout() {
  const init = useAuthStore((state) => state.init);

  useFonts({ Inter_400Regular, Inter_500Medium, Inter_700Bold, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold });

  useEffect(() => {
    init();
  }, [init]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Slot />
    </SafeAreaProvider>
  );
}
