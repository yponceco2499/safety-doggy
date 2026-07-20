import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DEFAULT_REGION, getReportType } from '@/constants/report-types';
import { useAuth } from '@/lib/auth-context';
import { signOut } from '@/lib/auth';
import { fetchActiveReports, type Report } from '@/lib/reports';

export default function MapScreen() {
  const { session } = useAuth();
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [locationGranted, setLocationGranted] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      setLocationGranted(true);
      const position = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    })();
  }, []);

  const loadReports = async () => {
    try {
      setLoadError(false);
      const data = await fetchActiveReports();
      setReports(data);
    } catch {
      setLoadError(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, []),
  );

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={region} showsUserLocation={locationGranted}>
        {reports.map((report) => {
          const type = getReportType(report.type);
          return (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.latitude, longitude: report.longitude }}
              title={type.labelFr}
              anchor={{ x: 0.5, y: 0.5 }}>
              <View style={[styles.markerBubble, { backgroundColor: type.color }]}>
                <Text style={styles.markerIcon}>{type.icon}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <SafeAreaView style={styles.topBar} pointerEvents="box-none">
        <View style={styles.topBarRow} pointerEvents="box-none">
          <View />
          <Pressable
            style={styles.accountPill}
            onPress={() => {
              if (!session) {
                router.push('/auth-landing');
                return;
              }
              Alert.alert(session.user.email ?? 'Compte', undefined, [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Se déconnecter', style: 'destructive', onPress: () => signOut() },
              ]);
            }}>
            <Text style={styles.accountPillLabel}>{session ? 'Profil' : 'Connexion'}</Text>
          </Pressable>
        </View>

        {!locationGranted && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Localisation indisponible</Text>
          </View>
        )}
        {loadError && (
          <Pressable style={[styles.banner, styles.bannerError]} onPress={loadReports}>
            <Text style={styles.bannerText}>Impossible de charger les signalements — réessayer</Text>
          </Pressable>
        )}
      </SafeAreaView>

      <SafeAreaView style={styles.fabWrap} pointerEvents="box-none">
        <Pressable
          style={styles.fab}
          onPress={() => {
            router.push(session ? '/report-create' : '/auth-landing');
          }}>
          <Text style={styles.fabLabel}>+</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 12,
    gap: 8,
  },
  topBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountPill: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  accountPillLabel: {
    fontWeight: '600',
    color: '#1D3557',
  },
  markerBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  markerIcon: {
    fontSize: 16,
  },
  banner: {
    backgroundColor: '#1D3557',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  bannerError: {
    backgroundColor: '#C62828',
  },
  bannerText: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  fabWrap: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#208AEF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  fabLabel: {
    color: 'white',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '600',
  },
});
