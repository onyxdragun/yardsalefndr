"use client";

import Script from 'next/script';
import { GA_TRACKING_ID, useGoogleAnalytics } from '@/lib/gtag';

export default function GoogleAnalytics() {
  // Use the custom hook to track page views
  useGoogleAnalytics();

  // Only render if we have a tracking ID and we're not in development
  if (!GA_TRACKING_ID || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
