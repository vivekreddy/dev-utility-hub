import { Tool, ToolCategory } from '@/types';

// Helper function to create a tool with type safety
const createTool = (
  id: string,
  name: string,
  description: string,
  category: ToolCategory,
  path: string,
  icon: string,
  color: string
): Tool => ({
  id,
  name,
  description,
  category,
  path,
  icon,
  color
});

// Tool definitions
export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format and validate JSON data with syntax highlighting',
    category: 'Formatters',
    path: '/tools/json-formatter',
    icon: 'ri-braces-line',
    color: 'blue'
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Convert text to and from Base64 encoding',
    category: 'Encoders/Decoders',
    path: '/tools/base64',
    icon: 'ri-code-box-line',
    color: 'purple'
  },
  {
    id: 'base64-image',
    name: 'Base64 Image Encoder',
    description: 'Convert images to and from Base64 encoding',
    category: 'Image Tools',
    path: '/tools/base64-image',
    icon: 'ri-image-line',
    color: 'emerald'
  },
  {
    id: 'jwt-decoder-tool',
    name: 'JWT Decoder',
    description: 'Decode and verify JSON Web Tokens',
    category: 'Crypto',
    path: '/tools/jwt-decoder',
    icon: 'ri-key-line',
    color: 'blue'
  },
  {
    id: 'regex-tester-tool',
    name: 'Regex Tester',
    description: 'Test regular expressions with live matches',
    category: 'Text Utilities',
    path: '/tools/regex-tester', 
    icon: 'ri-brackets-line',
    color: 'red'
  },
  {
    id: 'cron-parser-tool',
    name: 'Cron Expression Parser',
    description: 'Parse cron expressions into human-readable format',
    category: 'Text Utilities',
    path: '/tools/cron-parser',
    icon: 'ri-time-line',
    color: 'indigo'
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs for web applications',
    category: 'Encoders/Decoders',
    path: '/tools/url-encoder',
    icon: 'ri-link',
    color: 'green'
  },
  {
    id: 'code-formatter',
    name: 'Code Formatter',
    description: 'Format HTML, CSS, and JavaScript code',
    category: 'Formatters',
    path: '/tools/code-formatter',
    icon: 'ri-code-s-slash-line',
    color: 'orange'
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors and convert between formats',
    category: 'Converters',
    path: '/tools/color-picker',
    icon: 'ri-palette-line',
    color: 'pink'
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Write and preview Markdown in real-time',
    category: 'Formatters',
    path: '/tools/markdown-preview',
    icon: 'ri-markdown-line',
    color: 'blue'
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    description: 'Convert CSV data to JSON format',
    category: 'Converters',
    path: '/tools/csv-to-json',
    icon: 'ri-file-transfer-line',
    color: 'yellow'
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random UUIDs for your applications',
    category: 'Generators',
    path: '/tools/uuid-generator',
    icon: 'ri-key-2-line',
    color: 'indigo'
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for design mockups',
    category: 'Generators',
    path: '/tools/lorem-ipsum',
    icon: 'ri-text',
    color: 'red'
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256 hashes',
    category: 'Crypto',
    path: '/tools/hash-generator',
    icon: 'ri-fingerprint-line',
    color: 'emerald'
  },
  // Add more tools as they're implemented
];

// Function to get all tools
export function getAllTools(): Tool[] {
  return tools;
}

// Get tools by category
export function getToolsByCategory(category: string): Tool[] {
  if (category === 'All Tools') {
    return tools;
  }
  return tools.filter(tool => tool.category === category);
}

// Get a specific tool by ID
export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

// Search tools by query
export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return tools.filter(
    tool => 
      tool.name.toLowerCase().includes(lowerQuery) || 
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery)
  );
}
