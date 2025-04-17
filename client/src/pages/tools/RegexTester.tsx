import { useState, useEffect, useCallback } from 'react';
import { getToolById } from '@/utils/tools';
import ToolLayout from '@/layouts/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/utils/clipboard';

interface Match {
  text: string;
  index: number;
  length: number;
  groups: string[];
}

interface RegexResult {
  isValid: boolean;
  error?: string;
  matches: Match[];
  replacedText?: string;
}

interface CommonRegex {
  name: string;
  pattern: string;
  description: string;
  flags: string;
}

// Common regex patterns
const commonRegexPatterns: CommonRegex[] = [
  {
    name: 'Email',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    description: 'Match valid email addresses',
    flags: 'g',
  },
  {
    name: 'URL',
    pattern: 'https?://[\\w-]+(\\.[\\w-]+)+(/[\\w-./?%&=]*)?',
    description: 'Match URLs with http:// or https://',
    flags: 'g',
  },
  {
    name: 'IP Address',
    pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
    description: 'Match IPv4 addresses',
    flags: 'g',
  },
  {
    name: 'Date (MM/DD/YYYY)',
    pattern: '\\b(0?[1-9]|1[0-2])/(0?[1-9]|[12]\\d|3[01])/\\d{4}\\b',
    description: 'Match dates in MM/DD/YYYY format',
    flags: 'g',
  },
  {
    name: 'Phone Number',
    pattern: '\\b\\(?\\d{3}\\)?[-. ]?\\d{3}[-. ]?\\d{4}\\b',
    description: 'Match US phone numbers',
    flags: 'g',
  },
  {
    name: 'Time (HH:MM)',
    pattern: '\\b([01]?\\d|2[0-3]):([0-5]\\d)\\b',
    description: 'Match 24-hour time format',
    flags: 'g',
  },
  {
    name: 'HTML Tag',
    pattern: '<([a-z][a-z0-9]*)\\b[^>]*>.*?</\\1>',
    description: 'Match HTML tags with content',
    flags: 'gi',
  },
  {
    name: 'Hex Color',
    pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})',
    description: 'Match hexadecimal color codes',
    flags: 'g',
  },
];

export default function RegexTester() {
  const tool = getToolById('regex-tester-tool')!;
  const [regex, setRegex] = useState<string>('^\\d+$');
  const [text, setText] = useState<string>('123\n456\nabc\n789');
  const [flags, setFlags] = useState<string>('gm');
  const [activeTab, setActiveTab] = useState<string>('match');
  const [replaceWith, setReplaceWith] = useState<string>('');
  const [result, setResult] = useState<RegexResult | null>(null);
  const [highlightedText, setHighlightedText] = useState<string>('');
  const { toast } = useToast();

  // Flag toggles
  const [globalFlag, setGlobalFlag] = useState<boolean>(true);
  const [multilineFlag, setMultilineFlag] = useState<boolean>(true);
  const [caseInsensitiveFlag, setCaseInsensitiveFlag] = useState<boolean>(false);
  const [dotAllFlag, setDotAllFlag] = useState<boolean>(false);
  const [unicodeFlag, setUnicodeFlag] = useState<boolean>(false);
  const [stickyFlag, setStickyFlag] = useState<boolean>(false);

  // Update flags when toggles change
  useEffect(() => {
    let newFlags = '';
    if (globalFlag) newFlags += 'g';
    if (multilineFlag) newFlags += 'm';
    if (caseInsensitiveFlag) newFlags += 'i';
    if (dotAllFlag) newFlags += 's';
    if (unicodeFlag) newFlags += 'u';
    if (stickyFlag) newFlags += 'y';
    setFlags(newFlags);
  }, [globalFlag, multilineFlag, caseInsensitiveFlag, dotAllFlag, unicodeFlag, stickyFlag]);

  // Process regex and update results
  const processRegex = useCallback(() => {
    if (!regex.trim() || !text.trim()) {
      setResult(null);
      setHighlightedText('');
      return;
    }

    try {
      // Create regex object
      const regexObj = new RegExp(regex, flags);
      
      // Find matches
      const matches: Match[] = [];
      let match;
      
      if (globalFlag) {
        // Use exec with g flag to get all matches and their indices
        while ((match = regexObj.exec(text)) !== null) {
          matches.push({
            text: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.slice(1),
          });
          
          // Avoid infinite loops if the regex can match empty string
          if (match[0].length === 0) {
            regexObj.lastIndex++;
          }
        }
      } else {
        // Without g flag, just get the first match
        match = regexObj.exec(text);
        if (match) {
          matches.push({
            text: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.slice(1),
          });
        }
      }
      
      // Create replaced text for replace tab
      const replacedText = text.replace(regexObj, replaceWith);
      
      // Highlight matches in the text
      let highlighted = '';
      let lastIndex = 0;
      
      // Sort matches by index to ensure proper order
      const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
      
      for (const match of sortedMatches) {
        // Add text before the match
        highlighted += escapeHtml(text.substring(lastIndex, match.index));
        // Add highlighted match
        highlighted += `<mark class="bg-yellow-300 dark:bg-yellow-700">${escapeHtml(match.text)}</mark>`;
        // Update last index
        lastIndex = match.index + match.length;
      }
      
      // Add any remaining text after the last match
      highlighted += escapeHtml(text.substring(lastIndex));
      
      // Handle newlines for display
      highlighted = highlighted.replace(/\n/g, '<br>');
      
      setResult({
        isValid: true,
        matches,
        replacedText,
      });
      setHighlightedText(highlighted);
    } catch (error) {
      setResult({
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid regular expression',
        matches: [],
      });
      setHighlightedText(escapeHtml(text).replace(/\n/g, '<br>'));
    }
  }, [regex, text, flags, replaceWith, globalFlag]);

  // Process regex when inputs change
  useEffect(() => {
    processRegex();
  }, [processRegex]);

  // Escape HTML special characters
  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Handle regex test
  const handleTest = () => {
    processRegex();
    toast({
      title: result?.isValid ? 'Regex is valid' : 'Invalid Regex',
      description: result?.isValid
        ? `Found ${result.matches.length} match${result.matches.length !== 1 ? 'es' : ''}`
        : result?.error,
      variant: result?.isValid ? 'default' : 'destructive',
    });
  };

  // Handle copy to clipboard
  const handleCopy = async (content: string, type: string) => {
    const result = await copyToClipboard(content);
    if (result.success) {
      toast({
        title: 'Copied!',
        description: `${type} copied to clipboard`,
      });
    } else {
      toast({
        title: 'Copy Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  // Handle loading a common regex pattern
  const handleLoadPattern = (pattern: CommonRegex) => {
    setRegex(pattern.pattern);
    
    // Parse flags
    setGlobalFlag(pattern.flags.includes('g'));
    setMultilineFlag(pattern.flags.includes('m'));
    setCaseInsensitiveFlag(pattern.flags.includes('i'));
    setDotAllFlag(pattern.flags.includes('s'));
    setUnicodeFlag(pattern.flags.includes('u'));
    setStickyFlag(pattern.flags.includes('y'));
    
    toast({
      title: `Loaded pattern: ${pattern.name}`,
      description: pattern.description,
    });
  };

  // Handle clearing inputs
  const handleClear = () => {
    setRegex('');
    setText('');
    setReplaceWith('');
    setResult(null);
    setHighlightedText('');
    setGlobalFlag(true);
    setMultilineFlag(true);
    setCaseInsensitiveFlag(false);
    setDotAllFlag(false);
    setUnicodeFlag(false);
    setStickyFlag(false);
    toast({
      title: 'Cleared',
      description: 'All inputs have been cleared',
    });
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Regular Expression Tester</h2>
            <p className="text-muted-foreground">
              Build, test, and debug regular expressions with real-time feedback.
            </p>
          </div>
          <Button variant="outline" onClick={handleClear}>
            Clear All
          </Button>
        </div>

        {/* Regex Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="regex-input">Regular Expression</Label>
            <div className="flex gap-2">
              <div className="flex items-center bg-surface px-3 rounded-l-md">
                /
              </div>
              <Input
                id="regex-input"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="Enter regular expression pattern"
                className="rounded-l-none"
              />
              <div className="flex items-center bg-surface px-3 rounded-r-md">
                /{flags}
              </div>
            </div>
            {result && !result.isValid && (
              <p className="text-destructive text-sm">{result.error}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Flags</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="flag-g"
                  checked={globalFlag}
                  onCheckedChange={setGlobalFlag}
                />
                <Label htmlFor="flag-g" className="font-mono">g</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="flag-m"
                  checked={multilineFlag}
                  onCheckedChange={setMultilineFlag}
                />
                <Label htmlFor="flag-m" className="font-mono">m</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="flag-i"
                  checked={caseInsensitiveFlag}
                  onCheckedChange={setCaseInsensitiveFlag}
                />
                <Label htmlFor="flag-i" className="font-mono">i</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="flag-s"
                  checked={dotAllFlag}
                  onCheckedChange={setDotAllFlag}
                />
                <Label htmlFor="flag-s" className="font-mono">s</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="flag-u"
                  checked={unicodeFlag}
                  onCheckedChange={setUnicodeFlag}
                />
                <Label htmlFor="flag-u" className="font-mono">u</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="flag-y"
                  checked={stickyFlag}
                  onCheckedChange={setStickyFlag}
                />
                <Label htmlFor="flag-y" className="font-mono">y</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <Label htmlFor="text-input">Test String</Label>
          <Textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to test against the regular expression"
            className="min-h-[150px] font-mono text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleTest} className="min-w-[120px]">
            Test Regex
          </Button>
          {regex && (
            <Button
              variant="outline"
              onClick={() => handleCopy(regex, 'Regex pattern')}
            >
              Copy Pattern
            </Button>
          )}
        </div>

        {/* Results Tabs */}
        <Tabs
          defaultValue="match"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="match">Matches</TabsTrigger>
            <TabsTrigger value="replace">Replace</TabsTrigger>
            <TabsTrigger value="cheatsheet">Cheatsheet</TabsTrigger>
          </TabsList>

          {/* Matches Tab */}
          <TabsContent value="match" className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
              <h3 className="font-medium">
                {result?.isValid
                  ? `Found ${result.matches.length} match${
                      result.matches.length !== 1 ? 'es' : ''
                    }`
                  : 'Matches will appear here'}
              </h3>
              {result?.matches.length ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleCopy(
                      result.matches.map((m) => m.text).join('\n'),
                      'Matches'
                    )
                  }
                >
                  Copy All Matches
                </Button>
              ) : null}
            </div>

            {/* Highlighted text */}
            {text.trim() && (
              <div
                className="bg-surface p-4 rounded-lg font-mono text-sm overflow-auto max-h-[300px]"
                dangerouslySetInnerHTML={{ __html: highlightedText }}
              ></div>
            )}

            {/* Match details */}
            {result?.isValid && result.matches.length > 0 && (
              <div className="space-y-3 bg-surface p-4 rounded-lg">
                <h4 className="font-medium">Match Details</h4>
                <div className="space-y-2">
                  {result.matches.map((match, index) => (
                    <div
                      key={index}
                      className="bg-background p-3 rounded-md border-l-4 border-primary"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="font-mono text-sm break-all">
                          {match.text}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Index: {match.index}, Length: {match.length}
                        </div>
                      </div>
                      {match.groups.length > 0 && (
                        <div className="mt-2">
                          <div className="text-xs font-medium mb-1">
                            Capture Groups:
                          </div>
                          <div className="grid grid-cols-1 gap-1">
                            {match.groups.map((group, groupIndex) => (
                              <div
                                key={groupIndex}
                                className="text-xs font-mono bg-surface p-1 rounded"
                              >
                                Group {groupIndex + 1}: {group || '(empty)'}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Replace Tab */}
          <TabsContent value="replace" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="replace-input">Replace With</Label>
              <Input
                id="replace-input"
                value={replaceWith}
                onChange={(e) => setReplaceWith(e.target.value)}
                placeholder="Enter replacement text (use $1, $2, etc. for capture groups)"
              />
              <p className="text-xs text-muted-foreground">
                Use $1, $2, etc. to reference capture groups, or $& to reference the whole match.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Result</Label>
                {result?.replacedText && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleCopy(result.replacedText || '', 'Replaced text')
                    }
                  >
                    Copy Result
                  </Button>
                )}
              </div>
              <div className="bg-surface p-4 rounded-lg font-mono text-sm overflow-auto max-h-[300px]">
                {result?.replacedText ? (
                  <pre className="whitespace-pre-wrap break-all">
                    {result.replacedText}
                  </pre>
                ) : (
                  <div className="text-muted-foreground">
                    Enter a replacement pattern to see the result
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Cheatsheet Tab */}
          <TabsContent value="cheatsheet" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-medium">Common Patterns</h3>
                <div className="grid gap-2">
                  {commonRegexPatterns.map((pattern, index) => (
                    <div
                      key={index}
                      className="bg-surface p-3 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{pattern.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {pattern.description}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleLoadPattern(pattern)}
                      >
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Regex Syntax Reference</h3>
                <div className="bg-surface rounded-lg p-3 text-sm">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">.</td>
                        <td>Any character except newline</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">\\w</td>
                        <td>Word character [a-zA-Z0-9_]</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">\\d</td>
                        <td>Digit [0-9]</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">\\s</td>
                        <td>Whitespace character</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">\\W, \\D, \\S</td>
                        <td>Negated versions (non-word, etc.)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">[abc]</td>
                        <td>Character class (a or b or c)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">[^abc]</td>
                        <td>Negated character class</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">^, $</td>
                        <td>Start/end of line</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">\\b</td>
                        <td>Word boundary</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">*</td>
                        <td>0 or more</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">+</td>
                        <td>1 or more</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">?</td>
                        <td>0 or 1 (optional)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">{'{n}'}</td>
                        <td>Exactly n times</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">{'{n,}'}</td>
                        <td>n or more times</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">{'{n,m}'}</td>
                        <td>Between n and m times</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">(...)</td>
                        <td>Capture group</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 font-mono">a|b</td>
                        <td>Alternation (a or b)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="font-medium">Flags</h4>
                <div className="bg-surface rounded-lg p-3 text-sm">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">g</td>
                        <td>Global (find all matches)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">m</td>
                        <td>Multiline (^ and $ match each line)</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">i</td>
                        <td>Case-insensitive</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">s</td>
                        <td>Dot matches newline</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1 pr-2 font-mono">u</td>
                        <td>Unicode support</td>
                      </tr>
                      <tr>
                        <td className="py-1 pr-2 font-mono">y</td>
                        <td>Sticky (match from lastIndex only)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}