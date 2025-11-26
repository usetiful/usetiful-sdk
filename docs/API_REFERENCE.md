# API Reference

Complete reference for all Usetiful SDK functions and types.

## Functions

### Core Functions

#### `loadUsetifulScript(token, settings?)`

Loads the Usetiful script and initializes the service.

**Parameters:**

- `token` (string): Your Usetiful project token
- `settings` (object, optional):
  - `identifyUser` (boolean): Enable automatic user identification

**Example:**

```typescript
import { loadUsetifulScript } from 'usetiful-sdk';

loadUsetifulScript('your-token', {
  identifyUser: true,
});
```

**Notes:**

- Call this function once during app initialization
- The script is loaded asynchronously
- Duplicate calls are ignored (script won't load twice)

---

#### `setUsetifulTags(tags)`

Sets multiple user tags for targeting and segmentation.

**Parameters:**

- `tags` (UsetifulTags): Object containing tag key-value pairs

**Example:**

```typescript
import { setUsetifulTags } from 'usetiful-sdk';

setUsetifulTags({
  userId: 'user-123',
  plan: 'premium',
  role: 'admin',
  customField: 'value',
});
```

**Notes:**

- Tags are used for targeting tours and guides
- Special handling for `userId` field
- Safely handles null/undefined input
- Merges with existing tags

### Tag Management

#### `setUsetifulTag(name, value)`

Sets a single user tag.

**Parameters:**

- `name` (string): Tag name
- `value` (any): Tag value

**Example:**

```typescript
import { setUsetifulTag } from 'usetiful-sdk';

setUsetifulTag('plan', 'premium');
setUsetifulTag('feature_enabled', true);
setUsetifulTag('last_login', new Date().toISOString());
```

**Notes:**

- Use for updating individual tags
- More efficient than `setUsetifulTags` for single updates

---

#### `removeUsetifulTag(name)`

Removes a specific tag.

**Parameters:**

- `name` (string): Name of tag to remove

**Example:**

```typescript
import { removeUsetifulTag } from 'usetiful-sdk';

removeUsetifulTag('temporary_flag');
removeUsetifulTag('outdated_preference');
```

**Notes:**

- Only removes the specified tag
- Safe to call with non-existent tag names

---

#### `removeAllUsetifulTags()`

Removes all user tags.

**Example:**

```typescript
import { removeAllUsetifulTags } from 'usetiful-sdk';

// On user logout
const handleLogout = () => {
  removeAllUsetifulTags();
  clearUsetifulProgress();
};
```

**Notes:**

- Useful for user logout scenarios
- Clears all targeting information

### Progress Management

#### `clearUsetifulProgress()`

Clears user's progress through all tours and guides.

**Example:**

```typescript
import { clearUsetifulProgress } from 'usetiful-sdk';

// Reset onboarding progress
const resetOnboarding = () => {
  clearUsetifulProgress();
  setUsetifulTag('onboarding_reset', true);
};
```

**Notes:**

- User will see tours/guides from the beginning
- Useful for onboarding resets
- Often combined with `removeAllUsetifulTags()`

### SPA Support

#### `reinitializeUsetiful()`

Reinitializes Usetiful after route changes or language changes in SPAs.

**Example:**

```typescript
import { reinitializeUsetiful } from 'usetiful-sdk';

// After language change
const changeLanguage = newLang => {
  i18n.changeLanguage(newLang);

  // Small delay to ensure DOM is updated
  setTimeout(() => {
    reinitializeUsetiful();
  }, 100);
};

// After route change (React Router)
useEffect(() => {
  reinitializeUsetiful();
}, [location.pathname]);
```

**Notes:**

- Call after DOM changes that affect tours
- Include small delay after language/content changes
- Essential for SPA navigation

## Types

### `UsetifulTags`

Interface for user tags object.

```typescript
interface UsetifulTags {
  userId?: string;
  [key: string]: any;
}
```

**Common Properties:**

- `userId` (string): Unique user identifier
- `email` (string): User email address
- `plan` (string): Subscription plan
- `role` (string): User role
- `signupDate` (string): Account creation date
- Custom properties as needed

**Example:**

```typescript
const userTags: UsetifulTags = {
  userId: 'user-123',
  email: 'user@example.com',
  plan: 'premium',
  role: 'admin',
  signupDate: '2025-01-01',
  hasCompletedOnboarding: true,
  preferredLanguage: 'en',
  lastActivity: new Date().toISOString(),
};
```

---

### `ScriptSettings`

Configuration options for script loading.

```typescript
interface ScriptSettings {
  identifyUser?: boolean;
}
```

**Properties:**

- `identifyUser` (boolean, optional): Enable automatic user identification

**Example:**

```typescript
const settings: ScriptSettings = {
  identifyUser: true,
};

loadUsetifulScript('your-token', settings);
```

## Environment Variables

### `USETIFUL_SCRIPT_URL`

Override the default Usetiful script URL.

**Default URLs:**

- Production: `https://www.usetiful.com/dist/usetiful.js`
- Development: `https://dev.usetiful.com/dist/usetiful.js`
- Local: `https://www.usetiful.dev/dist/usetiful.js`

**Example:**

```bash
# .env
USETIFUL_SCRIPT_URL=https://dev.usetiful.com/dist/usetiful.js
```

```typescript
// Will use custom URL from environment
loadUsetifulScript('your-token');
```

## Error Handling

All SDK functions include built-in error handling:

```typescript
try {
  setUsetifulTags(userTags);
} catch (error) {
  console.error('Failed to set Usetiful tags:', error);
}
```

**Common Error Scenarios:**

- Usetiful script not loaded yet
- Invalid tag values
- Network connectivity issues
- Browser restrictions

**Best Practices:**

- Functions fail silently with console.error logging
- Always safe to call functions before script loads
- Tags are queued until script is ready

## Browser Compatibility

**Supported Browsers:**

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

**Required Features:**

- ES6 Modules support
- Promise support
- DOM manipulation APIs

**Polyfills:**
Not required - SDK uses only widely supported APIs.

## Performance Considerations

### Bundle Size Impact

- SDK: ~2KB minified + gzipped
- Usetiful script: ~50KB (loaded asynchronously)
- Zero runtime dependencies

### Loading Strategy

```typescript
// ✅ Good: Load once at app startup
useEffect(() => {
  loadUsetifulScript(token);
}, []);

// ❌ Bad: Loading on every render
loadUsetifulScript(token);
```

### Tag Update Optimization

```typescript
// ✅ Good: Batch tag updates
setUsetifulTags({
  plan: 'premium',
  role: 'admin',
  lastLogin: new Date().toISOString(),
});

// ❌ Less efficient: Multiple individual calls
setUsetifulTag('plan', 'premium');
setUsetifulTag('role', 'admin');
setUsetifulTag('lastLogin', new Date().toISOString());
```

## Advanced Usage

### Custom Event Handling

```typescript
// Listen for Usetiful events
window.addEventListener('usetiful:tour-completed', event => {
  console.log('Tour completed:', event.detail);

  // Update user progress
  setUsetifulTag('last_tour_completed', event.detail.tourId);
  setUsetifulTag('tour_completion_date', new Date().toISOString());
});
```

### Conditional Loading

```typescript
// Only load in production
if (process.env.NODE_ENV === 'production') {
  loadUsetifulScript(process.env.REACT_APP_USETIFUL_TOKEN!);
}
```

### Feature Flag Integration

```typescript
const updateFeatureFlags = (flags: Record<string, boolean>) => {
  // Prefix feature flags for easy filtering
  const prefixedFlags = Object.entries(flags).reduce(
    (acc, [key, value]) => {
      acc[`feature_${key}`] = value;
      return acc;
    },
    {} as Record<string, boolean>
  );

  setUsetifulTags(prefixedFlags);
};
```

## Debugging

### Enable Debug Mode

```typescript
// Enable verbose logging
setUsetifulTag('debug_mode', true);
setUsetifulTag('log_level', 'verbose');
```

### Inspect Current State

```typescript
// Check if script is loaded
console.log('Usetiful loaded:', !!window.USETIFUL);

// Inspect current tags
console.log('Current tags:', window.usetifulTags);

// Check API availability
console.log('User API:', window.USETIFUL?.user);
```

### Common Debug Commands

```typescript
// Force reinitialize
reinitializeUsetiful();

// Clear everything and start fresh
removeAllUsetifulTags();
clearUsetifulProgress();
reinitializeUsetiful();

// Check script loading
const script = document.getElementById('usetifulScript');
console.log('Script element:', script);
console.log('Script loaded:', script?.getAttribute('data-loaded'));
```
