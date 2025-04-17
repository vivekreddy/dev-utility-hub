import { useState, useEffect } from 'react';
import ToolLayout from '@/layouts/ToolLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getToolById } from '@/utils/tools';
import { copyToClipboard } from '@/utils/clipboard';
import { useToast } from '@/hooks/use-toast';

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState<string>(`# Markdown Preview

## Introduction
This is a simple markdown preview tool. It converts your markdown into HTML in real-time.

### Features
- **Bold** and *italic* text
- Lists (ordered and unordered)
- [Links](https://example.com)
- Images
- Code blocks

## Code Example
\`\`\`javascript
function greeting(name) {
  return \`Hello, \${name}!\`;
}

console.log(greeting('Developer'));
\`\`\`

## Lists

### Unordered List
- Item 1
- Item 2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

> This is a blockquote that can be used to highlight important information.

---

![Example Image](https://via.placeholder.com/150)

Enjoy using the markdown preview tool!`);
  
  const [html, setHtml] = useState<string>('');
  const { toast } = useToast();
  
  const tool = getToolById('markdown-preview')!;

  useEffect(() => {
    // Convert markdown to HTML
    // For a real app, we would use a proper markdown parser library
    // This is a simplified example
    const convertedHtml = simpleMarkdownToHtml(markdown);
    setHtml(convertedHtml);
  }, [markdown]);

  // Simple markdown parser (very basic implementation)
  // In a real app, we would use a library like marked or remark
  const simpleMarkdownToHtml = (md: string): string => {
    if (!md) return '';
    
    let html = md;
    
    // Headers
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Lists
    html = html.replace(/^\- (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>');
    
    // Images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">');
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
    
    // Horizontal rule
    html = html.replace(/^\-\-\-$/gm, '<hr>');
    
    // Paragraphs
    html = html.replace(/^\s*(\n)?(.+)/gm, function(m) {
      return /^<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m) ? m : '<p>' + m + '</p>';
    });
    
    // Cleanup
    html = html.replace(/<\/ul>\s?<ul>/g, '');
    html = html.replace(/<\/ol>\s?<ol>/g, '');
    html = html.replace(/<\/li>\s?<li>/g, '</li><li>');
    
    return html;
  };

  const handleCopy = () => {
    copyToClipboard(markdown)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Markdown copied to clipboard",
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
    setMarkdown('');
  };

  const handleSample = () => {
    setMarkdown(`# Markdown Preview

## Introduction
This is a simple markdown preview tool. It converts your markdown into HTML in real-time.

### Features
- **Bold** and *italic* text
- Lists (ordered and unordered)
- [Links](https://example.com)
- Images
- Code blocks

## Code Example
\`\`\`javascript
function greeting(name) {
  return \`Hello, \${name}!\`;
}

console.log(greeting('Developer'));
\`\`\`

## Lists

### Unordered List
- Item 1
- Item 2
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

> This is a blockquote that can be used to highlight important information.

---

![Example Image](https://via.placeholder.com/150)

Enjoy using the markdown preview tool!`);
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Markdown Input</h3>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={handleSample}>
                  Sample
                </Button>
                <Button variant="secondary" size="sm" onClick={handleClear}>
                  Clear
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
            <div className="relative h-[600px]">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full h-full resize-none bg-neutral rounded-lg font-mono text-sm p-4 focus:outline-none focus:ring-1 focus:ring-primary overflow-auto"
                placeholder="Write your markdown here..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Preview</h3>
            </div>
            <div 
              className="h-[600px] bg-neutral rounded-lg p-4 overflow-auto prose prose-invert prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tool Info Section */}
      <div className="mt-8 bg-surface rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">About Markdown Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Instructions</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Write or paste markdown in the input panel</li>
              <li>See the rendered HTML in real-time in the preview panel</li>
              <li>Use the sample button to see example markdown</li>
              <li>Copy your markdown with the copy button</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Supported Markdown</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Headers (# for h1, ## for h2, etc.)</li>
              <li>Emphasis (**bold**, *italic*)</li>
              <li>Lists (ordered and unordered)</li>
              <li>Links and images</li>
              <li>Code blocks and inline code</li>
              <li>Blockquotes and horizontal rules</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
