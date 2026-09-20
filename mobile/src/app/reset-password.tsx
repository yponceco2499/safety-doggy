import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { completePasswordReset, verifyRecoveryCode } from '@/lib/auth';

// Second step of the password reset: the user types the 6-digit code from the
// email (see sendPasswordReset in src/lib/auth.ts) plus a new password. The
// code is verified first (which opens a short recovery session), then the
// password is updated on that session.
export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (!email) {
      setError("Email manquant. Recommencez depuis « Mot de passe oublié ».");
      return;
    }
    if (code.trim().length < 6) {
      setError('Saisissez le code à 6 chiffres reçu par email.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }
    setSubmitting(true);
    try {
      await verifyRecoveryCode(email, code.trim());
    } catch {
      setError('Code invalide ou expiré. Vérifiez-le ou demandez un nouveau code.');
      setSubmitting(false);
      return;
    }
    try {
      await completePasswordReset(password);
      setDone(true);
    } catch {
      setError("Le code est valide mais la mise à jour du mot de passe a échoué. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Mot de passe mis à jour</Text>
        <Text style={styles.message}>Votre nouveau mot de passe est enregistré.</Text>
        <Pressable style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonLabel}>Retour à la carte</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Nouveau mot de passe</Text>
      <Text style={styles.message}>Un code à 6 chiffres a été envoyé à {email ?? 'votre adresse email'}.</Text>

      <Text style={styles.label}>Code reçu par email</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={(text) => setCode(text.replace(/\D/g, ''))}
        keyboardType="number-pad"
        maxLength={6}
        autoComplete="one-time-code"
      />

      <Text style={styles.label}>Nouveau mot de passe</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={styles.label}>Confirmer le mot de passe</Text>
      <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.buttonLabel}>Valider</Text>}
      </Pressable>

      <Pressable onPress={() => router.replace('/forgot-password')}>
        <Text style={styles.link}>Renvoyer un code</Text>
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
  link: { color: '#208AEF', textAlign: 'center', fontWeight: '600', marginTop: 4 },
});
