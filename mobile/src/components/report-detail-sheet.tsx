import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { getReportType } from '@/constants/report-types';
import { deleteReport, extendReport, type Report } from '@/lib/reports';

interface Props {
  report: Report;
  currentUserId: string | null;
  onClose: () => void;
  onUpdated: (report: Report) => void;
  onDeleted: (reportId: string) => void;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} à ${d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

// Returns null once expired.
function remainingLabel(expiresAt: string | null, durationHours: number | null): string | null {
  if (durationHours == null) return 'Permanent';
  if (!expiresAt) return null;
  const msLeft = new Date(expiresAt).getTime() - Date.now();
  if (msLeft <= 0) return null;
  const hoursLeft = msLeft / 3600000;
  if (hoursLeft >= 24) return `Actif encore ~${Math.round(hoursLeft / 24)} j`;
  return `Actif encore ~${Math.max(1, Math.round(hoursLeft))}h`;
}

export function ReportDetailSheet({ report, currentUserId, onClose, onUpdated, onDeleted }: Props) {
  const [busy, setBusy] = useState(false);
  const type = getReportType(report.type);
  const isCreator = currentUserId != null && report.user_id === currentUserId;
  const remaining = remainingLabel(report.expires_at, type.durationHours);
  const expired = type.durationHours != null && remaining == null;

  const handleExtend = async () => {
    setBusy(true);
    try {
      const updated = await extendReport(report);
      onUpdated(updated);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await deleteReport(report.id);
      onDeleted(report.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <View style={[styles.iconBubble, { backgroundColor: type.color }]}>
            <Text style={styles.icon}>{type.icon}</Text>
          </View>
          <Text style={styles.label}>{type.labelFr}</Text>
        </View>

        <Text style={styles.meta}>Signalé le {formatDate(report.created_at)}</Text>
        {expired ? (
          <Text style={styles.expired}>Ce signalement a expiré.</Text>
        ) : (
          remaining && <Text style={styles.meta}>{remaining}</Text>
        )}

        {isCreator && !expired && (
          <View style={styles.actions}>
            {type.durationHours != null && (
              <Pressable style={styles.actionButton} onPress={handleExtend} disabled={busy}>
                {busy ? <ActivityIndicator /> : <Text style={styles.actionLabel}>Prolonger la durée</Text>}
              </Pressable>
            )}
            <Pressable style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete} disabled={busy}>
              {busy ? (
                <ActivityIndicator color="#C62828" />
              ) : (
                <Text style={[styles.actionLabel, styles.deleteLabel]}>Supprimer</Text>
              )}
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    gap: 8,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 18 },
  label: { fontSize: 18, fontWeight: '700', flexShrink: 1 },
  meta: { fontSize: 14, color: '#555' },
  expired: { fontSize: 14, color: '#C62828', fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#208AEF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionLabel: { color: '#208AEF', fontWeight: '700' },
  deleteButton: { borderColor: '#C62828' },
  deleteLabel: { color: '#C62828' },
});
