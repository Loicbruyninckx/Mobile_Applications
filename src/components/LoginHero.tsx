import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Icon } from './primitives/Icon';
import { Text } from './primitives/Text';
import { StarDisplay } from './StarDisplay';

/**
 * Decoratieve kaart bovenaan het inlogscherm: toont in één oogopslag waar de app over gaat
 * (een bier, een score, een café). Schermlezers slaan hem over.
 */
export function LoginHero() {
  return (
    <View style={styles.card} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" aria-hidden>
      <Icon name="beer-outline" size={64} color={colors.textMuted} />
      <View style={styles.score}>
        <StarDisplay score={4.5} />
      </View>
      <View style={styles.cafe}>
        <Text weight="bold">@ Je stamcafé</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 220,
    borderRadius: 28,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Licht gekanteld, zoals een sticker.
  score: { position: 'absolute', top: 18, right: 18, transform: [{ rotate: '4deg' }] },
  cafe: {
    position: 'absolute',
    left: 18,
    bottom: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.background,
  },
});
