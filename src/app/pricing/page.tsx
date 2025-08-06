"use client";

import { useState } from 'react';
import { Check, X, Star, Zap, Building2, User } from 'lucide-react';
import { SUBSCRIPTION_LIMITS, SubscriptionTier } from '@/types/subscription';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Pricing data (placeholder for now)
  const pricing = {
    monthly: {
      premium: 9.99,
      business: 29.99
    },
    annual: {
      premium: 99.99,
      business: 299.99
    }
  };

  const tiers: Array<{
    tier: SubscriptionTier;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    price: number | 'Free';
    description: string;
    popular?: boolean;
    comingSoon?: boolean;
  }> = [
    {
      tier: 'registered',
      name: 'Free Account',
      icon: User,
      price: 'Free',
      description: 'Everything you need to get started - just sign up with Google!',
      comingSoon: false
    },
    {
      tier: 'premium',
      name: 'Premium',
      icon: Star,
      price: pricing[billingCycle].premium,
      description: 'Perfect for frequent sellers',
      popular: true,
      comingSoon: true
    },
    {
      tier: 'business',
      name: 'Business',
      icon: Building2,
      price: pricing[billingCycle].business,
      description: 'For power users and businesses',
      comingSoon: true
    }
  ];

  const features = [
    { key: 'monthlySales', label: 'Monthly garage sales', unit: ' sales' },
    { key: 'maxCategories', label: 'Categories per sale', unit: ' categories' },
    { key: 'listingDuration', label: 'Listing duration', unit: ' days' },
    { key: 'hasCustomTitle', label: 'Custom titles', unit: '' },
    { key: 'hasDescription', label: 'Full descriptions', unit: '' },
    { key: 'hasHistory', label: 'Search history', unit: '' },
    { key: 'hasFavorites', label: 'Save favorites', unit: '' },
    { key: 'hasNotifications', label: 'Email notifications', unit: '' }
  ];

  const formatFeatureValue = (tier: SubscriptionTier, featureKey: string, unit: string) => {
    const limits = SUBSCRIPTION_LIMITS[tier];
    const value = (limits as unknown as Record<string, unknown>)[featureKey];
    
    if (typeof value === 'boolean') {
      return value;
    }
    
    if (featureKey === 'monthlySales' && typeof value === 'number' && value >= 999) {
      return 'Unlimited';
    }
    
    return `${value}${unit}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find the perfect plan for your garage sale needs. Start free and upgrade as you grow.
          </p>
          
          {/* Coming Soon Banner */}
          <div className="mt-6 inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="h-4 w-4" />
            Premium plans coming soon!
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'
              }`}
            >
              Annual
              <span className="ml-1 text-green-600 dark:text-green-400 text-xs">(Save 20%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {tiers.map((tierInfo) => (
            <div
              key={tierInfo.tier}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                tierInfo.popular
                  ? 'border-blue-500 dark:border-blue-400'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Popular Badge */}
              {tierInfo.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Coming Soon Badge */}
              {tierInfo.comingSoon && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Coming Soon
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <tierInfo.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {tierInfo.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      {typeof tierInfo.price === 'number' ? `$${tierInfo.price}` : tierInfo.price}
                    </span>
                    {typeof tierInfo.price === 'number' && (
                      <span className="text-gray-600 dark:text-gray-400">
                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    {tierInfo.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {features.map((feature) => {
                    const value = formatFeatureValue(tierInfo.tier, feature.key, feature.unit);
                    const isBoolean = typeof value === 'boolean';
                    
                    return (
                      <div key={feature.key} className="flex items-center gap-3">
                        {isBoolean ? (
                          value ? (
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          )
                        ) : (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          isBoolean && !value ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {isBoolean ? feature.label : `${value} ${feature.label.replace(feature.unit, '')}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <button
                  disabled={tierInfo.comingSoon}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    tierInfo.comingSoon
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                      : tierInfo.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : tierInfo.tier === 'registered'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                >
                  {tierInfo.comingSoon 
                    ? 'Coming Soon' 
                    : tierInfo.tier === 'registered'
                    ? 'Sign Up with Google'
                    : 'Choose Plan'
                  }
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                How easy is it to sign up?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Super easy! Just click &quot;Sign up with Google&quot; and you&apos;ll have a free account in seconds. No forms to fill out.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! You can upgrade to premium or business plans at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                What happens if I exceed my monthly limit?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You&apos;ll be prompted to upgrade your plan or wait until the next month. Your existing listings remain active.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                When will premium plans be available?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Premium and Business plans are coming soon! Sign up for our newsletter to be notified when they launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
