import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import { distanceMeters } from './reports';

const TASK_NAME = 'safety-doggy-walk-tracking';
const STORAGE_KEY_DISTANCE = 'walk-tracking:distance-meters';
const STORAGE_KEY_LAST_POINT = 'walk-tracking:last-point';

// Defined at module scope so it's registered as soon as the app boots
// (imported once from app/_layout.tsx) — required for Android to be able
// to wake this task up and deliver locations while the app is backgrounded
// or the JS engine has been restarted mid-walk.
//
// Privacy-by-design: only a running distance total is persisted (in
// AsyncStorage, then as a single number on the walk row once it ends) —
// individual GPS points are used to update that total and then discarded,
// never stored as a path.
TaskManager.defineTask(TASK_NAME, async ({ data, error }) => {
  if (error || !data) return;
  const { locations } = data as { locations: Location.LocationObject[] };
  if (!locations?.length) return;

  const lastPointRaw = await AsyncStorage.getItem(STORAGE_KEY_LAST_POINT);
  let lastPoint: { latitude: number; longitude: number } | null = lastPointRaw ? JSON.parse(lastPointRaw) : null;
  let totalMeters = Number((await AsyncStorage.getItem(STORAGE_KEY_DISTANCE)) ?? '0');

  for (const loc of locations) {
    const point = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
    if (lastPoint) {
      totalMeters += distanceMeters(lastPoint, point);
    }
    lastPoint = point;
  }

  await AsyncStorage.setItem(STORAGE_KEY_DISTANCE, String(totalMeters));
  await AsyncStorage.setItem(STORAGE_KEY_LAST_POINT, JSON.stringify(lastPoint));
});

// TaskManager (and therefore background location) isn't available in Expo
// Go on Android — it needs a development/production build. Every exported
// function below checks this first and fails soft (never throws), so a
// walk always falls back to the untracked version instead of crashing.
export async function isWalkTrackingAvailable(): Promise<boolean> {
  try {
    return await TaskManager.isAvailableAsync();
  } catch {
    return false;
  }
}

// Foreground permission first (required before background can be granted),
// then background ("Allow all the time") — returns false if either step is
// declined (or tracking isn't available at all), so the caller can fall
// back to a walk with no distance tracked.
export async function requestWalkTrackingPermissions(): Promise<boolean> {
  if (!(await isWalkTrackingAvailable())) return false;
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== 'granted') return false;
  const background = await Location.requestBackgroundPermissionsAsync();
  return background.status === 'granted';
}

export async function startWalkTracking(): Promise<void> {
  if (!(await isWalkTrackingAvailable())) return;
  await AsyncStorage.multiRemove([STORAGE_KEY_DISTANCE, STORAGE_KEY_LAST_POINT]);
  await Location.startLocationUpdatesAsync(TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 15,
    timeInterval: 10000,
    foregroundService: {
      notificationTitle: 'Safety Doggy',
      notificationBody: 'Suivi de votre sortie en cours…',
    },
  });
}

// Stops the background task and returns the total distance walked, in km.
// Deliberately does NOT clear the AsyncStorage accumulator — the caller is
// about to persist this distance to the walk's row, and that call can fail
// (network). Clearing here first would lose the measured distance forever
// with no way to retry. Call clearWalkTrackingState() once the distance has
// actually been saved.
export async function stopWalkTracking(): Promise<number> {
  if (await isWalkTrackingActive()) {
    await Location.stopLocationUpdatesAsync(TASK_NAME);
  }
  const totalMeters = Number((await AsyncStorage.getItem(STORAGE_KEY_DISTANCE)) ?? '0');
  return totalMeters / 1000;
}

// Resets the distance accumulator — call once a tracked walk's distance has
// been durably saved (or discarded on purpose, e.g. recovering from an
// orphaned tracking session with no matching walk row).
export async function clearWalkTrackingState(): Promise<void> {
  await AsyncStorage.multiRemove([STORAGE_KEY_DISTANCE, STORAGE_KEY_LAST_POINT]);
}

export async function isWalkTrackingActive(): Promise<boolean> {
  if (!(await isWalkTrackingAvailable())) return false;
  try {
    return await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  } catch {
    return false;
  }
}
