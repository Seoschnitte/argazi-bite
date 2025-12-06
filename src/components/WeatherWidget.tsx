import { Thermometer, Wind, Gauge } from 'lucide-react';
import { WeatherData } from '../types';
import { getRatingColor, getRatingLabel } from '../utils/helpers';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  overallBiteIndex: number;
  loading?: boolean;
}

export function WeatherWidget({ weather, overallBiteIndex, loading }: WeatherWidgetProps) {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm p-5 mb-4 border border-gray-100">
        <h2 className="text-lg font-semibold mb-3">Ситуация на водоеме сейчас</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const biteColorClass = getRatingColor(overallBiteIndex);
  const biteLabel = getRatingLabel(overallBiteIndex);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm p-5 mb-4 border border-gray-100">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Ситуация на водоеме сейчас</h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
          <Thermometer className="w-5 h-5 text-blue-500" />
          <div>
            <div className="text-xs text-gray-500">Температура</div>
            <div className="font-semibold text-gray-900">
              {weather ? `${weather.temperature.toFixed(1)}°` : '—'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
          <Gauge className="w-5 h-5 text-blue-500" />
          <div>
            <div className="text-xs text-gray-500">Давление</div>
            <div className="font-semibold text-gray-900">
              {weather ? `${weather.pressure.toFixed(0)}` : '—'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
          <Wind className="w-5 h-5 text-blue-500" />
          <div>
            <div className="text-xs text-gray-500">Ветер</div>
            <div className="font-semibold text-gray-900">
              {weather ? `${weather.wind_speed.toFixed(1)} ${weather.wind_direction}` : '—'}
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-3 rounded-xl p-3 border border-opacity-20 ${biteColorClass}`}>
          <div className="w-5 h-5 flex items-center justify-center text-xl">🎣</div>
          <div>
            <div className="text-xs opacity-80">Индекс клёва</div>
            <div className="font-bold text-lg">
              {overallBiteIndex > 0 ? overallBiteIndex.toFixed(1) : '—'}
            </div>
          </div>
        </div>
      </div>

      {overallBiteIndex > 0 && (
        <div className="text-xs text-center text-gray-600 px-3 py-1 bg-gray-100 rounded-lg">
          {biteLabel}
        </div>
      )}
    </div>
  );
}
