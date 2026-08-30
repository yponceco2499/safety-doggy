import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { CrashScreen } from '@/components/crash-screen';
import { AuthProvider } from '@/lib/auth-context';
import { loadReportTypeDurationOverrides } from '@/lib/report-type-settings';

SplashScreen.preventAutoHideAsync();

// Side-effect import: registers the background walk-tracking task at app
// boot, so Android can wake it up mid-walk even after the JS engine
// restarts. Loaded via require() instead of a static import so a throw here
// is catchable — a static top-level `import` can't be wrapped in try/catch.
try {
  require('@/lib/walk-tracking');
} catch (error) {
  console.error('walk-tracking registration failed at boot:', error);
}

// Fire-and-forget: not awaited before first render, see the comment on this
// function for why blocking startup on it isn't worth it.
try {
  loadReportTypeDurationOverrides();
} catch (error) {
  console.error('loadReportTypeDurationOverrides failed synchronously:', error);
}

export default function RootLayout() {
  const [globalError, setGlobalError] = useState<Error | null>(null);

  // Temporary diagnostic net (see crash-screen.tsx): catches fatal JS errors
  // that happen outside React's render cycle, which an error boundary alone
  // wouldn't see.
  useEffect(() => {
    const ErrorUtils = (global as unknown as { ErrorUtils?: { setGlobalHandler: (fn: (e: Error) => void) => void } })
      .ErrorUtils;
    ErrorUtils?.setGlobalHandler((error) => setGlobalError(error));
  }, []);

  if (globalError) {
    return (
      <SafeAreaProvider>
        <CrashScreen>
          {(() => {
            throw globalError;
          })()}
        </CrashScreen>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <CrashScreen>
        <AuthProvider>
          <AnimatedSplashOverlay />
          <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
      </CrashScreen>
    </SafeAreaProvider>
  );
}
