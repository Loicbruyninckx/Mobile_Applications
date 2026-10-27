import { Text as RNText, StyleSheet } from 'react-native';
import { colors, fonts } from '../../theme/colors';

type TextSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type TextWeight = 'normal' | 'medium' | 'bold';

interface TextProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  /** display = titellettertype (Space Grotesk). Standaard voor xl en xxl. */
  font?: 'body' | 'display';
  color?: string;
  align?: 'left' | 'center' | 'right';
  underline?: boolean;
  numberOfLines?: number;
  testID?: string;
}

/**
 * Elk gewicht is een apart lettertypebestand. We zetten dus alleen fontFamily en geen
 * fontWeight: op Android valt een eigen lettertype met fontWeight terug op het systeemlettertype.
 */
function fontFamily(font: 'body' | 'display', weight: TextWeight): string {
  if (font === 'display') return weight === 'bold' ? fonts.display : fonts.displayMedium;
  if (weight === 'bold') return fonts.bodyBold;
  if (weight === 'medium') return fonts.bodyMedium;
  return fonts.body;
}

export function Text({
  children,
  size = 'md',
  weight = 'normal',
  font,
  color,
  align = 'left',
  underline = false,
  numberOfLines,
  testID,
}: TextProps) {
  const family = font ?? (size === 'xl' || size === 'xxl' ? 'display' : 'body');

  return (
    <RNText
      style={[
        styles.base,
        styles[size],
        { fontFamily: fontFamily(family, weight), textAlign: align },
        underline && styles.underline,
        color !== undefined && { color },
      ]}
      numberOfLines={numberOfLines}
      testID={testID}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  },
  sm: { fontSize: 13, lineHeight: 18 },
  md: { fontSize: 15, lineHeight: 22 },
  lg: { fontSize: 18, lineHeight: 24 },
  xl: { fontSize: 30, lineHeight: 36, letterSpacing: -0.5 },
  xxl: { fontSize: 42, lineHeight: 46, letterSpacing: -1 },
  underline: { textDecorationLine: 'underline' },
});
