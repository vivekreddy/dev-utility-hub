import { useState, useEffect } from 'react';
import ToolLayout from '@/layouts/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getToolById } from '@/utils/tools';
import { copyToClipboard } from '@/utils/clipboard';
import { useToast } from '@/hooks/use-toast';

export default function Base64Tool() {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [includePrefix, setIncludePrefix] = useState<boolean>(false);
  const { toast } = useToast();
  
  const tool = getToolById('base64')!;

  // Process input whenever it changes or options change
  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    try {
      if (mode === 'encode') {
        // Convert string to Base64
        const base64 = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) => {
          return String.fromCharCode(parseInt(p1, 16));
        }));
        
        // Apply URL-safe transformation if needed
        let result = base64;
        if (urlSafe) {
          result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        }
        
        // Add prefix if needed
        if (includePrefix) {
          result = `data:text/plain;base64,${result}`;
        }
        
        setOutput(result);
      } else {
        // Prepare Base64 string for decoding
        let base64 = input;
        
        // Remove prefix if present
        if (base64.includes('data:')) {
          base64 = base64.split(',')[1] || base64;
        }
        
        // Restore standard Base64 if URL-safe was used
        if (urlSafe) {
          base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
          
          // Add padding if needed
          while (base64.length % 4) {
            base64 += '=';
          }
        }
        
        // Decode Base64 to string
        const decoded = decodeURIComponent(
          Array.prototype.map.call(
            atob(base64),
            c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          ).join('')
        );
        
        setOutput(decoded);
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Invalid input'}`);
    }
  }, [input, mode, urlSafe, includePrefix]);

  const handleCopy = () => {
    copyToClipboard(output)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Converted text copied to clipboard",
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
    setInput('');
    setOutput('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to paste from clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Input</h3>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={handleClear}>
                  Clear
                </Button>
                <Button variant="secondary" size="sm" onClick={handlePaste}>
                  Paste
                </Button>
              </div>
            </div>
            <div className="relative h-96">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-full resize-none bg-neutral rounded-lg font-mono text-sm p-4 focus:outline-none focus:ring-1 focus:ring-primary overflow-auto"
                placeholder={mode === 'encode' ? 'Enter text to encode as Base64...' : 'Enter Base64 to decode...'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Output</h3>
              <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!output}>
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
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Options */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'encode' | 'decode')}>
              <TabsList>
                <TabsTrigger value="encode">Encode</TabsTrigger>
                <TabsTrigger value="decode">Decode</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="url-safe" 
                checked={urlSafe} 
                onCheckedChange={setUrlSafe}
              />
              <Label htmlFor="url-safe">URL-safe encoding</Label>
            </div>
            
            {mode === 'encode' && (
              <div className="flex items-center space-x-2">
                <Switch 
                  id="include-prefix" 
                  checked={includePrefix} 
                  onCheckedChange={setIncludePrefix}
                />
                <Label htmlFor="include-prefix">Include data URL prefix</Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tool Info Section */}
      <div className="mt-8 bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">About Base64 Encoder/Decoder</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">What is Base64?</h4>
            <p className="text-gray-300">
              Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format by translating it into a radix-64 representation. 
              It's commonly used to embed binary data in text-based formats where binary values might be problematic.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Common Uses</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Embedding binary data in HTML or CSS</li>
              <li>Sending binary data in emails (MIME)</li>
              <li>Storing complex data in JSON</li>
              <li>Encoding images and other files as data URLs</li>
              <li>Transferring data in URL parameters</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-3">Features</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Standard Base64 encoding and decoding</li>
            <li>URL-safe variant (using "-" and "_" instead of "+" and "/")</li>
            <li>Data URL format support for embedding in web pages</li>
            <li>Works with Unicode text and binary data</li>
            <li>Client-side processing - data never leaves your browser</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}