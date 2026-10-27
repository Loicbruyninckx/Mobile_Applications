import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

const SPACING = { none: 0, sm: 8, md: 16, lg: 24 };

export function Divider({ orientation = 'horizontal', spacing = 'none' }: DividerProps) {
  const isHorizontal = orientation === 'horizontal';
  // Ruimte boven en onder (horizontaal) of links en rechts (verticaal) van de lijn.
  const margin = isHorizontal ? { marginVertical: SPACING[spacing] } : { marginHorizontal: SPACING[spacing] };

  return <View style={[styles.base, isHorizontal ? styles.horizontal : styles.vertical, margin]} />;
}

const styles = StyleSheet.create({
  base: { backgroundColor: colors.border },
  horizontal: { height: 1, width: '100%' },
  vertical: { width: 1, height: '100%' },
});
