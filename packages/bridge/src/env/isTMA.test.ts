import { CancelablePromise } from '@telegram-apps/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createWindow, mockSessionStorageGetItem, mockWindow } from 'test-utils';

import { request as requestFn } from '@/utils/request.js';
import { isTMA } from './isTMA.js';

const request = vi.mocked(requestFn);

vi.mock('@/utils/request.js', () => ({
  request: vi.fn(),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('async', () => {
  it('should return true if current window contains TelegramWebviewProxy property', async () => {
    createWindow({
      TelegramWebviewProxy: {
        postEvent: 123,
      },
    } as any);
    await expect(isTMA()).resolves.toBe(true);
  });

  it('should return promise with true value resolved, if requesting theme parameters was successful', async () => {
    createWindow();
    request.mockImplementationOnce(() => CancelablePromise.resolve({}));
    await expect(isTMA()).resolves.toBe(true);
  });

  it('should return promise with false value resolved, if requesting theme parameters was unsuccessful', async () => {
    createWindow();
    request.mockImplementationOnce(() => CancelablePromise.reject(new Error('Timed out.')));
    await expect(isTMA()).resolves.toBe(false);
  });
});

describe('sync', () => {
  beforeEach(() => {
    mockWindow({
      location: {
        href: '',
      },
    } as any);
    mockSessionStorageGetItem();
  });

  it('should return true if env contains launch params', () => {
    vi
      .spyOn(window.location, 'href', 'get')
      .mockImplementation(() => {
        return '/abc?tgWebAppStartParam=START#tgWebAppPlatform=tdesktop&tgWebAppVersion=7.0&tgWebAppThemeParams=%7B%7D';
      });

    expect(isTMA('simple')).toBe(true);
  });

  it('should return true if env doesnt contain launch params', () => {
    expect(isTMA('simple')).toBe(false);
  });
});