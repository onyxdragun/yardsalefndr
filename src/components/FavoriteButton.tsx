'use client';

import { useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface FavoriteButtonProps {
  garageSaleId: number;
  initialIsFavorited?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FavoriteButton({
  garageSaleId,
  initialIsFavorited = false,
  showText = false,
  size = 'md',
  className = ''
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const toggleFavorite = async () => {
    if (!user) {
      // Show sign-up prompt for non-authenticated users
      setShowSignUpPrompt(true);
      // Auto-hide after 5 seconds
      setTimeout(() => setShowSignUpPrompt(false), 5000);
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`/api/favorites?garageSaleId=${garageSaleId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to remove from favorites');
        }

        setIsFavorited(false);
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ garageSaleId }),
        });

        if (!response.ok) {
          throw new Error('Failed to add to favorites');
        }

        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Always render the button, but show different behavior for authenticated vs non-authenticated users
  return (
    <div className="relative">
      <button
        onClick={toggleFavorite}
        disabled={isLoading}
        className={`
          inline-flex items-center gap-2 transition-colors
          ${user && isFavorited 
            ? 'text-red-600 hover:text-red-700' 
            : 'text-gray-400 hover:text-red-500'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
          ${className}
        `}
        title={user 
          ? (isFavorited ? 'Remove from favorites' : 'Add to favorites')
          : 'Sign up to save favorites'
        }
      >
        {isLoading ? (
          <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-red-600 ${sizeClasses[size]}`}></div>
        ) : (user && isFavorited) ? (
          <HeartIconSolid className={`${sizeClasses[size]} fill-current`} />
        ) : (
          <HeartIcon className={`${sizeClasses[size]}`} />
        )}
        {showText && (
          <span className="text-sm font-medium">
            {user 
              ? (isFavorited ? 'Favorited' : 'Add to Favorites')
              : 'Add to Favorites'
            }
          </span>
        )}
      </button>

      {/* Sign-up prompt tooltip */}
      {showSignUpPrompt && !user && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm whitespace-nowrap">
            <div className="text-center mb-2">
              <strong>Save your favorites!</strong>
            </div>
            <div className="text-xs text-blue-100 mb-3">
              Create a free account to save garage sales and never lose track of great deals.
            </div>
            <div className="flex gap-2">
              <Link 
                href="/auth/signup"
                className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
              >
                Sign Up Free
              </Link>
              <Link 
                href="/auth/signin"
                className="border border-white text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
            {/* Arrow pointer */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-600"></div>
          </div>
        </div>
      )}
    </div>
  );
}
