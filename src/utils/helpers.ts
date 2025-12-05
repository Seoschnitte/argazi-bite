import { UserLocation } from '../types';

const RESERVOIR_POLYGON = [
  { lat: 55.480871, lng: 60.302051 },
  { lat: 55.051804, lng: 59.837034 },
  { lat: 54.951552, lng: 60.257504 },
  { lat: 55.370411, lng: 60.505119 },
  { lat: 55.488239, lng: 60.407015 },
];

const MAX_DISTANCE_KM = 1;

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isPointInPolygon(
  point: { lat: number; lng: number },
  polygon: { lat: number; lng: number }[]
): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lat;
    const yi = polygon[i].lng;
    const xj = polygon[j].lat;
    const yj = polygon[j].lng;

    const intersect =
      yi > point.lng !== yj > point.lng &&
      point.lat < ((xj - xi) * (point.lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function distanceToPolygon(
  point: { lat: number; lng: number },
  polygon: { lat: number; lng: number }[]
): number {
  let minDistance = Infinity;

  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const distance = Math.min(
      haversineDistance(point.lat, point.lng, polygon[i].lat, polygon[i].lng),
      haversineDistance(point.lat, point.lng, polygon[j].lat, polygon[j].lng)
    );
    minDistance = Math.min(minDistance, distance);
  }

  return minDistance;
}

export function isWithinReservoir(location: UserLocation): boolean {
  const point = { lat: location.latitude, lng: location.longitude };

  if (isPointInPolygon(point, RESERVOIR_POLYGON)) {
    return true;
  }

  const distance = distanceToPolygon(point, RESERVOIR_POLYGON);
  return distance <= MAX_DISTANCE_KM;
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.1) return 'bg-green-500 text-white';
  if (rating >= 3.1) return 'bg-yellow-500 text-white';
  if (rating >= 2.1) return 'bg-orange-500 text-white';
  return 'bg-red-500 text-white';
}

export function getRatingLabel(rating: number): string {
  if (rating >= 4.1) return 'Клюёт!';
  if (rating >= 3.1) return 'Клёв средний';
  if (rating >= 2.1) return 'Клёв слабый';
  return 'Не клюёт';
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export async function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
