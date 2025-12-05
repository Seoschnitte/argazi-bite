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
          className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
            activePeriod === tab.value
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
