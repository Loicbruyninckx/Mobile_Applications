import { View, Image, StyleSheet } from 'react-native';
import { Text } from './Text';
import { colors } from '../../theme/colors';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
}

export function Avatar({ uri, name, size = 'md', ring = false }: AvatarProps) {
  const initials = name
    ? name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (uri !== undefined) {
    return <Image source={{ uri }} style={[styles.base, styles[size], ring && styles.ring]} />;
  }

  return (
    <View style={[styles.base, styles[size], styles.fallback, ring && styles.ring]}>
      <Text size={size === 'xl' ? 'xl' : 'md'} weight="bold" font="display" color={colors.textSecondary}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 999, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  fallback: { backgroundColor: colors.surfaceRaised },
  ring: { borderWidth: 3, borderColor: colors.accent },
  sm: { width: 32, height: 32 },
  md: { width: 44, height: 44 },
  lg: { width: 56, height: 56 },
  xl: { width: 112, height: 112 },
});
