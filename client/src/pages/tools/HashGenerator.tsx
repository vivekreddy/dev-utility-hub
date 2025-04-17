import { useState, useEffect } from 'react';
import ToolLayout from '@/layouts/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getToolById } from '@/utils/tools';
import { copyToClipboard } from '@/utils/clipboard';
import { generateHash } from '@/utils/generators';
import { useToast } from '@/hooks/use-toast';
import { HashOptions } from '@/types';

export default function HashGenerator() {
  const [input, setInput] = useState<string>('');
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [algorithm, setAlgorithm] = useState<HashOptions['algorithm']>('SHA-256');
  const [hash, setHash] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();
  
  const tool = getToolById('hash-generator')!;

  // Generate hash when input or algorithm changes
  useEffect(() => {
    if (mode === 'text' && input) {
      generateHashFromText();
    }
  }, [input, algorithm, mode]);

  const generateHashFromText = async () => {
    if (!input) {
      setHash('');
      return;
    }
    
    try {
      setIsGenerating(true);
      const result = await generateHash(input, algorithm);
      setHash(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate hash",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsGenerating(true);
      
      // Read file as ArrayBuffer
      const buffer = await file.arrayBuffer();
      
      // Convert to text for simple MVP implementation
      // In a real app, we'd hash the binary data directly
      const text = new TextDecoder().decode(buffer);
      
      const result = await generateHash(text, algorithm);
      setHash(result);
      
      toast({
        title: "Hash Generated",
        description: `${algorithm} hash for ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate hash from file",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!hash) return;
    
    copyToClipboard(hash)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Hash copied to clipboard",
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
    setHash('');
  };

  return (
    <ToolLayout tool={tool}>
      <Card className="mb-4">
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Hash Algorithm</h3>
          <RadioGroup 
            value={algorithm} 
            onValueChange={(val) => setAlgorithm(val as HashOptions['algorithm'])}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="MD5" id="md5" />
              <Label htmlFor="md5">MD5</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SHA-1" id="sha1" />
              <Label htmlFor="sha1">SHA-1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SHA-256" id="sha256" />
              <Label htmlFor="sha256">SHA-256</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SHA-384" id="sha384" />
              <Label htmlFor="sha384">SHA-384</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="SHA-512" id="sha512" />
              <Label htmlFor="sha512">SHA-512</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <Tabs value={mode} onValueChange={(value) => setMode(value as 'text' | 'file')} className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="text" className="flex-1">Text</TabsTrigger>
          <TabsTrigger value="file" className="flex-1">File</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="input-text" className="font-medium mb-2 block">Input Text</Label>
              <div className="relative">
                <textarea
                  id="input-text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-32 resize-none bg-neutral rounded-lg font-mono text-sm p-4 focus:outline-none focus:ring-1 focus:ring-primary overflow-auto"
                  placeholder="Enter text to hash..."
                />
                <div className="absolute top-2 right-2">
                  <Button variant="ghost" size="sm" onClick={handleClear}>
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
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="file">
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="input-file" className="font-medium mb-2 block">Input File</Label>
              <Input
                id="input-file"
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Select a file to generate its hash. For large files, this may take some time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="mt-4">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <Label className="font-medium">{algorithm} Hash</Label>
            <Button variant="ghost" size="sm" onClick={handleCopy} disabled={!hash}>
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
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </Button>
          </div>
          <div className="bg-neutral rounded-lg p-4 font-mono text-sm">
            {isGenerating ? (
              <div className="flex items-center justify-center py-2">
                <svg
                  className="animate-spin h-5 w-5 text-primary mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating hash...
              </div>
            ) : hash ? (
              <div className="break-all">{hash}</div>
            ) : (
              <div className="text-gray-400 text-center py-2">
                Enter text or upload a file to generate a hash
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tool Info Section */}
      <div className="mt-8 bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">About Hash Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">What is a Hash?</h4>
            <p className="text-gray-300">
              A hash function is a mathematical algorithm that maps data of arbitrary size to a fixed-size output. The same input will always produce the same output, but even a small change in the input will produce a completely different output.
            </p>
            <p className="text-gray-300 mt-2">
              Hashes are commonly used for data integrity verification, password storage, and digital signatures.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Available Algorithms</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>MD5</strong> - 128-bit hash (not secure for cryptographic purposes)</li>
              <li><strong>SHA-1</strong> - 160-bit hash (no longer considered secure)</li>
              <li><strong>SHA-256</strong> - 256-bit hash (part of SHA-2 family, widely used)</li>
              <li><strong>SHA-384</strong> - 384-bit hash (part of SHA-2 family)</li>
              <li><strong>SHA-512</strong> - 512-bit hash (part of SHA-2 family, strongest)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-3">Common Uses</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Verifying file integrity (checksum verification)</li>
            <li>Storing passwords securely (when properly salted)</li>
            <li>Digital signatures and certificates</li>
            <li>Blockchain and cryptocurrency technology</li>
            <li>Data deduplication and caching</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
