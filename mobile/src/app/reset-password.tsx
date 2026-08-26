import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { completePasswordReset } from '@/lib/auth';

// Reached via the "safetydoggy://reset-password?code=..." link sent by
// sendPasswordReset() (see src/lib/auth.ts). Supabase's client uses the PKCE
// flow, so the link carries a one-time `code` that must be exchanged for a
// real (recovery) session before updateUser({ password }) is allowed to
// change it — this screen does both steps.
export default function ResetPasswordScreen() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const [exchanging, setExchanging] = useState(true);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!code) {
      setLinkError("Ce lien de réinitialisation est invalide ou incomplet.");
      setExchanging(false);
      return;
    }
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) setLinkError("Ce lien de réinitialisation est invalide ou a expiré. Demandez-en un nouveau.");
      })
      .finally(() => setExchanging(false));
  }, [code]);

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
