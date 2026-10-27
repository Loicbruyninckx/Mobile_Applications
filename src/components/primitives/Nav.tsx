import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface NavProps {
  children: React.ReactNode;
  /** Extra ruimte onderaan, bv. voor de home-balk van een iPhone. */
  bottomInset?: number;
  testID?: string;
}

export function Nav({ children, bottomInset = 0, testID }: NavProps) {
  return (
    <View
      style={[styles.base, { paddingBottom: bottomInset + 6 }]}
      role="tablist"
      testID={testID}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 6,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
