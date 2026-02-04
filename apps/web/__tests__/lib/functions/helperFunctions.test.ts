import { isValidImage, isString } from '@/lib/functions/helperFunctions';

describe('helperFunctions', () => {
  describe('isString', () => {
    it('should return true for string values', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
    });

    it('should return false for non-string values', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString(undefined)).toBe(false);
      expect(isString({})).toBe(false);
      expect(isString([])).toBe(false);
    });
  });

  describe('isValidImage', () => {
    it('should return true for valid image URLs', () => {
      expect(isValidImage('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
      expect(isValidImage('https://example.com/image.png')).toBe('https://example.com/image.png');
      expect(isValidImage('https://example.com/image.webp')).toBe('https://example.com/image.webp');
    });

    it('should return false for invalid URLs', () => {
      expect(isValidImage('not-a-url')).toBe(false);
      expect(isValidImage('')).toBe(false);
      expect(isValidImage('ftp://example.com/image.jpg')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isValidImage(null as any)).toBe(false);
      expect(isValidImage(undefined as any)).toBe(false);
      expect(isValidImage(123 as any)).toBe(false);
    });
  });
});

