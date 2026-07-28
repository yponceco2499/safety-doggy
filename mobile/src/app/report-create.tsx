import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { type Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DEFAULT_REGION, REPORT_TYPES, type ReportTypeId } from '@/constants/report-types';
import { useAuth } from '@/lib/auth-context';
import { countReportsLastHour, createReport, distanceMeters, findNearbyDuplicate, uploadReportPhoto } from '@/lib/reports';

const MAX_DISTANCE_FROM_LE_HAVRE_METERS = 30000;

export default function ReportCreateScreen() {
  const { session } = useAuth();
  const mapRef = useRef<MapView>(null);
  const [selectedType, setSelectedType] = useState<ReportTypeId | null>(null);
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [usingGps, setUsingGps] = useState(true);
  const [gpsAvailable, setGpsAvailable] = useState(false);
  const [outsideArea, setOutsideArea] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const isProgrammaticMove = useRef(false);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6 });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const goToMyLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    setGpsAvailable(true);
    const position = await Location.getCurrentPositionAsync({});
    const next: Region = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(next);
    setUsingGps(true);
    isProgrammaticMove.current = true;
    mapRef.current?.animateToRegion(next, 300);
  };

  useEffect(() => {
    goToMyLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    if (isProgrammaticMove.current) {
      isProgrammaticMove.current = false;
    } else {
      setUsingGps(false);
    }
    const distance = distanceMeters(
      { latitude: DEFAULT_REGION.latitude, longitude: DEFAULT_REGION.longitude },
      newRegion,
    );
    setOutsideArea(distance > MAX_DISTANCE_FROM_LE_HAVRE_METERS);
  };

  const suggestNewType = () => {
    Linking.openURL(
      'mailto:contact@safetydoggy.app?subject=' +
        encodeURIComponent('Suggestion de nouveau type de signalement') +
        '&body=' +
        encodeURIComponent("Bonjour,\n\nJe n'ai pas trouvé de type adapté pour signaler :\n\n"),
    );
  };

  const selectedConfig = selectedType ? REPORT_TYPES.find((t) => t.id === selectedType) : null;

  const durationLabel = () => {
    if (!selectedConfig) return '';
    if (selectedConfig.durationHours == null) return 'Permanent';
    if (selectedConfig.durationHours >= 24) return `${selectedConfig.durationHours / 24} jours`;
    return `${selectedConfig.durationHours}h`;
  };

  const submit = async () => {
    if (!selectedType || !session?.user || outsideArea) return;
    setSubmitting(true);
    setError(null);
    try {
      const count = await countReportsLastHour(session.user.id);
      if (count >= 5) {
        setError('Limite de 5 signalements par heure atteinte. Réessayez plus tard.');
        return;
      }

      const duplicate = await findNearbyDuplicate(selectedType, region);
      if (duplicate) {
        const confirmed = await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Signalement similaire à proximité',
            'Un signalement du même type existe déjà à moins de 50m. Publier quand même ?',
            [
              { text: 'Annuler', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Publier quand même', onPress: () => resolve(true) },
            ],
          );
        });
        if (!confirmed) {
          setSubmitting(false);
          return;
        }
      }

      let photoUrl: string | null = null;
      if (photoUri) {
        try {
          photoUrl = await uploadReportPhoto(session.user.id, photoUri);
        } catch {
          // Photo is optional and must never block publishing — continue without it.
          photoUrl = null;
        }
      }

      await createReport(session.user.id, selectedType, region, photoUrl);
      router.back();
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Nouveau signalement</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.groupLabel}>⚠ Dangers</Text>
        <View style={styles.grid}>
          {REPORT_TYPES.filter((t) => t.category === 'hazard').map((t) => (
            <Pressable
              key={t.id}
              style={[styles.typeCard, selectedType === t.id && styles.typeCardSelected]}
              onPress={() => setSelectedType(t.id)}>
              <Text style={styles.typeIcon}>{t.icon}</Text>
              <Text style={styles.typeLabel}>{t.labelFr}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.groupLabel}>✅ Points positifs</Text>
        <View style={styles.grid}>
          {REPORT_TYPES.filter((t) => t.category === 'positive').map((t) => (
            <Pressable
              key={t.id}
              style={[styles.typeCard, selectedType === t.id && styles.typeCardSelected]}
              onPress={() => setSelectedType(t.id)}>
              <Text style={styles.typeIcon}>{t.icon}</Text>
              <Text style={styles.typeLabel}>{t.labelFr}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={suggestNewType}>
          <Text style={styles.suggestLink}>Vous ne trouvez pas le type qu'il vous faut ? Suggérer un nouveau type</Text>
        </Pressable>

        {selectedConfig && (
          <Text style={styles.duration}>
            Durée : <Text style={styles.durationValue}>{durationLabel()}</Text>
          </Text>
        )}

        {photoUri ? (
          <View style={styles.photoPreviewWrap}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <Pressable onPress={() => setPhotoUri(null)}>
              <Text style={styles.suggestLink}>Retirer la photo</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={pickPhoto}>
            <Text style={styles.suggestLink}>📷 Ajouter une photo (optionnel)</Text>
          </Pressable>
        )}

        <View style={styles.mapWrap}>
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={region}
            onRegionChangeComplete={handleRegionChangeComplete}
          />
          <View style={styles.centerPin} pointerEvents="none">
            <Text style={styles.centerPinIcon}>📍</Text>
          </View>
        </View>

        <Text style={styles.positionLabel}>
          {!gpsAvailable
            ? '⚠️ Localisation indisponible — placez le repère manuellement'
            : usingGps
              ? '📍 Position détectée automatiquement'
              : 'Position ajustée manuellement'}
        </Text>
        {!usingGps && gpsAvailable && (
          <Pressable onPress={goToMyLocation}>
            <Text style={styles.link}>Utiliser ma position</Text>
          </Pressable>
        )}
        {outsideArea && (
          <Text style={styles.error}>Safety Doggy couvre uniquement la zone du Havre pour le moment.</Text>
        )}

        {error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.submitButton, (!selectedType || outsideArea || submitting) && styles.submitButtonDisabled]}
          disabled={!selectedType || outsideArea || submitting}
          onPress={submit}>
          {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.submitLabel}>Publier</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 12, marginBottom: 4 },
  back: { fontSize: 22 },
  title: { fontSize: 20, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingTop: 4, gap: 8 },
  groupLabel: { fontSize: 13, color: '#555', marginTop: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeCard: {
    width: '23%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 4,
  },
  typeCardSelected: { borderColor: '#208AEF', borderWidth: 2, backgroundColor: '#EAF4FF' },
  typeIcon: { fontSize: 22 },
  typeLabel: { fontSize: 10, textAlign: 'center' },
  suggestLink: { fontSize: 12, color: '#208AEF', marginTop: 10 },
  duration: { fontSize: 14, marginTop: 8 },
  photoPreviewWrap: { marginTop: 8, gap: 6 },
  photoPreview: { width: '100%', height: 160, borderRadius: 10 },
  durationValue: { fontWeight: '700' },
  mapWrap: { height: 200, borderRadius: 10, overflow: 'hidden', marginTop: 8 },
  centerPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,
    marginTop: -30,
  },
  centerPinIcon: { fontSize: 30 },
  positionLabel: { fontSize: 13, color: '#555', marginTop: 6 },
  link: { color: '#208AEF', fontWeight: '600' },
  error: { color: '#C62828', fontSize: 13, marginTop: 4 },
  footer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  submitButton: {
    backgroundColor: '#208AEF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitLabel: { color: 'white', fontWeight: '700' },
});
