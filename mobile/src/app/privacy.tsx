import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BODY = [
  '1. Données collectées — Email, surnom (optionnel), photo de profil (optionnelle), date d\'inscription.',
  '2. Finalité — Ces données servent uniquement à sécuriser et responsabiliser les signalements.',
  '3. Conservation — Vos données personnelles (profil, chiens, sorties, identifiants de connexion) sont supprimées immédiatement à la clôture du compte. Les signalements sont conservés, anonymisés.',
  '4. Vos droits — Accès, rectification, suppression : contact@safetydoggy.app.',
  '(Texte provisoire — le texte légal définitif sera rédigé avant le lancement.)',
];

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Politique de confidentialité</Text>
        {BODY.map((line) => (
          <Text key={line} style={styles.paragraph}>
            {line}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  back: { fontSize: 22, marginBottom: 8 },
  body: { gap: 12, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  paragraph: { fontSize: 15, color: '#333', lineHeight: 22 },
});
