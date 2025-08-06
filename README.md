# 🏠 Global Garage Sale Finder

A modern, feature-rich web application for discovering and managing garage sales worldwide. Built with Next.js 15, TypeScript, and Tailwind CSS for a seamless user experience across all devices.

## ✨ Features

### 🔍 **Discovery & Search**
- **Advanced Search** - Find garage sales by location, keywords, date range, and categories
- **Interactive Maps** - Visual discovery with Google Maps integration
- **Smart Filtering** - Category-based filtering with 15+ item categories
- **Location-based Results** - Radius-based search with GPS integration

### 👤 **User Management**
- **Secure Authentication** - Google OAuth + email/password login via NextAuth
- **User Profiles** - Personalized accounts with subscription tiers
- **Favorites System** - Save and organize interesting sales
- **Dashboard** - Manage your listings and account settings

### 📋 **Listing Management**
- **Rich Listing Creation** - Detailed garage sale forms with image support
- **Category Management** - Organize items across multiple categories
- **Time Management** - Schedule sales with start/end dates and times
- **Edit & Update** - Full CRUD operations for sale listings

### 🌐 **Global Features**
- **Multi-region Support** - Designed for worldwide garage sale discovery
- **Responsive Design** - Perfect experience on mobile, tablet, and desktop
- **SEO Optimized** - Rich metadata, structured data, and sitemap
- **Privacy Compliant** - GDPR-ready with comprehensive privacy policy

### 📧 **Communication**
- **Contact Form** - Integrated Mailgun email delivery system
- **Privacy-focused** - Contact information never publicly displayed
- **Professional Templates** - Branded email communications

### 📊 **Analytics & Tracking**
- **Google Analytics 4** - Comprehensive user behavior tracking
- **Event Tracking** - Custom events for key user interactions
- **Performance Monitoring** - Built-in health checks and monitoring

## 🛠 Tech Stack

### **Core Framework**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Utility-first styling with responsive design

### **Authentication & Database**
- **NextAuth.js** - Secure authentication with multiple providers
- **SQLite** - Lightweight, production-ready database
- **bcryptjs** - Secure password hashing

### **External Services**
- **Google Maps API** - Location services and interactive maps
- **Mailgun** - Reliable email delivery service
- **Google Analytics 4** - Advanced user analytics

### **Development & Production**
- **ESLint** - Code linting with custom configuration
- **PostCSS** - CSS processing and optimization
- **Production Ready** - Optimized builds with static generation

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── auth/              # Authentication pages
│   ├── garage-sales/      # Sale listing pages
│   └── [pages]/           # Static and dynamic pages
├── components/            # Reusable React components
├── lib/                   # Utilities and configurations
│   ├── auth-config.ts     # NextAuth configuration
│   ├── database.ts        # Database operations
│   └── gtag.ts           # Analytics integration
└── types/                 # TypeScript type definitions
```

## 🚀 Production Ready

This application is **production-ready** with:

- ✅ **Full TypeScript Coverage** - Type-safe codebase
- ✅ **Optimized Builds** - Fast loading and excellent performance
- ✅ **SEO Excellence** - Rich metadata and structured data
- ✅ **Privacy Compliance** - GDPR-ready privacy policy and terms
- ✅ **Security** - Secure authentication and data handling
- ✅ **Scalability** - Designed for growth and expansion

## 📚 Additional Documentation

- [`MAILGUN_SETUP.md`](./MAILGUN_SETUP.md) - Email service configuration guide
- [`GA4_SETUP.md`](./GA4_SETUP.md) - Google Analytics 4 setup instructions

## 🌟 Key Highlights

- **Global Focus** - Designed for worldwide garage sale discovery
- **Modern Architecture** - Built with the latest Next.js 15 and React 18
- **Performance Optimized** - Fast loading with static generation where possible
- **Mobile First** - Responsive design that works beautifully on all devices
- **Privacy Focused** - Canadian data centers and GDPR compliance
- **Developer Friendly** - Clean code, comprehensive documentation

---

*Ready to help people discover amazing garage sales around the world! 🌍✨*
