import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Per gewicht importeren: zo komen alleen deze 5 bestanden in de app (en in de offline-cache).
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { SpaceGrotesk_500Medium } from '@expo-google-fonts/space-grotesk/500Medium';
import { SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk/700Bold';
import { useAuthStore } from '../src/state/useAuthStore';

export default function RootLayout() {
  const init = useAuthStore((state) => state.init);

  // De namen hier moeten overeenkomen met `fonts` in src/theme/colors.ts.
  // We wachten niet op het laden: tot dan toont de browser een standaardlettertype.
  useFonts({ Inter_400Regular, Inter_500Medium, Inter_700Bold, SpaceGrotesk_500Medium, SpaceGrotesk_700Bold });

  // Bij het opstarten: bewaarde Supabase-sessie herstellen.
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
