import { BiteIndex } from '../types';
import { getRatingColor, getRatingLabel } from '../utils/helpers';

interface FishCardProps {
  biteIndex: BiteIndex | null;
  fishName: string;
}

const fishImages: Record<string, string> = {
  'Судак': new URL('../assets/судак.gif', import.meta.url).href,
  'Щука': new URL('../assets/щука.gif', import.meta.url).href,
  'Окунь': new URL('../assets/окунь.gif', import.meta.url).href,
  'Лещ': new URL('../assets/лещ.gif', import.meta.url).href,
  'Плотва': new URL('../assets/плотва.gif', import.meta.url).href,
};

export function FishCard({ biteIndex, fishName }: FishCardProps) {
  const fishImage = fishImages[fishName];

  if (!biteIndex) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-4 flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          {fishImage && (
            <img
              src={fishImage}
              alt={fishName}
              className="w-10 h-10 object-contain opacity-30"
            />
          )}
          <div>
            <div className="font-semibold text-gray-900">{fishName}</div>
            <div className="text-xs text-gray-500">Нет данных</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-gray-200 text-gray-600 font-semibold text-sm">
            —
          </div>
        </div>
      </div>
    );
  }

  const colorClass = getRatingColor(biteIndex.average_rating);
  const label = getRatingLabel(biteIndex.average_rating);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm p-4 flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        {fishImage && (
          <img
            src={fishImage}
            alt={biteIndex.fish_name}
            className="w-10 h-10 object-contain"
          />
        )}
        <div>
          <div className="font-semibold text-gray-900">{biteIndex.fish_name}</div>
          <div className="text-xs text-gray-500">
            {biteIndex.rating_count} {biteIndex.rating_count === 1 ? 'оценка' : 'оценок'}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <div className={`px-3 py-1.5 rounded-full font-bold text-sm ${colorClass}`}>
          {biteIndex.average_rating.toFixed(1)}
        </div>
        <div className="text-xs text-gray-600 font-medium">{label}</div>
      </div>
    </div>
  );
}
