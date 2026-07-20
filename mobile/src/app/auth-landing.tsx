import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLandingScreen() {
  const [ageChecked, setAgeChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);

  const canSignUp = ageChecked && termsChecked;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Compte</Text>
      <Text style={styles.subtitle}>Un compte permet de responsabiliser les signalements.</Text>

      <Pressable style={styles.checkboxRow} onPress={() => setAgeChecked((v) => !v)}>
        <View style={[styles.checkbox, ageChecked && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>J'ai 16 ans ou plus</Text>
      </Pressable>

      <Pressable style={styles.checkboxRow} onPress={() => setTermsChecked((v) => !v)}>
        <View style={[styles.checkbox, termsChecked && styles.checkboxChecked]} />
        <Text style={styles.checkboxLabel}>
          J'accepte les{' '}
          <Link href="/terms" style={styles.link}>
            Conditions d'utilisation
          </Link>{' '}
          et la{' '}
          <Link href="/privacy" style={styles.link}>
            Politique de confidentialité
          </Link>
        </Text>
      </Pressable>

      <Pressable style={[styles.button, styles.buttonSecondary, styles.buttonDisabled]} disabled>
        <Text style={styles.buttonSecondaryLabel}>Continuer avec Google (bientôt)</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.buttonPrimary, !canSignUp && styles.buttonDisabled]}
        disabled={!canSignUp}
        onPress={() => router.push('/signup')}>
        <Text style={styles.buttonPrimaryLabel}>S'inscrire par email</Text>
      </Pressable>

      <Pressable style={styles.finePrint} onPress={() => router.push('/login')}>
        <Text style={styles.finePrintText}>
          Vous avez déjà un compte ? <Text style={styles.link}>Se connecter</Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 15, color: '#555' },
  checkboxRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 5, borderWidth: 2, borderColor: '#208AEF', marginTop: 2 },
  checkboxChecked: { backgroundColor: '#208AEF' },
  checkboxLabel: { flex: 1, fontSize: 14 },
  link: { color: '#208AEF', fontWeight: '600' },
  button: { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#208AEF' },
  buttonPrimaryLabel: { color: 'white', fontWeight: '700' },
  buttonSecondary: { borderWidth: 1, borderColor: '#ccc' },
  buttonSecondaryLabel: { color: '#555', fontWeight: '600' },
  buttonDisabled: { opacity: 0.5 },
  finePrint: { marginTop: 8, alignItems: 'center' },
  finePrintText: { fontSize: 14 },
});
