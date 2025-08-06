'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { GarageSale } from '@/types/database';
import { HeartIcon, MapPinIcon, CalendarIcon, ClockIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Link from 'next/link';

interface FavoritesData {
  garageSales: GarageSale[];
  totalCount: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export default function FavoritesClient() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoritesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [removingFavorite, setRemovingFavorite] = useState<number | null>(null);

  const fetchFavorites = useCallback(async (pageNum: number = 1, showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      const response = await fetch(`/api/favorites?page=${pageNum}&limit=10`);

      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }

      const data = await response.json();
      console.log('Favorites API response: ', data);
      setFavorites({ garageSales: Array.isArray(data) ? data : [], totalCount: Array.isArray(data) ? data.length : 0, page: 1, totalPages: 1, hasMore: false });;
      console.log("Favorites is : ", favorites);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  const removeFavorite = useCallback(async (garageSaleId: number) => {
    try {
      setRemovingFavorite(garageSaleId);
      const response = await fetch(`/api/favorites?garageSaleId=${garageSaleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      // Refresh favorites list
      await fetchFavorites(page, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove favorite');
    } finally {
      setRemovingFavorite(null);
    }
  }, [page, fetchFavorites]);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Initial load when user is available
  useEffect(() => {
    if (user) {
      fetchFavorites(1);
    }
  }, [user, fetchFavorites]);

  // Handle page changes separately
  useEffect(() => {
    if (user && page > 1) {
      fetchFavorites(page, false);
    }
  }, [page, user, fetchFavorites]);

  if (loading && !favorites) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchFavorites(page)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!favorites || !Array.isArray(favorites.garageSales) || favorites.garageSales.length === 0) {
    return (
      <div className="text-center py-12">
        <HeartIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Favorites Yet</h2>
        <p className="text-gray-600 mb-6">
          Start browsing garage sales and save your favorites to see them here.
        </p>
        <Link
          href="/map"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <MapPinIcon className="h-5 w-5" />
          Browse Garage Sales
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {favorites.totalCount} favorite{favorites.totalCount !== 1 ? 's' : ''} found
        </p>
        <Link
          href="/map"
          className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
        >
          <MapPinIcon className="h-4 w-4" />
          View on Map
        </Link>
      </div>

      <div className="grid gap-6">
        {favorites.garageSales.map((sale) => (
          <div key={sale.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{sale.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sale.status)}`}>
                    {sale.status}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  <span>{sale.address}, {sale.city}</span>
                </div>
              </div>
              <button
                onClick={() => removeFavorite(sale.id)}
                disabled={removingFavorite === sale.id}
                className="text-red-600 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50 disabled:opacity-50"
                title="Remove from favorites"
              >
                {removingFavorite === sale.id ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                ) : (
                  <HeartIconSolid className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>
                  {formatDate(sale.startDate)}
                  {sale.startDate !== sale.endDate && ` - ${formatDate(sale.endDate)}`}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-4 w-4 mr-2" />
                <span>{formatTime(sale.startTime)} - {formatTime(sale.endTime)}</span>
              </div>
            </div>

            {sale.description && (
              <p className="text-gray-700 mb-4 line-clamp-3">{sale.description}</p>
            )}

            {sale.categories && sale.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {sale.categories.map((category) => (
                  <span
                    key={typeof category === 'string' ? category : category.name}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {typeof category === 'string' ? category : category.name}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {sale.contactPhone && (
                  <div className="flex items-center gap-1">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{sale.contactPhone}</span>
                  </div>
                )}
                {sale.isMultiFamily && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Multi-Family
                  </span>
                )}
                {sale.cashOnly && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    Cash Only
                  </span>
                )}
              </div>
              <Link
                href={`/garage-sales/${sale.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {favorites.totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {page} of {favorites.totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= favorites.totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
