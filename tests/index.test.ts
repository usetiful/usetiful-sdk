import {
  loadUsetifulScript,
  setUsetifulTags,
  reinitializeUsetiful,
  clearUsetifulProgress,
  removeAllUsetifulTags,
  removeUsetifulTag,
  setUsetifulTag,
} from '../src/index';

describe('loadUsetifulScript', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('should create and append script element to head', () => {
    loadUsetifulScript('test-token');

    const scriptElement = document.getElementById(
      'usetifulScript'
    ) as HTMLScriptElement;
    expect(scriptElement).not.toBeNull();
    expect(scriptElement.async).toBe(true);
    expect(scriptElement.dataset.token).toBe('test-token');
    expect(scriptElement.src).toBe('https://www.usetiful.com/dist/usetiful.js');
  });

  it('should use development URL when NODE_ENV is development', () => {
    process.env.USETIFUL_SCRIPT_URL =
      'https://dev.usetiful.com/dist/usetiful.js';
    loadUsetifulScript('test-token');

    const scriptElement = document.getElementById(
      'usetifulScript'
    ) as HTMLScriptElement;
    expect(scriptElement.src).toBe('https://dev.usetiful.com/dist/usetiful.js');
  });

  it('should set identifyUser attribute when specified', () => {
    loadUsetifulScript('test-token', { identifyUser: true });

    const scriptElement = document.getElementById(
      'usetifulScript'
    ) as HTMLScriptElement;
    expect(scriptElement.dataset.identifyUser).toBe('1');
  });

  it('should not create duplicate script elements', () => {
    loadUsetifulScript('test-token');
    loadUsetifulScript('test-token');

    const scripts = document.querySelectorAll('#usetifulScript');
    expect(scripts.length).toBe(1);
  });
});

describe('setUsetifulTags', () => {
  beforeEach(() => {
    delete (window as any).usetifulTags;
    delete (window as any).USETIFUL;
  });

  it('should initialize window.usetifulTags if not present', () => {
    setUsetifulTags({ test: 'value' });
    expect(window.usetifulTags).toBeDefined();
  });

  it('should set tags on window object when USETIFUL API is not available', () => {
    setUsetifulTags({ plan: 'pro', feature: true });

    expect(window.usetifulTags).toEqual({
      plan: 'pro',
      feature: true,
    });
  });

  it('should handle userId separately', () => {
    setUsetifulTags({ userId: 'user123', plan: 'pro' });

    expect(window.usetifulTags).toEqual({
      userId: 'user123',
      plan: 'pro',
    });
  });

  it('should call USETIFUL API when available', () => {
    const mockSetTags = jest.fn();
    const mockSetId = jest.fn();

    (window as any).USETIFUL = {
      user: {
        setTags: mockSetTags,
        setId: mockSetId,
      },
    };

    setUsetifulTags({ userId: 'user123', plan: 'pro' });

    expect(mockSetId).toHaveBeenCalledWith('user123');
    expect(mockSetTags).toHaveBeenCalledWith({ plan: 'pro' });
  });

  it('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (window as any).USETIFUL = {
      user: {
        setTags: () => {
          throw new Error('Test error');
        },
      },
    };

    setUsetifulTags({ plan: 'pro' });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to set Usetiful tags:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

describe('reinitializeUsetiful', () => {
  it('should call USETIFUL.reinitialize when available', () => {
    const mockReinitialize = jest.fn();
    (window as any).USETIFUL = {
      reinitialize: mockReinitialize,
    };

    reinitializeUsetiful();

    expect(mockReinitialize).toHaveBeenCalled();
  });

  it('should handle missing USETIFUL object gracefully', () => {
    expect(() => reinitializeUsetiful()).not.toThrow();
  });

  it('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (window as any).USETIFUL = {
      reinitialize: () => {
        throw new Error('Test error');
      },
    };

    reinitializeUsetiful();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to reinitialize Usetiful:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

describe('clearUsetifulProgress', () => {
  it('should call user.clearProgress when available', () => {
    const mockClearProgress = jest.fn();
    (window as any).USETIFUL = {
      user: {
        clearProgress: mockClearProgress,
      },
    };

    clearUsetifulProgress();

    expect(mockClearProgress).toHaveBeenCalled();
  });

  it('should handle missing user object gracefully', () => {
    (window as any).USETIFUL = {};
    expect(() => clearUsetifulProgress()).not.toThrow();
  });

  it('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (window as any).USETIFUL = {
      user: {
        clearProgress: () => {
          throw new Error('Test error');
        },
      },
    };

    clearUsetifulProgress();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to clear Usetiful progress:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

describe('removeAllUsetifulTags', () => {
  it('should call user.removeAllTags when available', () => {
    const mockRemoveAllTags = jest.fn();
    (window as any).USETIFUL = {
      user: {
        removeAllTags: mockRemoveAllTags,
      },
    };

    removeAllUsetifulTags();

    expect(mockRemoveAllTags).toHaveBeenCalled();
  });

  it('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (window as any).USETIFUL = {
      user: {
        removeAllTags: () => {
          throw new Error('Test error');
        },
      },
    };

    removeAllUsetifulTags();

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to remove all Usetiful tags:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

describe('removeUsetifulTag', () => {
  it('should call user.removeTag with correct parameter', () => {
    const mockRemoveTag = jest.fn();
    (window as any).USETIFUL = {
      user: {
        removeTag: mockRemoveTag,
      },
    };

    removeUsetifulTag('testTag');

    expect(mockRemoveTag).toHaveBeenCalledWith('testTag');
  });

  it('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (window as any).USETIFUL = {
      user: {
        removeTag: () => {
          throw new Error('Test error');
        },
      },
    };

    removeUsetifulTag('testTag');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to remove Usetiful tag:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

describe('setUsetifulTag', () => {
  it('should call user.setTag with correct parameters', () => {
    const mockSetTag = jest.fn();
    (window as any).USETIFUL = {
      user: {
        setTag: mockSetTag,
      },
    };

    setUsetifulTag('plan', 'pro');

    expect(mockSetTag).toHaveBeenCalledWith('plan', 'pro');
  });

  it('should handle different value types', () => {
    const mockSetTag = jest.fn();
    (window as any).USETIFUL = {
      user: {
        setTag: mockSetTag,
      },
    };

    setUsetifulTag('enabled', true);
    setUsetifulTag('count', 42);
    setUsetifulTag('data', { nested: 'object' });

    expect(mockSetTag).toHaveBeenCalledWith('enabled', true);
    expect(mockSetTag).toHaveBeenCalledWith('count', 42);
    expect(mockSetTag).toHaveBeenCalledWith('data', { nested: 'object' });
  });

  it('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    (window as any).USETIFUL = {
      user: {
        setTag: () => {
          throw new Error('Test error');
        },
      },
    };

    setUsetifulTag('plan', 'pro');

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to set Usetiful tag:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
