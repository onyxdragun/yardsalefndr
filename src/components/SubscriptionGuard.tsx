'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { canAccessFeature, getUpgradeMessage } from '@/lib/subscription';
import { SubscriptionTier } from '@/types/subscription';

interface SubscriptionGuardProps {
  requiredTier: SubscriptionTier;
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function SubscriptionGuard({
  requiredTier,
  feature,
  children,
  fallback
}: SubscriptionGuardProps) {
  const { user } = useAuth();
  const userTier = (user?.subscriptionTier as SubscriptionTier) || 'anonymous';
  const hasAccess = canAccessFeature(userTier, requiredTier);

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-yellow-100 dark:bg-yellow-900/40 rounded-full">
          <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6V9a2 2 0 00-2-2H8a2 2 0 00-2 2v2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upgrade Required</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{getUpgradeMessage(feature, requiredTier)}</p>
        {requiredTier === 'registered' ? (
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Sign Up Free
          </Link>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Premium features coming soon!
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
