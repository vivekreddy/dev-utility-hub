import { useState, useEffect } from 'react';
import ToolLayout from '@/layouts/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getToolById } from '@/utils/tools';
import { copyToClipboard } from '@/utils/clipboard';
import { formatJson, validateJson, minifyJson } from '@/utils/formatters';
import { ValidationResult } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function JsonFormatter() {
  const [input, setInput] = useState<string>('{\n  "name": "DevUtils",\n  "version": "1.0.0",\n  "description": "100 developer tools",\n  "categories": [\n    "Formatters",\n    "Encoders",\n    "Generators"\n  ],\n  "tools": 100,\n  "author": {\n    "name": "Developer",\n    "email": "dev@example.com"\n  },\n  "isOpenSource": true\n}');
  const [formattedOutput, setFormattedOutput] = useState<string>('');
  const [indentSize, setIndentSize] = useState<string>('2');
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, message: 'JSON is valid' });
  const { toast } = useToast();
  
  const tool = getToolById('json-formatter')!;

  // Format JSON whenever input or formatting options change
  useEffect(() => {
    try {
      if (!input.trim()) {
        setFormattedOutput('');
        setValidation({ isValid: true, message: '' });
        return;
      }
      
      const result = validateJson(input);
      setValidation(result);
      
      if (result.isValid) {
        setFormattedOutput(formatJson(input, parseInt(indentSize)));
      } else {
        setFormattedOutput(input);
      }
    } catch (error) {
      setFormattedOutput(input);
      setValidation({ isValid: false, message: 'Invalid JSON' });
    }
  }, [input, indentSize]);

  const handleCopy = () => {
    copyToClipboard(formattedOutput)
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
    setInput('');
  };

  const handleSample = () => {
    setInput('{\n  "name": "DevUtils",\n  "version": "1.0.0",\n  "description": "100 developer tools",\n  "categories": [\n    "Formatters",\n    "Encoders",\n    "Generators"\n  ],\n  "tools": 100,\n  "author": {\n    "name": "Developer",\n    "email": "dev@example.com"\n  },\n  "isOpenSource": true\n}');
  };

  const handleMinify = () => {
    if (validation.isValid) {
      try {
        const minified = minifyJson(input);
        setFormattedOutput(minified);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to minify JSON",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Input JSON</h3>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={handleSample}>
                  Sample
                </Button>
                <Button variant="secondary" size="sm" onClick={handleClear}>
                  Clear
                </Button>
                <Button variant="secondary" size="sm" onClick={() => {
                  navigator.clipboard.readText().then(text => setInput(text));
                }}>
                  Paste
                </Button>
              </div>
            </div>
            <div className="relative h-96">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-full resize-none bg-neutral rounded-lg font-mono text-sm p-4 focus:outline-none focus:ring-1 focus:ring-primary overflow-auto"
                placeholder="Paste your JSON here..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Formatted JSON</h3>
              <div className="flex items-center space-x-2">
                <Select value={indentSize} onValueChange={setIndentSize}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Indent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="8">8 spaces</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="secondary" size="sm" onClick={handleMinify}>
                  Minify
                </Button>
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
            </div>
            <div className="h-96 bg-neutral rounded-lg p-4 font-mono text-sm overflow-auto relative">
              <pre className="text-sm">{formattedOutput}</pre>
              {validation.message && (
                <div className={`absolute bottom-4 left-4 px-3 py-2 ${validation.isValid ? 'bg-success' : 'bg-error'} text-white rounded-lg shadow-lg`}>
                  <svg
                    className="inline-block h-4 w-4 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {validation.isValid ? (
                      <path d="M20 6 9 17l-5-5" />
                    ) : (
                      <>
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </>
                    )}
                  </svg>
                  {validation.message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tool Info Section */}
      <div className="mt-8 bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">About JSON Formatter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Instructions</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Paste your JSON into the input panel</li>
              <li>The tool will format it automatically</li>
              <li>Adjust indentation options as needed</li>
              <li>Copy the formatted JSON using the copy button</li>
              <li>Use "Minify" to compress your JSON for production</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Features</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Automatic syntax highlighting</li>
              <li>JSON validation with detailed error messages</li>
              <li>Adjustable indentation (2 spaces, 4 spaces, 8 spaces)</li>
              <li>Minification for reduced file size</li>
              <li>One-click copy to clipboard</li>
              <li>Works offline - no data sent to servers</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
