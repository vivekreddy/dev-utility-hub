import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for the developer tools

  // JSON formatter endpoint
  app.post('/api/format-json', (req, res) => {
    try {
      const { json, spaces } = req.body;
      if (!json) {
        return res.status(400).json({ message: 'No JSON provided' });
      }
      
      // Parse and format JSON
      const parsedJson = JSON.parse(json);
      const formattedJson = JSON.stringify(parsedJson, null, spaces || 2);
      
      res.json({ 
        formatted: formattedJson,
        valid: true
      });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Invalid JSON',
        valid: false
      });
    }
  });

  // Base64 encode/decode endpoint
  app.post('/api/base64', (req, res) => {
    try {
      const { text, mode, urlSafe } = req.body;
      if (!text) {
        return res.status(400).json({ message: 'No text provided' });
      }
      
      let result = '';
      
      if (mode === 'encode') {
        const buffer = Buffer.from(text, 'utf-8');
        result = buffer.toString('base64');
        
        if (urlSafe) {
          result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
      } else if (mode === 'decode') {
        let decodable = text;
        
        if (urlSafe) {
          decodable = decodable.replace(/-/g, '+').replace(/_/g, '/');
          // Add padding if necessary
          while (decodable.length % 4) {
            decodable += '=';
          }
        }
        
        const buffer = Buffer.from(decodable, 'base64');
        result = buffer.toString('utf-8');
      } else {
        return res.status(400).json({ message: 'Invalid mode' });
      }
      
      res.json({ result });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Processing error'
      });
    }
  });

  // URL encode/decode endpoint
  app.post('/api/url-codec', (req, res) => {
    try {
      const { url, mode, encodeAll } = req.body;
      if (!url) {
        return res.status(400).json({ message: 'No URL provided' });
      }
      
      let result = '';
      
      if (mode === 'encode') {
        result = encodeAll ? encodeURIComponent(url) : encodeURI(url);
      } else if (mode === 'decode') {
        result = decodeURIComponent(url);
      } else {
        return res.status(400).json({ message: 'Invalid mode' });
      }
      
      res.json({ result });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Processing error'
      });
    }
  });

  // UUID generator endpoint
  app.get('/api/uuid', (req, res) => {
    try {
      const { version, count = 1, uppercase = false, hyphens = true } = req.query;
      
      const uuids = [];
      const uuidCount = Math.min(parseInt(count as string) || 1, 100); // Limit to 100 UUIDs
      
      for (let i = 0; i < uuidCount; i++) {
        // Generate UUID v4
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        
        // Apply formatting
        let formattedUuid = uuid;
        if (uppercase) {
          formattedUuid = formattedUuid.toUpperCase();
        }
        if (!hyphens) {
          formattedUuid = formattedUuid.replace(/-/g, '');
        }
        
        uuids.push(formattedUuid);
      }
      
      res.json({ uuids });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Processing error'
      });
    }
  });

  // CSV to JSON converter endpoint
  app.post('/api/csv-to-json', (req, res) => {
    try {
      const { csv, useHeaders = true, parseNumbers = true, parseBooleans = true } = req.body;
      if (!csv) {
        return res.status(400).json({ message: 'No CSV provided' });
      }
      
      // Split into rows
      const rows = csv.split(/\r?\n/).filter(row => row.trim() !== '');
      if (!rows.length) {
        return res.json({ json: [] });
      }
      
      // Parse headers
      const headers = useHeaders 
        ? rows[0].split(',').map((header: string) => header.trim())
        : Array.from({ length: rows[0].split(',').length }, (_, i) => `column${i + 1}`);
      
      // Parse data rows
      const jsonArray = [];
      const startRow = useHeaders ? 1 : 0;
      
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
      
      res.json({ json: jsonArray });
    } catch (error) {
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Processing error'
      });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
