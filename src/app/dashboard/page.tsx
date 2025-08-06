"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Trash2, Eye, Calendar, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { SubscriptionTier } from '@/types/subscription';
import { getTierDisplayName } from '@/lib/subscription';

interface GarageSale {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  province: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: string;
  contactPhone: string;
  contactEmail: string;
  viewsCount: number;
  categories: string[];
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [garageSales, setGarageSales] = useState<GarageSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all'); // 'all', 'active', 'scheduled', 'completed', 'draft', 'cancelled'
  const [usageInfo, setUsageInfo] = useState<{ canPost: boolean; currentCount: number; limit: number } | null>(null);

  const fetchUserGarageSales = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const [salesResponse, usageResponse] = await Promise.all([
        fetch(`/api/garage-sales/user/${user.id}`),
        fetch('/api/user/usage-check')
      ]);

      const salesData = await salesResponse.json();
      const usageData = await usageResponse.json();

      if (!salesResponse.ok) {
        throw new Error(salesData.error || 'Failed to fetch garage sales');
      }

      setGarageSales(salesData.data || []);
      
      if (usageResponse.ok) {
        setUsageInfo(usageData.data);
      }
    } catch (err) {
      console.error('Error fetching garage sales:', err);
      setError(err instanceof Error ? err.message : 'Failed to load garage sales');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/auth/signin');
      return;
    }

    fetchUserGarageSales();
  }, [user, authLoading, router, fetchUserGarageSales]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this garage sale? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/garage-sales/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete garage sale');
      }

      // Remove the deleted item from the list
      setGarageSales(prev => prev.filter(sale => sale.id !== id));
    } catch (err) {
      console.error('Error deleting garage sale:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete garage sale');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  // Filter garage sales based on active filter
  const filteredGarageSales = garageSales.filter(sale => {
    if (activeFilter === 'all') return true;
    return sale.status === activeFilter;
  });

  // Get the card style based on whether it's the active filter
  const getCardStyle = (filter: string) => {
    const isActive = activeFilter === filter;
    return `bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md ${
      isActive ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
    }`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your garage sales...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchUserGarageSales}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  My Garage Sales
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your garage sale listings
                </p>
                {user && (
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Account: <span className="font-medium text-blue-600 dark:text-blue-400">
                        {getTierDisplayName((user.subscriptionTier as SubscriptionTier) || 'anonymous')}
                      </span>
                    </span>
                    {usageInfo && (
                      <span className="text-gray-500 dark:text-gray-400">
                        This month: <span className="font-medium">
                          {usageInfo.currentCount}/{usageInfo.limit} sales
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                {usageInfo && !usageInfo.canPost && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-sm text-yellow-700 dark:text-yellow-300">Monthly limit reached</span>
                  </div>
                )}
                <Link
                  href="/add-garage-sale"
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    usageInfo?.canPost !== false 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add New Sale
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div 
              className={getCardStyle('all')}
              onClick={() => setActiveFilter('all')}
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {garageSales.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Sales</div>
              {activeFilter === 'all' && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">Active Filter</div>
              )}
            </div>
            <div 
              className={getCardStyle('active')}
              onClick={() => setActiveFilter('active')}
            >
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {garageSales.filter(s => s.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Now</div>
              {activeFilter === 'active' && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">Active Filter</div>
              )}
            </div>
            <div 
              className={getCardStyle('scheduled')}
              onClick={() => setActiveFilter('scheduled')}
            >
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {garageSales.filter(s => s.status === 'scheduled').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Scheduled</div>
              {activeFilter === 'scheduled' && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">Active Filter</div>
              )}
            </div>
            <div 
              className={getCardStyle('completed')}
              onClick={() => setActiveFilter('completed')}
            >
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                {garageSales.filter(s => s.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              {activeFilter === 'completed' && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">Active Filter</div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {garageSales.reduce((sum, sale) => sum + (sale.viewsCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Non-filterable</div>
            </div>
          </div>

          {/* Garage Sales List */}
          {garageSales.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Garage Sales Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Get started by creating your first garage sale listing.
              </p>
              <Link
                href="/add-garage-sale"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add Your First Sale
              </Link>
            </div>
          ) : filteredGarageSales.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No {activeFilter === 'all' ? '' : activeFilter + ' '}Garage Sales Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {activeFilter === 'all' 
                  ? 'You don\'t have any garage sales yet.'
                  : `You don't have any ${activeFilter} garage sales.`
                }
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Show All Sales
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeFilter === 'all' 
                    ? `All Garage Sales (${filteredGarageSales.length})`
                    : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Sales (${filteredGarageSales.length})`
                  }
                </h2>
                {activeFilter !== 'all' && (
                  <button
                    onClick={() => setActiveFilter('all')}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="grid gap-6">
                {filteredGarageSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {sale.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sale.status)}`}>
                            {sale.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{sale.address}, {sale.city}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(sale.startDate)} - {formatDate(sale.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            <span>{sale.viewsCount || 0} views</span>
                          </div>
                          {sale.contactPhone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{sale.contactPhone}</span>
                            </div>
                          )}
                          {sale.contactEmail && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{sale.contactEmail}</span>
                            </div>
                          )}
                        </div>

                        {sale.description && (
                          <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                            {sale.description}
                          </p>
                        )}

                        {sale.categories && sale.categories.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {sale.categories.slice(0, 3).map((category, index) => {
                              let categoryLabel;
                              if (typeof category === 'string') {
                                categoryLabel = category;
                              } else if (typeof category === 'object' && category !== null) {
                                categoryLabel = Object.values(category).find(val => typeof val === 'string') || JSON.stringify(category);
                              } else {
                                categoryLabel = 'Category';
                              }
                              return (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded-full"
                                >
                                  {categoryLabel}
                                </span>
                              );
                            })}
                            {sale.categories.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                +{sale.categories.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Link
                          href={`/garage-sales/edit/${sale.id}`}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit garage sale"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(sale.id)}
                          disabled={deleteLoading === sale.id}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete garage sale"
                        >
                          {deleteLoading === sale.id ? (
                            <div className="w-4 h-4 animate-spin border-2 border-red-600 border-t-transparent rounded-full"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
  );
}
