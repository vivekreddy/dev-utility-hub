import { ClipboardStatus } from '@/types';

/**
 * Copy text to clipboard using the Clipboard API
 * @param text The text to copy
 * @returns Promise resolving to a status object
 */
export async function copyToClipboard(text: string): Promise<ClipboardStatus> {
  try {
    await navigator.clipboard.writeText(text);
    return {
      success: true,
      message: 'Text copied to clipboard'
    };
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Read text from clipboard
 * @returns Promise resolving to clipboard text or null if failed
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('Failed to read from clipboard:', error);
    return null;
  }
}
