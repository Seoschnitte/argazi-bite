import { Thermometer, Wind, Gauge } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  overallBiteIndex: number;
  loading?: boolean;
}

export function WeatherWidget({ weather, overallBiteIndex, loading }: WeatherWidgetProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3">Ситуация на водоеме сейчас</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3">Ситуация на водоеме сейчас</h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-xs text-gray-500">Температура</div>
            <div className="font-medium">
              {weather ? `${weather.temperature.toFixed(1)}°C` : '—'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Gauge className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-xs text-gray-500">Давление</div>
            <div className="font-medium">
              {weather ? `${weather.pressure.toFixed(0)} мм` : '—'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-blue-600" />
          <div>
            <div className="text-xs text-gray-500">Ветер</div>
            <div className="font-medium">
              {weather ? `${weather.wind_speed.toFixed(1)} м/с ${weather.wind_direction}` : '—'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center text-xl">🎣</div>
          <div>
            <div className="text-xs text-gray-500">Индекс клёва</div>
            <div className="font-bold text-lg">
              {overallBiteIndex > 0 ? overallBiteIndex.toFixed(1) : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
