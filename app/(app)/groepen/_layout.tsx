import { Stack } from 'expo-router';
import { colors } from '../../../src/theme/colors';

/**
 * Stack binnen de Groepen-tab: lijst (index) → groepsdetail ([id]).
 * Zo blijft de tabbalk zichtbaar en werkt "terug" van detail naar lijst.
 */
export default function GroepenLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />;
}
