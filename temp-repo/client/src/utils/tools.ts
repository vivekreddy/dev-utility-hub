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
  // Additional tools to reach 100
  {
    id: 'html-entity-encoder',
    name: 'HTML Entity Encoder',
    description: 'Convert characters to HTML entities and vice versa',
    category: 'Encoders/Decoders' as const,
    path: '#',
    icon: 'ri-html5-line',
    color: 'orange'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and verify JSON Web Tokens',
    category: 'Crypto' as const,
    path: '#',
    icon: 'ri-lock-2-line',
    color: 'indigo'
  },
  {
    id: 'diff-checker',
    name: 'Text Diff Checker',
    description: 'Compare text files and find differences',
    category: 'Text Utilities' as const,
    path: '#',
    icon: 'ri-git-branch-line',
    color: 'blue'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions with live matches',
    category: 'Text Utilities' as const,
    path: '#',
    icon: 'ri-regex-line',
    color: 'purple'
  },
  {
    id: 'cron-parser',
    name: 'Cron Expression Parser',
    description: 'Parse and explain cron expressions',
    category: 'Text Utilities' as const,
    path: '#',
    icon: 'ri-time-line',
    color: 'teal'
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format SQL queries for readability',
    category: 'Formatters' as const,
    path: '#',
    icon: 'ri-database-2-line',
    color: 'cyan'
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images for the web',
    category: 'Image Tools' as const,
    path: '#',
    icon: 'ri-image-line',
    color: 'green'
  },
  {
    id: 'svg-optimizer',
    name: 'SVG Optimizer',
    description: 'Optimize SVG files for web use',
    category: 'Image Tools' as const,
    path: '#',
    icon: 'ri-shape-line',
    color: 'yellow'
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64',
    description: 'Convert images to Base64 strings',
    category: 'Image Tools' as const,
    path: '#',
    icon: 'ri-file-transfer-line',
    color: 'pink'
  },
  {
    id: 'css-minifier',
    name: 'CSS Minifier',
    description: 'Minify CSS code to reduce file size',
    category: 'Formatters' as const,
    path: '#',
    icon: 'ri-css3-line',
    color: 'blue'
  },
  // Continue with more tools (adding up to 90 more beyond the first 10)
  ...[
    {
      id: 'js-minifier',
      name: 'JavaScript Minifier',
      description: 'Minify JavaScript code',
      category: 'Formatters' as const, 
      path: '#',
      icon: 'ri-javascript-line',
      color: 'yellow'
    },
    {
      id: 'json-to-csv',
      name: 'JSON to CSV',
      description: 'Convert JSON to CSV format',
      category: 'Converters' as const,
      path: '#',
      icon: 'ri-file-transfer-line',
      color: 'green'
    },
    {
      id: 'json-to-yaml',
      name: 'JSON to YAML',
      description: 'Convert between JSON and YAML formats',
      category: 'Converters' as const,
      path: '#',
      icon: 'ri-file-transfer-line',
      color: 'blue'
    },
    {
      id: 'timestamp-converter',
      name: 'Timestamp Converter',
      description: 'Convert between timestamp formats',
      category: 'Converters' as const,
      path: '#',
      icon: 'ri-time-line',
      color: 'indigo'
    },
    {
      id: 'unit-converter',
      name: 'Unit Converter',
      description: 'Convert between different units of measurement',
      category: 'Converters' as const,
      path: '#',
      icon: 'ri-scales-line',
      color: 'orange'
    },
    {
      id: 'color-converter',
      name: 'Color Converter',
      description: 'Convert between color formats (HEX, RGB, HSL)',
      category: 'Converters' as const,
      path: '#',
      icon: 'ri-palette-line',
      color: 'purple'
    },
    {
      id: 'password-generator',
      name: 'Password Generator',
      description: 'Generate secure passwords',
      category: 'Generators' as const,
      path: '#',
      icon: 'ri-lock-password-line',
      color: 'red'
    },
    {
      id: 'qr-code-generator',
      name: 'QR Code Generator',
      description: 'Create QR codes for text or URLs',
      category: 'Generators' as const,
      path: '#',
      icon: 'ri-qr-code-line',
      color: 'black'
    },
    {
      id: 'case-converter',
      name: 'Case Converter',
      description: 'Convert text case (uppercase, lowercase, title case)',
      category: 'Text Utilities' as const,
      path: '#',
      icon: 'ri-text',
      color: 'blue'
    },
    {
      id: 'string-escape-unescape',
      name: 'String Escape/Unescape',
      description: 'Escape or unescape strings for various languages',
      category: 'Text Utilities' as const,
      path: '#',
      icon: 'ri-double-quotes-l',
      color: 'purple'
    },
    {
      id: 'word-counter',
      name: 'Word Counter',
      description: 'Count words, characters, and lines in text',
      category: 'Text Utilities' as const,
      path: '#',
      icon: 'ri-counter-2-line',
      color: 'blue'
    },
    {
      id: 'url-parser',
      name: 'URL Parser',
      description: 'Parse and analyze URL components',
      category: 'Network' as const,
      path: '#',
      icon: 'ri-links-line',
      color: 'green'
    },
    {
      id: 'user-agent-parser',
      name: 'User Agent Parser',
      description: 'Parse and analyze browser User-Agent strings',
      category: 'Network' as const,
      path: '#',
      icon: 'ri-spy-line',
      color: 'blue'
    },
    {
      id: 'http-status-codes',
      name: 'HTTP Status Codes',
      description: 'Reference for HTTP status codes and messages',
      category: 'Network' as const,
      path: '#',
      icon: 'ri-error-warning-line',
      color: 'orange'
    },
    {
      id: 'mime-types',
      name: 'MIME Types Lookup',
      description: 'Find MIME types for file extensions',
      category: 'Network' as const,
      path: '#',
      icon: 'ri-file-list-line',
      color: 'blue'
    },
    {
      id: 'ip-formatter',
      name: 'IP Address Formatter',
      description: 'Format and validate IP addresses',
      category: 'Network' as const,
      path: '#',
      icon: 'ri-router-line',
      color: 'teal'
    },
    {
      id: 'crontab-generator',
      name: 'Crontab Generator',
      description: 'Generate crontab expressions',
      category: 'Generators' as const,
      path: '#',
      icon: 'ri-calendar-event-line',
      color: 'indigo'
    },
    {
      id: 'csr-decoder',
      name: 'CSR Decoder',
      description: 'Decode certificate signing requests',
      category: 'Crypto' as const,
      path: '#',
      icon: 'ri-shield-keyhole-line',
      color: 'green'
    },
    {
      id: 'ssl-checker',
      name: 'SSL Certificate Checker',
      description: 'Verify SSL certificates',
      category: 'Crypto' as const,
      path: '#',
      icon: 'ri-lock-line',
      color: 'green'
    }
  ],
  // Generate the remaining tools to reach 100
  ...Array.from({ length: 69 }, (_, i) => ({
    id: `tool-${i + 31}`,
    name: `Tool ${i + 31}`,
    description: 'Coming soon',
    category: 'Coming Soon' as const,
    path: '#',
    icon: 'ri-tools-line',
    color: 'gray'
  }))
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
