import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BODY = [
  "1. Objet — SafetyPet est une application communautaire pour consulter et signaler des événements liés aux promenades de chiens dans la région du Havre.",
  "2. Compte — La création d'un compte est requise pour publier un signalement. Vous devez avoir 16 ans ou plus.",
  '3. Contenu des signalements — Les signalements ne doivent jamais identifier une personne ou un animal en particulier.',
  '4. Suppression — Vous pouvez supprimer votre compte à tout moment depuis votre profil.',
];

const FULL_TEXT_URL = 'https://yponceco2499.github.io/safety-doggy/terms.html';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Conditions d'utilisation</Text>
        {BODY.map((line) => (
          <Text key={line} style={styles.paragraph}>
            {line}
          </Text>
        ))}
        <Pressable onPress={() => Linking.openURL(FULL_TEXT_URL)}>
          <Text style={styles.link}>Lire les conditions d'utilisation complètes</Text>
        </Pressable>
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
  link: { fontSize: 15, color: '#208AEF', fontWeight: '600', marginTop: 8 },
});
