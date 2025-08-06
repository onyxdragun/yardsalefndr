'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { X, Heart } from 'lucide-react';
import { useState } from 'react';

export function SignUpBanner() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(true);

  // Don't show if user is already signed in or banner was dismissed
  if (user || !isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 relative">
      <div className="container mx-auto flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-300" />
          <span>
            <strong>Save your favorites!</strong> Sign up free to bookmark garage sales and get notifications.
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href="/auth/signup"
            className="bg-white text-blue-600 px-3 py-1 rounded text-xs font-medium hover:bg-blue-50 transition-colors"
          >
            Sign Up Free
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-blue-200 transition-colors"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
