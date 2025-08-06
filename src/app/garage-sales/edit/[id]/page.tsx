"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { AddGarageSaleForm } from '@/components/AddGarageSaleForm';
import { Navbar } from '@/components/Navbar';

interface GarageSale {
  id: number;
  title: string;
  description: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  contactPhone: string;
  contactEmail: string;
  isMultiFamily: boolean;
  cashOnly: boolean;
  earlyBirdsWelcome: boolean;
  categories: string[];
}

export default function EditGarageSalePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [garageSale, setGarageSale] = useState<GarageSale | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [garageSaleId, setGarageSaleId] = useState<string | null>(null);

  // Resolve params on component mount
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setGarageSaleId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  const fetchGarageSale = useCallback(async () => {
    if (!garageSaleId || !user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/garage-sales/${garageSaleId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch garage sale');
      }

      // Check if user owns this garage sale
      if (data.data.userId !== parseInt(user.id)) {
        setError('You can only edit your own garage sales');
        return;
      }

      setGarageSale(data.data);
    } catch (err) {
      console.error('Error fetching garage sale:', err);
      setError(err instanceof Error ? err.message : 'Failed to load garage sale');
    } finally {
      setLoading(false);
    }
  }, [garageSaleId, user?.id]);

  // Effect to handle authentication and initial loading
  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push('/auth/signin');
      return;
    }
  }, [authLoading, user, router]);

  // Effect to fetch garage sale data when we have both garageSaleId and user
  useEffect(() => {
    if (garageSaleId && user?.id && !authLoading) {
      fetchGarageSale();
    }
  }, [garageSaleId, user?.id, authLoading, fetchGarageSale]);

  const handleSubmit = async (formData: Record<string, unknown>) => {
    if (!garageSaleId) return;

    try {
      const response = await fetch(`/api/garage-sales/${garageSaleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update garage sale');
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Error updating garage sale:', err);
      throw err; // Let the form handle the error display
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Error Loading Garage Sale
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
      </>
    );
  }

  if (!garageSale) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Garage Sale Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The garage sale you&apos;re trying to edit doesn&apos;t exist or has been deleted.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Garage Sale
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update the details of your garage sale listing.
            </p>
          </div>

          <AddGarageSaleForm
            initialData={garageSale}
            onSubmit={handleSubmit}
            submitButtonText="Update Garage Sale"
            isEditing={true}
          />
        </div>
      </div>
    </>
  );
}
