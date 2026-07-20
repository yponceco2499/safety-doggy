import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resendConfirmationEmail } from '@/lib/auth';

export default function ConfirmPendingScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    await resendConfirmationEmail(email);
    setResent(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Confirmez votre email</Text>
      <Text style={styles.message}>Un lien de confirmation a été envoyé à {email}.</Text>

      <Pressable style={styles.button} onPress={handleResend}>
        <Text style={styles.buttonLabel}>{resent ? 'Email envoyé' : "Renvoyer l'email"}</Text>
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
  button: { backgroundColor: '#208AEF', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonLabel: { color: 'white', fontWeight: '700' },
  link: { color: '#208AEF', textAlign: 'center', fontWeight: '600' },
});
