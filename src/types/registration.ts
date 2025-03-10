
export interface RegistrationData {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  tradingExperience: string;
  preferredMarkets: string[];
  isResearchAnalyst: boolean;
  certificationNumber: string;
}

export interface BrowserInfo {
  browser: string;
  isPrivateMode: boolean;
  userAgent: string;
  cookiesEnabled: boolean;
}

export interface RegistrationState {
  step: number;
  isLoading: boolean;
  connectionError: string | null;
  browserIssue: BrowserInfo | null;
  showFirefoxHelp: boolean;
  isOffline: boolean;
  formData: RegistrationData;
}
