import { Image, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { Icon, type IconName } from './primitives/Icon';

interface PhotoBoxProps {
  uri?: string;
  placeholderIcon?: IconName;
  aspectRatio?: number;
  size?: number;
  children?: React.ReactNode;
}

export function PhotoBox({ uri, placeholderIcon = 'image-outline', aspectRatio = 1, size, children }: PhotoBoxProps) {
  const sizeStyle: ViewStyle = size !== undefined ? { width: size, height: size } : { width: '100%', aspectRatio };

  return (
    <View style={[styles.base, sizeStyle]}>
      {uri !== undefined ? (
        <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <Icon name={placeholderIcon} size={28} color={colors.textMuted} />
      )}
      {children !== undefined && <View style={styles.overlay}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: { ...StyleSheet.absoluteFillObject, padding: 10 },
});
