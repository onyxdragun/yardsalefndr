"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Google Analytics tracking ID - replace with your actual GA4 Measurement ID
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom hook to track page views
export function useGoogleAnalytics() {
  const pathname = usePathname();
  
  useEffect(() => {
    if (GA_TRACKING_ID && typeof window !== 'undefined') {
      // Get search params safely on client side
      const searchParams = window.location.search;
      const url = pathname + searchParams;
      pageview(url);
    }
  }, [pathname]);
}

// Pre-defined event tracking functions for common actions
export const trackGarageSaleView = (saleId: string) => {
  event({
    action: 'view_garage_sale',
    category: 'engagement',
    label: saleId,
  });
};

export const trackSearch = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
  });
};

export const trackGarageSaleCreate = () => {
  event({
    action: 'create_garage_sale',
    category: 'conversion',
  });
};

export const trackFavorite = (saleId: string) => {
  event({
    action: 'add_to_favorites',
    category: 'engagement',
    label: saleId,
  });
};

export const trackContactForm = () => {
  event({
    action: 'contact_form_submit',
    category: 'conversion',
  });
};

export const trackSignUp = (method: string) => {
  event({
    action: 'sign_up',
    category: 'conversion',
    label: method,
  });
};

export const trackSignIn = (method: string) => {
  event({
    action: 'sign_in',
    category: 'conversion',
    label: method,
  });
};
