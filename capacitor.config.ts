
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1272f5f4c33644d09e9e8d8fa20dfcf6',
  appName: 'lovable-app',
  webDir: 'dist',
  server: {
    url: 'https://lovable.app',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
      releaseType: null,
      signingConfigName: null
    }
  }
};

export default config;
