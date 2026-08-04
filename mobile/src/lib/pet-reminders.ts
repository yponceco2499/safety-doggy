import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'pet-reminders';
const REMINDER_LEAD_DAYS = 30;

let channelReady = false;

async function ensureChannel(): Promise<void> {
  if (channelReady) return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Rappels chiens',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
  channelReady = true;
}

export async function requestReminderPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// Schedules a local (device-only, no push token/server involved) reminder
// 30 days before vaccineDate. Returns null — and schedules nothing — if
// that lead time has already passed, since a "reminder" for a date that's
// already gone isn't useful.
export async function scheduleVaccineReminder(petName: string, vaccineDate: Date): Promise<string | null> {
  const triggerDate = new Date(vaccineDate.getTime() - REMINDER_LEAD_DAYS * 24 * 3600 * 1000);
  if (triggerDate.getTime() <= Date.now()) return null;

  const granted = await requestReminderPermissions();
  if (!granted) return null;

  await ensureChannel();
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Rappel vaccin',
      body: `Le vaccin de ${petName} arrive à échéance dans environ un mois.`,
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: triggerDate, channelId: CHANNEL_ID },
  });
}

export async function cancelVaccineReminder(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Already fired or already cancelled — nothing to clean up.
  }
}
