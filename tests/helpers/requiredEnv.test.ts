import { afterEach, describe, expect, it, vi } from 'vitest';
import { requiredEnv } from '../../src/helpers/requiredEnv';

describe('requiredEnv', () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('returns the environment variable value', () => {
        vi.stubEnv('TEST_VALUE', 'hello');

        expect(requiredEnv('TEST_VALUE')).toBe('hello');
    });

    it('throws when the environment variable is missing', () => {
        vi.stubEnv('TEST_VALUE', undefined);

        expect(() => requiredEnv('TEST_VALUE')).toThrow(
            'Missing required environment variable: TEST_VALUE',
        );
    });

    it('throws when the environment variable is empty', () => {
        vi.stubEnv('TEST_VALUE', '');

        expect(() => requiredEnv('TEST_VALUE')).toThrow(
            'Missing required environment variable: TEST_VALUE',
        );
    });

    it('throws when the environment variable contains only whitespace', () => {
        vi.stubEnv('TEST_VALUE', '   ');

        expect(() => requiredEnv('TEST_VALUE')).toThrow(
            'Missing required environment variable: TEST_VALUE',
        );
    });
});
