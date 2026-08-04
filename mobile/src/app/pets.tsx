import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth-context';
import { createPet, deletePet, fetchMyPets, updatePetVaccineReminder, type Pet } from '@/lib/pets';
import { cancelVaccineReminder, scheduleVaccineReminder } from '@/lib/pet-reminders';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default function PetsScreen() {
  const { session } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [microchipId, setMicrochipId] = useState('');
  const [nextVaccineDate, setNextVaccineDate] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    if (!session?.user) return;
    fetchMyPets(session.user.id).then((data) => {
      setPets(data);
      setLoaded(true);
    });
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const handleAdd = async () => {
    if (!session?.user || !name.trim()) return;
    if (birthDate.trim() && !DATE_RE.test(birthDate.trim())) return;
    if (nextVaccineDate.trim() && !DATE_RE.test(nextVaccineDate.trim())) return;

    setBusy(true);
    try {
      const pet = await createPet(session.user.id, {
        name: name.trim(),
        breed: breed.trim(),
        birthDate: birthDate.trim(),
        microchipId: microchipId.trim(),
        nextVaccineDate: nextVaccineDate.trim(),
      });

      if (pet.next_vaccine_date) {
        // Reminder failing to schedule (permission declined, etc.) must
        // never block the pet itself from being saved.
        try {
          const notificationId = await scheduleVaccineReminder(pet.name, new Date(pet.next_vaccine_date));
          if (notificationId) await updatePetVaccineReminder(pet.id, notificationId);
        } catch {
          // Ignored — the pet is already saved without a reminder.
        }
      }

      setName('');
      setBreed('');
      setBirthDate('');
      setMicrochipId('');
      setNextVaccineDate('');
      load();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = (pet: Pet) => {
    Alert.alert('Retirer ce chien ?', `"${pet.name}" sera retiré de votre profil.`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Retirer',
        style: 'destructive',
        onPress: async () => {
          if (pet.vaccine_reminder_notification_id) {
            await cancelVaccineReminder(pet.vaccine_reminder_notification_id);
          }
          await deletePet(pet.id);
          load();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Mes chiens</Text>
      </View>

      <Text style={styles.hint}>
        Usage strictement personnel — jamais rattaché publiquement à un signalement.
      </Text>

      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Nom du chien" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Race (optionnel)" value={breed} onChangeText={setBreed} />
        <TextInput
          style={styles.input}
          placeholder="Date de naissance AAAA-MM-JJ (optionnel)"
          value={birthDate}
          onChangeText={setBirthDate}
        />
        <TextInput
          style={styles.input}
          placeholder="N° puce / tatouage (optionnel)"
          value={microchipId}
          onChangeText={setMicrochipId}
        />
        <TextInput
          style={styles.input}
          placeholder="Prochain vaccin AAAA-MM-JJ (optionnel)"
          value={nextVaccineDate}
          onChangeText={setNextVaccineDate}
        />
        <Text style={styles.reminderHint}>
          📅 Un rappel s'affiche automatiquement 1 mois avant la date de vaccin renseignée.
        </Text>
        <Pressable
          style={[styles.addButton, (!name.trim() || busy) && styles.addButtonDisabled]}
          onPress={handleAdd}
          disabled={!name.trim() || busy}>
          {busy ? <ActivityIndicator color="white" /> : <Text style={styles.addButtonLabel}>Ajouter</Text>}
        </Pressable>
      </View>

      {loaded && pets.length === 0 ? (
        <Text style={styles.empty}>Aucun chien ajouté pour l'instant.</Text>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowBody}>
                <Text style={styles.rowName}>🐾 {item.name}</Text>
                {item.breed && <Text style={styles.rowBreed}>{item.breed}</Text>}
                {item.birth_date && <Text style={styles.rowMeta}>Né(e) le {item.birth_date}</Text>}
                {item.microchip_id && <Text style={styles.rowMeta}>Puce : {item.microchip_id}</Text>}
                {item.next_vaccine_date && (
                  <Text style={styles.rowMeta}>💉 Prochain vaccin : {item.next_vaccine_date}</Text>
                )}
              </View>
              <Pressable onPress={() => handleDelete(item)}>
                <Text style={styles.removeLabel}>Retirer</Text>
              </Pressable>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  back: { fontSize: 22 },
  title: { fontSize: 20, fontWeight: '700' },
  hint: { fontSize: 13, color: '#555', marginBottom: 12 },
  form: { gap: 8, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 15 },
  reminderHint: { fontSize: 12, color: '#777' },
  addButton: { backgroundColor: '#208AEF', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  addButtonDisabled: { opacity: 0.5 },
  addButtonLabel: { color: 'white', fontWeight: '700' },
  empty: { textAlign: 'center', color: '#777', marginTop: 24 },
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  rowBody: { flex: 1, gap: 2 },
  rowName: { fontSize: 15, fontWeight: '600' },
  rowBreed: { fontSize: 12, color: '#777' },
  rowMeta: { fontSize: 12, color: '#777' },
  removeLabel: { color: '#C62828', fontWeight: '600', fontSize: 13 },
});
