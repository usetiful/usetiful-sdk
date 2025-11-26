import {
  loadUsetifulScript,
  setUsetifulTags,
  reinitializeUsetiful,
  clearUsetifulProgress,
  removeAllUsetifulTags,
  removeUsetifulTag,
  setUsetifulTag,
} from '../src/index';

describe('Edge Cases and Error Handling', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    delete (window as any).usetifulTags;
    delete (window as any).USETIFUL;
  });

  describe('loadUsetifulScript edge cases', () => {
    it('should handle empty token', () => {
      expect(() => loadUsetifulScript('')).not.toThrow();
      const script = document.getElementById(
        'usetifulScript'
      ) as HTMLScriptElement;
      expect(script.dataset.token).toBe('');
    });

    it('should handle null settings', () => {
      expect(() => loadUsetifulScript('token', {} as any)).not.toThrow();
    });

    it('should handle special characters in token', () => {
      const specialToken = 'token-123_$%^&*()';
      loadUsetifulScript(specialToken);
      const script = document.getElementById(
        'usetifulScript'
      ) as HTMLScriptElement;
      expect(script.dataset.token).toBe(specialToken);
    });
  });

  describe('setUsetifulTags edge cases', () => {
    it('should handle null tags object', () => {
      expect(() => setUsetifulTags(null as any)).not.toThrow();
    });

    it('should handle undefined tags object', () => {
      expect(() => setUsetifulTags(undefined as any)).not.toThrow();
    });

    it('should handle complex nested objects', () => {
      const complexTags = {
        user: {
          profile: {
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
        array: [1, 2, 3],
        nullValue: null,
        undefinedValue: undefined,
      };

      expect(() => setUsetifulTags(complexTags)).not.toThrow();
      expect(window.usetifulTags).toEqual(complexTags);
    });

    it('should handle userId as null', () => {
      setUsetifulTags({ userId: null, plan: 'free' });
      expect(window.usetifulTags).toEqual({ userId: null, plan: 'free' });
    });

    it('should handle USETIFUL API throwing errors during setId', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      (window as any).USETIFUL = {
        user: {
          setId: () => {
            throw new Error('SetId error');
          },
          setTags: jest.fn(),
        },
      };

      expect(() =>
        setUsetifulTags({ userId: 'test', plan: 'pro' })
      ).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to set user ID:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('API method edge cases', () => {
    it('should handle removeUsetifulTag with empty string', () => {
      const mockRemoveTag = jest.fn();
      (window as any).USETIFUL = { user: { removeTag: mockRemoveTag } };

      expect(() => removeUsetifulTag('')).not.toThrow();
      expect(mockRemoveTag).toHaveBeenCalledWith('');
    });

    it('should handle setUsetifulTag with null value', () => {
      const mockSetTag = jest.fn();
      (window as any).USETIFUL = { user: { setTag: mockSetTag } };

      expect(() => setUsetifulTag('key', null)).not.toThrow();
      expect(mockSetTag).toHaveBeenCalledWith('key', null);
    });

    it('should handle partial USETIFUL object', () => {
      (window as any).USETIFUL = { user: {} }; // Missing methods

      expect(() => clearUsetifulProgress()).not.toThrow();
      expect(() => removeAllUsetifulTags()).not.toThrow();
      expect(() => removeUsetifulTag('test')).not.toThrow();
      expect(() => setUsetifulTag('test', 'value')).not.toThrow();
      expect(() => reinitializeUsetiful()).not.toThrow();
    });
  });

  describe('Multiple script loading scenarios', () => {
    it('should not create multiple scripts with same ID', () => {
      loadUsetifulScript('token1');
      loadUsetifulScript('token2');
      loadUsetifulScript('token3');

      const scripts = document.querySelectorAll('#usetifulScript');
      expect(scripts.length).toBe(1);
      expect((scripts[0] as HTMLScriptElement).dataset.token).toBe('token1');
    });

    it('should handle rapid successive calls', () => {
      for (let i = 0; i < 10; i++) {
        loadUsetifulScript(`token${i}`);
      }

      const scripts = document.querySelectorAll('#usetifulScript');
      expect(scripts.length).toBe(1);
    });
  });

  describe('Window object state management', () => {
    it('should preserve existing usetifulTags when adding new ones', () => {
      window.usetifulTags = { existing: 'value' };

      setUsetifulTags({ new: 'tag' });

      expect(window.usetifulTags).toEqual({
        existing: 'value',
        new: 'tag',
      });
    });

    it('should handle concurrent tag setting', () => {
      setUsetifulTags({ first: 'value1' });
      setUsetifulTags({ second: 'value2' });

      expect(window.usetifulTags).toEqual({
        first: 'value1',
        second: 'value2',
      });
    });
  });
});
