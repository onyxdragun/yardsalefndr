import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing Plans - YardSaleFndr',
  description: 'Choose the perfect plan for your garage sale needs. Start free and upgrade as you grow.',
  robots: 'noindex, nofollow', // Keep it private for now
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
