import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { FishType, BiteIndex, WeatherData, TimePeriod } from '../types';
import { supabase } from '../lib/supabase';
import { WeatherWidget } from './WeatherWidget';
import { Tabs } from './Tabs';
import { FishCard } from './FishCard';
import { RatingForm } from './RatingForm';

interface MainScreenProps {
  telegramUserId: string;
}

export function MainScreen({ telegramUserId }: MainScreenProps) {
  const [fishTypes, setFishTypes] = useState<FishType[]>([]);
  const [biteIndices, setBiteIndices] = useState<BiteIndex[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [overallBiteIndex, setOverallBiteIndex] = useState(0);
  const [activePeriod, setActivePeriod] = useState<TimePeriod>('today');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadBiteIndices();
  }, [activePeriod, fishTypes]);

  const loadInitialData = async () => {
    try {
      const { data: fishData, error: fishError } = await supabase
        .from('fish_types')
        .select('*')
        .order('display_order');

      if (fishError) throw fishError;
      setFishTypes(fishData || []);

      const weatherResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-weather?lat=55.38&lon=60.40`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        setWeather(weatherData);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBiteIndices = async () => {
    if (fishTypes.length === 0) return;

    try {
      let timeFilter = '';
      const now = new Date();

      switch (activePeriod) {
        case 'today':
          const today = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          timeFilter = `created_at.gte.${today}`;
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
          timeFilter = `created_at.gte.${weekAgo}`;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
          timeFilter = `created_at.gte.${monthAgo}`;
          break;
        case 'year':
          const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
          timeFilter = `created_at.gte.${yearAgo}`;
          break;
      }

      const { data, error } = await supabase
        .from('ratings')
        .select('fish_type_id, rating')
        .gte('created_at', timeFilter.split('.gte.')[1]);

      if (error) throw error;

      const indices: BiteIndex[] = fishTypes.map((fish) => {
        const fishRatings = data?.filter((r) => r.fish_type_id === fish.id) || [];

        if (fishRatings.length === 0) {
          return {
            fish_type_id: fish.id,
            fish_name: fish.name_ru,
            icon_name: fish.icon_name,
            average_rating: 0,
            rating_count: 0,
          };
        }

        const sum = fishRatings.reduce((acc, r) => acc + r.rating, 0);
        const average = sum / fishRatings.length;

        return {
          fish_type_id: fish.id,
          fish_name: fish.name_ru,
          icon_name: fish.icon_name,
          average_rating: average,
          rating_count: fishRatings.length,
        };
      });

      setBiteIndices(indices);

      const allRatings = indices.filter((i) => i.rating_count > 0);
      if (allRatings.length > 0) {
        const overallAvg =
          allRatings.reduce((acc, i) => acc + i.average_rating, 0) / allRatings.length;
        setOverallBiteIndex(overallAvg);
      } else {
        setOverallBiteIndex(0);
      }
    } catch (error) {
      console.error('Error loading bite indices:', error);
    }
  };

  const handleRatingSuccess = () => {
    loadBiteIndices();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">Клёво! Аргази</h1>

        <WeatherWidget
          weather={weather}
          overallBiteIndex={overallBiteIndex}
          loading={loading}
        />

        <Tabs activePeriod={activePeriod} onPeriodChange={setActivePeriod} />

        <div className="space-y-3 mb-6">
          {fishTypes.map((fish) => {
            const index = biteIndices.find((i) => i.fish_type_id === fish.id);
            return (
              <FishCard
                key={fish.id}
                biteIndex={index && index.rating_count > 0 ? index : null}
                fishName={fish.name_ru}
              />
            );
          })}
        </div>

        <button
          onClick={() => setShowRatingForm(true)}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Оценить клёв
        </button>

        {showRatingForm && (
          <RatingForm
            fishTypes={fishTypes}
            telegramUserId={telegramUserId}
            onClose={() => setShowRatingForm(false)}
            onSuccess={handleRatingSuccess}
          />
        )}
      </div>
    </div>
  );
}
