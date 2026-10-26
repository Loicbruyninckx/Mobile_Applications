import { Pressable, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  /** Donkere rand, bv. voor een gekozen item. */
  highlighted?: boolean;
  testID?: string;
}

export function Card({ children, onPress, highlighted = false, testID }: CardProps) {
  const style = [styles.base, highlighted && styles.highlighted];

  if (onPress !== undefined) {
    return (
      <Pressable onPress={onPress} style={style} testID={testID} accessibilityRole="button">
        {children}
      </Pressable>
    );
  }

  return (
    <View style={style} testID={testID}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
  },
  highlighted: { borderColor: colors.primary },
});
