import { useState, useEffect, useRef } from 'react';
import { getToolById } from '@/utils/tools';
import ToolLayout from '@/layouts/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/utils/clipboard';

export default function Base64ImageTool() {
  const tool = getToolById('base64-image-tool')!;
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [includeDataUrl, setIncludeDataUrl] = useState<boolean>(true);
  const [isDecoding, setIsDecoding] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is an image
      if (!selectedFile.type.match('image.*')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }
      
      // Check file size (limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setImage(selectedFile);
      setIsDecoding(false);
    }
  };

  // Convert the selected image to base64
  useEffect(() => {
    if (!image) {
      setPreview(null);
      setBase64String('');
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result as string;
        setPreview(result);
        
        // Extract the base64 part if it's a data URL
        if (result.startsWith('data:')) {
          const base64 = result.split(',')[1];
          setBase64String(includeDataUrl ? result : base64);
        } else {
          setBase64String(result);
        }
      }
    };
    
    reader.readAsDataURL(image);
  }, [image, includeDataUrl]);

  // Handle base64 input change for decoding
  const handleBase64InputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBase64String(e.target.value);
    setIsDecoding(true);
  };

  // Decode the base64 string to an image
  const decodeBase64 = () => {
    try {
      let base64 = base64String.trim();
      
      // If the string doesn't start with 'data:', add the appropriate data URL prefix
      if (!base64.startsWith('data:')) {
        // Try to guess the image type from the base64 string
        const imageType = guessImageType(base64);
        base64 = `data:${imageType};base64,${base64}`;
      }
      
      setPreview(base64);
      toast({
        title: 'Base64 decoded',
        description: 'Successfully decoded base64 to image.',
      });
    } catch (err) {
      toast({
        title: 'Decoding failed',
        description: 'Invalid base64 string. Please check your input.',
        variant: 'destructive',
      });
    }
  };

  // Try to guess the image type from the base64 string
  const guessImageType = (base64: string): string => {
    // Check first few characters to determine file type
    // These are very simplified checks and might not work for all images
    const firstChars = base64.substring(0, 10);
    
    if (firstChars.includes('/9j/')) {
      return 'image/jpeg';
    } else if (firstChars.includes('iVBOR')) {
      return 'image/png';
    } else if (firstChars.includes('R0lGO')) {
      return 'image/gif';
    } else if (firstChars.includes('PHN2Z')) {
      return 'image/svg+xml';
    } else if (firstChars.includes('UklGR')) {
      return 'image/webp';
    }
    
    // Default to png if we can't determine
    return 'image/png';
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    if (!base64String) {
      toast({
        title: 'Nothing to copy',
        description: 'Generate base64 first.',
        variant: 'destructive',
      });
      return;
    }

    const result = await copyToClipboard(base64String);
    if (result.success) {
      toast({
        title: 'Copied!',
        description: 'Base64 copied to clipboard.',
      });
    } else {
      toast({
        title: 'Copy failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  // Handle download of the image from base64
  const handleDownload = () => {
    if (!preview) {
      toast({
        title: 'Nothing to download',
        description: 'Please decode an image first.',
        variant: 'destructive',
      });
      return;
    }

    const link = document.createElement('a');
    link.href = preview;
    link.download = 'decoded-image.' + (preview.split(';')[0].split('/')[1] || 'png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: 'Download started',
      description: 'Image download initiated.',
    });
  };

  // Handle clearing the input
  const handleClear = () => {
    setImage(null);
    setPreview(null);
    setBase64String('');
    setIsDecoding(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast({
      title: 'Cleared',
      description: 'Input and output cleared.',
    });
  };

  // Trigger file input click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isDecoding ? 'Decode Base64 to Image' : 'Encode Image to Base64'}
            </h2>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear All
            </Button>
          </div>

          {/* Mode Switch */}
          <div className="flex items-center space-x-2 mb-4">
            <Label htmlFor="mode-switch">Mode:</Label>
            <span className={!isDecoding ? 'font-medium' : ''}>Encode</span>
            <Switch
              id="mode-switch"
              checked={isDecoding}
              onCheckedChange={setIsDecoding}
            />
            <span className={isDecoding ? 'font-medium' : ''}>Decode</span>
          </div>

          {isDecoding ? (
            <>
              {/* Decode Mode - Base64 Input */}
              <Textarea
                placeholder="Paste your base64 string here..."
                className="min-h-[200px] font-mono text-xs"
                value={base64String}
                onChange={handleBase64InputChange}
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={decodeBase64} disabled={!base64String.trim()}>
                  Decode to Image
                </Button>
                {preview && (
                  <Button variant="secondary" onClick={handleDownload}>
                    Download Image
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Encode Mode - Image Input */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center bg-surface">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
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
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">
                    Drag and drop your image here, or{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline focus:outline-none"
                      onClick={handleBrowseClick}
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-400">
                    Supported formats: JPG, PNG, GIF, SVG, WebP (Max: 5MB)
                  </p>
                </div>
              </div>
              {image && (
                <div className="flex flex-wrap items-center text-sm text-gray-500">
                  <span className="font-medium mr-2">Selected:</span>
                  {image.name} ({(image.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Panel - Output */}
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isDecoding ? 'Image Preview' : 'Base64 Output'}
            </h2>
            {!isDecoding && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-data-url"
                  checked={includeDataUrl}
                  onCheckedChange={setIncludeDataUrl}
                />
                <Label htmlFor="include-data-url">Include data URL</Label>
              </div>
            )}
          </div>

          {isDecoding ? (
            <div className="bg-surface rounded-lg p-4 min-h-[300px] flex items-center justify-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Decoded"
                  className="max-w-full max-h-[300px] object-contain"
                />
              ) : (
                <p className="text-gray-400">
                  Enter a valid base64 string and click "Decode" to see the image
                </p>
              )}
            </div>
          ) : (
            <>
              <Textarea
                className="min-h-[300px] font-mono text-xs"
                value={base64String}
                readOnly
                placeholder="Encoded base64 will appear here..."
              />
              {base64String && (
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleCopy}>
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}