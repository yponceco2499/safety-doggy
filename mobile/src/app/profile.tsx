import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signOut } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import { deleteAccount, fetchProfile, updateNickname, type Profile } from '@/lib/profile';
import { fetchMyReports } from '@/lib/reports';

export default function ProfileScreen() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reportCount, setReportCount] = useState<number | null>(null);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!session?.user) return;
    const data = await fetchProfile(session.user.id);
    setProfile(data);
    const reports = await fetchMyReports(session.user.id);
    setReportCount(reports.length);
  }, [session?.user?.id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (!session?.user) {
    router.replace('/');
    return null;
  }

  const memberSince = profile
    ? new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : '';

  const handleSaveNickname = async () => {
    if (!nicknameInput.trim()) return;
    setBusy(true);
    try {
      await updateNickname(session.user.id, nicknameInput.trim());
      setEditingNickname(false);
      load();
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer votre compte ?',
      "Vos signalements restent sur la carte, anonymisés. Le reste de vos données (profil, chiens, sorties) et vos identifiants de connexion sont supprimés immédiatement — cette action est irréversible.",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            try {
              await deleteAccount();
              await signOut();
              router.replace('/');
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Profil</Text>
      </View>

      <Text style={styles.email}>{session.user.email}</Text>

      {editingNickname ? (
        <View style={styles.nicknameEditRow}>
          <TextInput style={styles.input} value={nicknameInput} onChangeText={setNicknameInput} />
          <View style={styles.btnRow}>
            <Pressable style={styles.secondaryBtn} onPress={() => setEditingNickname(false)}>
              <Text style={styles.secondaryBtnLabel}>Annuler</Text>
            </Pressable>
            <Pressable style={styles.primaryBtn} onPress={handleSaveNickname} disabled={busy}>
              {busy ? <ActivityIndicator color="white" /> : <Text style={styles.primaryBtnLabel}>Enregistrer</Text>}
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.row}>
          <Text style={styles.nickname}>{profile?.nickname ?? '…'}</Text>
          <Pressable
            onPress={() => {
              setNicknameInput(profile?.nickname ?? '');
              setEditingNickname(true);
            }}>
            <Text style={styles.link}>Modifier</Text>
          </Pressable>
        </View>
      )}

      {profile && <Text style={styles.meta}>Membre depuis {memberSince}</Text>}
      {reportCount != null && (
        <Text style={styles.meta}>
          {reportCount} signalement{reportCount > 1 ? 's' : ''} créé{reportCount > 1 ? 's' : ''} depuis votre inscription
        </Text>
      )}

      <Pressable style={styles.listRow} onPress={() => router.push('/history')}>
        <Text style={styles.listRowLabel}>Mes signalements</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      <Pressable style={styles.listRow} onPress={() => router.push('/pets')}>
        <Text style={styles.listRowLabel}>Mes chiens</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      <Pressable style={styles.listRow} onPress={() => router.push('/walks')}>
        <Text style={styles.listRowLabel}>Mes sorties</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      <Pressable style={styles.listRow} onPress={() => router.push('/faq')}>
        <Text style={styles.listRowLabel}>Questions fréquentes</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      <Pressable style={styles.listRow} onPress={() => router.push('/terms')}>
        <Text style={styles.listRowLabel}>Conditions d'utilisation</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      <Pressable style={styles.listRow} onPress={() => router.push('/privacy')}>
        <Text style={styles.listRowLabel}>Politique de confidentialité</Text>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      {profile?.is_admin && (
        <Pressable style={styles.listRow} onPress={() => router.push('/admin-durations')}>
          <Text style={styles.listRowLabel}>⚙️ Gestion des durées</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      )}

      <Pressable
        style={styles.secondaryBtnFull}
        onPress={async () => {
          await signOut();
          router.replace('/');
        }}>
        <Text style={styles.secondaryBtnLabel}>Se déconnecter</Text>
      </Pressable>

      <Pressable style={styles.dangerBtn} onPress={handleDeleteAccount} disabled={busy}>
        <Text style={styles.dangerBtnLabel}>Supprimer mon compte</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  back: { fontSize: 22 },
  title: { fontSize: 20, fontWeight: '700' },
  email: { fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nickname: { fontSize: 15 },
  link: { color: '#208AEF', fontWeight: '600' },
  nicknameEditRow: { gap: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 15 },
  btnRow: { flexDirection: 'row', gap: 10 },
  secondaryBtn: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  secondaryBtnLabel: { fontWeight: '600', color: '#333' },
  primaryBtn: { flex: 1, backgroundColor: '#208AEF', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  primaryBtnLabel: { fontWeight: '700', color: 'white' },
  meta: { fontSize: 13, color: '#555' },
  listRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  listRowLabel: { fontSize: 15 },
  chevron: { fontSize: 18, color: '#999' },
  secondaryBtnFull: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  dangerBtn: { alignItems: 'center', paddingVertical: 14 },
  dangerBtnLabel: { color: '#C62828', fontWeight: '700' },
});
