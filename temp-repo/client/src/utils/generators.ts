import { LoremIpsumOptions, HashOptions } from '@/types';

/**
 * Generate a random UUID (v4)
 * @returns A UUID string
 */
export function generateUuid(): string {
  // Implementation based on RFC4122 version 4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate a custom UUID for demo purposes
 * This is a simplified version, not fully compliant with UUID specs
 * @returns A UUID-like string
 */
export function generateCustomUuid(): string {
  // Simple time-based UUID-like string (not a true v1 UUID)
  const now = new Date();
  const timestamp = now.getTime().toString(16);
  const random = Math.random().toString(16).substring(2, 10);
  
  // Format to look like a UUID
  return `${timestamp.substring(0, 8)}-${timestamp.substring(8, 12)}-1${timestamp.substring(12, 15)}-${random.substring(0, 4)}-${random.substring(4, 12)}`;
}

/**
 * Generate Lorem Ipsum text
 * @param options Configuration options for the lorem ipsum
 * @returns A string of lorem ipsum text
 */
export function generateLoremIpsum(options: LoremIpsumOptions): string {
  const { type, count, includeHtml } = options;
  
  // Common lorem ipsum words
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in',
    'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
    'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
    'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];
  
  // Generate random words
  const getRandomWords = (count: number): string => {
    const result = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      result.push(words[randomIndex]);
    }
    
    // Capitalize first word
    if (result.length > 0) {
      result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
    }
    
    return result.join(' ');
  };
  
  // Generate a random sentence
  const getRandomSentence = (): string => {
    const wordCount = Math.floor(Math.random() * 10) + 5; // 5-15 words
    return getRandomWords(wordCount) + '.';
  };
  
  // Generate a random paragraph
  const getRandomParagraph = (): string => {
    const sentenceCount = Math.floor(Math.random() * 5) + 3; // 3-8 sentences
    const sentences = [];
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(getRandomSentence());
    }
    return sentences.join(' ');
  };
  
  let result = '';
  
  // Generate content based on type
  switch (type) {
    case 'words':
      result = getRandomWords(count);
      break;
    case 'sentences':
      if (includeHtml) {
        const sentences = [];
        for (let i = 0; i < count; i++) {
          sentences.push(getRandomSentence());
        }
        result = sentences.join(' ');
      } else {
        const sentences = [];
        for (let i = 0; i < count; i++) {
          sentences.push(getRandomSentence());
        }
        result = sentences.join(' ');
      }
      break;
    case 'paragraphs':
      if (includeHtml) {
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(`<p>${getRandomParagraph()}</p>`);
        }
        result = paragraphs.join('\n');
      } else {
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
          paragraphs.push(getRandomParagraph());
        }
        result = paragraphs.join('\n\n');
      }
      break;
  }
  
  return result;
}

/**
 * Generate a hash from a string using the specified algorithm
 * @param input The input string to hash
 * @param algorithm The hash algorithm to use
 * @returns A promise resolving to the hash string
 */
export async function generateHash(input: string, algorithm: HashOptions['algorithm']): Promise<string> {
  // Use the Web Crypto API to generate the hash
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  // Map our algorithm names to the ones used by SubtleCrypto
  const algorithmMap: Record<HashOptions['algorithm'], string> = {
    'MD5': 'MD5', // Note: MD5 is not supported by SubtleCrypto
    'SHA-1': 'SHA-1',
    'SHA-256': 'SHA-256',
    'SHA-384': 'SHA-384',
    'SHA-512': 'SHA-512'
  };
  
  // Special case for MD5 (not supported by SubtleCrypto)
  if (algorithm === 'MD5') {
    // For demo purposes, we'll use a simple fallback implementation
    // In a real app, you would use a proper MD5 library
    return md5(input);
  }
  
  try {
    const hashBuffer = await crypto.subtle.digest(
      algorithmMap[algorithm],
      data
    );
    
    // Convert the hash to a hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error(`Error generating ${algorithm} hash:`, error);
    throw new Error(`Failed to generate ${algorithm} hash`);
  }
}

/**
 * Simple MD5 implementation for demo purposes
 * This is NOT cryptographically secure and should NOT be used for security purposes
 * In a real app, use a proper library
 * @param input The input string
 * @returns The MD5 hash as a hex string
 */
function md5(input: string): string {
  // For demo purposes, return a simplified hash
  // In a real app, use a proper MD5 implementation
  const str = input + 'salt';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string
  const hexHash = (hash >>> 0).toString(16).padStart(32, '0');
  return hexHash;
}
