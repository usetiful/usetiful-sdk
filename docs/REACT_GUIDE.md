# React Integration Guide

This guide shows best practices for integrating Usetiful SDK with React applications.

## Quick Start

### 1. Installation

```bash
npm install usetiful-sdk
```

### 2. Environment Setup

Add your Usetiful token to your environment variables:

```bash
# .env
REACT_APP_USETIFUL_TOKEN=your_token_here
```

### 3. Basic Integration

Create a custom hook for Usetiful integration:

```typescript
// hooks/useUsetiful.ts
import { useEffect, useCallback } from 'react';
import {
  loadUsetifulScript,
  setUsetifulTags,
  reinitializeUsetiful,
  clearUsetifulProgress,
} from 'usetiful-sdk';

interface UsetifulConfig {
  token: string;
  identifyUser?: boolean;
}

interface UserTags {
  userId?: string;
  email?: string;
  plan?: string;
  role?: string;
  [key: string]: any;
}

export const useUsetiful = (config: UsetifulConfig) => {
  const { token, identifyUser = true } = config;

  // Initialize Usetiful script
  useEffect(() => {
    loadUsetifulScript(token, { identifyUser });
  }, [token, identifyUser]);

  // Set user tags
  const updateUserTags = useCallback((tags: UserTags) => {
    setUsetifulTags(tags);
  }, []);

  // Reinitialize for language changes or route changes
  const reinitialize = useCallback(() => {
    reinitializeUsetiful();
  }, []);

  // Clear user progress
  const clearProgress = useCallback(() => {
    clearUsetifulProgress();
  }, []);

  return {
    updateUserTags,
    reinitialize,
    clearProgress,
  };
};
```

## App-Level Integration

### Main App Component

```typescript
// App.tsx
import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth'; // Your auth hook
import { useUsetiful } from './hooks/useUsetiful';

function App() {
  const { user, isAuthenticated } = useAuth();
  const { updateUserTags, reinitialize } = useUsetiful({
    token: process.env.REACT_APP_USETIFUL_TOKEN!,
    identifyUser: true
  });

  // Update tags when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      updateUserTags({
        userId: user.id,
        email: user.email,
        plan: user.subscription?.plan,
        role: user.role,
        signupDate: user.createdAt,
        isOnboardingComplete: user.hasCompletedOnboarding
      });
    }
  }, [user, isAuthenticated, updateUserTags]);

  // Reinitialize on language change
  useEffect(() => {
    const handleLanguageChange = () => {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        reinitialize();
      }, 100);
    };

    // Listen for language changes (adjust based on your i18n library)
    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, [reinitialize]);

  return (
    <div className="App">
      {/* Your app content */}
    </div>
  );
}

export default App;
```

## Component-Level Usage

### User Profile Component

```typescript
// components/UserProfile.tsx
import React from 'react';
import { setUsetifulTag, clearUsetifulProgress } from 'usetiful-sdk';

interface UserProfileProps {
  user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const handlePlanUpgrade = (newPlan: string) => {
    // Update user plan and notify Usetiful
    setUsetifulTag('plan', newPlan);
    setUsetifulTag('lastPlanChange', new Date().toISOString());
  };

  const handleResetOnboarding = () => {
    clearUsetifulProgress();
    setUsetifulTag('onboardingReset', true);
  };

  return (
    <div>
      <h2>User Profile</h2>
      <p>Current Plan: {user.plan}</p>

      <button onClick={() => handlePlanUpgrade('premium')}>
        Upgrade to Premium
      </button>

      <button onClick={handleResetOnboarding}>
        Reset Onboarding
      </button>
    </div>
  );
};
```

## Advanced Patterns

### Context Provider Pattern

```typescript
// contexts/UsetifulContext.tsx
import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useUsetiful } from '../hooks/useUsetiful';
import { useAuth } from '../hooks/useAuth';

interface UsetifulContextValue {
  updateUserTags: (tags: any) => void;
  reinitialize: () => void;
  clearProgress: () => void;
}

const UsetifulContext = createContext<UsetifulContextValue | undefined>(undefined);

interface UsetifulProviderProps {
  children: ReactNode;
  token: string;
}

export const UsetifulProvider: React.FC<UsetifulProviderProps> = ({
  children,
  token
}) => {
  const { user, isAuthenticated } = useAuth();
  const { updateUserTags, reinitialize, clearProgress } = useUsetiful({
    token,
    identifyUser: true
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      updateUserTags({
        userId: user.id,
        email: user.email,
        plan: user.subscription?.plan,
        role: user.role,
        signupDate: user.createdAt
      });
    }
  }, [user, isAuthenticated, updateUserTags]);

  return (
    <UsetifulContext.Provider value={{ updateUserTags, reinitialize, clearProgress }}>
      {children}
    </UsetifulContext.Provider>
  );
};

export const useUsetifulContext = (): UsetifulContextValue => {
  const context = useContext(UsetifulContext);
  if (!context) {
    throw new Error('useUsetifulContext must be used within a UsetifulProvider');
  }
  return context;
};
```

### Router Integration

```typescript
// hooks/useRouterUsetiful.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { reinitializeUsetiful, setUsetifulTag } from 'usetiful-sdk';

export const useRouterUsetiful = () => {
  const location = useLocation();

  useEffect(() => {
    // Update current page tag
    setUsetifulTag('currentPage', location.pathname);

    // Reinitialize Usetiful for new page
    const timer = setTimeout(() => {
      reinitializeUsetiful();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);
};
```

## Authentication Flow Integration

```typescript
// hooks/useAuthUsetiful.ts
import { useEffect } from 'react';
import {
  setUsetifulTags,
  removeAllUsetifulTags,
  clearUsetifulProgress,
} from 'usetiful-sdk';

export const useAuthUsetiful = (
  user: User | null,
  isAuthenticated: boolean
) => {
  useEffect(() => {
    if (isAuthenticated && user) {
      // User logged in
      setUsetifulTags({
        userId: user.id,
        email: user.email,
        plan: user.subscription?.plan,
        role: user.role,
        loginCount: user.loginCount,
        lastLogin: new Date().toISOString(),
        isNewUser: user.isNewUser,
      });
    } else {
      // User logged out
      removeAllUsetifulTags();
      clearUsetifulProgress();
    }
  }, [user, isAuthenticated]);
};
```

## Feature Flag Integration

```typescript
// hooks/useFeatureFlags.ts
import { useEffect } from 'react';
import { setUsetifulTag } from 'usetiful-sdk';

export const useFeatureFlags = (flags: Record<string, boolean>) => {
  useEffect(() => {
    Object.entries(flags).forEach(([flag, enabled]) => {
      setUsetifulTag(`feature_${flag}`, enabled);
    });
  }, [flags]);
};
```

## A/B Testing Integration

```typescript
// hooks/useExperiments.ts
import { useEffect } from 'react';
import { setUsetifulTag } from 'usetiful-sdk';

export const useExperiments = () => {
  const trackExperiment = (experimentName: string, variant: string) => {
    setUsetifulTag(`experiment_${experimentName}`, variant);
  };

  const trackConversion = (experimentName: string, conversionType: string) => {
    setUsetifulTag(`conversion_${experimentName}`, conversionType);
    setUsetifulTag(
      `conversion_${experimentName}_timestamp`,
      new Date().toISOString()
    );
  };

  return { trackExperiment, trackConversion };
};
```

## TypeScript Integration

### Type Definitions

```typescript
// types/usetiful.ts
export interface UserTags {
  userId?: string;
  email?: string;
  plan?: 'free' | 'pro' | 'enterprise';
  role?: 'user' | 'admin' | 'moderator';
  signupDate?: string;
  lastLogin?: string;
  isNewUser?: boolean;
  hasCompletedOnboarding?: boolean;
  [key: string]: any;
}

export interface UsetifulConfig {
  token: string;
  identifyUser?: boolean;
  autoTrackPages?: boolean;
}
```

### Strongly Typed Hook

```typescript
// hooks/useTypedUsetiful.ts
import { useCallback } from 'react';
import { setUsetifulTags, setUsetifulTag } from 'usetiful-sdk';
import { UserTags } from '../types/usetiful';

export const useTypedUsetiful = () => {
  const updateUserTags = useCallback((tags: UserTags) => {
    setUsetifulTags(tags);
  }, []);

  const updateUserPlan = useCallback((plan: UserTags['plan']) => {
    setUsetifulTag('plan', plan);
  }, []);

  const updateUserRole = useCallback((role: UserTags['role']) => {
    setUsetifulTag('role', role);
  }, []);

  return {
    updateUserTags,
    updateUserPlan,
    updateUserRole,
  };
};
```

## Error Handling

```typescript
// hooks/useUsetifulWithErrorHandling.ts
import { useCallback } from 'react';
import { setUsetifulTags } from 'usetiful-sdk';

export const useUsetifulWithErrorHandling = () => {
  const updateUserTagsSafely = useCallback((tags: any) => {
    try {
      setUsetifulTags(tags);
    } catch (error) {
      console.error('Failed to update Usetiful tags:', error);
      // Optional: Send to error reporting service
    }
  }, []);

  return { updateUserTagsSafely };
};
```

## Performance Optimization

### Debounced Updates

```typescript
// hooks/useDebouncedUsetiful.ts
import { useCallback } from 'react';
import { debounce } from 'lodash';
import { setUsetifulTags } from 'usetiful-sdk';

export const useDebouncedUsetiful = (delay: number = 300) => {
  const debouncedUpdateTags = useCallback(
    debounce((tags: any) => {
      setUsetifulTags(tags);
    }, delay),
    [delay]
  );

  return { updateUserTags: debouncedUpdateTags };
};
```

### Memoized Tag Updates

```typescript
// hooks/useMemoizedUsetiful.ts
import { useCallback, useMemo } from 'react';
import { setUsetifulTags } from 'usetiful-sdk';

export const useMemoizedUsetiful = (user: User | null) => {
  const userTags = useMemo(() => {
    if (!user) return {};

    return {
      userId: user.id,
      email: user.email,
      plan: user.subscription?.plan,
      role: user.role,
      signupDate: user.createdAt,
    };
  }, [user]);

  const updateTags = useCallback(() => {
    setUsetifulTags(userTags);
  }, [userTags]);

  return { updateTags };
};
```

## Testing

### Test Utilities

```typescript
// test-utils/usetiful.ts
import { jest } from '@jest/globals';

export const mockUsetifulSDK = () => {
  return {
    loadUsetifulScript: jest.fn(),
    setUsetifulTags: jest.fn(),
    setUsetifulTag: jest.fn(),
    reinitializeUsetiful: jest.fn(),
    clearUsetifulProgress: jest.fn(),
    removeAllUsetifulTags: jest.fn(),
    removeUsetifulTag: jest.fn(),
  };
};
```

### Component Testing

```typescript
// __tests__/useUsetiful.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useUsetiful } from '../hooks/useUsetiful';
import { mockUsetifulSDK } from '../test-utils/usetiful';

jest.mock('usetiful-sdk', () => mockUsetifulSDK());

describe('useUsetiful', () => {
  it('should initialize with token', () => {
    const { result } = renderHook(() => useUsetiful({ token: 'test-token' }));

    expect(result.current.updateUserTags).toBeDefined();
    expect(result.current.reinitialize).toBeDefined();
    expect(result.current.clearProgress).toBeDefined();
  });
});
```

## Common Pitfalls and Solutions

### 1. Multiple Script Loading

**Problem**: Script loads multiple times in development
**Solution**: Use useEffect dependency array properly

```typescript
useEffect(() => {
  loadUsetifulScript(token);
}, [token]); // Only re-run if token changes
```

### 2. Tags Not Updating

**Problem**: Tags don't update after route changes
**Solution**: Call reinitializeUsetiful after navigation

```typescript
useEffect(() => {
  reinitializeUsetiful();
}, [location.pathname]);
```

### 3. Memory Leaks

**Problem**: Event listeners not cleaned up
**Solution**: Always clean up in useEffect

```typescript
useEffect(() => {
  const handler = () => reinitializeUsetiful();
  window.addEventListener('languagechange', handler);

  return () => {
    window.removeEventListener('languagechange', handler);
  };
}, []);
```

## Best Practices Summary

1. ✅ Use custom hooks for reusability
2. ✅ Initialize once at app level
3. ✅ Update tags when user data changes
4. ✅ Reinitialize after route/language changes
5. ✅ Handle errors gracefully
6. ✅ Use TypeScript for type safety
7. ✅ Test your integrations
8. ✅ Optimize for performance
9. ✅ Clean up event listeners
10. ✅ Use environment variables for tokens
