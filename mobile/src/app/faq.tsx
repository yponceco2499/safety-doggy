import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ITEMS = [
  {
    q: 'Pourquoi faut-il avoir 16 ans ou plus pour créer un compte ?',
    a: "Publier un signalement engage une forme de responsabilité (exactitude de l'information, respect des autres utilisateurs). L'âge minimum de 16 ans est un seuil de bon sens pour cet usage.",
  },
  {
    q: "Pourquoi je ne peux pas écrire un texte libre sur mon signalement ?",
    a: "Pour éviter les dérives (contenu inapproprié, propos diffamatoires, harcèlement) qu'une équipe de deux personnes sans outil de modération ne pourrait pas surveiller en continu. Chaque signalement utilise donc un type prédéfini (icône + catégorie), sans champ de texte libre.",
  },
  {
    q: 'Combien de temps un signalement reste-t-il affiché ?',
    a: "Ça dépend du type : une durée fixe est associée à chaque type de signalement (par exemple 4h pour une chasse en cours, 7 jours pour des chenilles processionnaires). Les points positifs comme un point d'eau restent affichés en permanence jusqu'à suppression par leur créateur. Ces durées ne sont pas modifiables à la création pour éviter qu'un signalement reste actif plus longtemps que justifié.",
  },
  {
    q: 'Qui peut voir mes signalements et est-ce que je suis identifiable ?',
    a: "Les signalements sont anonymes : aucune identité n'est jamais affichée publiquement à côté d'un signalement. Votre position en temps réel n'est jamais visible par les autres utilisateurs non plus.",
  },
  {
    q: "Que se passe-t-il si je signale un contenu comme incorrect ?",
    a: "Un signalement automatiquement retiré de la carte dès qu'il reçoit 4 signalements \"incorrect\" de la part d'utilisateurs différents. C'est réversible : les porteurs du projet peuvent le réactiver après vérification.",
  },
  {
    q: 'Est-ce que je peux supprimer mon compte ?',
    a: "Oui, à tout moment depuis votre profil. Vos données personnelles sont supprimées immédiatement ; vos signalements restent visibles mais sont anonymisés.",
  },
];

export default function FaqScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </Pressable>
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.title}>Questions fréquentes</Text>
        {ITEMS.map((item) => (
          <Text key={item.q} style={styles.item}>
            <Text style={styles.question}>{item.q}{'\n'}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  back: { fontSize: 22, marginBottom: 8 },
  body: { gap: 18, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  item: { fontSize: 15, lineHeight: 22 },
  question: { fontWeight: '700', color: '#111' },
  answer: { color: '#333' },
});
