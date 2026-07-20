import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { REPORT_TYPES, type ReportTypeId } from '@/constants/report-types';

interface Props {
  activeFilters: Set<ReportTypeId>;
  onChange: (next: Set<ReportTypeId>) => void;
  onClose: () => void;
}

export function FilterSheet({ activeFilters, onChange, onClose }: Props) {
  const toggle = (id: ReportTypeId) => {
    const next = new Set(activeFilters);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(next);
  };

  const hazardTypes = REPORT_TYPES.filter((t) => t.category === 'hazard');
  const positiveTypes = REPORT_TYPES.filter((t) => t.category === 'positive');

  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Filtrer les signalements</Text>

        <ScrollView>
          <Text style={styles.groupLabel}>⚠ Dangers</Text>
          {hazardTypes.map((t) => (
            <Pressable key={t.id} style={styles.row} onPress={() => toggle(t.id)}>
              <Text style={styles.rowIcon}>{t.icon}</Text>
              <Text style={styles.rowLabel}>{t.labelFr}</Text>
              <View style={[styles.checkbox, activeFilters.has(t.id) && styles.checkboxChecked]} />
            </Pressable>
          ))}

          <Text style={styles.groupLabel}>✅ Points positifs</Text>
          {positiveTypes.map((t) => (
            <Pressable key={t.id} style={styles.row} onPress={() => toggle(t.id)}>
              <Text style={styles.rowIcon}>{t.icon}</Text>
              <Text style={styles.rowLabel}>{t.labelFr}</Text>
              <View style={[styles.checkbox, activeFilters.has(t.id) && styles.checkboxChecked]} />
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.footerRow}>
          <Pressable style={styles.footerButton} onPress={() => onChange(new Set())}>
            <Text style={styles.footerButtonLabel}>Tout décocher</Text>
          </Pressable>
          <Pressable style={styles.footerButton} onPress={() => onChange(new Set(REPORT_TYPES.map((t) => t.id)))}>
            <Text style={styles.footerButtonLabel}>Tout cocher</Text>
          </Pressable>
        </View>
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
    maxHeight: '75%',
    backgroundColor: 'white',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  groupLabel: { fontSize: 13, color: '#555', marginTop: 12, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  rowIcon: { fontSize: 18, width: 24 },
  rowLabel: { flex: 1, fontSize: 15 },
  checkbox: { width: 22, height: 22, borderRadius: 5, borderWidth: 2, borderColor: '#208AEF' },
  checkboxChecked: { backgroundColor: '#208AEF' },
  footerRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  footerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  footerButtonLabel: { fontWeight: '600', color: '#333' },
});
