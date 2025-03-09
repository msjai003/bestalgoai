
/// <reference types="vite/client" />

import { BeforeInstallPromptEvent } from './types/installation';

declare global {
  interface Window {
    deferredInstallPrompt: BeforeInstallPromptEvent | null;
  }
}
