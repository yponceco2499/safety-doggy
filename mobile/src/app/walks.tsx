import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth-context';
import { fetchMyPets, type Pet } from '@/lib/pets';
import { endWalk, fetchActiveWalk, fetchMyWalks, startWalk, walkDurationLabel, type Walk } from '@/lib/walks';

const ONE_WEEK_MS = 7 * 24 * 3600 * 1000;

export default function WalksScreen() {
  const { session } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [walks, setWalks] = useState<Walk[]>([]);
  const [activeWalk, setActiveWalk] = useState<Walk | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    if (!session?.user) return;
    Promise.all([fetchMyPets(session.user.id), fetchMyWalks(session.user.id), fetchActiveWalk(session.user.id)]).then(
      ([petsData, walksData, active]) => {
        setPets(petsData);
        setWalks(walksData);
        setActiveWalk(active);
        setLoaded(true);
      },
    );
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const petName = (petId: string | null) => pets.find((p) => p.id === petId)?.name ?? null;

  const stats = useMemo(() => {
    const total = walks.length;
    const thisWeek = walks.filter((w) => Date.now() - new Date(w.started_at).getTime() < ONE_WEEK_MS).length;
    return { total, thisWeek };
  }, [walks]);

  const handleStart = async () => {
    if (!session?.user) return;
    setBusy(true);
    try {
      const walk = await startWalk(session.user.id, selectedPetId);
      setActiveWalk(walk);
    } finally {
      setBusy(false);
    }
  };

  const handleEnd = async () => {
    if (!activeWalk) return;
    setBusy(true);
    try {
      await endWalk(activeWalk.id);
      setActiveWalk(null);
      load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Mes sorties</Text>
      </View>

      {loaded && (
        <Text style={styles.statsLine}>
          {stats.total} sortie{stats.total > 1 ? 's' : ''} enregistrée{stats.total > 1 ? 's' : ''} · {stats.thisWeek} cette semaine
        </Text>
      )}

      {activeWalk ? (
        <View style={styles.activeCard}>
          <Text style={styles.activeLabel}>🐕 Sortie en cours</Text>
          <Text style={styles.activeMeta}>
            Démarrée à {new Date(activeWalk.started_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            {petName(activeWalk.pet_id) ? ` avec ${petName(activeWalk.pet_id)}` : ''}
          </Text>
          <Pressable style={styles.stopButton} onPress={handleEnd} disabled={busy}>
            {busy ? <ActivityIndicator color="white" /> : <Text style={styles.stopButtonLabel}>Terminer la sortie</Text>}
          </Pressable>
        </View>
      ) : (
        <View style={styles.startCard}>
          {pets.length > 0 && (
            <View style={styles.petChips}>
              <Pressable
                style={[styles.petChip, selectedPetId === null && styles.petChipSelected]}
                onPress={() => setSelectedPetId(null)}>
                <Text style={[styles.petChipLabel, selectedPetId === null && styles.petChipLabelSelected]}>Aucun chien</Text>
              </Pressable>
              {pets.map((pet) => (
                <Pressable
                  key={pet.id}
                  style={[styles.petChip, selectedPetId === pet.id && styles.petChipSelected]}
                  onPress={() => setSelectedPetId(pet.id)}>
                  <Text style={[styles.petChipLabel, selectedPetId === pet.id && styles.petChipLabelSelected]}>{pet.name}</Text>
                </Pressable>
              ))}
            </View>
          )}
          <Pressable style={styles.startButton} onPress={handleStart} disabled={busy}>
            {busy ? <ActivityIndicator color="white" /> : <Text style={styles.startButtonLabel}>Démarrer une sortie</Text>}
          </Pressable>
        </View>
      )}

      {loaded && walks.length === 0 ? (
        <Text style={styles.empty}>Aucune sortie enregistrée pour l'instant.</Text>
      ) : (
        <FlatList
          style={styles.list}
          data={walks}
          keyExtractor={(w) => w.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.rowBody}>
                <Text style={styles.rowLabel}>
                  {new Date(item.started_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  {petName(item.pet_id) ? ` — avec ${petName(item.pet_id)}` : ''}
                </Text>
              </View>
              <Text style={styles.rowDuration}>{walkDurationLabel(item)}</Text>
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
  statsLine: { fontSize: 13, color: '#555', marginBottom: 12 },
  activeCard: { backgroundColor: '#EAF4FF', borderRadius: 12, padding: 16, gap: 8, marginBottom: 16 },
  activeLabel: { fontSize: 16, fontWeight: '700' },
  activeMeta: { fontSize: 13, color: '#555' },
  stopButton: { backgroundColor: '#C62828', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  stopButtonLabel: { color: 'white', fontWeight: '700' },
  startCard: { gap: 10, marginBottom: 16 },
  petChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  petChip: { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
  petChipSelected: { borderColor: '#208AEF', backgroundColor: '#EAF4FF' },
  petChipLabel: { fontSize: 13, color: '#333' },
  petChipLabelSelected: { color: '#208AEF', fontWeight: '700' },
  startButton: { backgroundColor: '#208AEF', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  startButtonLabel: { color: 'white', fontWeight: '700' },
  empty: { textAlign: 'center', color: '#777', marginTop: 24 },
  list: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: 14 },
  rowDuration: { fontSize: 13, fontWeight: '700', color: '#208AEF' },
});
