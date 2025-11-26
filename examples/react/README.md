# React Integration Examples

This directory contains practical examples of how to integrate Usetiful SDK with React applications.

## Files

- `useUsetiful.ts` - Custom React hook for Usetiful integration
- `README.md` - This documentation file

## Quick Start

### 1. Install Dependencies

```bash
npm install usetiful-sdk
```

### 2. Set Up Environment Variables

```bash
# .env
REACT_APP_USETIFUL_TOKEN=your_token_here
```

### 3. Use the Hook

```typescript
import { useUsetiful } from './hooks/useUsetiful';

function App() {
  const { updateUserTags, reinitialize } = useUsetiful({
    token: process.env.REACT_APP_USETIFUL_TOKEN!
  });

  // Update user tags when user data changes
  useEffect(() => {
    if (user) {
      updateUserTags({
        userId: user.id,
        email: user.email,
        plan: user.plan
      });
    }
  }, [user, updateUserTags]);

  return <div>Your App</div>;
}
```

## Advanced Usage

### App-Level Integration

```typescript
// App.tsx
import React, { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
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
        signupDate: user.createdAt
      });
    }
  }, [user, isAuthenticated, updateUserTags]);

  // Reinitialize on language change
  useEffect(() => {
    const handleLanguageChange = () => {
      setTimeout(() => reinitialize(), 100);
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => {
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, [reinitialize]);

  return <div className="App">{/* Your content */}</div>;
}
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
    setUsetifulTag('currentPage', location.pathname);

    const timer = setTimeout(() => {
      reinitializeUsetiful();
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);
};
```

### Next.js Integration

```typescript
// hooks/useUsetiful.ts (Next.js version)
import { useEffect } from 'react';
import { loadUsetifulScript } from 'usetiful-sdk';

export const useUsetiful = (token: string) => {
  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      loadUsetifulScript(token);
    }
  }, [token]);
};
```

## TypeScript Support

The hook is fully typed and provides excellent TypeScript support:

```typescript
interface UserTags {
  userId?: string;
  email?: string;
  plan?: 'free' | 'pro' | 'enterprise';
  role?: 'user' | 'admin' | 'moderator';
  [key: string]: any;
}

const { updateUserTags } = useUsetiful({ token: 'your-token' });

// TypeScript will validate the structure
updateUserTags({
  userId: 'user-123',
  plan: 'pro', // Only accepts valid plan values
  email: 'user@example.com',
});
```

## Best Practices

1. **Initialize once** - Call `loadUsetifulScript` only once at the app level
2. **Update tags efficiently** - Batch tag updates using `setUsetifulTags`
3. **Handle route changes** - Call `reinitializeUsetiful` after navigation
4. **Manage user sessions** - Clear tags and progress on logout
5. **Error handling** - The SDK handles errors gracefully, but log them for debugging

## Common Patterns

### Authentication Flow

```typescript
const handleLogin = user => {
  updateUserTags({
    userId: user.id,
    email: user.email,
    loginCount: user.loginCount,
  });
};

const handleLogout = () => {
  removeAllUsetifulTags();
  clearUsetifulProgress();
};
```

### Feature Flags

```typescript
const updateFeatureFlags = flags => {
  Object.entries(flags).forEach(([flag, enabled]) => {
    setUsetifulTag(`feature_${flag}`, enabled);
  });
};
```

### Plan Changes

```typescript
const handlePlanUpgrade = newPlan => {
  setUsetifulTag('plan', newPlan);
  setUsetifulTag('planUpgradeDate', new Date().toISOString());
};
```

## Troubleshooting

### Script Not Loading

- Verify your token is correct
- Check browser console for errors
- Ensure you're in a browser environment (not SSR)

### Tours Not Showing

- Confirm tags are set before tours trigger
- Check targeting conditions in Usetiful dashboard
- Verify DOM elements exist when tours should appear

### SPA Navigation Issues

- Always call `reinitializeUsetiful()` after route changes
- Add small delay after DOM updates: `setTimeout(() => reinitialize(), 100)`

For more detailed documentation, see the main [React Integration Guide](../../docs/REACT_GUIDE.md).
