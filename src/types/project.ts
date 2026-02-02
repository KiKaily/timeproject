export type AccentColor = 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'pink';

export interface Project {
  id: string;
  name: string;
  timeInSeconds: number;
  accentColor: AccentColor;
  isRunning: boolean;
  lastStartTime: number | null;
}

export const ACCENT_COLORS: AccentColor[] = [
  'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink'
];

export const TIME_OPTIONS = [
  { label: '5m', seconds: 5 * 60 },
  { label: '10m', seconds: 10 * 60 },
  { label: '15m', seconds: 15 * 60 },
  { label: '30m', seconds: 30 * 60 },
  { label: '1h', seconds: 60 * 60 },
  { label: '8h', seconds: 8 * 60 * 60 },
];

export const getAccentColorClass = (color: AccentColor): string => {
  const colorMap: Record<AccentColor, string> = {
    red: 'bg-accent-red',
    orange: 'bg-accent-orange',
    yellow: 'bg-accent-yellow',
    green: 'bg-accent-green',
    cyan: 'bg-accent-cyan',
    blue: 'bg-accent-blue',
    purple: 'bg-accent-purple',
    pink: 'bg-accent-pink',
  };
  return colorMap[color];
};

export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const parseTime = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
};
