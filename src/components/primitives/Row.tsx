import { ScrollView, View, StyleSheet } from 'react-native';

interface RowProps {
  children: React.ReactNode;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between';
  wrap?: boolean;
  scroll?: boolean;
}

export function Row({
  children,
  gap = 'none',
  align = 'center',
  justify = 'flex-start',
  wrap = false,
  scroll = false,
}: RowProps) {
  const style = [
    styles.base,
    styles[`gap_${gap}` as keyof typeof styles],
    { alignItems: align, justifyContent: justify },
    wrap && styles.wrap,
  ];

  if (scroll) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={style}>
        {children}
      </ScrollView>
    );
  }

  return <View style={style}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row' },
  wrap: { flexWrap: 'wrap' },
  gap_none: {},
  gap_sm: { gap: 8 },
  gap_md: { gap: 16 },
  gap_lg: { gap: 24 },
});
