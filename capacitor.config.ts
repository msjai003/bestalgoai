
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1272f5f4c33644d09e9e8d8fa20dfcf6',
  appName: 'bestalgoai',
  webDir: 'dist',
  server: {
    url: 'https://bestalgoai.lovable.app',
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
