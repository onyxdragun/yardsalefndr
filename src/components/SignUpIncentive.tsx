'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Heart, Bell, MapPin, Star } from 'lucide-react';

export function SignUpIncentive() {
  const { user } = useAuth();

  // Don't show if user is already signed in
  if (user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get More from YardSale<span className="text-blue-200">Fndr</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Create a free account to unlock powerful features that make garage sale hunting even better!
          </p>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <Heart className="h-8 w-8 mx-auto mb-3 text-red-300" />
              <h3 className="font-semibold mb-2">Save Favorites</h3>
              <p className="text-sm text-blue-100">
                Bookmark garage sales to visit later. Never lose track of great finds!
              </p>
            </div>
            
            <div className="text-center">
              <Bell className="h-8 w-8 mx-auto mb-3 text-yellow-300" />
              <h3 className="font-semibold mb-2">Get Notifications</h3>
              <p className="text-sm text-blue-100">
                Be first to know about new sales in your area with personalized alerts.
              </p>
            </div>
            
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-3 text-green-300" />
              <h3 className="font-semibold mb-2">List Your Sales</h3>
              <p className="text-sm text-blue-100">
                Easily create and manage your own garage sale listings to reach more buyers.
              </p>
            </div>
            
            <div className="text-center">
              <Star className="h-8 w-8 mx-auto mb-3 text-orange-300" />
              <h3 className="font-semibold mb-2">Track History</h3>
              <p className="text-sm text-blue-100">
                Keep a record of sales you&apos;ve visited and items you&apos;ve found.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup"
              className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Sign Up Free
            </Link>
            <Link 
              href="/auth/signin"
              className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
          </div>
          
          <p className="text-sm text-blue-200 mt-4">
            It&apos;s completely free • No credit card required • Join thousands of garage sale enthusiasts
          </p>
        </div>
      </div>
    </div>
  );
}
