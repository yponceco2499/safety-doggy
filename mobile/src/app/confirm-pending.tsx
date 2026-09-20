import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resendConfirmationEmail, verifySignupCode } from '@/lib/auth';

export default function ConfirmPendingScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    if (!email) {
      setError('Email manquant. Recommencez depuis la connexion.');
      return;
    }
    if (code.trim().length < 6) {
      setError('Saisissez le code à 6 chiffres reçu par email.');
      return;
    }
    setSubmitting(true);
    try {
      await verifySignupCode(email, code.trim());
      router.replace('/');
    } catch {
      setError('Code invalide ou expiré. Vérifiez-le ou demandez un nouveau code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError(null);
    try {
      await resendConfirmationEmail(email);
      setResent(true);
    } catch {
      setError("L'envoi a échoué. Réessayez dans quelques instants.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Confirmez votre email</Text>
      <Text style={styles.message}>Un code à 6 chiffres a été envoyé à {email}.</Text>

      <TextInput
        style={styles.input}
        value={code}
        onChangeText={(text) => setCode(text.replace(/\D/g, ''))}
        keyboardType="number-pad"
        maxLength={6}
        autoComplete="one-time-code"
        placeholder="Code à 6 chiffres"
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={handleConfirm} disabled={submitting}>
        {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.buttonLabel}>Confirmer</Text>}
      </Pressable>

      <Pressable onPress={handleResend}>
        <Text style={styles.link}>{resent ? 'Nouveau code envoyé' : 'Renvoyer le code'}</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/')}>
        <Text style={styles.link}>Retour à la carte</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  message: { fontSize: 15, textAlign: 'center', color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 18, textAlign: 'center' },
  error: { color: '#D32F2F', fontSize: 13, textAlign: 'center' },
  button: { backgroundColor: '#208AEF', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonLabel: { color: 'white', fontWeight: '700' },
  link: { color: '#208AEF', textAlign: 'center', fontWeight: '600' },
});
