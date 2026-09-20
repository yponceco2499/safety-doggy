import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resendConfirmationEmail, signInWithEmail } from '@/lib/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Merci de remplir votre email et votre mot de passe.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithEmail(email, password);
      router.replace('/');
    } catch (e) {
      const code = (e as { code?: string } | null)?.code;
      if (code === 'email_not_confirmed') {
        // Correct credentials but the account was never confirmed: send a
        // fresh code and go to the confirmation screen instead of showing a
        // misleading "wrong password".
        try {
          await resendConfirmationEmail(email);
        } catch {
          // The confirmation screen has its own "resend" action.
        }
        router.replace({ pathname: '/confirm-pending', params: { email } });
        return;
      }
      setError('Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </Pressable>
      <Text style={styles.title}>Connexion</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Mot de passe</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonLabel}>Se connecter</Text>}
      </Pressable>

      <Pressable onPress={() => router.push('/forgot-password')}>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  back: { fontSize: 22, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  label: { fontSize: 13, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  error: { color: '#C62828', fontSize: 13 },
  button: { backgroundColor: '#208AEF', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonLabel: { color: 'white', fontWeight: '700' },
  link: { color: '#208AEF', textAlign: 'center', marginTop: 12, fontWeight: '600' },
});
