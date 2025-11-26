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
