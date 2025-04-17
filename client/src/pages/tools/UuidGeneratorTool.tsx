import { useState, useEffect } from 'react';
import { getToolById } from '@/utils/tools';
import ToolLayout from '@/layouts/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/utils/clipboard';

// UUID v4 generation (RFC 4122 compliant)
function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// UUID v1-like generation (not truly RFC 4122 compliant, but similar format)
function generateUUIDv1(): string {
  const now = new Date();
  const timeMs = now.getTime();
  const timeLow = ('00000000' + timeMs.toString(16)).slice(-8);
  const timeMid = ('0000' + Math.floor(Math.random() * 0xffff).toString(16)).slice(-4);
  const timeHighAndVersion = '1' + ('000' + Math.floor(Math.random() * 0x0fff).toString(16)).slice(-3);
  const clockSeqHiAndReserved = (Math.floor(Math.random() * 0x3f) | 0x80).toString(16);
  const clockSeqLow = ('00' + Math.floor(Math.random() * 0xff).toString(16)).slice(-2);
  const node = Array.from({length: 6}, () => ('00' + Math.floor(Math.random() * 0xff).toString(16)).slice(-2)).join('');
  
  return `${timeLow.slice(0, 8)}-${timeMid}-${timeHighAndVersion}-${clockSeqHiAndReserved}${clockSeqLow}-${node}`;
}

// Simple incremental UUID
let uuidCounter = 0;
function generateSimpleUUID(): string {
  const timestamp = new Date().getTime().toString(16);
  const counter = (++uuidCounter).toString(16).padStart(4, '0');
  const random = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
  return `${timestamp}-${counter}-${random}`.padEnd(36, '0');
}

// Null UUID
function getNullUUID(): string {
  return '00000000-0000-0000-0000-000000000000';
}

export default function UuidGeneratorTool() {
  const tool = getToolById('uuid-generator')!;
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<string>('v4');
  const [count, setCount] = useState<number>(5);
  const [format, setFormat] = useState<string>('standard');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [braces, setBraces] = useState<boolean>(false);
  const [hyphens, setHyphens] = useState<boolean>(true);
  const { toast } = useToast();

  // Generate UUIDs
  const generateUUIDs = () => {
    const newUuids = Array.from({ length: count }, () => {
      // Generate the basic UUID based on version
      let uuid = '';
      switch (version) {
        case 'v1':
          uuid = generateUUIDv1();
          break;
        case 'v4':
          uuid = generateUUIDv4();
          break;
        case 'null':
          uuid = getNullUUID();
          break;
        case 'simple':
          uuid = generateSimpleUUID();
          break;
        default:
          uuid = generateUUIDv4();
      }

      // Apply formatting options
      if (!hyphens) {
        uuid = uuid.replace(/-/g, '');
      }
      
      if (uppercase) {
        uuid = uuid.toUpperCase();
      }
      
      if (braces) {
        uuid = `{${uuid}}`;
      }
      
      return uuid;
    });

    setUuids(newUuids);
    
    toast({
      title: 'UUIDs Generated',
      description: `Successfully generated ${count} UUIDs`,
    });
  };

  // Format existing UUIDs
  useEffect(() => {
    if (uuids.length > 0) {
      // Reformat existing UUIDs when format options change
      setUuids(prev => prev.map(uuid => {
        // Remove braces if they exist
        let formatted = uuid.replace(/[{}]/g, '');
        
        // Convert to appropriate case
        formatted = uppercase ? formatted.toUpperCase() : formatted.toLowerCase();
        
        // Handle hyphens
        const uuidBody = formatted.replace(/-/g, '');
        formatted = hyphens
          ? `${uuidBody.slice(0, 8)}-${uuidBody.slice(8, 12)}-${uuidBody.slice(12, 16)}-${uuidBody.slice(16, 20)}-${uuidBody.slice(20)}`
          : uuidBody;
        
        // Add braces if needed
        return braces ? `{${formatted}}` : formatted;
      }));
    }
  }, [format, uppercase, braces, hyphens]);

  // Handle copy to clipboard
  const handleCopy = async (uuid: string) => {
    const result = await copyToClipboard(uuid);
    if (result.success) {
      toast({
        title: 'Copied!',
        description: 'UUID copied to clipboard',
      });
    } else {
      toast({
        title: 'Copy Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  // Handle copy all to clipboard
  const handleCopyAll = async () => {
    if (uuids.length === 0) {
      toast({
        title: 'Nothing to Copy',
        description: 'Generate UUIDs first',
        variant: 'destructive',
      });
      return;
    }

    const result = await copyToClipboard(uuids.join('\n'));
    if (result.success) {
      toast({
        title: 'All Copied!',
        description: `${uuids.length} UUIDs copied to clipboard`,
      });
    } else {
      toast({
        title: 'Copy Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  // Handle predefined formats
  const handleFormatChange = (value: string) => {
    setFormat(value);
    
    switch (value) {
      case 'standard':
        setHyphens(true);
        setBraces(false);
        setUppercase(false);
        break;
      case 'uppercase':
        setHyphens(true);
        setBraces(false);
        setUppercase(true);
        break;
      case 'braces':
        setHyphens(true);
        setBraces(true);
        setUppercase(false);
        break;
      case 'no-hyphens':
        setHyphens(false);
        setBraces(false);
        setUppercase(false);
        break;
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">UUID Generator</h2>
            <p className="text-muted-foreground">
              Generate random UUIDs (Universally Unique Identifiers) with various options and formats.
            </p>
          </div>

          {/* Version Selection */}
          <div className="space-y-3">
            <Label>UUID Version</Label>
            <RadioGroup
              value={version}
              onValueChange={setVersion}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="v4" id="v4" />
                <Label htmlFor="v4" className="font-normal">
                  Version 4 (Random) - Standard
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="v1" id="v1" />
                <Label htmlFor="v1" className="font-normal">
                  Version 1 (Time-based)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="simple" id="simple" />
                <Label htmlFor="simple" className="font-normal">
                  Simple (Timestamp + Counter)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="null" id="null" />
                <Label htmlFor="null" className="font-normal">
                  Null UUID (All Zeros)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Count Slider */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="count-slider">Count: {count}</Label>
            </div>
            <Slider
              id="count-slider"
              min={1}
              max={100}
              step={1}
              value={[count]}
              onValueChange={(value) => setCount(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Format Options */}
          <div className="space-y-3">
            <Label>Format</Label>
            <Select value={format} onValueChange={handleFormatChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard (lowercase with hyphens)</SelectItem>
                <SelectItem value="uppercase">Uppercase with hyphens</SelectItem>
                <SelectItem value="braces">With braces {'{...}'}</SelectItem>
                <SelectItem value="no-hyphens">No hyphens</SelectItem>
                <SelectItem value="custom">Custom...</SelectItem>
              </SelectContent>
            </Select>

            {format === 'custom' && (
              <div className="pt-2 space-y-3 border-t">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase-switch">Uppercase</Label>
                  <Switch
                    id="uppercase-switch"
                    checked={uppercase}
                    onCheckedChange={setUppercase}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="braces-switch">Include braces {'{...}'}</Label>
                  <Switch
                    id="braces-switch"
                    checked={braces}
                    onCheckedChange={setBraces}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hyphens-switch">Include hyphens</Label>
                  <Switch
                    id="hyphens-switch"
                    checked={hyphens}
                    onCheckedChange={setHyphens}
                  />
                </div>
              </div>
            )}
          </div>

          <Button onClick={generateUUIDs} size="lg" className="w-full">
            Generate UUIDs
          </Button>
        </div>

        {/* Right Panel - Results */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Generated UUIDs</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyAll}
              disabled={uuids.length === 0}
            >
              Copy All
            </Button>
          </div>

          <div className="bg-surface rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {uuids.length > 0 ? (
              <ul className="space-y-2">
                {uuids.map((uuid, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-background p-2 rounded font-mono text-sm"
                  >
                    <span className="truncate mr-2">{uuid}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(uuid)}
                      className="shrink-0"
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
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Click "Generate UUIDs" to start</p>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Textarea
              readOnly
              value={uuids.join('\n')}
              placeholder="Generated UUIDs will appear here"
              className="min-h-[120px] font-mono"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}