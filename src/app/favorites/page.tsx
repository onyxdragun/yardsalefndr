import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { redirect } from 'next/navigation';
import FavoritesClient from '@/components/FavoritesClient';

export const metadata: Metadata = {
  title: 'My Favorites - Comox Valley Garage Sales',
  description: 'View and manage your favorite garage sales',
};

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
            <p className="text-gray-600">
              Garage sales you&apos;ve saved to visit later
            </p>
          </div>
          
          <FavoritesClient />
        </div>
      </div>
    </div>
  );
}
