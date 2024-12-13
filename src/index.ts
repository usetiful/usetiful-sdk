interface UserApi {
  setTags: (tags: UsetifulTags) => void;
  setId: (userId: string | null ) => void;
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

export function loadUsetifulScript(token: string, settings: ScriptSettings = {}): void {
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

    if (settings.identifyUser) {
      scriptElement.dataset.identifyUser = '1';
    }
  
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(scriptElement);
}

export function setUsetifulTags(tags: UsetifulTags = {}): void {
  const { userId, ...tagsWithoutUserId } = tags;

  window.usetifulTags = window.usetifulTags || {};

  if (userId !== undefined) {
    if (window.USETIFUL?.user) {
      try {
        window.USETIFUL.user.setId(userId);
      } catch (error) {
        console.error("Failed to set user ID:", error);
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
    console.error("Failed to set Usetiful tags:", error);
  }
}
