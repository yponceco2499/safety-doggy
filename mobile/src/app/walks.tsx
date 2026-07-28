import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/lib/auth-context';
import { fetchMyPets, type Pet } from '@/lib/pets';
import { fetchProfile, grantWalkTrackingConsent, type Profile } from '@/lib/profile';
import { isWalkTrackingActive, requestWalkTrackingPermissions, startWalkTracking, stopWalkTracking } from '@/lib/walk-tracking';
import {
  endWalk,
  fetchActiveWalk,
  fetchMyWalks,
  formatDurationMs,
  startWalk,
  statsByPet,
  walkDurationLabel,
  type Walk,
} from '@/lib/walks';

const ONE_WEEK_MS = 7 * 24 * 3600 * 1000;

export default function WalksScreen() {
  const { session } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [walks, setWalks] = useState<Walk[]>([]);
  const [activeWalk, setActiveWalk] = useState<Walk | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [trackGps, setTrackGps] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const load = useCallback(() => {
    if (!session?.user) return;
    Promise.all([
      fetchMyPets(session.user.id),
      fetchMyWalks(session.user.id),
      fetchActiveWalk(session.user.id),
      fetchProfile(session.user.id),
      isWalkTrackingActive(),
    ]).then(([petsData, walksData, active, profileData, trackingActive]) => {
      setPets(petsData);
      setWalks(walksData);
      setActiveWalk(active);
      setProfile(profileData);
      setTracking(trackingActive);
      setLoaded(true);
    });
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const petName = (petId: string | null) => pets.find((p) => p.id === petId)?.name ?? null;

  const weekCount = useMemo(
    () => walks.filter((w) => Date.now() - new Date(w.started_at).getTime() < ONE_WEEK_MS).length,
    [walks],
  );
  const dashboard = useMemo(() => statsByPet(walks), [walks]);

  const beginTrackedWalk = async () => {
    setBusy(true);
    try {
      const granted = await requestWalkTrackingPermissions();
      if (!granted) {
        Alert.alert(
          'Permission refusée',
          "La localisation en arrière-plan n'a pas été autorisée. La sortie va démarrer sans suivi de distance.",
        );
        const walk = await startWalk(session!.user.id, selectedPetId);
        setActiveWalk(walk);
        return;
      }
      await startWalkTracking();
      const walk = await startWalk(session!.user.id, selectedPetId);
      setActiveWalk(walk);
      setTracking(true);
    } finally {
      setBusy(false);
    }
  };

  const handleStart = async () => {
    if (!session?.user) return;
    if (!trackGps) {
      setBusy(true);
      try {
        const walk = await startWalk(session.user.id, selectedPetId);
        setActiveWalk(walk);
      } finally {
        setBusy(false);
      }
      return;
    }

    if (!profile?.walk_tracking_consent_at) {
      setShowConsent(true);
      return;
    }
    await beginTrackedWalk();
  };

  const handleConsentAccept = async () => {
    if (!session?.user) return;
    setBusy(true);
    try {
      await grantWalkTrackingConsent(session.user.id);
      setProfile((p) => (p ? { ...p, walk_tracking_consent_at: new Date().toISOString() } : p));
      setShowConsent(false);
      await beginTrackedWalk();
    } finally {
      setBusy(false);
    }
  };

  const handleEnd = async () => {
    if (!activeWalk) return;
    setBusy(true);
    try {
      if (tracking) {
        const km = await stopWalkTracking();
        await endWalk(activeWalk.id, km);
        setTracking(false);
      } else {
        await endWalk(activeWalk.id);
      }
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
        <View style={styles.dashboard}>
          <Text style={styles.statsLine}>
            {walks.length} sortie{walks.length > 1 ? 's' : ''} enregistrée{walks.length > 1 ? 's' : ''} · {weekCount} cette semaine
          </Text>
          {dashboard.map((stat) => (
            <Text key={stat.petId ?? '__none__'} style={styles.dashboardRow}>
              🐾 {stat.petId ? petName(stat.petId) ?? 'Chien supprimé' : 'Sans chien'} — {stat.count} sortie{stat.count > 1 ? 's' : ''}
              {stat.totalKm > 0 ? ` · ${stat.totalKm.toFixed(1)} km` : ''} · {formatDurationMs(stat.totalDurationMs)}
            </Text>
          ))}
        </View>
      )}

      {activeWalk ? (
        <View style={styles.activeCard}>
          <Text style={styles.activeLabel}>🐕 Sortie en cours</Text>
          <Text style={styles.activeMeta}>
            Démarrée à {new Date(activeWalk.started_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            {petName(activeWalk.pet_id) ? ` avec ${petName(activeWalk.pet_id)}` : ''}
            {tracking ? ' · 📍 distance suivie' : ''}
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
          <View style={styles.gpsRow}>
            <Text style={styles.gpsLabel}>📍 Suivre la distance (GPS)</Text>
            <Switch value={trackGps} onValueChange={setTrackGps} />
          </View>
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
              {item.distance_km != null && <Text style={styles.rowKm}>{item.distance_km.toFixed(1)} km</Text>}
              <Text style={styles.rowDuration}>{walkDurationLabel(item)}</Text>
            </View>
          )}
        />
      )}

      <Modal transparent animationType="fade" visible={showConsent} onRequestClose={() => setShowConsent(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Suivre la distance de vos sorties ?</Text>
            <Text style={styles.modalBody}>
              Pour calculer la distance parcourue, Safety Doggy suit votre position pendant la sortie — y compris si votre écran
              se verrouille ou que l'app passe en arrière-plan. Une notification reste visible pendant tout le suivi.
            </Text>
            <Text style={styles.modalBody}>
              Seule la distance totale calculée est enregistrée — jamais le trajet détaillé. Vous pouvez toujours faire une
              sortie sans suivi de distance en laissant l'option désactivée.
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setShowConsent(false)}>
                <Text style={styles.modalCancelLabel}>Annuler</Text>
              </Pressable>
              <Pressable style={styles.modalAccept} onPress={handleConsentAccept} disabled={busy}>
                {busy ? <ActivityIndicator color="white" /> : <Text style={styles.modalAcceptLabel}>Activer le suivi</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  back: { fontSize: 22 },
  title: { fontSize: 20, fontWeight: '700' },
  dashboard: { gap: 4, marginBottom: 12 },
  statsLine: { fontSize: 13, color: '#555' },
  dashboardRow: { fontSize: 13, color: '#333' },
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
  gpsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gpsLabel: { fontSize: 14 },
  startButton: { backgroundColor: '#208AEF', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  startButtonLabel: { color: 'white', fontWeight: '700' },
  empty: { textAlign: 'center', color: '#777', marginTop: 24 },
  list: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: 14 },
  rowKm: { fontSize: 13, color: '#555' },
  rowDuration: { fontSize: 13, fontWeight: '700', color: '#208AEF' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: 'white', borderRadius: 14, padding: 20, gap: 12 },
  modalTitle: { fontSize: 17, fontWeight: '700' },
  modalBody: { fontSize: 14, color: '#333', lineHeight: 20 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  modalCancel: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  modalCancelLabel: { fontWeight: '600', color: '#333' },
  modalAccept: { flex: 1, backgroundColor: '#208AEF', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  modalAcceptLabel: { color: 'white', fontWeight: '700' },
});
