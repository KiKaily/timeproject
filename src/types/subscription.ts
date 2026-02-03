export type SubscriptionTier = 'free' | 'pro';

export interface SubscriptionFeatures {
  maxProjects: number;
  hasFolders: boolean;
  multipleTimers: boolean;
  hasAppThemes: boolean;
  availableColors: string[];
}

export const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    maxProjects: 10,
    hasFolders: false,
    multipleTimers: false,
    hasAppThemes: false,
    availableColors: ['red', 'orange', 'yellow', 'lime', 'green', 'cyan', 'blue', 'purple', 'pink', 'slate'],
  },
  pro: {
    maxProjects: 100,
    hasFolders: true,
    multipleTimers: true,
    hasAppThemes: true,
    availableColors: [
      'red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'pink',
      'rose', 'indigo', 'teal', 'lime', 'amber', 'emerald', 'violet', 'fuchsia',
      'sky', 'mint', 'coral', 'lavender'
    ],
  },
};

export const getSubscriptionTier = (): SubscriptionTier => {
  try {
    const stored = localStorage.getItem('subscription-tier');
    return (stored as SubscriptionTier) || 'free';
  } catch {
    return 'free';
  }
};

export const setSubscriptionTier = (tier: SubscriptionTier): void => {
  localStorage.setItem('subscription-tier', tier);
};
