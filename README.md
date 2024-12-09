# Usetiful SDK

A lightweight utility to easily load the Usetiful script and set tags.

## Installation

You can install this package via npm:

```bash
npm install usetiful-sdk
```

## Usage
#### Loading Usetiful Script

To load the Usetiful script, use the loadUsetifulScript function. You need to provide your unique token for it to work.

```bash 
import { loadUsetifulScript } from 'usetiful-sdk';

loadUsetifulScript('your-usetiful-token');
```

To ensure the Usetiful script waits for user identification (via the userId tag), you can use the optional settings parameter with the identifyUser property. This is particularly useful if you want to prevent content from being displayed to unauthenticated users.

```bash 
loadUsetifulScript('your-usetiful-token', { identifyUser: true });
```

#### Setting Usetiful Tags

You can set tags to customize Usetiful’s behavior or tracking by using the setUsetifulTags function.

```bash 
import { setUsetifulTags } from 'usetiful-sdk';

setUsetifulTags({
  userType: 'admin',
  subscriptionLevel: 'premium',
});
```

This function adds the tags to the window object so they can be accessed by the Usetiful script.


#### Example
```bash
import { loadUsetifulScript, setUsetifulTags } from 'usetiful-sdk';

// Load the Usetiful script
loadUsetifulScript('your-usetiful-token');

// Set custom tags
setUsetifulTags({
  plan: 'pro',
  featureEnabled: true,
});
```

## Notes
- Ensure you replace 'your-usetiful-token' with your actual Usetiful token.
- The script URL is pre-set to https://www.usetiful.com/dist/usetiful.js.

