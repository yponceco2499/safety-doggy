import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FilterSheet } from '@/components/filter-sheet';
import { ReportDetailSheet } from '@/components/report-detail-sheet';
import { DEFAULT_REGION, REPORT_TYPES, getReportType, type ReportTypeId } from '@/constants/report-types';
import { useAuth } from '@/lib/auth-context';
import { searchAddress, type GeocodingResult } from '@/lib/geocoding';
import { fetchActiveReports, type Report } from '@/lib/reports';

export default function MapScreen() {
  const { session } = useAuth();
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [locationGranted, setLocationGranted] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<ReportTypeId>>(
    () => new Set(REPORT_TYPES.map((t) => t.id)),
  );
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const visibleReports = reports.filter((r) => activeFilters.has(r.type));

  const mapRef = useRef<MapView>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const runSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError(false);
    try {
      const results = await searchAddress(searchQuery);
      setSearchResults(results);
    } catch {
      setSearchError(true);
    } finally {
      setSearching(false);
    }
  };

  const goToSearchResult = (result: GeocodingResult) => {
    const next: Region = {
      latitude: result.latitude,
      longitude: result.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    setRegion(next);
    mapRef.current?.animateToRegion(next, 300);
    setSearchResults([]);
    setSearchOpen(false);
    setSearchQuery('');
  };

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
      <MapView ref={mapRef} style={StyleSheet.absoluteFill} initialRegion={region} showsUserLocation={locationGranted}>
        {visibleReports.map((report) => {
          const type = getReportType(report.type);
          return (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.latitude, longitude: report.longitude }}
              title={type.labelFr}
              anchor={{ x: 0.5, y: 0.5 }}
              onPress={() => setSelectedReport(report)}>
              <View style={[styles.markerBubble, { backgroundColor: type.color }]}>
                <Text style={styles.markerIcon}>{type.icon}</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      <SafeAreaView style={styles.topBar} pointerEvents="box-none">
        <View style={styles.topBarRow} pointerEvents="box-none">
          <Pressable style={styles.accountPill} onPress={() => setSearchOpen((o) => !o)}>
            <Text style={styles.accountPillLabel}>🔍</Text>
          </Pressable>
          <Pressable style={styles.accountPill} onPress={() => setFilterSheetOpen(true)}>
            <Text style={styles.accountPillLabel}>Filtres</Text>
          </Pressable>
          <Pressable
            style={styles.accountPill}
            onPress={() => {
              router.push(session ? '/walks' : '/auth-landing');
            }}>
            <Text style={styles.accountPillLabel}>🐕 Sortie</Text>
          </Pressable>
          <Pressable
            style={styles.accountPill}
            onPress={() => {
              router.push(session ? '/profile' : '/auth-landing');
            }}>
            <Text style={styles.accountPillLabel}>{session ? 'Profil' : 'Connexion'}</Text>
          </Pressable>
        </View>

        {searchOpen && (
          <View style={styles.searchBox}>
            <View style={styles.searchRow}>
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une adresse…"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={runSearch}
                returnKeyType="search"
                autoFocus
              />
              <Pressable style={styles.searchButton} onPress={runSearch} disabled={searching}>
                {searching ? <ActivityIndicator color="white" /> : <Text style={styles.searchButtonLabel}>OK</Text>}
              </Pressable>
            </View>
            {searchError && <Text style={styles.searchErrorText}>Recherche indisponible, réessayez.</Text>}
            {searchResults.length > 0 && (
              <FlatList
                style={styles.searchResultsList}
                data={searchResults}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => (
                  <Pressable style={styles.searchResultRow} onPress={() => goToSearchResult(item)}>
                    <Text style={styles.searchResultText} numberOfLines={2}>
                      {item.displayName}
                    </Text>
                  </Pressable>
                )}
              />
            )}
          </View>
        )}

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

      {selectedReport && (
        <ReportDetailSheet
          report={selectedReport}
          currentUserId={session?.user.id ?? null}
          onClose={() => setSelectedReport(null)}
          onUpdated={(updated) => {
            setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
            setSelectedReport(updated);
          }}
          onDeleted={(reportId) => {
            setReports((prev) => prev.filter((r) => r.id !== reportId));
            setSelectedReport(null);
          }}
        />
      )}

      {filterSheetOpen && (
        <FilterSheet
          activeFilters={activeFilters}
          onChange={setActiveFilters}
          onClose={() => setFilterSheetOpen(false)}
        />
      )}
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
  searchBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    gap: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchRow: { flexDirection: 'row', gap: 8 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
  },
  searchButton: {
    backgroundColor: '#208AEF',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonLabel: { color: 'white', fontWeight: '700' },
  searchErrorText: { color: '#C62828', fontSize: 13 },
  searchResultsList: { maxHeight: 220 },
  searchResultRow: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  searchResultText: { fontSize: 14, color: '#333' },
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
