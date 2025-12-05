import { Fish } from 'lucide-react';
import { BiteIndex } from '../types';
import { getRatingColor, getRatingLabel } from '../utils/helpers';

interface FishCardProps {
  biteIndex: BiteIndex | null;
  fishName: string;
}

export function FishCard({ biteIndex, fishName }: FishCardProps) {
  if (!biteIndex) {
    return (
      <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Fish className="w-6 h-6 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">{fishName}</div>
            <div className="text-xs text-gray-500">Нет данных</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-gray-300 text-gray-600 font-medium">
            —
          </div>
        </div>
      </div>
    );
  }

  const colorClass = getRatingColor(biteIndex.average_rating);
  const label = getRatingLabel(biteIndex.average_rating);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Fish className="w-6 h-6 text-blue-600" />
        <div>
          <div className="font-medium text-gray-900">{biteIndex.fish_name}</div>
          <div className="text-xs text-gray-500">
            {biteIndex.rating_count} {biteIndex.rating_count === 1 ? 'оценка' : 'оценок'}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className={`px-3 py-1 rounded-full font-bold ${colorClass}`}>
          {biteIndex.average_rating.toFixed(1)}
        </div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}
