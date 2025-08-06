import { SubscriptionTier, SubscriptionLimits, SUBSCRIPTION_LIMITS } from '@/types/subscription';

export function getSubscriptionLimits(tier: SubscriptionTier): SubscriptionLimits {
  return SUBSCRIPTION_LIMITS[tier];
}

export function canAccessFeature(
  userTier: SubscriptionTier | undefined,
  requiredTier: SubscriptionTier
): boolean {
  if (!userTier) return false; // No anonymous access now
  
  const tierOrder: SubscriptionTier[] = ['registered', 'premium', 'business'];
  const userTierIndex = tierOrder.indexOf(userTier);
  const requiredTierIndex = tierOrder.indexOf(requiredTier);
  
  return userTierIndex >= requiredTierIndex;
}

export function getUpgradeMessage(
  feature: string,
  requiredTier: SubscriptionTier
): string {
  switch (requiredTier) {
    case 'registered':
      return `${feature} requires a free account. Sign up with Google to unlock this feature!`;
    case 'premium':
      return `${feature} is a premium feature. Upgrade to Premium to access this!`;
    case 'business':
      return `${feature} is available for business accounts. Upgrade to Business!`;
    default:
      return `${feature} requires an account upgrade.`;
  }
}

export function getTierDisplayName(tier: SubscriptionTier): string {
  switch (tier) {
    case 'registered':
      return 'Free Account';
    case 'premium':
      return 'Premium';
    case 'business':
      return 'Business';
    default:
      return 'Unknown';
  }
}
