import { useState, useEffect } from 'react';
import { getToolById } from '@/utils/tools';
import ToolLayout from '@/layouts/ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/utils/clipboard';

interface JwtParts {
  header: string;
  payload: string;
  signature: string;
  isValid: boolean;
  error?: string;
}

export default function JwtDecoder() {
  const tool = getToolById('jwt-decoder-tool')!;
  const [jwtToken, setJwtToken] = useState<string>('');
  const [decodedJwt, setDecodedJwt] = useState<JwtParts | null>(null);
  const [activeTab, setActiveTab] = useState<string>('payload');
  const { toast } = useToast();

  // Decode JWT when input changes
  useEffect(() => {
    if (jwtToken.trim()) {
      try {
        const decoded = decodeJwt(jwtToken);
        setDecodedJwt(decoded);
      } catch (error) {
        // Not a valid JWT, but don't show an error until user clicks "Decode"
        setDecodedJwt(null);
      }
    } else {
      setDecodedJwt(null);
    }
  }, [jwtToken]);

  // Function to decode JWT
  const decodeJwt = (token: string): JwtParts => {
    try {
      // Split the token into parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Expected 3 parts (header.payload.signature).');
      }

      // Decode header
      const headerBase64 = parts[0];
      const headerJson = atob(headerBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const header = JSON.stringify(JSON.parse(headerJson), null, 2);

      // Decode payload
      const payloadBase64 = parts[1];
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.stringify(JSON.parse(payloadJson), null, 2);

      // Return decoded parts
      return {
        header,
        payload,
        signature: parts[2],
        isValid: true,
      };
    } catch (error) {
      // If it fails, return an error
      return {
        header: '',
        payload: '',
        signature: '',
        isValid: false,
        error: error instanceof Error ? error.message : 'Invalid JWT token',
      };
    }
  };

  // Handle form submission
  const handleDecode = () => {
    if (!jwtToken.trim()) {
      toast({
        title: 'No JWT Provided',
        description: 'Please enter a JWT token to decode',
        variant: 'destructive',
      });
      return;
    }

    try {
      const decoded = decodeJwt(jwtToken);
      setDecodedJwt(decoded);

      if (decoded.isValid) {
        toast({
          title: 'JWT Decoded',
          description: 'Successfully decoded the JWT token',
        });
      } else {
        toast({
          title: 'Invalid JWT',
          description: decoded.error || 'Failed to decode the JWT token',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to decode the JWT token',
        variant: 'destructive',
      });
    }
  };

  // Extract information for display
  const getTokenInfo = () => {
    if (!decodedJwt || !decodedJwt.isValid) return null;

    try {
      const payload = JSON.parse(decodedJwt.payload);
      const header = JSON.parse(decodedJwt.header);

      // Extract common fields
      const algorithm = header.alg || 'Unknown';
      const type = header.typ || 'Unknown';
      const issuer = payload.iss || 'Not specified';
      const subject = payload.sub || 'Not specified';
      
      // Calculate expiration information
      let expirationStatus = 'No expiration';
      let expiration = '';
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        expirationStatus = now > expDate ? 'Expired' : 'Active';
        expiration = expDate.toLocaleString();
      }

      // Calculate issuance time
      let issuedAt = 'Not specified';
      if (payload.iat) {
        issuedAt = new Date(payload.iat * 1000).toLocaleString();
      }

      return {
        algorithm,
        type,
        issuer,
        subject,
        expirationStatus,
        expiration,
        issuedAt,
      };
    } catch (error) {
      return null;
    }
  };

  // Handle copy to clipboard
  const handleCopy = async (text: string) => {
    const result = await copyToClipboard(text);
    if (result.success) {
      toast({
        title: 'Copied!',
        description: 'Content copied to clipboard',
      });
    } else {
      toast({
        title: 'Copy Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  // Handle clear
  const handleClear = () => {
    setJwtToken('');
    setDecodedJwt(null);
    toast({
      title: 'Cleared',
      description: 'Input and output cleared',
    });
  };

  // Token info for display
  const tokenInfo = getTokenInfo();

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">JWT Decoder</h2>
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          </div>
          <p className="text-muted-foreground">
            Decode JSON Web Tokens (JWT) to view header and payload information.
          </p>

          <Textarea
            placeholder="Enter JWT token (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
            className="min-h-[150px] font-mono text-xs"
            value={jwtToken}
            onChange={(e) => setJwtToken(e.target.value)}
          />

          <div className="flex space-x-2">
            <Button onClick={handleDecode} disabled={!jwtToken.trim()} className="flex-1">
              Decode Token
            </Button>
            {decodedJwt?.isValid && (
              <Button
                variant="outline"
                onClick={() => handleCopy(jwtToken)}
                className="shrink-0"
              >
                Copy Token
              </Button>
            )}
          </div>

          {tokenInfo && (
            <div className="bg-surface rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Token Information</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Algorithm:</div>
                <div>{tokenInfo.algorithm}</div>
                <div className="font-medium">Type:</div>
                <div>{tokenInfo.type}</div>
                <div className="font-medium">Issuer:</div>
                <div className="truncate">{tokenInfo.issuer}</div>
                <div className="font-medium">Subject:</div>
                <div className="truncate">{tokenInfo.subject}</div>
                <div className="font-medium">Status:</div>
                <div
                  className={`${
                    tokenInfo.expirationStatus === 'Active'
                      ? 'text-green-500'
                      : tokenInfo.expirationStatus === 'Expired'
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {tokenInfo.expirationStatus}
                </div>
                {tokenInfo.expirationStatus !== 'No expiration' && (
                  <>
                    <div className="font-medium">Expires:</div>
                    <div>{tokenInfo.expiration}</div>
                  </>
                )}
                <div className="font-medium">Issued at:</div>
                <div>{tokenInfo.issuedAt}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Decoded Data */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Decoded Data</h2>

          {decodedJwt?.isValid ? (
            <Tabs
              defaultValue="payload"
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="payload">Payload</TabsTrigger>
                <TabsTrigger value="header">Header</TabsTrigger>
              </TabsList>

              <TabsContent value="payload" className="space-y-3">
                <div className="flex justify-between">
                  <h3 className="font-medium">Payload Data</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(decodedJwt.payload)}
                  >
                    Copy Payload
                  </Button>
                </div>
                <div className="bg-surface rounded-lg p-4 overflow-auto max-h-[400px]">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                    {decodedJwt.payload}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="header" className="space-y-3">
                <div className="flex justify-between">
                  <h3 className="font-medium">Header Data</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(decodedJwt.header)}
                  >
                    Copy Header
                  </Button>
                </div>
                <div className="bg-surface rounded-lg p-4 overflow-auto max-h-[400px]">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                    {decodedJwt.header}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="bg-surface rounded-lg p-8 text-center h-[300px] flex flex-col items-center justify-center">
              {jwtToken.trim() ? (
                <>
                  <svg
                    className="h-12 w-12 text-destructive mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <h3 className="font-medium text-destructive mb-2">Invalid JWT Format</h3>
                  <p className="text-sm text-muted-foreground">
                    The provided string doesn't appear to be a valid JWT token.
                    <br />
                    Please check the format and try again.
                  </p>
                </>
              ) : (
                <>
                  <svg
                    className="h-12 w-12 text-gray-400 mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <h3 className="font-medium mb-2">Enter a JWT Token</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter a JWT token in the input field and click "Decode Token"
                    <br />
                    to view header and payload information.
                  </p>
                </>
              )}
            </div>
          )}

          {/* JWT Structure Visualization */}
          {decodedJwt?.isValid && (
            <div className="space-y-3 pt-4">
              <h3 className="font-medium">Token Structure</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-500/20 rounded p-3 text-center">
                  <div className="font-medium mb-1">Header</div>
                  <div className="text-muted-foreground break-all">
                    {jwtToken.split('.')[0]}
                  </div>
                </div>
                <div className="bg-purple-500/20 rounded p-3 text-center">
                  <div className="font-medium mb-1">Payload</div>
                  <div className="text-muted-foreground break-all">
                    {jwtToken.split('.')[1]}
                  </div>
                </div>
                <div className="bg-emerald-500/20 rounded p-3 text-center">
                  <div className="font-medium mb-1">Signature</div>
                  <div className="text-muted-foreground break-all">
                    {jwtToken.split('.')[2]}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}