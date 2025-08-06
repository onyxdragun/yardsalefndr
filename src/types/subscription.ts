export type SubscriptionTier = 'registered' | 'premium' | 'business';

export interface SubscriptionLimits {
  monthlySales: number;
  maxCategories: number;
  listingDuration: number; // days
  hasCustomTitle: boolean;
  hasDescription: boolean;
  hasHistory: boolean;
  hasFavorites: boolean;
  hasNotifications: boolean;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  registered: {
    monthlySales: 2,
    maxCategories: 5,
    listingDuration: 14,
    hasCustomTitle: true,
    hasDescription: true,
    hasHistory: true,
    hasFavorites: true,
    hasNotifications: true
  },
  premium: {
    monthlySales: 10,
    maxCategories: 10,
    listingDuration: 30,
    hasCustomTitle: true,
    hasDescription: true,
    hasHistory: true,
    hasFavorites: true,
    hasNotifications: true
  },
  business: {
    monthlySales: 999,
    maxCategories: 10,
    listingDuration: 60,
    hasCustomTitle: true,
    hasDescription: true,
    hasHistory: true,
    hasFavorites: true,
    hasNotifications: true
  }
};

export interface UserUsage {
  canPost: boolean;
  currentCount: number;
  limit: number;
}
