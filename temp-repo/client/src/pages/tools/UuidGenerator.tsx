import { useState } from 'react';
import ToolLayout from '@/layouts/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getToolById } from '@/utils/tools';
import { copyToClipboard } from '@/utils/clipboard';
import { generateUuid, generateCustomUuid } from '@/utils/generators';
import { useToast } from '@/hooks/use-toast';

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([generateUuid()]);
  const [version, setVersion] = useState<string>('v4');
  const [count, setCount] = useState<string>('1');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const { toast } = useToast();
  
  const tool = getToolById('uuid-generator')!;

  const generateUuids = () => {
    const quantity = parseInt(count);
    
    if (isNaN(quantity) || quantity < 1 || quantity > 100) {
      toast({
        title: "Invalid count",
        description: "Please enter a number between 1 and 100",
        variant: "destructive",
      });
      return;
    }
    
    const newUuids: string[] = [];
    
    for (let i = 0; i < quantity; i++) {
      let uuid = version === 'v4' 
        ? generateUuid() 
        : generateCustomUuid();
      
      // Apply formatting options
      if (uppercase) {
        uuid = uuid.toUpperCase();
      }
      
      if (!hyphens) {
        uuid = uuid.replace(/-/g, '');
      }
      
      newUuids.push(uuid);
    }
    
    setUuids(newUuids);
  };

  const handleCopy = (text: string) => {
    copyToClipboard(text)
      .then(() => {
        toast({
          title: "Copied!",
          description: "UUID copied to clipboard",
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

  const handleCopyAll = () => {
    copyToClipboard(uuids.join('\n'))
      .then(() => {
        toast({
          title: "Copied!",
          description: `${uuids.length} UUIDs copied to clipboard`,
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

  return (
    <ToolLayout tool={tool}>
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label htmlFor="version">UUID Version</Label>
              <Select value={version} onValueChange={setVersion}>
                <SelectTrigger id="version" className="w-full mt-1">
                  <SelectValue placeholder="Select version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v4">Version 4 (Random)</SelectItem>
                  <SelectItem value="v1">Version 1 (Time-based)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="count">Number of UUIDs</Label>
              <Select value={count} onValueChange={setCount}>
                <SelectTrigger id="count" className="w-full mt-1">
                  <SelectValue placeholder="Count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="uppercase" 
                checked={uppercase} 
                onCheckedChange={setUppercase}
              />
              <Label htmlFor="uppercase">Uppercase</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="hyphens" 
                checked={hyphens} 
                onCheckedChange={setHyphens}
              />
              <Label htmlFor="hyphens">Include hyphens</Label>
            </div>
          </div>
          
          <Button 
            className="mt-4 w-full"
            onClick={generateUuids}
          >
            Generate UUID{parseInt(count) > 1 ? 's' : ''}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Generated UUIDs</h3>
            {uuids.length > 1 && (
              <Button variant="secondary" size="sm" onClick={handleCopyAll}>
                Copy All
              </Button>
            )}
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center bg-neutral rounded-lg p-3">
                <code className="font-mono text-sm flex-1 break-all">{uuid}</code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopy(uuid)}
                  className="ml-2"
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
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tool Info Section */}
      <div className="mt-8 bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">About UUID Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">What is a UUID?</h4>
            <p className="text-gray-300">
              A UUID (Universally Unique Identifier) is a 128-bit value used to uniquely identify information in computer systems. 
              The standard format is 36 characters (32 alphanumeric characters and 4 hyphens) like this:
              <code className="block mt-2 font-mono bg-neutral p-2 rounded">
                550e8400-e29b-41d4-a716-446655440000
              </code>
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">UUID Versions</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Version 4</strong> - Random UUID, generated using random or pseudo-random numbers</li>
              <li><strong>Version 1</strong> - Time-based UUID, generated from a timestamp and the MAC address of the computer</li>
            </ul>
            <h4 className="font-medium mb-3 mt-4">Features</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Generate multiple UUIDs at once</li>
              <li>Format options (uppercase, with/without hyphens)</li>
              <li>Copy individual UUIDs or all at once</li>
              <li>Client-side generation - no server requests</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
