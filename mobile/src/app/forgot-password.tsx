import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { sendPasswordReset } from '@/lib/auth';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await sendPasswordReset(email);
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </Pressable>
      <Text style={styles.title}>Réinitialiser le mot de passe</Text>

      {sent ? (
        <Text style={styles.info}>Si cet email existe, un lien de réinitialisation a été envoyé.</Text>
      ) : (
        <>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonLabel}>Envoyer le lien</Text>}
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 12 },
  back: { fontSize: 22, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  label: { fontSize: 13, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  info: { fontSize: 15 },
  button: { backgroundColor: '#208AEF', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  buttonLabel: { color: 'white', fontWeight: '700' },
});
