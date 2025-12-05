export interface FishType {
  id: string;
  name_ru: string;
  name_en: string;
  icon_name: string;
  display_order: number;
  created_at: string;
}

export interface Rating {
  id: string;
  telegram_user_id: string;
  fish_type_id: string;
  rating: number;
  latitude: number;
  longitude: number;
  air_temp: number | null;
  pressure: number | null;
  wind_speed: number | null;
  wind_direction: string | null;
  created_at: string;
}

export interface BiteIndex {
  fish_type_id: string;
  fish_name: string;
  icon_name: string;
  average_rating: number;
  rating_count: number;
}

export interface WeatherData {
  temperature: number;
  pressure: number;
  wind_speed: number;
  wind_direction: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export type TimePeriod = 'today' | 'week' | 'month' | 'year';

export interface AggregatedData {
  period: string;
  average_rating: number;
}
