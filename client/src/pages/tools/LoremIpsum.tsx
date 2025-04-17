import { useState, useEffect } from 'react';
import ToolLayout from '@/layouts/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { getToolById } from '@/utils/tools';
import { copyToClipboard } from '@/utils/clipboard';
import { generateLoremIpsum } from '@/utils/generators';
import { useToast } from '@/hooks/use-toast';
import { LoremIpsumOptions } from '@/types';

export default function LoremIpsum() {
  const [options, setOptions] = useState<LoremIpsumOptions>({
    type: 'paragraphs',
    count: 3,
    includeHtml: true
  });
  
  const [output, setOutput] = useState<string>('');
  const { toast } = useToast();
  
  const tool = getToolById('lorem-ipsum')!;

  // Generate lorem ipsum whenever options change
  useEffect(() => {
    const text = generateLoremIpsum(options);
    setOutput(text);
  }, [options]);

  const handleTypeChange = (value: 'words' | 'sentences' | 'paragraphs') => {
    setOptions(prev => ({ ...prev, type: value }));
  };

  const handleCountChange = (value: number[]) => {
    setOptions(prev => ({ ...prev, count: value[0] }));
  };

  const handleHtmlChange = (checked: boolean) => {
    setOptions(prev => ({ ...prev, includeHtml: checked }));
  };

  const handleCopy = () => {
    copyToClipboard(output)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Lorem ipsum copied to clipboard",
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

  // Calculate max slider value and label based on type
  const getMaxValue = (): number => {
    switch (options.type) {
      case 'words': return 500;
      case 'sentences': return 50;
      case 'paragraphs': return 20;
      default: return 20;
    }
  };

  const getLabelText = (): string => {
    return `Number of ${options.type}`;
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Options</h3>
            
            <div className="space-y-6">
              <div>
                <Label className="font-medium mb-2 block">Content Type</Label>
                <RadioGroup 
                  defaultValue={options.type} 
                  onValueChange={(val) => handleTypeChange(val as 'words' | 'sentences' | 'paragraphs')}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="words" id="words" />
                    <Label htmlFor="words">Words</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sentences" id="sentences" />
                    <Label htmlFor="sentences">Sentences</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paragraphs" id="paragraphs" />
                    <Label htmlFor="paragraphs">Paragraphs</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-medium">{getLabelText()}</Label>
                  <span className="text-sm text-muted-foreground">{options.count}</span>
                </div>
                <Slider
                  defaultValue={[options.count]}
                  min={1}
                  max={getMaxValue()}
                  step={1}
                  onValueChange={handleCountChange}
                  className="py-4"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="include-html" 
                  checked={options.includeHtml} 
                  onCheckedChange={handleHtmlChange}
                />
                <Label htmlFor="include-html">Include HTML tags</Label>
              </div>
              
              <Button className="w-full" onClick={handleCopy}>
                <svg
                  className="h-4 w-4 mr-2"
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
                Copy to Clipboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Generated Lorem Ipsum</h3>
            <div className="bg-neutral rounded-lg p-4 h-96 overflow-auto">
              {options.includeHtml ? (
                <div dangerouslySetInnerHTML={{ __html: output }} className="prose prose-invert prose-sm max-w-none" />
              ) : (
                <p className="whitespace-pre-wrap">{output}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tool Info Section */}
      <div className="mt-8 bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">About Lorem Ipsum Generator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">What is Lorem Ipsum?</h4>
            <p className="text-gray-300">
              Lorem Ipsum is dummy text used in the design and publishing industries. It has been the industry's standard dummy text since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Usage</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Web design mockups and prototypes</li>
              <li>Testing layouts before final content is available</li>
              <li>Typography demonstrations</li>
              <li>Document templates</li>
              <li>Placeholder text for design work</li>
            </ul>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-3">Features</h4>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Generate words, sentences, or paragraphs</li>
            <li>Customize the amount of content generated</li>
            <li>Include HTML tags (paragraphs, breaks) for web pages</li>
            <li>Instantly copy to clipboard for easy use</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
