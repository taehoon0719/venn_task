import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { beforeAll, afterAll, afterEach, expect, vi } from 'vitest';

import { server } from './server';

expect.extend(matchers as unknown as Parameters<typeof expect.extend>[0]);

afterEach(() => cleanup());

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});
afterAll(() => server.close());

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { changeLanguage: () => Promise.resolve() },
  }),
}));
