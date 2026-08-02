import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { REPORT_TYPES, getReportType, type ReportTypeConfig } from '@/constants/report-types';
import { useAuth } from '@/lib/auth-context';
import { fetchProfile } from '@/lib/profile';
import { loadReportTypeDurationOverrides, updateReportTypeDuration } from '@/lib/report-type-settings';

function currentDurationLabel(durationHours: number | null): string {
  if (durationHours == null) return 'Permanent';
  if (durationHours % 24 === 0) return `${durationHours / 24} j`;
  return `${durationHours}h`;
}

function DurationRow({ type }: { type: ReportTypeConfig }) {
  const [permanent, setPermanent] = useState(type.durationHours == null);
  const [hours, setHours] = useState(type.durationHours != null ? String(type.durationHours) : '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Only a plain positive integer counts as valid — parseInt() alone would
  // silently accept garbage like "abc" as 1 (NaN || 0, then floored up to
  // 1), saving a value the admin never actually typed.
  const trimmedHours = hours.trim();
  const parsedHours = /^\d+$/.test(trimmedHours) ? parseInt(trimmedHours, 10) : null;
  const canSave = permanent || (parsedHours != null && parsedHours > 0);

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateReportTypeDuration(type.id, permanent ? null : parsedHours);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowIcon}>{type.icon}</Text>
        <Text style={styles.rowLabel}>{type.labelFr}</Text>
        <Text style={styles.rowCurrent}>{currentDurationLabel(type.durationHours)}</Text>
      </View>
      <View style={styles.rowEdit}>
        <Text style={styles.permanentLabel}>Permanent</Text>
        <Switch
          value={permanent}
          onValueChange={(next) => {
            setPermanent(next);
            setSaved(false);
          }}
        />
        {!permanent && (
          <TextInput
            style={styles.hoursInput}
            keyboardType="number-pad"
            value={hours}
            onChangeText={(next) => {
              setHours(next);
              setSaved(false);
            }}
            placeholder="Heures"
          />
        )}
        <Pressable style={[styles.saveButton, !canSave && styles.saveButtonDisabled]} onPress={handleSave} disabled={saving || !canSave}>
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonLabel}>{saved ? '✓ Enregistré' : 'Enregistrer'}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export default function AdminDurationsScreen() {
  const { session } = useAuth();
  const [ready, setReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!session?.user) {
        router.replace('/');
        return;
      }
      let cancelled = false;
      (async () => {
        const profile = await fetchProfile(session.user.id);
        if (!profile.is_admin) {
          router.replace('/profile');
          return;
        }
        await loadReportTypeDurationOverrides();
        if (!cancelled) setReady(true);
      })();
      return () => {
        cancelled = true;
      };
    }, [session?.user?.id]),
  );

  if (!ready) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Gestion des durées</Text>
      </View>

      <Text style={styles.hint}>
        Effet immédiat pour les nouveaux signalements de ce type — n'affecte pas ceux déjà publiés.
      </Text>

      <ScrollView contentContainerStyle={styles.list}>
        {REPORT_TYPES.map((type) => (
          <DurationRow key={type.id} type={getReportType(type.id)} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  back: { fontSize: 22 },
  title: { fontSize: 20, fontWeight: '700' },
  hint: { fontSize: 13, color: '#555', marginBottom: 12 },
  list: { gap: 12, paddingBottom: 40 },
  row: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, gap: 10 },
  rowHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowIcon: { fontSize: 18 },
  rowLabel: { fontSize: 14, fontWeight: '600', flex: 1 },
  rowCurrent: { fontSize: 12, color: '#777' },
  rowEdit: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  permanentLabel: { fontSize: 13, color: '#333' },
  hoursInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
  },
  saveButton: { backgroundColor: '#208AEF', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonLabel: { color: 'white', fontWeight: '700', fontSize: 13 },
});
