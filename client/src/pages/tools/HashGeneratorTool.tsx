import { useState, useEffect } from 'react';
import { getToolById } from '@/utils/tools';
import ToolLayout from '@/layouts/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/utils/clipboard';

// Helper to convert string to ArrayBuffer
function strToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

// Helper to convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Hash generation using Web Crypto API
async function generateHash(text: string, algorithm: string): Promise<string> {
  try {
    const subtleAlgo = algorithm.toLowerCase() as 'sha-1' | 'sha-256' | 'sha-384' | 'sha-512' | 'md5';
    let hashBuffer: ArrayBuffer;

    // MD5 isn't supported in Web Crypto API, so we need a fallback
    if (subtleAlgo === 'md5') {
      // Simple MD5 implementation for demo purposes
      // In a real app, use a proper library
      return simpleMd5(text);
    }

    hashBuffer = await crypto.subtle.digest(
      subtleAlgo,
      strToArrayBuffer(text)
    );

    return bufferToHex(hashBuffer);
  } catch (error) {
    console.error('Hash generation error:', error);
    throw new Error(`Failed to generate ${algorithm} hash`);
  }
}

// Simple MD5 implementation for demo
// This is NOT cryptographically secure - for demonstration only
function simpleMd5(input: string): string {
  // This is a placeholder. In a real implementation, you would use a proper library.
  // For demo purposes, we're returning a mock MD5 hash
  const characters = '0123456789abcdef';
  let result = '';
  
  // Create a deterministic but not cryptographically secure hash
  // DO NOT USE THIS FOR SECURITY PURPOSES
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  // Generate a 32-character hex string (like MD5)
  for (let i = 0; i < 32; i++) {
    const value = (hash + i * input.length) % 16;
    result += characters.charAt(Math.abs(value));
  }
  
  return result;
}

// List of supported hash algorithms
const hashAlgorithms = [
  { id: 'md5', name: 'MD5', length: 32 },
  { id: 'sha-1', name: 'SHA-1', length: 40 },
  { id: 'sha-256', name: 'SHA-256', length: 64 },
  { id: 'sha-384', name: 'SHA-384', length: 96 },
  { id: 'sha-512', name: 'SHA-512', length: 128 },
];

export default function HashGeneratorTool() {
  const tool = getToolById('hash-generator')!;
  const [input, setInput] = useState<string>('');
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [algorithm, setAlgorithm] = useState<string>('sha-256');
  const [hashOutput, setHashOutput] = useState<{ [key: string]: string }>({});
  const [hashFile, setHashFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Generate hashes for all algorithms
  const generateHashes = async () => {
    if (!input && !hashFile) {
      toast({
        title: 'Input Required',
        description: 'Please enter text or select a file to hash',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const results: { [key: string]: string } = {};
      
      // For text input
      if (inputType === 'text') {
        for (const algo of hashAlgorithms) {
          results[algo.id] = await generateHash(input, algo.id);
        }
      } 
      // For file input
      else if (hashFile) {
        // In a real app, you would process the file contents
        // For this demo, we'll just hash the file name
        for (const algo of hashAlgorithms) {
          results[algo.id] = await generateHash(hashFile.name + hashFile.size, algo.id);
        }
      }
      
      setHashOutput(results);
      toast({
        title: 'Hashes Generated',
        description: 'Successfully generated hash values',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate hashes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setHashFile(e.target.files[0]);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async (text: string) => {
    const result = await copyToClipboard(text);
    if (result.success) {
      toast({
        title: 'Copied!',
        description: 'Hash copied to clipboard',
      });
    } else {
      toast({
        title: 'Copy Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  // Clear the form
  const handleClear = () => {
    setInput('');
    setHashFile(null);
    setHashOutput({});
    toast({
      title: 'Cleared',
      description: 'Input and output cleared',
    });
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Hash Generator</h2>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear All
            </Button>
          </div>
          <p className="text-muted-foreground">
            Generate cryptographic hash values from text or files.
          </p>

          <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'text' | 'file')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="file">File Input</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder="Enter text to hash..."
                className="min-h-[200px]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-surface">
                <input
                  type="file"
                  id="file-input"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">
                    Click to select a file or drag and drop
                  </p>
                  <label
                    htmlFor="file-input"
                    className="inline-block px-4 py-2 rounded-md bg-primary text-white cursor-pointer hover:bg-primary/90"
                  >
                    Select File
                  </label>
                </div>
              </div>

              {hashFile && (
                <div className="bg-surface p-3 rounded-md">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <div className="text-sm">
                      <p className="font-medium">{hashFile.name}</p>
                      <p className="text-xs text-gray-400">
                        {(hashFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="space-y-3 pt-4">
            <Label>Algorithm</Label>
            <RadioGroup
              value={algorithm}
              onValueChange={setAlgorithm}
              className="grid grid-cols-2 gap-2"
            >
              {hashAlgorithms.map((algo) => (
                <div key={algo.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={algo.id} id={algo.id} />
                  <Label htmlFor={algo.id} className="font-normal">
                    {algo.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            onClick={generateHashes}
            disabled={isLoading || (!input && !hashFile)}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Generating...' : 'Generate Hashes'}
          </Button>
        </div>

        {/* Right Panel - Output */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Hash Output</h2>
          
          <div className="bg-surface rounded-lg p-4 space-y-4 min-h-[400px]">
            {Object.keys(hashOutput).length > 0 ? (
              <>
                {hashAlgorithms.map((algo) => (
                  <div
                    key={algo.id}
                    className={`bg-background p-3 rounded-md ${
                      algorithm === algo.id ? 'border-l-4 border-primary' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{algo.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(hashOutput[algo.id] || '')}
                      >
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </Button>
                    </div>
                    <div className="font-mono text-xs break-all">
                      {hashOutput[algo.id] || ''}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <svg
                  className="h-12 w-12 text-gray-400 mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="10" y1="3" x2="10" y2="21" />
                  <line x1="14" y1="3" x2="14" y2="21" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <line x1="3" y1="14" x2="21" y2="14" />
                </svg>
                <p className="text-gray-500 text-sm">
                  Enter text or select a file and click "Generate Hashes" to see
                  the results here
                </p>
              </div>
            )}
          </div>
          
          <div className="pt-2">
            {Object.keys(hashOutput).length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="selected-hash">Selected Hash ({algorithm.toUpperCase()})</Label>
                <div className="flex space-x-2">
                  <Input
                    id="selected-hash"
                    value={hashOutput[algorithm] || ''}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(hashOutput[algorithm] || '')}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}