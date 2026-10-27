import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { Icon } from './primitives/Icon';
import { BackButton } from './BackButton';

interface GroupBannerProps {
  onBack: () => void;
  backTestID?: string;
}

/**
 * Grote banner bovenaan het groepsdetail, met de terugknop erin.
 * Later (native app) komt hier de groepsfoto.
 */
export function GroupBanner({ onBack, backTestID }: GroupBannerProps) {
  return (
    <View style={styles.banner}>
      <Icon name="people-outline" size={56} color={colors.textMuted} />
      <View style={styles.back}>
        <BackButton onPress={onBack} testID={backTestID} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 170,
    borderRadius: 28,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: { position: 'absolute', top: 14, left: 14 },
});
