import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import type { IconName } from './primitives/Icon';
import { Text } from './primitives/Text';
import { BackButton } from './BackButton';

interface ScreenHeaderProps {
  title: string;
  onButtonPress: () => void;
  /** Wat schermlezers voorlezen voor de knop, bv. "Sluiten". */
  buttonLabel: string;
  /** Standaard een kruisje. */
  buttonIcon?: IconName;
  testID?: string;
}

/** Kop met een ronde knop links en een kleine titel precies in het midden. */
export function ScreenHeader({ title, onButtonPress, buttonLabel, buttonIcon = 'close', testID }: ScreenHeaderProps) {
  return (
    <View style={styles.base}>
      {/* De titel staat over de hele breedte, zodat hij gecentreerd is ongeacht de knop. */}
      <View style={styles.title}>
        <Text color={colors.textSecondary} weight="medium" align="center">{title}</Text>
      </View>
      <BackButton onPress={onButtonPress} label={buttonLabel} icon={buttonIcon} testID={testID} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 48, flexDirection: 'row', alignItems: 'center' },
  title: { position: 'absolute', left: 56, right: 56, alignItems: 'center', pointerEvents: 'none' },
});
