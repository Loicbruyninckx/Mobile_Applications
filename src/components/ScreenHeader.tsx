import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import type { IconName } from './primitives/Icon';
import { Text } from './primitives/Text';
import { BackButton } from './BackButton';

interface ScreenHeaderProps {
  title: string;
  onButtonPress: () => void;
  buttonLabel: string;
  buttonIcon?: IconName;
  testID?: string;
}

export function ScreenHeader({ title, onButtonPress, buttonLabel, buttonIcon = 'close', testID }: ScreenHeaderProps) {
  return (
    <View style={styles.base}>
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
