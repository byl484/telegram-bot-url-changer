import { describe, expect, it } from 'vitest';
import { validateUrl } from '../../src/bot/urlValidator';

describe('validateUrl', () => {
    it('accepts a valid HTTPS URL', () => {
        expect(validateUrl('https://example.com/path')).toBe('https://example.com/path');
    });

    it('trims surrounding whitespace', () => {
        expect(validateUrl('  https://example.com/path  ')).toBe('https://example.com/path');
    });

    it('rejects invalid URLs', () => {
        expect(validateUrl('not a url')).toBeNull();
    });

    it('rejects HTTP URLs', () => {
        expect(validateUrl('http://example.com')).toBeNull();
    });

    it('rejects URLs with a username', () => {
        expect(validateUrl('https://user@example.com')).toBeNull();
    });

    it('rejects URLs with a password', () => {
        expect(validateUrl('https://user:password@example.com')).toBeNull();
    });

    it('rejects URLs with a port', () => {
        expect(validateUrl('https://example.com:8080')).toBeNull();
    });

    it('rejects URLs containing newlines', () => {
        expect(validateUrl('https://example.com/\nfoo')).toBeNull();
    });

    it('rejects URLs containing carriage returns', () => {
        expect(validateUrl('https://example.com/\rfoo')).toBeNull();
    });

    it('rejects URLs containing tabs', () => {
        expect(validateUrl('https://example.com/\tfoo')).toBeNull();
    });

    it('returns a normalized URL', () => {
        expect(validateUrl('https://example.com')).toBe('https://example.com/');
    });
});
