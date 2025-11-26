import {
  loadUsetifulScript,
  setUsetifulTags,
  reinitializeUsetiful,
  clearUsetifulProgress,
  removeAllUsetifulTags,
  removeUsetifulTag,
  setUsetifulTag,
} from '../src/index';

describe('Additional Edge Cases', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    delete (window as any).usetifulTags;
    delete (window as any).USETIFUL;
    delete process.env.USETIFUL_SCRIPT_URL;
  });

  describe('setUsetifulTags edge cases', () => {
    it('should handle null input gracefully', () => {
      expect(() => setUsetifulTags(null as any)).not.toThrow();
      expect(window.usetifulTags).toEqual({});
    });

    it('should handle undefined input gracefully', () => {
      expect(() => setUsetifulTags(undefined as any)).not.toThrow();
      expect(window.usetifulTags).toEqual({});
    });

    it('should handle non-object input gracefully', () => {
      expect(() => setUsetifulTags('string' as any)).not.toThrow();
      expect(window.usetifulTags).toEqual({});
    });

    it('should handle numeric input gracefully', () => {
      expect(() => setUsetifulTags(123 as any)).not.toThrow();
      expect(window.usetifulTags).toEqual({});
    });

    it('should merge with existing tags', () => {
      window.usetifulTags = { existing: 'value' };
      setUsetifulTags({ new: 'tag' });

      expect(window.usetifulTags).toEqual({
        existing: 'value',
        new: 'tag',
      });
    });

    it('should handle userId: null correctly', () => {
      const mockSetId = jest.fn();
      const mockSetTags = jest.fn();
      (window as any).USETIFUL = {
        user: {
          setId: mockSetId,
          setTags: mockSetTags,
        },
      };

      setUsetifulTags({ userId: null, plan: 'pro' });

      expect(mockSetId).toHaveBeenCalledWith(null);
      expect(mockSetTags).toHaveBeenCalledWith({ plan: 'pro' });
    });

    it('should handle userId: undefined correctly', () => {
      setUsetifulTags({ userId: undefined, plan: 'pro' });

      expect(window.usetifulTags).toEqual({
        userId: undefined,
        plan: 'pro',
      });
    });

    it('should work when only userId is provided', () => {
      setUsetifulTags({ userId: 'test-user' });

      expect(window.usetifulTags).toEqual({
        userId: 'test-user',
      });
    });

    it('should work with empty object', () => {
      setUsetifulTags({});

      expect(window.usetifulTags).toEqual({});
    });
  });

  describe('loadUsetifulScript edge cases', () => {
    it('should handle empty token', () => {
      loadUsetifulScript('');

      const script = document.getElementById(
        'usetifulScript'
      ) as HTMLScriptElement;
      expect(script?.dataset.token).toBe('');
    });

    it('should use custom script URL from environment', () => {
      process.env.USETIFUL_SCRIPT_URL = 'https://custom.domain.com/script.js';

      loadUsetifulScript('test-token');

      const script = document.getElementById(
        'usetifulScript'
      ) as HTMLScriptElement;
      expect(script.src).toBe('https://custom.domain.com/script.js');
    });

    it('should not set identifyUser attribute when false', () => {
      loadUsetifulScript('test-token', { identifyUser: false });

      const script = document.getElementById(
        'usetifulScript'
      ) as HTMLScriptElement;
      expect(script.dataset.identifyUser).toBeUndefined();
    });

    it('should handle settings with undefined identifyUser', () => {
      loadUsetifulScript('test-token', { identifyUser: undefined });

      const script = document.getElementById(
        'usetifulScript'
      ) as HTMLScriptElement;
      expect(script.dataset.identifyUser).toBeUndefined();
    });

    it('should work with null settings', () => {
      expect(() => loadUsetifulScript('test-token', null as any)).not.toThrow();

      const script = document.getElementById('usetifulScript');
      expect(script).toBeTruthy();
    });

    it('should work with undefined settings', () => {
      expect(() => loadUsetifulScript('test-token', undefined)).not.toThrow();

      const script = document.getElementById('usetifulScript');
      expect(script).toBeTruthy();
    });
  });

  describe('API function edge cases when USETIFUL is partially available', () => {
    it('should handle USETIFUL without user object', () => {
      (window as any).USETIFUL = {};

      expect(() => clearUsetifulProgress()).not.toThrow();
      expect(() => removeAllUsetifulTags()).not.toThrow();
      expect(() => removeUsetifulTag('test')).not.toThrow();
      expect(() => setUsetifulTag('test', 'value')).not.toThrow();
    });

    it('should handle USETIFUL with user but missing methods', () => {
      (window as any).USETIFUL = { user: {} };

      expect(() => clearUsetifulProgress()).not.toThrow();
      expect(() => removeAllUsetifulTags()).not.toThrow();
      expect(() => removeUsetifulTag('test')).not.toThrow();
      expect(() => setUsetifulTag('test', 'value')).not.toThrow();
    });

    it('should handle USETIFUL without reinitialize method', () => {
      (window as any).USETIFUL = { user: {} };

      expect(() => reinitializeUsetiful()).not.toThrow();
    });
  });

  describe('Function parameter validation', () => {
    it('should handle removeUsetifulTag with empty string', () => {
      const mockRemoveTag = jest.fn();
      (window as any).USETIFUL = {
        user: { removeTag: mockRemoveTag },
      };

      removeUsetifulTag('');

      expect(mockRemoveTag).toHaveBeenCalledWith('');
    });

    it('should handle setUsetifulTag with empty string key', () => {
      const mockSetTag = jest.fn();
      (window as any).USETIFUL = {
        user: { setTag: mockSetTag },
      };

      setUsetifulTag('', 'value');

      expect(mockSetTag).toHaveBeenCalledWith('', 'value');
    });

    it('should handle setUsetifulTag with null value', () => {
      const mockSetTag = jest.fn();
      (window as any).USETIFUL = {
        user: { setTag: mockSetTag },
      };

      setUsetifulTag('key', null);

      expect(mockSetTag).toHaveBeenCalledWith('key', null);
    });

    it('should handle setUsetifulTag with undefined value', () => {
      const mockSetTag = jest.fn();
      (window as any).USETIFUL = {
        user: { setTag: mockSetTag },
      };

      setUsetifulTag('key', undefined);

      expect(mockSetTag).toHaveBeenCalledWith('key', undefined);
    });
  });

  describe('Error recovery scenarios', () => {
    it('should continue working after setTags error', () => {
      const mockSetTags = jest
        .fn()
        .mockImplementationOnce(() => {
          throw new Error('First call fails');
        })
        .mockImplementationOnce(() => {}); // Second call succeeds

      (window as any).USETIFUL = {
        user: { setTags: mockSetTags },
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // First call should fail gracefully
      setUsetifulTags({ plan: 'pro' });
      expect(consoleSpy).toHaveBeenCalled();

      // Second call should work
      consoleSpy.mockClear();
      setUsetifulTags({ plan: 'enterprise' });
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(mockSetTags).toHaveBeenCalledTimes(2);

      consoleSpy.mockRestore();
    });

    it('should handle multiple consecutive errors', () => {
      const mockSetTags = jest.fn(() => {
        throw new Error('Always fails');
      });
      (window as any).USETIFUL = {
        user: { setTags: mockSetTags },
      };

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      setUsetifulTags({ plan: 'pro' });
      setUsetifulTags({ role: 'admin' });
      setUsetifulTags({ feature: true });

      expect(consoleSpy).toHaveBeenCalledTimes(3);
      expect(mockSetTags).toHaveBeenCalledTimes(3);

      consoleSpy.mockRestore();
    });
  });

  describe('Complex data handling', () => {
    it('should handle complex nested objects', () => {
      const complexData = {
        user: {
          profile: {
            name: 'Test User',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        features: ['feature1', 'feature2'],
        metadata: null,
        timestamp: new Date('2025-01-01'),
        count: 42,
      };

      setUsetifulTags(complexData);

      expect(window.usetifulTags).toEqual(complexData);
    });

    it('should handle arrays as tag values', () => {
      const mockSetTag = jest.fn();
      (window as any).USETIFUL = {
        user: { setTag: mockSetTag },
      };

      const arrayValue = ['item1', 'item2', 'item3'];
      setUsetifulTag('features', arrayValue);

      expect(mockSetTag).toHaveBeenCalledWith('features', arrayValue);
    });

    it('should handle Date objects as tag values', () => {
      const mockSetTag = jest.fn();
      (window as any).USETIFUL = {
        user: { setTag: mockSetTag },
      };

      const dateValue = new Date('2025-01-01');
      setUsetifulTag('signupDate', dateValue);

      expect(mockSetTag).toHaveBeenCalledWith('signupDate', dateValue);
    });
  });

  describe('Script loading scenarios', () => {
    it('should append script to head even if head has other children', () => {
      // Add some existing elements to head
      const existingMeta = document.createElement('meta');
      existingMeta.name = 'viewport';
      document.head.appendChild(existingMeta);

      const existingTitle = document.createElement('title');
      existingTitle.textContent = 'Test Page';
      document.head.appendChild(existingTitle);

      loadUsetifulScript('test-token');

      const script = document.getElementById('usetifulScript');
      expect(script).toBeTruthy();
      expect(document.head.contains(script!)).toBe(true);

      // Should still have existing elements
      expect(document.head.querySelector('meta[name="viewport"]')).toBeTruthy();
      expect(document.head.querySelector('title')).toBeTruthy();
    });

    it('should work when document.head is empty', () => {
      expect(document.head.children.length).toBe(0);

      loadUsetifulScript('test-token');

      const script = document.getElementById('usetifulScript');
      expect(script).toBeTruthy();
      expect(document.head.children.length).toBe(1);
    });
  });
});
