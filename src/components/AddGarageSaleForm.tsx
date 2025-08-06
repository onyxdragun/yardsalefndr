"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ITEM_CATEGORIES } from "@/types";
import { MapPin, Calendar, Clock, User, Phone, Mail, Tag, Navigation } from "lucide-react";
import { geocodeAddress, isGeocodeError } from "@/lib/geocoding";
import { trackGarageSaleCreate } from "@/lib/gtag";

interface FormData {
  title: string;
  address: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  categories: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface AddGarageSaleFormProps {
  initialData?: any;
  onSubmit?: (formData: any) => Promise<void>;
  submitButtonText?: string;
  isEditing?: boolean;
}

export function AddGarageSaleForm({ 
  initialData, 
  onSubmit, 
  submitButtonText = "Create Garage Sale",
  isEditing = false 
}: AddGarageSaleFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    address: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
    categories: [],
    contactName: "",
    contactEmail: "",
    contactPhone: ""
  });

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        address: initialData.address || "",
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : "",
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : "",
        startTime: initialData.startTime || "",
        endTime: initialData.endTime || "",
        description: initialData.description || "",
        categories: initialData.categories || [],
        contactName: initialData.contactName || "",
        contactEmail: initialData.contactEmail || "",
        contactPhone: initialData.contactPhone || ""
      });
    }
  }, [initialData]);

  // Auto-populate contact name when user is logged in and no initial data
  useEffect(() => {
    if (session?.user && !initialData && !formData.contactName) {
      const fullName = session.user.name || 
        `${(session.user as any).firstName || ''} ${(session.user as any).lastName || ''}`.trim() ||
        session.user.email?.split('@')[0] || '';
      
      setFormData(prev => ({
        ...prev,
        contactName: fullName
      }));
    }
  }, [session, initialData, formData.contactName]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [showManualCoordinates, setShowManualCoordinates] = useState(false);
  const [manualCoordinates, setManualCoordinates] = useState<{ latitude: string; longitude: string }>({
    latitude: '',
    longitude: ''
  });
  const [geocodedLocation, setGeocodedLocation] = useState<{
    latitude: number;
    longitude: number;
    city?: string;
    province?: string;
    postalCode?: string;
    formattedAddress?: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear geocoded location when address changes
    if (name === 'address') {
      setGeocodedLocation(null);
      setGeocodingError(null);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId]
    }));
  };

  const handleAddressGeocode = async () => {
    if (!formData.address.trim()) {
      setGeocodingError('Please enter an address first');
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);
    setGeocodedLocation(null);

    try {
      const result = await geocodeAddress(formData.address);
      
      if (isGeocodeError(result)) {
        setGeocodingError(result.message);
        // Show manual coordinate input if geocoding fails due to API issues
        if (result.error === 'API_KEY_MISSING' || result.error === 'REQUEST_DENIED') {
          setShowManualCoordinates(true);
        }
      } else {
        setGeocodedLocation(result);
        setGeocodingError(null);
        
        // Optionally update the address field with the formatted address
        if (result.formattedAddress) {
          setFormData(prev => ({
            ...prev,
            address: result.formattedAddress || prev.address
          }));
        }
      }
    } catch {
      setGeocodingError('Failed to geocode address. Please try again.');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Check if user is authenticated
    if (!session) {
      setSubmitMessage({ 
        type: 'error', 
        message: 'You must be logged in to create a garage sale. Please sign in first.' 
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Geocode address if not already done
      let locationData = geocodedLocation;
      
      // Use manual coordinates if provided
      if (!locationData && (manualCoordinates.latitude || manualCoordinates.longitude)) {
        if (manualCoordinates.latitude && manualCoordinates.longitude) {
          locationData = {
            latitude: parseFloat(manualCoordinates.latitude),
            longitude: parseFloat(manualCoordinates.longitude),
            city: '',
            province: '',
            postalCode: '',
            formattedAddress: formData.address
          };
        } else {
          setSubmitMessage({ 
            type: 'error', 
            message: 'Please provide both latitude and longitude coordinates, or remove the manual coordinates.' 
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      if (!locationData && formData.address.trim()) {
        setIsGeocoding(true);
        const geocodeResult = await geocodeAddress(formData.address);
        
        if (isGeocodeError(geocodeResult)) {
          setSubmitMessage({ 
            type: 'error', 
            message: `Address geocoding failed: ${geocodeResult.message}. Please try manual coordinates or verify the address and try again.` 
          });
          setIsSubmitting(false);
          setIsGeocoding(false);
          setShowManualCoordinates(true);
          return;
        }
        
        locationData = geocodeResult;
        setIsGeocoding(false);
      }

      // Prepare the data to send to the API
      const apiData = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        city: locationData?.city,
        province: locationData?.province,
        postalCode: locationData?.postalCode,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        categories: formData.categories,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
      };

      // Use custom onSubmit handler if provided, otherwise use default behavior
      if (onSubmit) {
        await onSubmit(apiData);
        setSubmitMessage({ 
          type: 'success', 
          message: isEditing ? 'Garage sale updated successfully!' : 'Garage sale created successfully!' 
        });
      } else {
        const response = await fetch('/api/garage-sales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiData),
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          // Track successful garage sale creation
          trackGarageSaleCreate();
          
          setSubmitMessage({ 
            type: 'success', 
            message: 'Garage sale created successfully! It will appear on the map shortly.' 
          });
          
          // Reset form but keep the contact name populated
          const preservedContactName = session?.user ? 
            (session.user.name || 
             `${(session.user as any).firstName || ''} ${(session.user as any).lastName || ''}`.trim() ||
             session.user.email?.split('@')[0] || '') : '';
             
          setFormData({
            title: "",
            address: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
            description: "",
            categories: [],
            contactName: preservedContactName,
            contactEmail: "",
            contactPhone: ""
          });

          // Optionally redirect to the map or sales list after a delay
          setTimeout(() => {
            router.push('/map');
          }, 2000);
          
        } else {
          setSubmitMessage({ 
            type: 'error', 
            message: result.message || 'Failed to create garage sale. Please try again.' 
          });
        }
      }
      
    } catch (error) {
      console.error('Error submitting garage sale:', error);
      setSubmitMessage({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!session) {
    return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Account Required
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          To create a garage sale listing, you&apos;ll need a free account. Sign up with Google in just one click, or log into your existing account.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push('/auth/signin')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer font-medium"
          >
            Sign Up with Google
          </button>
          <button
            onClick={() => router.push('/auth/signin')}
            className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer font-medium"
          >
            Log Into Existing Account
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Free accounts get 2 garage sale listings per month
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Basic Information
        </h3>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sale Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="e.g., Multi-Family Garage Sale"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            Address *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              placeholder="123 Main Street, Courtenay, BC V9N 3P1"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={handleAddressGeocode}
              disabled={isGeocoding || !formData.address.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isGeocoding ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {isGeocoding ? 'Locating...' : 'Verify Location'}
            </button>
          </div>
          
          {/* Geocoding feedback */}
          {geocodingError && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{geocodingError}</p>
              {showManualCoordinates && (
                <div className="mt-2 pt-2 border-t border-red-200">
                  <p className="text-xs text-red-600 mb-2">
                    You can enter coordinates manually:
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowManualCoordinates(!showManualCoordinates)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    {showManualCoordinates ? 'Hide' : 'Show'} manual coordinate input
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Manual coordinate input */}
          {showManualCoordinates && (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">Manual Coordinates (optional)</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={manualCoordinates.latitude}
                    onChange={(e) => setManualCoordinates(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="49.6866"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={manualCoordinates.longitude}
                    onChange={(e) => setManualCoordinates(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="-125.0000"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to use default location (Courtenay, BC)
              </p>
            </div>
          )}
          
          {geocodedLocation && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 mb-1">
                ✓ Location verified: {geocodedLocation.formattedAddress}
              </p>
              <p className="text-xs text-green-600">
                Coordinates: {geocodedLocation.latitude.toFixed(6)}, {geocodedLocation.longitude.toFixed(6)}
              </p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="Tell people what they can expect to find at your sale..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Date and Time */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Date & Time
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              Start Time *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Clock className="h-4 w-4 inline mr-1" />
              End Time *
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Item Categories
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Select the categories that best describe what you&apos;ll be selling (select all that apply)
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {ITEM_CATEGORIES.map((category) => (
            <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.categories.includes(category.id)}
                onChange={() => handleCategoryChange(category.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <User className="h-5 w-5" />
          Contact Information
        </h3>
        
        {/* Privacy Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-medium mb-1">Privacy Notice</p>
              <p>All contact information is optional and will never be displayed publicly on YardSaleFndr. This information is only used to help interested buyers contact you directly if they have questions about your sale.</p>
            </div>
          </div>
        </div>
        
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            placeholder="Your name"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Email <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="h-4 w-4 inline mr-1" />
              Phone <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              placeholder="(250) 334-1234"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Geocoding Error Message */}
      {geocodingError && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400">
          {geocodingError}
        </div>
      )}

      {/* Submit Message */}
      {submitMessage && (
        <div className={`p-4 rounded-lg ${
          submitMessage.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400'
        }`}>
          {submitMessage.message}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          {isSubmitting ? (isEditing ? 'Updating...' : 'Adding Sale...') : submitButtonText}
        </button>
      </div>
    </form>
  );
}
