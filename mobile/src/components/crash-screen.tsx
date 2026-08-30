import { Component, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

// Temporary diagnostic net: standalone (non-Expo-Go) release builds don't
// show a red-box for uncaught errors the way Expo Go does — the app just
// disappears with no on-screen indication of what happened. This surfaces
// the real error text directly on screen instead, so it can be read/
// screenshotted without needing USB debugging or a crash-reporting service.
// Remove once the standalone-build launch crash investigation is closed.
export class CrashScreen extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    console.error('CrashScreen caught:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Text style={styles.title}>Erreur au démarrage</Text>
          <Text style={styles.message}>{String(this.state.error?.message ?? this.state.error)}</Text>
          <Text style={styles.stack}>{String(this.state.error?.stack ?? '')}</Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF3F3' },
  content: { padding: 24, paddingTop: 60, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#B00020' },
  message: { fontSize: 15, color: '#333' },
  stack: { fontSize: 11, color: '#666', fontFamily: 'monospace' },
});
