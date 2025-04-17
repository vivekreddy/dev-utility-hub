import { useState, useEffect } from 'react';
import { formatJson, validateJson, minifyJson } from '@/utils/formatters';
import { copyToClipboard } from '@/utils/clipboard';
import { getToolById } from '@/utils/tools';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { FormatterOptions } from '@/types';
import ToolLayout from '@/layouts/ToolLayout';

export default function JsonFormatter() {
  // Get tool data
  const tool = getToolById('json-formatter')!;
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [options, setOptions] = useState<FormatterOptions>({
    indentSize: 2,
    useTabs: false,
  });
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { toast } = useToast();

  // Process JSON whenever input or options change
  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(true);
      setErrorMessage('');
      return;
    }

    const validation = validateJson(input);
    setIsValid(validation.isValid);
    setErrorMessage(validation.message);

    if (validation.isValid) {
      try {
        const formatted = formatJson(input, options.indentSize);
        setOutput(formatted);
      } catch (err) {
        setIsValid(false);
        setErrorMessage('Error formatting JSON: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    }
  }, [input, options.indentSize]);

  const handleFormat = () => {
    if (!input.trim()) {
      toast({
        title: 'Empty Input',
        description: 'Please enter some JSON to format',
        variant: 'destructive',
      });
      return;
    }

    try {
      const formatted = formatJson(input, options.indentSize);
      setOutput(formatted);
      setIsValid(true);
      setErrorMessage('');
      toast({
        title: 'JSON Formatted',
        description: 'Successfully formatted JSON with ' + options.indentSize + ' spaces',
      });
    } catch (err) {
      setIsValid(false);
      setErrorMessage('Error formatting JSON: ' + (err instanceof Error ? err.message : 'Unknown error'));
      toast({
        title: 'Invalid JSON',
        description: 'Please check your input and try again',
        variant: 'destructive',
      });
    }
  };

  const handleMinify = () => {
    if (!input.trim()) {
      toast({
        title: 'Empty Input',
        description: 'Please enter some JSON to minify',
        variant: 'destructive',
      });
      return;
    }

    try {
      const minified = minifyJson(input);
      setOutput(minified);
      setIsValid(true);
      setErrorMessage('');
      toast({
        title: 'JSON Minified',
        description: 'Successfully minified JSON',
      });
    } catch (err) {
      setIsValid(false);
      setErrorMessage('Error minifying JSON: ' + (err instanceof Error ? err.message : 'Unknown error'));
      toast({
        title: 'Invalid JSON',
        description: 'Please check your input and try again',
        variant: 'destructive',
      });
    }
  };

  const handleCopy = async () => {
    if (!output) {
      toast({
        title: 'Nothing to Copy',
        description: 'Generate some output first',
        variant: 'destructive',
      });
      return;
    }

    const result = await copyToClipboard(output);
    if (result.success) {
      toast({
        title: 'Copied!',
        description: 'Output copied to clipboard',
      });
    } else {
      toast({
        title: 'Copy Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsValid(true);
    setErrorMessage('');
    toast({
      title: 'Cleared',
      description: 'Input and output cleared',
    });
  };

  return (
    <ToolLayout tool={tool}>
      <div className="mb-8">
        <p className="text-muted-foreground">Format, validate, and minify JSON data with ease.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Input JSON</h2>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
          <Textarea
            placeholder="Paste your JSON here..."
            className="min-h-[300px] font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleFormat} disabled={!input.trim()}>
              Format JSON
            </Button>
            <Button 
              onClick={handleMinify} 
              variant="secondary" 
              disabled={!input.trim()}
            >
              Minify JSON
            </Button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Formatted Result</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              disabled={!output}
            >
              Copy to Clipboard
            </Button>
          </div>
          <div className="relative">
            <Textarea
              className={`min-h-[300px] font-mono ${isValid ? 'border-input' : 'border-destructive'}`}
              value={output}
              readOnly
              placeholder="Formatted output will appear here..."
            />
            {!isValid && errorMessage && (
              <div className="mt-2 text-sm text-destructive">
                <p>{errorMessage}</p>
              </div>
            )}
          </div>
          
          {/* Options */}
          <div className="bg-surface p-4 rounded-lg space-y-4">
            <h3 className="font-medium">Options</h3>
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="indent-size">Indent Size: {options.indentSize}</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    id="indent-size"
                    min={1}
                    max={8}
                    step={1}
                    value={[options.indentSize]}
                    onValueChange={(value) => setOptions({ ...options, indentSize: value[0] })}
                    className="flex-1"
                  />
                  <span className="w-10 text-center">{options.indentSize}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-tabs"
                  checked={options.useTabs}
                  onCheckedChange={(checked) => setOptions({ ...options, useTabs: checked })}
                />
                <Label htmlFor="use-tabs">Use Tabs (instead of spaces)</Label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}