import { ValidationResult, FormatterOptions } from '@/types';

/**
 * Validates and parses a JSON string
 * @param jsonString The JSON string to validate
 * @returns ValidationResult with status and message
 */
export function validateJson(jsonString: string): ValidationResult {
  try {
    if (!jsonString.trim()) {
      return { isValid: false, message: 'JSON is empty' };
    }
    
    JSON.parse(jsonString);
    return { isValid: true, message: 'JSON is valid' };
  } catch (error) {
    return { 
      isValid: false, 
      message: error instanceof SyntaxError ? error.message : 'Invalid JSON'
    };
  }
}

/**
 * Formats a JSON string with proper indentation
 * @param jsonString The JSON string to format
 * @param spaces Number of spaces for indentation
 * @returns Formatted JSON string
 */
export function formatJson(jsonString: string, spaces: number = 2): string {
  try {
    const parsedJson = JSON.parse(jsonString);
    return JSON.stringify(parsedJson, null, spaces);
  } catch (error) {
    // Return original string if parsing fails
    return jsonString;
  }
}

/**
 * Minifies a JSON string by removing all whitespace
 * @param jsonString The JSON string to minify
 * @returns Minified JSON string
 */
export function minifyJson(jsonString: string): string {
  try {
    const parsedJson = JSON.parse(jsonString);
    return JSON.stringify(parsedJson);
  } catch (error) {
    // Return original string if parsing fails
    return jsonString;
  }
}

/**
 * Formats HTML code
 * @param htmlString The HTML string to format
 * @param options Formatting options
 * @returns Formatted HTML string
 */
export function formatHtml(htmlString: string, options: FormatterOptions): string {
  // In a real implementation, would use a proper HTML formatter
  // This is a simplified version for the MVP
  try {
    // Basic formatting: add new lines after specific tags
    const formatted = htmlString
      .replace(/></g, '>\n<')
      .replace(/<\/div>/g, '</div>\n')
      .replace(/<\/p>/g, '</p>\n')
      .replace(/<\/li>/g, '</li>\n')
      .replace(/<\/h[1-6]>/g, '$&\n');
    
    // Handle indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indent = options.useTabs ? '\t' : ' '.repeat(options.indentSize);
    
    return lines.map(line => {
      // Reduce indent for closing tags
      if (line.match(/<\/[^>]+>/)) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = indent.repeat(indentLevel) + line;
      
      // Increase indent for opening tags (except self-closing)
      if (line.match(/<[^\/][^>]*[^\/]>/) && !line.match(/<[^>]+\/>/)) {
        indentLevel++;
      }
      
      return indentedLine;
    }).join('\n');
  } catch (error) {
    return htmlString; // Return original if formatting fails
  }
}

/**
 * Formats CSS code
 * @param cssString The CSS string to format
 * @param options Formatting options
 * @returns Formatted CSS string
 */
export function formatCss(cssString: string, options: FormatterOptions): string {
  // In a real implementation, would use a proper CSS formatter
  // This is a simplified version for the MVP
  try {
    // Remove all whitespace first
    let formatted = cssString.replace(/\s+/g, ' ');
    
    // Add new lines for better readability
    formatted = formatted
      .replace(/\{/g, ' {\n')
      .replace(/}/g, '}\n')
      .replace(/;/g, ';\n')
      .replace(/:\s/g, ': ')
      .replace(/\s\s+/g, ' ');
    
    // Handle indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indent = options.useTabs ? '\t' : ' '.repeat(options.indentSize);
    
    return lines.map(line => {
      if (line.includes('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = line !== '' ? indent.repeat(indentLevel) + line.trim() : '';
      
      if (line.includes('{')) {
        indentLevel++;
      }
      
      return indentedLine;
    }).join('\n');
  } catch (error) {
    return cssString; // Return original if formatting fails
  }
}

/**
 * Formats JavaScript code
 * @param jsString The JavaScript string to format
 * @param options Formatting options
 * @returns Formatted JavaScript string
 */
export function formatJavaScript(jsString: string, options: FormatterOptions): string {
  // In a real implementation, would use a proper JS formatter like prettier
  // This is a simplified version for the MVP
  try {
    // Basic formatting: add new lines after specific characters
    let formatted = jsString
      .replace(/;/g, ';\n')
      .replace(/{/g, '{\n')
      .replace(/}/g, '}\n')
      .replace(/,\s*/g, ',\n')
      .replace(/\)\s*{/g, ') {');
    
    // Handle indentation
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indent = options.useTabs ? '\t' : ' '.repeat(options.indentSize);
    
    return lines.map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine === '}') {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      const indentedLine = trimmedLine !== '' ? indent.repeat(indentLevel) + trimmedLine : '';
      
      if (trimmedLine.endsWith('{')) {
        indentLevel++;
      }
      
      return indentedLine;
    }).join('\n');
  } catch (error) {
    return jsString; // Return original if formatting fails
  }
}
