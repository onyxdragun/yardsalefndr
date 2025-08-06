export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "YardSaleFndr",
  "description": "Find garage sales, yard sales, and estate sales worldwide",
  "url": "https://yardsalefndr.com",
  "logo": "https://yardsalefndr.com/logo.png", // Update when you have a logo
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://facebook.com/yardsalefndr", // Update when created
    "https://twitter.com/yardsalefndr"   // Update when created
  ]
}

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "YardSaleFndr",
  "url": "https://yardsalefndr.com",
  "description": "Find garage sales, yard sales, and estate sales worldwide",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://yardsalefndr.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}

export const webApplicationStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "YardSaleFndr",
  "description": "Online platform for finding and listing garage sales worldwide",
  "url": "https://yardsalefndr.com",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Interactive garage sale map",
    "Location-based search",
    "Sale listings and management", 
    "Smart navigation integration",
    "Category-based filtering"
  ]
}
