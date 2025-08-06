import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SignUpBanner } from "@/components/SignUpBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "YardSaleFndr - Find Garage Sales & Yard Sales Near You",
    template: "%s | YardSaleFndr"
  },
  description: "Discover garage sales, yard sales, and estate sales in your area. Find hidden treasures, list your own sales, and connect with your community on YardSaleFndr.com",
  keywords: [
    "garage sales",
    "yard sales", 
    "estate sales",
    "garage sale finder",
    "yard sale map",
    "local sales",
    "secondhand",
    "thrift",
    "bargains",
    "garage sale app",
    "estate sale finder",
    "community sales",
    "moving sales",
    "multi-family sales"
  ],
  authors: [{ name: "YardSaleFndr Team" }],
  creator: "YardSaleFndr",
  publisher: "YardSaleFndr",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yardsalefndr.com",
    siteName: "YardSaleFndr",
    title: "YardSaleFndr - Find Garage Sales & Yard Sales Near You",
    description: "Discover garage sales, yard sales, and estate sales in your area. Find hidden treasures and connect with your community worldwide.",
    images: [
      {
        url: "/og-image.jpg", // We'll need to create this
        width: 1200,
        height: 630,
        alt: "YardSaleFndr - Garage Sale Finder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YardSaleFndr - Find Garage Sales & Yard Sales Near You",
    description: "Discover garage sales, yard sales, and estate sales in your area. Find hidden treasures and connect with your community worldwide.",
    creator: "@yardsalefndr", // Update when you create social accounts
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://yardsalefndr.com",
  },
  category: "shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="canonical" href="https://yardsalefndr.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <SignUpBanner />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
