import { ScrollView, View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface ScreenProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  scrollable?: boolean;
}

export function Screen({ children, padding = 'md', scrollable = true }: ScreenProps) {
  if (!scrollable) {
    return (
      <View style={[styles.container, styles[padding]]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, styles[padding]]}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1 },
  none: {},
  sm: { padding: 8 },
  md: { padding: 16 },
  lg: { padding: 20 },
});
