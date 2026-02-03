export type AccentColor = 
  | 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'pink'
  | 'rose' | 'indigo' | 'teal' | 'lime' | 'amber' | 'emerald' | 'violet' | 'fuchsia'
  | 'sky' | 'mint' | 'coral' | 'lavender' | 'slate'
  | 'rainbow' | 'aurora' | 'neon' | 'hologram' | 'sunset' | 'ocean' | 'fire' | 'electric' | 'cosmic' | 'chromatic'
  | 'radioactive' | 'prism' | 'vaporwave' | 'nova' | 'liquid';

export interface Project {
  id: string;
  name: string;
  timeInSeconds: number;
  accentColor: AccentColor;
  isRunning: boolean;
  lastStartTime: number | null;
  folderId?: string | null;
}

export interface Folder {
  id: string;
  name: string;
  color: AccentColor;
  isVisible?: boolean;
}

export const ACCENT_COLORS_FREE: AccentColor[] = [
  'red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple', 'pink', 'slate'
];

export const ACCENT_COLORS_PRO: AccentColor[] = [
  'rainbow', 'aurora', 'liquid', 'hologram', 'prism', 'vaporwave', 'nova', 'electric', 'cosmic', 'chromatic'
];

export const ACCENT_COLORS = [...ACCENT_COLORS_FREE, ...ACCENT_COLORS_PRO];

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
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500',
    teal: 'bg-teal-500',
    lime: 'bg-lime-400',
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    fuchsia: 'bg-fuchsia-500',
    sky: 'bg-sky-500',
    mint: 'bg-emerald-300',
    coral: 'bg-orange-400',
    lavender: 'bg-purple-300',
    slate: 'bg-slate-500',
    rainbow: 'color-rainbow',
    aurora: 'color-aurora',
    neon: 'color-neon',
    hologram: 'color-hologram',
    sunset: 'color-sunset',
    ocean: 'color-ocean',
    fire: 'color-fire',
    electric: 'color-electric',
    cosmic: 'color-cosmic',
    chromatic: 'color-chromatic',
    radioactive: 'color-radioactive',
    prism: 'color-prism',
    vaporwave: 'color-vaporwave',
    nova: 'color-nova',
    liquid: 'color-liquid',
  };
  return colorMap[color];
};

export const getAccentBorderClass = (color: AccentColor): string => {
  const colorMap: Record<AccentColor, string> = {
    red: 'border-accent-red',
    orange: 'border-accent-orange',
    yellow: 'border-accent-yellow',
    green: 'border-accent-green',
    cyan: 'border-accent-cyan',
    blue: 'border-accent-blue',
    purple: 'border-accent-purple',
    pink: 'border-accent-pink',
    rose: 'border-rose-500',
    indigo: 'border-indigo-500',
    teal: 'border-teal-500',
    lime: 'border-lime-400',
    amber: 'border-amber-500',
    emerald: 'border-emerald-500',
    violet: 'border-violet-500',
    fuchsia: 'border-fuchsia-500',
    sky: 'border-sky-500',
    mint: 'border-emerald-300',
    coral: 'border-orange-400',
    lavender: 'border-purple-300',
    slate: 'border-slate-500',
    rainbow: 'border-transparent',
    aurora: 'border-transparent',
    neon: 'border-transparent',
    hologram: 'border-transparent',
    sunset: 'border-transparent',
    ocean: 'border-transparent',
    fire: 'border-transparent',
    electric: 'border-transparent',
    cosmic: 'border-transparent',
    chromatic: 'border-transparent',
    radioactive: 'border-transparent',
    prism: 'border-transparent',
    vaporwave: 'border-transparent',
    liquid: 'border-transparent',
    nova: 'border-transparent',
  };
  return colorMap[color];
};

export const formatTime = (seconds: number, showSeconds: boolean = true): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (!showSeconds) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const parseTime = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 3600 + parts[1] * 60;
  }
  return 0;
};
