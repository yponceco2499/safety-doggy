// Address search via Nominatim (OpenStreetMap) — free, no API key, consistent
// with the OSM tiles already used for the map (§4.1). Usage policy caps this
// at 1 request/second and requires an identifying User-Agent — this module
// is only ever called from an explicit "search" button tap (never
// as-you-type autocomplete), so real usage stays far below that limit.
export interface GeocodingResult {
  displayName: string;
  latitude: number;
  longitude: number;
}

export async function searchAddress(query: string): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url =
    'https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + encodeURIComponent(trimmed);
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'SafetyPet (contact@safetypet.app)',
      Accept: 'application/json',
    },
  });
  if (!response.ok) throw new Error('Geocoding request failed');

  const data = (await response.json()) as { display_name: string; lat: string; lon: string }[];
  return data.map((item) => ({
    displayName: item.display_name,
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
  }));
}
