import { Image, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { Icon, type IconName } from './primitives/Icon';

interface PhotoBoxProps {
  /** URL van de foto. Leeg = grijs vlak met een icoon. */
  uri?: string;
  /** Icoon als er geen foto is. */
  placeholderIcon?: IconName;
  /** Breedte/hoogte, bv. 1 = vierkant, 4 / 3 = liggend. */
  aspectRatio?: number;
  /** Vaste breedte; zonder breedte vult hij de beschikbare ruimte. */
  size?: number;
  children?: React.ReactNode;
}

/** Een foto met afgeronde hoeken, of een placeholder zoals in de wireframes. Extra inhoud (bv. een score) ligt erbovenop. */
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
