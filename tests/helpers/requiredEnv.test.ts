import { describe, expect, it, afterEach } from 'vitest';
import { requiredEnv } from '../../src/helpers/requiredEnv';

describe('requiredEnv', () => {
    const originalEnv = process.env;

    afterEach(() => {
        process.env = originalEnv;
    });

    it('returns the environment variable value', () => {
        process.env.TEST_VALUE = 'hello';

        expect(requiredEnv('TEST_VALUE')).toBe('hello');
    });

    it('throws when the environment variable is missing', () => {
        delete process.env.TEST_VALUE;

        expect(() => requiredEnv('TEST_VALUE')).toThrow(
            'Missing required environment variable: TEST_VALUE',
        );
    });

    it('throws when the environment variable is empty', () => {
        process.env.TEST_VALUE = '';

        expect(() => requiredEnv('TEST_VALUE')).toThrow(
            'Missing required environment variable: TEST_VALUE',
        );
    });

    it('throws when the environment variable contains only whitespace', () => {
        process.env.TEST_VALUE = '   ';

        expect(() => requiredEnv('TEST_VALUE')).toThrow(
            'Missing required environment variable: TEST_VALUE',
        );
    });
});
