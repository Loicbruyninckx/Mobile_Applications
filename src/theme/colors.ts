/** Kleuren uit de stijlgids (zie CLAUDE.md → Design). Gebruik deze in plaats van losse hexcodes. */
export const colors = {
  /** Achtergrond van elk scherm. */
  background: '#0B0B0B',
  /** Kaarten, invoervelden en knoppen zonder kleur. */
  surface: '#1A1A1A',
  /** Iets lichter vlak bovenop een kaart, bv. een thumbnail of de #1-kaart. */
  surfaceRaised: '#262626',
  text: '#F5F5F0',
  textSecondary: '#9A9A9A',
  /** Voor wat bijna wegvalt, bv. rangnummers 2, 3, 4… */
  textMuted: '#5E5E5E',
  border: '#2E2E2E',
  /** Limegroen: hoofdknoppen, actieve tab, scores. Altijd met donkere tekst (onAccent). */
  accent: '#DAFF3E',
  onAccent: '#0B0B0B',
  error: '#FF6B6B',
  success: '#DAFF3E',
};

/** Lettertypes (geladen in app/_layout.tsx). Display = titels, body = gewone tekst. */
export const fonts = {
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodyBold: 'Inter_700Bold',
  display: 'SpaceGrotesk_700Bold',
  displayMedium: 'SpaceGrotesk_500Medium',
};
