import { TimePeriod } from '../types';

interface TabsProps {
  activePeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const tabs: { value: TimePeriod; label: string }[] = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'year', label: 'Год' },
];

export function Tabs({ activePeriod, onPeriodChange }: TabsProps) {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onPeriodChange(tab.value)}
          className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all active:scale-95 ${
            activePeriod === tab.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
