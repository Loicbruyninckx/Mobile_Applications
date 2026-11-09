import { Pressable, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'raised' | 'accent' | 'dashed';
  highlighted?: boolean;
  testID?: string;
}

export function Card({ children, onPress, variant = 'default', highlighted = false, testID }: CardProps) {
  const style = [styles.base, styles[variant], highlighted && styles.highlighted];

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
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  default: { backgroundColor: colors.surface },
  raised: { backgroundColor: colors.surfaceRaised },
  accent: { backgroundColor: colors.accent },
  dashed: { backgroundColor: 'transparent', borderColor: colors.accent, borderStyle: 'dashed' },
  highlighted: { borderColor: colors.accent },
});
