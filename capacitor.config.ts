import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.laiqian.app',
  appName: '来钱',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
    // Reserve space for the status bar / gesture nav bar instead of letting
    // the WebView draw edge-to-edge underneath them (Android 15+ forces
    // edge-to-edge by default, which was hiding the bottom FAB button).
    adjustMarginsForEdgeToEdge: 'force',
  },
  server: {
    androidScheme: 'https',
  },
}

export default config
