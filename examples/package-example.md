# Package.json Example for React App

Here's an example of how to add Usetiful SDK to your React project:

```json
{
  "name": "my-react-app",
  "version": "0.1.0",
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "usetiful-sdk": "^0.3.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

## Environment Variables

Add your Usetiful token to your environment variables:

```bash
# .env
REACT_APP_USETIFUL_TOKEN=your_token_here
```

## TypeScript Support

The SDK includes full TypeScript definitions, so you get intellisense and type checking out of the box:

```typescript
import { loadUsetifulScript, setUsetifulTags } from 'usetiful-sdk';
// TypeScript will provide autocomplete and type checking
```
