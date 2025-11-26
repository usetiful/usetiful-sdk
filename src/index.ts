interface UserApi {
  setTags: (tags: UsetifulTags) => void;
  setId: (userId: string | null) => void;
  clearProgress: () => void;
  removeAllTags: () => void;
  removeTag: (tagName: string) => void;
  setTag: (tagName: string, tagValue: any) => void;
}

interface UsetifulApi {
  user?: UserApi;
  reinitialize: () => void;
}

declare global {
  interface Window {
    usetifulTags?: UsetifulTags;
    USETIFUL?: UsetifulApi;
  }
}
interface UsetifulTags {
  [key: string]: any;
}

interface ScriptSettings {
  identifyUser?: boolean;
}

export function loadUsetifulScript(
  token: string,
  settings: ScriptSettings = {}
): void {
  const scriptId = 'usetifulScript';
  if (document.getElementById(scriptId)) {
    return;
  }

  const scriptElement = document.createElement('script');
  scriptElement.id = scriptId;
  scriptElement.async = true;

  const scriptSrc =
    process.env.USETIFUL_SCRIPT_URL ||
    'https://www.usetiful.com/dist/usetiful.js';
  scriptElement.src = scriptSrc;
  scriptElement.dataset.token = token;

  if (settings && settings.identifyUser) {
    scriptElement.dataset.identifyUser = '1';
  }

  const head = document.getElementsByTagName('head')[0];
  head.appendChild(scriptElement);
}

export function setUsetifulTags(tags: UsetifulTags = {}): void {
  // Protect against null/undefined input
  if (!tags || typeof tags !== 'object') {
    tags = {};
  }

  const { userId, ...tagsWithoutUserId } = tags;

  window.usetifulTags = window.usetifulTags || {};

  if (userId !== undefined) {
    if (window.USETIFUL?.user) {
      try {
        window.USETIFUL.user.setId(userId);
      } catch (error) {
        console.error('Failed to set user ID:', error);
      }
    } else {
      window.usetifulTags.userId = userId;
    }
  }

  try {
    if (window.USETIFUL?.user) {
      window.USETIFUL.user.setTags(tagsWithoutUserId);
    } else {
      Object.assign(window.usetifulTags, tagsWithoutUserId);
    }
  } catch (error) {
    console.error('Failed to set Usetiful tags:', error);
  }
}

export function reinitializeUsetiful(): void {
  try {
    if (window.USETIFUL?.reinitialize) {
      window.USETIFUL.reinitialize();
    }
  } catch (error) {
    console.error('Failed to reinitialize Usetiful:', error);
  }
}

export function clearUsetifulProgress(): void {
  try {
    if (window.USETIFUL?.user?.clearProgress) {
      window.USETIFUL.user.clearProgress();
    }
  } catch (error) {
    console.error('Failed to clear Usetiful progress:', error);
  }
}

export function removeAllUsetifulTags(): void {
  try {
    if (window.USETIFUL?.user?.removeAllTags) {
      window.USETIFUL.user.removeAllTags();
    }
  } catch (error) {
    console.error('Failed to remove all Usetiful tags:', error);
  }
}

export function removeUsetifulTag(tagName: string): void {
  try {
    if (window.USETIFUL?.user?.removeTag) {
      window.USETIFUL.user.removeTag(tagName);
    }
  } catch (error) {
    console.error('Failed to remove Usetiful tag:', error);
  }
}

export function setUsetifulTag(tagName: string, tagValue: any): void {
  try {
    if (window.USETIFUL?.user?.setTag) {
      window.USETIFUL.user.setTag(tagName, tagValue);
    }
  } catch (error) {
    console.error('Failed to set Usetiful tag:', error);
  }
}
