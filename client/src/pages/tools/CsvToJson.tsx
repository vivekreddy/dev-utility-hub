import { useState, useEffect } from 'react';
import ToolLayout from '@/layouts/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getToolById } from '@/utils/tools';
import { copyToClipboard } from '@/utils/clipboard';
import { useToast } from '@/hooks/use-toast';

export default function CsvToJson() {
  const [csvInput, setCsvInput] = useState<string>('id,name,email,active\n1,John Doe,john@example.com,true\n2,Jane Smith,jane@example.com,false\n3,Bob Johnson,bob@example.com,true');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [useFirstRowAsHeaders, setUseFirstRowAsHeaders] = useState<boolean>(true);
  const [parseNumbers, setParseNumbers] = useState<boolean>(true);
  const [parseBooleans, setParseBooleans] = useState<boolean>(true);
  const { toast } = useToast();
  
  const tool = getToolById('csv-to-json')!;

  useEffect(() => {
    if (!csvInput.trim()) {
      setJsonOutput('');
      return;
    }
    
    try {
      const jsonData = csvToJson(csvInput, useFirstRowAsHeaders, parseNumbers, parseBooleans);
      setJsonOutput(JSON.stringify(jsonData, null, 2));
    } catch (error) {
      setJsonOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [csvInput, useFirstRowAsHeaders, parseNumbers, parseBooleans]);

  const csvToJson = (
    csv: string, 
    useHeaders: boolean = true, 
    parseNums: boolean = true, 
    parseBools: boolean = true
  ): any[] => {
    // Split CSV into rows
    const rows = csv.split(/\r?\n/).filter(row => row.trim() !== '');
    if (!rows.length) return [];
    
    // Parse headers (if applicable)
    const headers = useHeaders 
      ? rows[0].split(',').map(header => header.trim())
      : Array.from({ length: rows[0].split(',').length }, (_, i) => `column${i + 1}`);
    
    // Parse data rows
    const jsonArray = [];
    const startRow = useHeaders ? 1 : 0;
    
    for (let i = startRow; i < rows.length; i++) {
      const values = rows[i].split(',').map(val => val.trim());
      const jsonObject: Record<string, any> = {};
      
      for (let j = 0; j < headers.length; j++) {
        let value = values[j] || '';
        
        // Parse values based on options
        if (parseNums && !isNaN(Number(value)) && value !== '') {
          value = Number(value);
        } else if (parseBools && ['true', 'false'].includes(value.toLowerCase())) {
          value = value.toLowerCase() === 'true';
        }
        
        jsonObject[headers[j]] = value;
      }
      
      jsonArray.push(jsonObject);
    }
    
    return jsonArray;
  };

  const handleCopy = () => {
    copyToClipboard(jsonOutput)
      .then(() => {
        toast({
          title: "Copied!",
          description: "JSON copied to clipboard",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy to clipboard",
          variant: "destructive",
        });
      });
  };

  const handleClear = () => {
    setCsvInput('');
  };

  const handleSample = () => {
    setCsvInput('id,name,email,active\n1,John Doe,john@example.com,true\n2,Jane Smith,jane@example.com,false\n3,Bob Johnson,bob@example.com,true');
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Input CSV</h3>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={handleSample}>
                  Sample
                </Button>
                <Button variant="secondary" size="sm" onClick={handleClear}>
                  Clear
                </Button>
                <Button variant="secondary" size="sm" onClick={() => {
                  navigator.clipboard.readText().then(text => setCsvInput(text));
                }}>
                  Paste
                </Button>
              </div>
            </div>
            <div className="relative h-96">
              <textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                className="w-full h-full resize-none bg-neutral rounded-lg font-mono text-sm p-4 focus:outline-none focus:ring-1 focus:ring-primary overflow-auto"
                placeholder="Paste your CSV here..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">JSON Output</h3>
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                <svg
                  className="h-4 w-4 mr-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
                Copy
              </Button>
            </div>
            <div className="h-96 bg-neutral rounded-lg p-4 font-mono text-sm overflow-auto">
              <pre className="whitespace-pre-wrap">{jsonOutput}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Options */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="use-headers" 
                checked={useFirstRowAsHeaders} 
                onCheckedChange={setUseFirstRowAsHeaders}
              />
              <Label htmlFor="use-headers">Use first row as headers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="parse-numbers" 
                checked={parseNumbers} 
                onCheckedChange={setParseNumbers}
              />
              <Label htmlFor="parse-numbers">Parse numbers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="parse-booleans" 
                checked={parseBooleans} 
                onCheckedChange={setParseBooleans}
              />
              <Label htmlFor="parse-booleans">Parse booleans</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tool Info Section */}
      <div className="mt-8 bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">About CSV to JSON Converter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Instructions</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Paste your CSV data in the input panel</li>
              <li>Adjust conversion options as needed</li>
              <li>View the JSON output in the right panel</li>
              <li>Copy the converted JSON using the copy button</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Features</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Use first row as headers or generate column names</li>
              <li>Automatically detect and parse numbers</li>
              <li>Automatically detect and parse boolean values</li>
              <li>Handles empty fields</li>
              <li>One-click copy to clipboard</li>
              <li>Works offline - all processing is done in your browser</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
