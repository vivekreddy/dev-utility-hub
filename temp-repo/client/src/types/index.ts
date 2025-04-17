// Tool object interface with icons and colors
export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  path: string;
  icon: string;
  color: string;
}

export type ToolCategory = 
  | 'All Tools'
  | 'Formatters'
  | 'Encoders/Decoders'
  | 'Converters'
  | 'Generators'
  | 'Text Utilities'
  | 'Image Tools'
  | 'Network'
  | 'Crypto'
  | 'Data Tools';

// For the clipboard operations
export interface ClipboardStatus {
  success: boolean;
  message: string;
}

// Tool specific interfaces
export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface FormatterOptions {
  indentSize: number;
  useTabs: boolean;
}

export interface Base64Options {
  urlSafe: boolean;
  includePrefix: boolean;
}

export interface HashOptions {
  algorithm: 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
}

export interface ColorFormat {
  hex: string;
  rgb: string;
  hsl: string;
}

export interface LoremIpsumOptions {
  type: 'words' | 'sentences' | 'paragraphs';
  count: number;
  includeHtml: boolean;
}
