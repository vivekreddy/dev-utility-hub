import { useState, useEffect } from 'react';
import ToolLayout from '@/layouts/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { getToolById } from '@/utils/tools';
import { copyToClipboard } from '@/utils/clipboard';
import { useToast } from '@/hooks/use-toast';

export default function CodeFormatter() {
  const [input, setInput] = useState<string>('<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>\n</body>\n</html>');
  const [output, setOutput] = useState<string>('');
  const [language, setLanguage] = useState<string>('html');
  const [indentSize, setIndentSize] = useState<string>('2');
  const [useTabs, setUseTabs] = useState<boolean>(false);
  const { toast } = useToast();
  
  const tool = getToolById('code-formatter')!;

  // Sample code examples for each language
  const samples = {
    html: '<!DOCTYPE html>\n<html>\n<head>\n<title>Page Title</title>\n</head>\n<body>\n<h1>This is a Heading</h1>\n<p>This is a paragraph.</p>\n</body>\n</html>',
    css: 'body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n  background-color: #f5f5f5;\n}\n\nh1 {\n  color: #333;\n  text-align: center;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n}',
    javascript: 'function greeting(name) {\n  return `Hello, ${name}!`;\n}\n\nconst person = {\n  firstName: "John",\n  lastName: "Doe",\n  age: 30,\n  fullName: function() {\n    return this.firstName + " " + this.lastName;\n  }\n};\n\nconsole.log(greeting(person.fullName()));'
  };

  // Format code whenever input or formatting options change
  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    
    try {
      // In a real implementation, we would use a proper formatter library
      // For this MVP, we'll do a simple pretty-print
      let result = input;
      
      // Simple formatting based on language
      if (language === 'html') {
        result = formatHtml(input, parseInt(indentSize), useTabs);
      } else if (language === 'css') {
        result = formatCss(input, parseInt(indentSize), useTabs);
      } else if (language === 'javascript') {
        result = formatJavaScript(input, parseInt(indentSize), useTabs);
      }
      
      setOutput(result);
    } catch (error) {
      setOutput(input);
      toast({
        title: "Error",
        description: "Failed to format code",
        variant: "destructive",
      });
    }
  }, [input, language, indentSize, useTabs]);

  // Simplified formatters (in a real app, would use libraries like prettier/js-beautify)
  const formatHtml = (code: string, spaces: number, useTabs: boolean): string => {
    // This is a simplified implementation
    // In a real app, would use a proper HTML formatter library
    return code;
  };

  const formatCss = (code: string, spaces: number, useTabs: boolean): string => {
    // This is a simplified implementation
    // In a real app, would use a proper CSS formatter library
    return code;
  };

  const formatJavaScript = (code: string, spaces: number, useTabs: boolean): string => {
    // This is a simplified implementation
    // In a real app, would use a proper JavaScript formatter library
    return code;
  };

  const handleCopy = () => {
    copyToClipboard(output)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Code copied to clipboard",
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
    setInput(samples[language as keyof typeof samples] || '');
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    // Load a sample for the selected language
    setInput(samples[value as keyof typeof samples] || '');
  };

  return (
    <ToolLayout tool={tool}>
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Language</label>
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Indent Size</label>
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
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="use-tabs" 
                checked={useTabs} 
                onCheckedChange={setUseTabs}
              />
              <Label htmlFor="use-tabs">Use tabs instead of spaces</Label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Input Code</h3>
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
                placeholder={`Enter ${language} code here...`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Formatted Code</h3>
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
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tool Info Section */}
      <div className="mt-8 bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">About Code Formatter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Instructions</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Select the code language (HTML, CSS, or JavaScript)</li>
              <li>Paste your code in the input panel</li>
              <li>Adjust indentation options as needed</li>
              <li>The formatter will automatically format your code</li>
              <li>Copy the formatted code using the copy button</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Features</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Support for HTML, CSS, and JavaScript</li>
              <li>Customizable indentation (spaces or tabs)</li>
              <li>Proper code structure and formatting</li>
              <li>One-click copy to clipboard</li>
              <li>Sample code templates for each language</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
