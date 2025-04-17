import { useState, useEffect } from 'react';
import { getToolById } from '@/utils/tools';
import ToolLayout from '@/layouts/ToolLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/utils/clipboard';

interface CronExpressionInfo {
  isValid: boolean;
  error?: string;
  schedule: string[];
  explanation: string;
  nextDates: Date[];
}

interface CommonCron {
  name: string;
  expression: string;
  description: string;
}

// Common Cron expressions
const commonCronExpressions: CommonCron[] = [
  {
    name: 'Every minute',
    expression: '* * * * *',
    description: 'Run a task every minute'
  },
  {
    name: 'Every hour',
    expression: '0 * * * *',
    description: 'Run a task at the beginning of every hour'
  },
  {
    name: 'Every day at midnight',
    expression: '0 0 * * *',
    description: 'Run a task at 12:00 AM every day'
  },
  {
    name: 'Every day at noon',
    expression: '0 12 * * *',
    description: 'Run a task at 12:00 PM every day'
  },
  {
    name: 'Every Sunday at midnight',
    expression: '0 0 * * 0',
    description: 'Run a task at 12:00 AM every Sunday'
  },
  {
    name: 'Every Monday to Friday at 10:00 AM',
    expression: '0 10 * * 1-5',
    description: 'Run a task at 10:00 AM every weekday'
  },
  {
    name: 'Every 30 minutes',
    expression: '*/30 * * * *',
    description: 'Run a task every 30 minutes'
  },
  {
    name: 'Every month on the 1st at midnight',
    expression: '0 0 1 * *',
    description: 'Run a task at 12:00 AM on the 1st of every month'
  },
  {
    name: 'Every quarter on the 1st at midnight',
    expression: '0 0 1 */3 *',
    description: 'Run a task at 12:00 AM on the 1st of every 3rd month'
  },
  {
    name: 'Every year on January 1st at midnight',
    expression: '0 0 1 1 *',
    description: 'Run a task at 12:00 AM on January 1st'
  }
];

export default function CronParser() {
  const tool = getToolById('cron-parser-tool')!;
  const [cronExpression, setCronExpression] = useState<string>('0 0 * * *');
  const [cronInfo, setCronInfo] = useState<CronExpressionInfo | null>(null);
  const [includeSeconds, setIncludeSeconds] = useState<boolean>(false);
  const { toast } = useToast();

  // Parse cron expression
  useEffect(() => {
    if (cronExpression.trim()) {
      try {
        const info = parseCronExpression(cronExpression, includeSeconds);
        setCronInfo(info);
      } catch (error) {
        setCronInfo({
          isValid: false,
          error: error instanceof Error ? error.message : 'Invalid cron expression',
          schedule: [],
          explanation: '',
          nextDates: []
        });
      }
    } else {
      setCronInfo(null);
    }
  }, [cronExpression, includeSeconds]);

  // Parse cron expression and generate human-readable explanation
  const parseCronExpression = (cron: string, includeSeconds: boolean): CronExpressionInfo => {
    const parts = cron.trim().split(/\s+/);
    
    // Check if the expression has the correct number of parts
    if ((includeSeconds && parts.length !== 6) || (!includeSeconds && parts.length !== 5)) {
      throw new Error(`Invalid cron expression format. Expected ${includeSeconds ? 6 : 5} fields, got ${parts.length}.`);
    }
    
    // Parse each field
    let fields: string[];
    let fieldNames: string[];
    
    if (includeSeconds) {
      fields = ['seconds', 'minutes', 'hours', 'dayOfMonth', 'month', 'dayOfWeek'];
      fieldNames = ['Second', 'Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week'];
    } else {
      fields = ['minutes', 'hours', 'dayOfMonth', 'month', 'dayOfWeek'];
      fieldNames = ['Minute', 'Hour', 'Day of Month', 'Month', 'Day of Week'];
    }
    
    // Validate each field
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      validateCronField(part, fields[i]);
    }
    
    // Generate explanation
    const explanation = generateExplanation(parts, fieldNames, includeSeconds);
    
    // Generate next run dates
    const nextDates = generateNextDates(cron, includeSeconds);
    
    return {
      isValid: true,
      schedule: parts,
      explanation,
      nextDates
    };
  };

  // Validate individual cron field
  const validateCronField = (field: string, fieldName: string): void => {
    // Check for empty field
    if (!field) {
      throw new Error(`${fieldName} field cannot be empty`);
    }
    
    // Allow * (wildcard), */n (step), n-m (range), n,m,o (list), n-m/o (range with step)
    const isValid = /^(\*|\d+)(?:\/\d+)?$|^(\d+-\d+)(?:\/\d+)?$|^(\d+(?:,\d+)*)$/.test(field);
    
    if (!isValid) {
      throw new Error(`Invalid ${fieldName} field: ${field}`);
    }
    
    // Additional field-specific validation
    switch(fieldName) {
      case 'seconds':
      case 'minutes':
        validateRange(field, 0, 59, fieldName);
        break;
      case 'hours':
        validateRange(field, 0, 23, fieldName);
        break;
      case 'dayOfMonth':
        validateRange(field, 1, 31, fieldName);
        break;
      case 'month':
        validateRange(field, 1, 12, fieldName);
        break;
      case 'dayOfWeek':
        validateRange(field, 0, 6, fieldName);
        break;
    }
  };

  // Validate numeric ranges
  const validateRange = (field: string, min: number, max: number, fieldName: string): void => {
    if (field === '*') return;
    
    // Parse numbers in the field
    const numbers: number[] = [];
    
    if (field.includes(',')) {
      // Handle list
      field.split(',').forEach(num => numbers.push(parseInt(num, 10)));
    } else if (field.includes('-')) {
      // Handle range
      const [start, end] = field.split('-')[0].split('/')[0].split('-').map(num => parseInt(num, 10));
      numbers.push(start, end);
    } else if (field.includes('/')) {
      // Handle step
      const base = field.split('/')[0];
      if (base !== '*') {
        numbers.push(parseInt(base, 10));
      }
    } else {
      // Handle single number
      numbers.push(parseInt(field, 10));
    }
    
    // Check if any number is out of range
    const outOfRange = numbers.some(num => num < min || num > max);
    
    if (outOfRange) {
      throw new Error(`${fieldName} values must be between ${min} and ${max}`);
    }
  };

  // Generate human-readable explanation of the cron expression
  const generateExplanation = (parts: string[], fieldNames: string[], includeSeconds: boolean): string => {
    const explanations: string[] = [];
    const offset = includeSeconds ? 0 : 1; // offset for 5-part expressions (no seconds)
    
    // Handle seconds if included
    if (includeSeconds) {
      explanations.push(explainField(parts[0], 'Second', 0, 59));
    }
    
    // Handle other fields
    explanations.push(explainField(parts[0 + offset], 'Minute', 0, 59));
    explanations.push(explainField(parts[1 + offset], 'Hour', 0, 23));
    explanations.push(explainField(parts[2 + offset], 'Day of month', 1, 31));
    explanations.push(explainField(parts[3 + offset], 'Month', 1, 12, [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]));
    explanations.push(explainField(parts[4 + offset], 'Day of week', 0, 6, [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ]));
    
    // Combine all explanations
    return explanations.join('\n');
  };

  // Explain a single cron field
  const explainField = (field: string, fieldName: string, min: number, max: number, names?: string[]): string => {
    if (field === '*') {
      return `${fieldName}: Every ${fieldName.toLowerCase()}`;
    }
    
    if (field.includes('*/')) {
      const step = parseInt(field.split('/')[1], 10);
      return `${fieldName}: Every ${step} ${fieldName.toLowerCase()}${step !== 1 ? 's' : ''}`;
    }
    
    if (field.includes('-')) {
      const [range, step] = field.split('/');
      const [start, end] = range.split('-').map(num => parseInt(num, 10));
      
      let rangeText = '';
      if (names) {
        rangeText = `from ${names[start - min]} to ${names[end - min]}`;
      } else {
        rangeText = `from ${start} to ${end}`;
      }
      
      if (step) {
        const stepNum = parseInt(step, 10);
        return `${fieldName}: Every ${stepNum} ${fieldName.toLowerCase()}${stepNum !== 1 ? 's' : ''} ${rangeText}`;
      }
      
      return `${fieldName}: ${rangeText}`;
    }
    
    if (field.includes(',')) {
      const values = field.split(',').map(num => {
        const parsedNum = parseInt(num, 10);
        return names ? names[parsedNum - min] : parsedNum;
      });
      
      return `${fieldName}: At ${values.join(', ')}`;
    }
    
    const value = parseInt(field, 10);
    const displayValue = names ? names[value - min] : value;
    return `${fieldName}: At ${displayValue}`;
  };

  // Generate next run dates for the cron expression
  const generateNextDates = (cron: string, includeSeconds: boolean): Date[] => {
    const dates: Date[] = [];
    const now = new Date();
    let nextDate = new Date(now);
    
    // Simple approximation for next dates - not a full cron parser
    // In a real app, you'd use a library like "cron-parser" for this
    for (let i = 0; i < 5; i++) {
      nextDate = calculateNextRunDate(nextDate, cron, includeSeconds);
      dates.push(new Date(nextDate));
      // Add a minute to get the next run after this one
      nextDate.setMinutes(nextDate.getMinutes() + 1);
    }
    
    return dates;
  };

  // Calculate the next run date for a cron expression
  const calculateNextRunDate = (after: Date, cron: string, includeSeconds: boolean): Date => {
    // This is a simplified implementation for demo purposes
    // In a real app, use a library like "cron-parser"
    const parts = cron.trim().split(/\s+/);
    const result = new Date(after);
    result.setMilliseconds(0);
    
    // Add one second or one minute to ensure we get the next occurrence
    if (includeSeconds) {
      result.setSeconds(result.getSeconds() + 1);
    } else {
      result.setSeconds(0);
      result.setMinutes(result.getMinutes() + 1);
    }
    
    // For simplicity in this demo version, we'll just increment the date
    // by hours and days based on the cron pattern
    
    // If hours are specified (not *), set the hour
    if (parts[includeSeconds ? 2 : 1] !== '*') {
      const targetHour = parseInt(parts[includeSeconds ? 2 : 1].split(',')[0], 10);
      if (result.getHours() > targetHour) {
        // If current hour is past the target, move to next day
        result.setDate(result.getDate() + 1);
      }
      result.setHours(targetHour);
      result.setMinutes(0);
    }
    
    // If day of month is specified, set the day
    if (parts[includeSeconds ? 3 : 2] !== '*') {
      const targetDay = parseInt(parts[includeSeconds ? 3 : 2].split(',')[0], 10);
      if (result.getDate() > targetDay) {
        // If current day is past the target, move to next month
        result.setMonth(result.getMonth() + 1);
      }
      result.setDate(targetDay);
      result.setHours(0);
      result.setMinutes(0);
    }
    
    return result;
  };

  // Handle form submission
  const handleParse = () => {
    try {
      const info = parseCronExpression(cronExpression, includeSeconds);
      setCronInfo(info);
      
      if (info.isValid) {
        toast({
          title: 'Valid Cron Expression',
          description: 'Successfully parsed the cron expression',
        });
      }
    } catch (error) {
      toast({
        title: 'Invalid Cron Expression',
        description: error instanceof Error ? error.message : 'Failed to parse the cron expression',
        variant: 'destructive',
      });
    }
  };

  // Handle copying to clipboard
  const handleCopy = async (content: string, label: string) => {
    const result = await copyToClipboard(content);
    if (result.success) {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      });
    } else {
      toast({
        title: 'Copy Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  // Handle loading a common cron expression
  const handleLoadExpression = (expression: CommonCron) => {
    setCronExpression(expression.expression);
    setIncludeSeconds(false); // Common expressions don't include seconds
    
    toast({
      title: `Loaded: ${expression.name}`,
      description: expression.description,
    });
  };

  // Handle clearing input
  const handleClear = () => {
    setCronExpression('');
    setCronInfo(null);
    toast({
      title: 'Cleared',
      description: 'Input has been cleared',
    });
  };

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold">Cron Expression Parser</h2>
            <p className="text-muted-foreground">
              Parse cron expressions into human-readable format and calculate next run times.
            </p>
          </div>
          <Button variant="outline" onClick={handleClear}>
            Clear
          </Button>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="cron-input">Cron Expression</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-seconds"
                  checked={includeSeconds}
                  onCheckedChange={setIncludeSeconds}
                />
                <Label htmlFor="include-seconds">Include seconds</Label>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                id="cron-input"
                value={cronExpression}
                onChange={(e) => setCronExpression(e.target.value)}
                placeholder={includeSeconds ? "* * * * * *" : "* * * * *"}
                className="font-mono"
              />
              <Button onClick={handleParse}>Parse</Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {includeSeconds ? 
                "Format: [seconds] [minutes] [hours] [day of month] [month] [day of week]" : 
                "Format: [minutes] [hours] [day of month] [month] [day of week]"}
            </p>
            {cronInfo && !cronInfo.isValid && (
              <p className="text-sm text-destructive">{cronInfo.error}</p>
            )}
          </div>
        </div>

        {/* Tabs for Results and Examples */}
        <Tabs defaultValue="explanation" className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="explanation">Explanation</TabsTrigger>
            <TabsTrigger value="nextDates">Next Run Times</TabsTrigger>
            <TabsTrigger value="examples">Common Examples</TabsTrigger>
          </TabsList>

          {/* Explanation Tab */}
          <TabsContent value="explanation" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Human-Readable Explanation</h3>
              {cronInfo && cronInfo.isValid && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(cronInfo.explanation, 'Explanation')}
                >
                  Copy Explanation
                </Button>
              )}
            </div>

            {cronInfo && cronInfo.isValid ? (
              <div className="bg-surface p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {cronInfo.explanation}
                </pre>
              </div>
            ) : (
              <div className="bg-surface p-6 text-center rounded-lg">
                <p className="text-muted-foreground">
                  Enter a valid cron expression to see its explanation
                </p>
              </div>
            )}

            {/* Field Reference */}
            <div className="space-y-2">
              <h3 className="font-medium">Field Reference</h3>
              <div className="bg-surface rounded-lg p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Field</th>
                      <th className="text-left py-2">Allowed Values</th>
                      <th className="text-left py-2">Special Characters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {includeSeconds && (
                      <tr className="border-b">
                        <td className="py-2 font-medium">Seconds</td>
                        <td>0-59</td>
                        <td>* , - /</td>
                      </tr>
                    )}
                    <tr className="border-b">
                      <td className="py-2 font-medium">Minutes</td>
                      <td>0-59</td>
                      <td>* , - /</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Hours</td>
                      <td>0-23</td>
                      <td>* , - /</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Day of Month</td>
                      <td>1-31</td>
                      <td>* , - /</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Month</td>
                      <td>1-12</td>
                      <td>* , - /</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Day of Week</td>
                      <td>0-6 (0 = Sunday)</td>
                      <td>* , - /</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Next Run Times Tab */}
          <TabsContent value="nextDates" className="space-y-4">
            <h3 className="font-medium">Next Execution Times</h3>

            {cronInfo && cronInfo.isValid ? (
              <div className="space-y-3">
                <div className="grid gap-2">
                  {cronInfo.nextDates.map((date, index) => (
                    <Card key={index} className="p-3 flex justify-between items-center">
                      <div>
                        <span className="font-medium">Run {index + 1}:</span>
                      </div>
                      <div className="text-sm">
                        {date.toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: includeSeconds ? '2-digit' : undefined
                        })}
                      </div>
                    </Card>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Note: These are approximate calculations. For precise scheduling, please verify with your system's cron implementation.
                </p>
              </div>
            ) : (
              <div className="bg-surface p-6 text-center rounded-lg">
                <p className="text-muted-foreground">
                  Enter a valid cron expression to see upcoming run times
                </p>
              </div>
            )}
          </TabsContent>

          {/* Common Examples Tab */}
          <TabsContent value="examples" className="space-y-4">
            <h3 className="font-medium">Common Cron Expressions</h3>

            <div className="grid gap-2">
              {commonCronExpressions.map((example, index) => (
                <Card
                  key={index}
                  className="p-3 hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => handleLoadExpression(example)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{example.name}</h4>
                      <p className="text-xs text-muted-foreground">{example.description}</p>
                    </div>
                    <div className="font-mono bg-surface px-2 py-1 rounded text-sm">
                      {example.expression}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Special Characters Explanation */}
        <div className="space-y-2">
          <h3 className="font-medium">Special Characters</h3>
          <div className="bg-surface rounded-lg p-3">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 pr-3 font-mono font-medium">*</td>
                  <td>Any value (wildcard)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-3 font-mono font-medium">,</td>
                  <td>Value list separator (e.g., 1,3,5)</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 pr-3 font-mono font-medium">-</td>
                  <td>Range of values (e.g., 1-5)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-3 font-mono font-medium">/</td>
                  <td>Step values (e.g., */2 means every 2 units)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}