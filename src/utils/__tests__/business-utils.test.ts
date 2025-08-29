import {
  validateEmail,
  validatePassword,
  formatDate,
  formatDateTime,
  generateUniqueId,
  debounce,
  throttle,
  slugify,
  capitalize,
  truncateText,
  parseNumber,
  formatFileSize,
  isValidUrl,
  generateColorFromString,
  deepClone,
  arrayChunk,
  arrayUnique,
  objectPick,
  objectOmit,
  retryAsync,
  asyncFilter,
  localStorage
} from '../business-utils';

// Mock localStorage for testing
const mockLocalStorage = () => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage()
});

describe('Business Utilities', () => {
  describe('validateEmail', () => {
    test('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('test+tag@example.org')).toBe(true);
    });

    test('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('validates strong passwords', () => {
      const result = validatePassword('StrongPass123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('rejects weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('identifies specific password requirements', () => {
      const result = validatePassword('short');
      expect(result.errors).toContain('Password must be at least 8 characters long');
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
      expect(result.errors).toContain('Password must contain at least one number');
    });
  });

  describe('formatDate', () => {
    test('formats dates correctly', () => {
      const timestamp = new Date('2023-01-15T12:00:00Z').getTime();
      const formatted = formatDate(timestamp);
      expect(formatted).toContain('2023');
      expect(formatted).toContain('Jan');
    });
  });

  describe('formatDateTime', () => {
    test('formats date and time correctly', () => {
      const timestamp = new Date('2023-01-15T10:30:00').getTime();
      const formatted = formatDateTime(timestamp);
      expect(formatted).toContain('Jan 15, 2023');
      expect(formatted).toContain('10:30');
    });
  });

  describe('generateUniqueId', () => {
    test('generates unique IDs', () => {
      const id1 = generateUniqueId();
      const id2 = generateUniqueId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('debounce', () => {
    test('debounces function calls', (done) => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(mockFn).not.toHaveBeenCalled();
      
      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1);
        done();
      }, 150);
    });
  });

  describe('throttle', () => {
    test('throttles function calls', (done) => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      expect(mockFn).toHaveBeenCalledTimes(1);
      
      setTimeout(() => {
        throttledFn();
        expect(mockFn).toHaveBeenCalledTimes(2);
        done();
      }, 150);
    });
  });

  describe('slugify', () => {
    test('converts text to URL-friendly slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Special Characters! @#$')).toBe('special-characters');
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
  });

  describe('capitalize', () => {
    test('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
      expect(capitalize('tEST')).toBe('Test');
    });
  });

  describe('truncateText', () => {
    test('truncates long text', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very lo...');
    });

    test('returns original text if shorter than max length', () => {
      const shortText = 'Short text';
      expect(truncateText(shortText, 20)).toBe('Short text');
    });
  });

  describe('parseNumber', () => {
    test('parses valid numbers', () => {
      expect(parseNumber('123')).toBe(123);
      expect(parseNumber('45.67')).toBe(45.67);
      expect(parseNumber('-89')).toBe(-89);
    });

    test('returns null for invalid numbers', () => {
      expect(parseNumber('abc')).toBe(null);
      expect(parseNumber('')).toBe(null);
      expect(parseNumber('12abc')).toBe(12);
    });
  });

  describe('formatFileSize', () => {
    test('formats file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  describe('isValidUrl', () => {
    test('validates URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('invalid-url')).toBe(false);
    });
  });

  describe('generateColorFromString', () => {
    test('generates consistent colors from strings', () => {
      const color1 = generateColorFromString('test');
      const color2 = generateColorFromString('test');
      const color3 = generateColorFromString('different');
      
      expect(color1).toBe(color2);
      expect(color1).not.toBe(color3);
      expect(color1).toMatch(/^hsl\(\d+, 70%, 50%\)$/);
    });
  });

  describe('deepClone', () => {
    test('deep clones objects', () => {
      const original = {
        name: 'Test',
        nested: { value: 42 },
        array: [1, 2, 3],
        date: new Date()
      };
      
      const cloned = deepClone(original);
      
      expect(cloned).not.toBe(original);
      expect(cloned.nested).not.toBe(original.nested);
      expect(cloned.array).not.toBe(original.array);
      expect(cloned).toEqual(original);
    });
  });

  describe('arrayChunk', () => {
    test('chunks arrays into smaller arrays', () => {
      const array = [1, 2, 3, 4, 5, 6, 7];
      const chunks = arrayChunk(array, 3);
      
      expect(chunks).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });
  });

  describe('arrayUnique', () => {
    test('removes duplicate values', () => {
      const array = [1, 2, 2, 3, 3, 3, 4];
      const unique = arrayUnique(array);
      
      expect(unique).toEqual([1, 2, 3, 4]);
    });
  });

  describe('objectPick', () => {
    test('picks specified properties', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const picked = objectPick(obj, ['a', 'c']);
      
      expect(picked).toEqual({ a: 1, c: 3 });
    });
  });

  describe('objectOmit', () => {
    test('omits specified properties', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const omitted = objectOmit(obj, ['b', 'd']);
      
      expect(omitted).toEqual({ a: 1, c: 3 });
    });
  });

  describe('retryAsync', () => {
    test('retries failed async operations', async () => {
      let attempts = 0;
      const failingFn = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Failed');
        }
        return 'Success';
      };
      
      const result = await retryAsync(failingFn, 3, 10);
      expect(result).toBe('Success');
      expect(attempts).toBe(3);
    });
  });

  describe('asyncFilter', () => {
    test('filters array with async predicate', async () => {
      const array = [1, 2, 3, 4, 5];
      const asyncIsEven = async (n: number) => n % 2 === 0;
      
      const filtered = await asyncFilter(array, asyncIsEven);
      expect(filtered).toEqual([2, 4]);
    });
  });

  describe('localStorage utilities', () => {
    beforeEach(() => {
      (window.localStorage.clear as jest.Mock).mockClear();
      (window.localStorage.getItem as jest.Mock).mockClear();
      (window.localStorage.setItem as jest.Mock).mockClear();
      (window.localStorage.removeItem as jest.Mock).mockClear();
    });

    test('gets items from localStorage', () => {
      (window.localStorage.getItem as jest.Mock).mockReturnValue('{"test": true}');
      
      const result = localStorage.get('test-key');
      expect(window.localStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(result).toEqual({ test: true });
    });

    test('sets items in localStorage', () => {
      const data = { test: true };
      localStorage.set('test-key', data);
      
      expect(window.localStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify(data));
    });

    test('removes items from localStorage', () => {
      localStorage.remove('test-key');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    test('clears localStorage', () => {
      localStorage.clear();
      expect(window.localStorage.clear).toHaveBeenCalled();
    });
  });
});
