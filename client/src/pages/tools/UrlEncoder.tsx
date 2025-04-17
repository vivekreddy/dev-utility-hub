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

export default function UrlEncoder() {
  const [input, setInput] = useState<string>('https://example.com/path?query=Hello World&param=value');
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeAll, setEncodeAll] = useState<boolean>(false);
  const { toast } = useToast();
  
  const tool = getToolById('url-encoder')!;

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }
    
    try {
      if (mode === 'encode') {
        // Encode URL
        if (encodeAll) {
          setOutput(encodeURIComponent(input));
        } else {
          // Only encode parts that need encoding (more suitable for full URLs)
          try {
            const url = new URL(input);
            const encodedSearchParams = new URLSearchParams();
            
            // Get and encode search params
            for (const [key, value] of url.searchParams.entries()) {
              encodedSearchParams.append(key, value);
            }
            
            // Reconstruct URL with encoded parts
            url.search = encodedSearchParams.toString();
            setOutput(url.toString());
          } catch (e) {
            // If not a valid URL, just encode the string
            setOutput(encodeURIComponent(input));
          }
        }
      } else {
        // Decode URL
        setOutput(decodeURIComponent(input));
      }
    } catch (e) {
      setOutput(mode === 'encode' ? 'Encoding error' : 'Decoding error');
    }
  }, [input, mode, encodeAll]);

  const handleCopy = () => {
    copyToClipboard(output)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Content copied to clipboard",
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
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read from clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <ToolLayout tool={tool}>
      <Tabs value={mode} onValueChange={(value) => setMode(value as 'encode' | 'decode')} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">
                  {mode === 'encode' ? 'URL to Encode' : 'URL to Decode'}
                </h3>
                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" onClick={handleClear}>
                    Clear
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handlePaste}>
                    Paste
                  </Button>
                </div>
              </div>
              <div className="relative h-64">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-full resize-none bg-neutral rounded-lg font-mono text-sm p-4 focus:outline-none focus:ring-1 focus:ring-primary overflow-auto"
                  placeholder={mode === 'encode' ? "Enter URL to encode..." : "Enter URL to decode..."}
                />
              </div>
            </CardContent>
          </Card>

          {/* Output Panel */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">
                  {mode === 'encode' ? 'Encoded URL' : 'Decoded URL'}
                </h3>
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
              <div className="h-64 bg-neutral rounded-lg p-4 font-mono text-sm overflow-auto break-all">
                {output}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Options */}
        {mode === 'encode' && (
          <Card className="mt-4">
            <CardContent className="py-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="encode-all" 
                  checked={encodeAll} 
                  onCheckedChange={setEncodeAll}
                />
                <Label htmlFor="encode-all">Encode entire URL (including '://', '/', '?', etc.)</Label>
              </div>
            </CardContent>
          </Card>
        )}
      </Tabs>

      {/* Tool Info Section */}
      <div className="mt-8 bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">About URL Encoder/Decoder</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Instructions</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Select encode or decode mode</li>
              <li>Enter a URL or URL component to encode/decode</li>
              <li>For encoding, choose whether to encode the entire string or just the parts that need encoding</li>
              <li>Copy the result using the copy button</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Features</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Standard URL encoding (converts spaces to %20, etc.)</li>
              <li>Smart encoding that preserves URL structure</li>
              <li>Full URL decoding</li>
              <li>Support for international characters</li>
              <li>One-click copy to clipboard</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
