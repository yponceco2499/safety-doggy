import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { completePasswordReset } from '@/lib/auth';

// Reached via the "safetydoggy://reset-password#access_token=...&refresh_token=..."
// link sent by sendPasswordReset() (see src/lib/auth.ts).
//
// Supabase's /auth/v1/verify link redirects here using the *implicit* flow:
// the session tokens (or an error) are appended after a `#`, not as a `?`
// query param — confirmed by following the actual redirect Location header.
// expo-router's useLocalSearchParams() only reads the query string, so it
// never sees this; the raw URL has to be parsed by hand instead.
function parseFragmentParams(url: string | null): URLSearchParams | null {
  if (!url) return null;
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return null;
  return new URLSearchParams(url.slice(hashIndex + 1));
}

export default function ResetPasswordScreen() {
  const url = Linking.useURL();
  const [exchanging, setExchanging] = useState(true);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const initialUrl = url ?? (await Linking.getInitialURL());
      const params = parseFragmentParams(initialUrl);
      if (!params) return; // not resolved yet — the timeout fallback below handles a true dead-end

      const errorDescription = params.get('error_description');
      if (errorDescription) {
        if (!cancelled) {
          setLinkError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
          setExchanging(false);
        }
        return;
      }

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      if (!accessToken || !refreshToken) return;

      const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      if (cancelled) return;
      setLinkError(error ? "Ce lien de réinitialisation est invalide ou a expiré. Demandez-en un nouveau." : null);
      setExchanging(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  // If the URL never resolves to usable params at all (route opened without
  // a link), stop waiting after a few seconds instead of spinning forever.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setExchanging((stillWaiting) => {
        if (stillWaiting) setLinkError("Ce lien de réinitialisation est invalide ou incomplet.");
        return false;
      });
    }, 5000);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = async () => {
    setFormError(null);
    if (password.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setSubmitting(true);
    try {
      await completePasswordReset(password);
      setDone(true);
    } catch {
      setFormError("La mise à jour a échoué. Réessayez ou demandez un nouveau lien.");
    } finally {
      setSubmitting(false);
    }
  };

  if (exchanging) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (linkError) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Lien invalide</Text>
        <Text style={styles.message}>{linkError}</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/forgot-password')}>
          <Text style={styles.buttonLabel}>Demander un nouveau lien</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Mot de passe mis à jour</Text>
        <Text style={styles.message}>Vous pouvez maintenant vous reconnecter avec votre nouveau mot de passe.</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonLabel}>Retour à la carte</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nouveau mot de passe</Text>

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.label}>Confirmer le mot de passe</Text>
      <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      {formError && <Text style={styles.error}>{formError}</Text>}

      <Pressable style={styles.button} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.buttonLabel}>Valider</Text>}
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  message: { fontSize: 15, textAlign: 'center', color: '#555' },
  label: { fontSize: 13, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  error: { color: '#D32F2F', fontSize: 13, textAlign: 'center' },
  button: { backgroundColor: '#208AEF', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonLabel: { color: 'white', fontWeight: '700' },
});
