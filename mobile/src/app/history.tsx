import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getReportType } from '@/constants/report-types';
import { useAuth } from '@/lib/auth-context';
import { fetchMyReports, reportStatus, type Report, type ReportStatus } from '@/lib/reports';

const STATUS_LABEL: Record<ReportStatus, string> = {
  active: 'Actif',
  expired: 'Expiré',
  deleted: 'Supprimé',
};

const STATUS_COLOR: Record<ReportStatus, string> = {
  active: '#2E7D32',
  expired: '#999',
  deleted: '#C62828',
};

export default function HistoryScreen() {
  const { session } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loaded, setLoaded] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!session?.user) return;
      fetchMyReports(session.user.id).then((data) => {
        setReports(data);
        setLoaded(true);
      });
    }, [session?.user?.id]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Mes signalements</Text>
      </View>

      {loaded && reports.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🐾</Text>
          <Text style={styles.emptyTitle}>Aucun signalement pour l'instant</Text>
          <Text style={styles.emptyBody}>Repéré quelque chose pendant votre promenade ?</Text>
          <Pressable style={styles.emptyCta} onPress={() => router.push('/report-create')}>
            <Text style={styles.emptyCtaLabel}>Créer votre premier signalement</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => {
            const type = getReportType(item.type);
            const status = reportStatus(item);
            return (
              <View style={styles.row}>
                <View style={[styles.iconBubble, { backgroundColor: type.color }]}>
                  <Text style={styles.icon}>{type.icon}</Text>
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowLabel}>{type.labelFr}</Text>
                  <Text style={styles.rowDate}>{new Date(item.created_at).toLocaleDateString('fr-FR')}</Text>
                </View>
                <Text style={[styles.status, { color: STATUS_COLOR[status] }]}>{STATUS_LABEL[status]}</Text>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  back: { fontSize: 22 },
  title: { fontSize: 20, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  iconBubble: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 15 },
  rowBody: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowDate: { fontSize: 12, color: '#777' },
  status: { fontSize: 13, fontWeight: '700' },
  empty: { alignItems: 'center', gap: 8, paddingTop: 60 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 17, fontWeight: '700' },
  emptyBody: { fontSize: 14, color: '#555' },
  emptyCta: { backgroundColor: '#208AEF', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, marginTop: 8 },
  emptyCtaLabel: { color: 'white', fontWeight: '700' },
});
