import { useState, useEffect } from 'react';
import { X, Fish, MapPin, CheckCircle } from 'lucide-react';
import { FishType, WeatherData } from '../types';
import { supabase } from '../lib/supabase';
import { getUserLocation, isWithinReservoir } from '../utils/helpers';

interface RatingFormProps {
  fishTypes: FishType[];
  telegramUserId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface FishRating {
  fishTypeId: string;
  rating: number;
  canRate: boolean;
}

export function RatingForm({ fishTypes, telegramUserId, onClose, onSuccess }: RatingFormProps) {
  const [ratings, setRatings] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [ratingLimits, setRatingLimits] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    checkRatingLimits();
  }, []);

  const checkRatingLimits = async () => {
    try {
      const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('ratings')
        .select('fish_type_id')
        .eq('telegram_user_id', telegramUserId)
        .gte('created_at', sixHoursAgo);

      if (error) throw error;

      const limits = new Map<string, boolean>();
      data?.forEach((rating) => {
        limits.set(rating.fish_type_id, false);
      });

      fishTypes.forEach((fish) => {
        if (!limits.has(fish.id)) {
          limits.set(fish.id, true);
        }
      });

      setRatingLimits(limits);
    } catch (err) {
      console.error('Error checking rating limits:', err);
    }
  };

  const handleRatingChange = (fishTypeId: string, rating: number) => {
    const newRatings = new Map(ratings);
    newRatings.set(fishTypeId, rating);
    setRatings(newRatings);
  };

  const handleSubmit = async () => {
    if (ratings.size === 0) {
      setError('Выберите хотя бы одну рыбу и поставьте оценку');
      return;
    }

    setLoading(true);
    setError(null);
    setCheckingLocation(true);

    try {
      const location = await getUserLocation();

      if (!isWithinReservoir(location)) {
        throw new Error(
          'Для оценки клёва Вы должны находиться на водохранилище Аргази или вблизи его береговой линии.'
        );
      }

      setCheckingLocation(false);

      const weatherResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-weather?lat=${location.latitude}&lon=${location.longitude}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      let weatherData: WeatherData | null = null;
      if (weatherResponse.ok) {
        weatherData = await weatherResponse.json();
      }

      const ratingsToInsert = Array.from(ratings.entries()).map(([fishTypeId, rating]) => ({
        telegram_user_id: telegramUserId,
        fish_type_id: fishTypeId,
        rating,
        latitude: location.latitude,
        longitude: location.longitude,
        air_temp: weatherData?.temperature || null,
        pressure: weatherData?.pressure || null,
        wind_speed: weatherData?.wind_speed || null,
        wind_direction: weatherData?.wind_direction || null,
      }));

      const { error: insertError } = await supabase.from('ratings').insert(ratingsToInsert);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка! Включите геолокацию на вашем устройстве.');
    } finally {
      setLoading(false);
      setCheckingLocation(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Спасибо!</h2>
          <p className="text-gray-600">Ваша оценка учтена.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-md w-full my-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Оценить клёв</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Выберите рыбу которую ловили и оцените ее активность по шкале 1–5. Ставить оценки можно
          не чаще чем каждые 6 часов, поэтому лучше всего сделать это в конце рыболовной сессии.
        </p>

        <div className="space-y-4 mb-6">
          {fishTypes.map((fish) => {
            const canRate = ratingLimits.get(fish.id) !== false;
            const currentRating = ratings.get(fish.id) || 0;

            return (
              <div
                key={fish.id}
                className={`border rounded-lg p-4 ${!canRate ? 'opacity-50 bg-gray-50' : ''}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Fish className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{fish.name_ru}</span>
                  {!canRate && (
                    <span className="text-xs text-red-600 ml-auto">
                      Можно оценить через 6 часов
                    </span>
                  )}
                </div>

                {canRate && (
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleRatingChange(fish.id, value)}
                        className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                          currentRating === value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || ratings.size === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {checkingLocation ? 'Проверка геолокации...' : loading ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
    </div>
  );
}
