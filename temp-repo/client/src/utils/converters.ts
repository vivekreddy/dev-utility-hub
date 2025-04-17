/**
 * Converts CSV to JSON
 * @param csv The CSV string to convert
 * @param useHeaderRow Whether to use the first row as headers
 * @param parseNumbers Whether to parse numeric values
 * @param parseBooleans Whether to parse boolean values
 * @returns An array of objects representing the CSV data
 */
export function csvToJson(
  csv: string,
  useHeaderRow: boolean = true,
  parseNumbers: boolean = true,
  parseBooleans: boolean = true
): any[] {
  // Split into rows and filter empty rows
  const rows = csv.split(/\r?\n/).filter(row => row.trim() !== '');
  if (!rows.length) return [];
  
  // Parse headers
  const headers = useHeaderRow 
    ? rows[0].split(',').map(header => header.trim())
    : Array.from({ length: rows[0].split(',').length }, (_, i) => `column${i + 1}`);
  
  // Parse data rows
  const jsonArray = [];
  const startRow = useHeaderRow ? 1 : 0;
  
  for (let i = startRow; i < rows.length; i++) {
    const values = rows[i].split(',').map(val => val.trim());
    const jsonObject: Record<string, any> = {};
    
    for (let j = 0; j < headers.length; j++) {
      let value = j < values.length ? values[j] : '';
      
      // Parse values based on options
      if (parseNumbers && !isNaN(Number(value)) && value !== '') {
        value = Number(value);
      } else if (parseBooleans && ['true', 'false'].includes(value.toLowerCase())) {
        value = value.toLowerCase() === 'true';
      }
      
      jsonObject[headers[j]] = value;
    }
    
    jsonArray.push(jsonObject);
  }
  
  return jsonArray;
}

/**
 * Converts JSON to CSV
 * @param json The JSON array to convert
 * @param includeHeaders Whether to include headers in the output
 * @returns A CSV string representing the JSON data
 */
export function jsonToCsv(
  json: any[],
  includeHeaders: boolean = true
): string {
  if (!json || !json.length) return '';
  
  // Extract headers from the first object
  const headers = Object.keys(json[0]);
  
  // Create CSV rows
  const csvRows = [];
  
  // Add header row if requested
  if (includeHeaders) {
    csvRows.push(headers.join(','));
  }
  
  // Add data rows
  for (const row of json) {
    const values = headers.map(header => {
      const value = row[header];
      
      // Format value for CSV
      if (value === null || value === undefined) {
        return '';
      } else if (typeof value === 'string') {
        // Escape quotes and wrap in quotes if contains comma
        const escaped = value.replace(/"/g, '""');
        return value.includes(',') ? `"${escaped}"` : escaped;
      } else {
        return String(value);
      }
    });
    
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

/**
 * Converts RGB color to hexadecimal format
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns Hex color string (e.g., "#ff0000")
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map(x => Math.max(0, Math.min(255, Math.round(x)))
    .toString(16)
    .padStart(2, '0'))
    .join('')}`;
}

/**
 * Converts hexadecimal color to RGB format
 * @param hex Hex color string (e.g., "#ff0000")
 * @returns RGB object with r, g, b components
 */
export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex value
  const bigint = parseInt(hex, 16);
  
  // Check if the hex value is valid
  if (isNaN(bigint)) return null;
  
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

/**
 * Converts RGB color to HSL format
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns HSL object with h, s, l components
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number, s: number, l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
    
    switch (max) {
      case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
      case g: h = (b - r) / diff + 2; break;
      case b: h = (r - g) / diff + 4; break;
    }
    
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}
