import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { DatabaseService } from '@/lib/database';
import GarageSaleDetail from '@/components/GarageSaleDetail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  
  if (isNaN(id)) {
    return { title: 'Garage Sale Not Found' };
  }
  
  const garageSale = await DatabaseService.getGarageSaleById(id);
  
  if (!garageSale) {
    return { title: 'Garage Sale Not Found' };
  }
  
  return {
    title: `${garageSale.title} - Comox Valley Garage Sales`,
    description: garageSale.description || `Garage sale in ${garageSale.city}`,
  };
}

export default async function GarageSaleDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  
  if (isNaN(id)) {
    notFound();
  }
  
  const session = await getServerSession(authOptions);
  const garageSale = await DatabaseService.getGarageSaleById(id);
  
  if (!garageSale) {
    notFound();
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <GarageSaleDetail 
        garageSale={garageSale} 
        currentUser={session?.user ? {
          id: session.user.id!,
          email: session.user.email!,
          name: session.user.name || undefined
        } : null} 
      />
    </div>
  );
}
