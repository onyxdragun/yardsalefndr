'use client';

import { GarageSale } from '@/types/database';
import { MapPinIcon, CalendarIcon, ClockIcon, PhoneIcon, EnvelopeIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import FavoriteButton from './FavoriteButton';
import Link from 'next/link';
import { getNavigationUrl } from '@/lib/navigation';

interface GarageSaleDetailProps {
  garageSale: GarageSale;
  currentUser?: { id: string; email: string; name?: string } | null;
}

export default function GarageSaleDetail({ garageSale, currentUser }: GarageSaleDetailProps) {
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

  const getGoogleMapsUrl = () => {
    const navigationOptions = {
      address: `${garageSale.address}, ${garageSale.city}`,
      latitude: garageSale.latitude ? parseFloat(garageSale.latitude.toString()) : undefined,
      longitude: garageSale.longitude ? parseFloat(garageSale.longitude.toString()) : undefined,
      title: garageSale.title
    };
    
    return getNavigationUrl(navigationOptions);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{garageSale.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(garageSale.status)}`}>
                    {garageSale.status}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  <span>{garageSale.address}, {garageSale.city}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FavoriteButton 
                  garageSaleId={garageSale.id}
                  showText={true}
                  size="lg"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                />
                {currentUser && currentUser.id === garageSale.userId.toString() && (
                  <Link
                    href={`/garage-sales/edit/${garageSale.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Edit Sale
                  </Link>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2" />
                <span>
                  {formatDate(garageSale.startDate)}
                  {garageSale.startDate !== garageSale.endDate && ` - ${formatDate(garageSale.endDate)}`}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>{formatTime(garageSale.startTime)} - {formatTime(garageSale.endTime)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Description */}
                {garageSale.description && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                    <p className="text-gray-700 leading-relaxed">{garageSale.description}</p>
                  </div>
                )}

                {/* Categories */}
                {garageSale.categories && garageSale.categories.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Categories</h2>
                    <div className="flex flex-wrap gap-2">
                      {garageSale.categories.map((category) => (
                        <span
                          key={typeof category === 'string' ? category : category.name}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {typeof category === 'string' ? category : category.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sale Details */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Sale Details</h2>
                  <div className="space-y-3">
                    {garageSale.isMultiFamily && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">Multi-Family Sale</span>
                      </div>
                    )}
                    {garageSale.cashOnly && (
                      <div className="flex items-center gap-2">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                        <span className="text-gray-700">Cash Only</span>
                      </div>
                    )}
                    {garageSale.earlyBirdsWelcome && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">Early Birds Welcome</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Information</h2>
                  <div className="space-y-3">
                    {garageSale.contactPhone && (
                      <div className="flex items-center gap-3">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <a
                          href={`tel:${garageSale.contactPhone}`}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {garageSale.contactPhone}
                        </a>
                      </div>
                    )}
                    {garageSale.contactEmail && (
                      <div className="flex items-center gap-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <a
                          href={`mailto:${garageSale.contactEmail}`}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          {garageSale.contactEmail}
                        </a>
                      </div>
                    )}
                    {!garageSale.contactPhone && !garageSale.contactEmail && (
                      <p className="text-gray-500">No contact information available</p>
                    )}
                  </div>
                </div>

                {/* Location & Directions */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Location & Directions</h2>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 font-medium">{garageSale.address}</p>
                      <p className="text-gray-600">{garageSale.city}, {garageSale.province}</p>
                      {garageSale.postalCode && (
                        <p className="text-gray-600">{garageSale.postalCode}</p>
                      )}
                    </div>
                    <a
                      href={getGoogleMapsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Map */}
        <div className="mt-8 text-center">
          <Link
            href="/map"
            className="text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <MapPinIcon className="h-4 w-4" />
            Back to Map View
          </Link>
        </div>
      </div>
    </div>
  );
}
