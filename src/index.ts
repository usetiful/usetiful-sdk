declare global {
  interface Window {
    usetifulTags?: UsetifulTags;
  }
}
interface UsetifulTags {
  [key: string]: any;
}

export function loadUsetifulScript(token: string): void {
    const scriptId = 'usetifulScript';
    if (document.getElementById(scriptId)) {
      return;
    }
  
    const scriptElement = document.createElement('script');
    scriptElement.id = scriptId;
    scriptElement.async = true;

    const scriptSrc = process.env.USETIFUL_SCRIPT_URL || 'https://www.usetiful.com/dist/usetiful.js';
    scriptElement.src = scriptSrc;
    scriptElement.dataset.token = token;
  
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(scriptElement);
}

export function setUsetifulTags(tags: UsetifulTags): void {
  window.usetifulTags = tags;
}