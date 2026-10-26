import * as Clipboard from 'expo-clipboard';
/**
/** Kopieert tekst naar het klembord. Geeft false als dat niet lukt (bv. geen toestemming in de browser). */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    return await Clipboard.setStringAsync(text);
  } catch {
    return false;
  }
}
