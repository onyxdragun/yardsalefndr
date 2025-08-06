import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | YardSaleFndr',
  description: 'Learn how YardSaleFndr protects your privacy and handles your personal information.',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Privacy Policy
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Privacy Policy
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Last updated: August 4, 2025
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    1. Introduction
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Welcome to YardSaleFndr (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website at yardsalefndr.com (the &quot;Service&quot;).
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Data Location:</strong> All user data is securely stored and processed within Canadian data centres, ensuring compliance with Canadian privacy laws and data protection standards.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    By using our Service, you agree to the collection and use of information in accordance with this policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    2. Information We Collect
                  </h2>
                  
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    2.1 Personal Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    When you create an account or list a garage sale, we may collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>Name and email address (for account creation)</li>
                    <li>Optional contact information (phone number) for garage sale listings</li>
                    <li>Location information (address) for garage sale listings</li>
                    <li>Profile information you choose to provide</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    2.2 Usage Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We automatically collect certain information about your use of our Service:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>Device information (browser type, operating system)</li>
                    <li>IP address and general location data</li>
                    <li>Pages visited and time spent on our site</li>
                    <li>Search queries and filters used</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    2.3 Cookies and Tracking
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We use cookies and similar technologies to enhance your experience, analyze usage patterns, and maintain your session. You can control cookie settings through your browser preferences.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    3. How We Use Your Information
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We use your information to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li>Provide and maintain our Service</li>
                    <li>Create and manage your account</li>
                    <li>Display your garage sale listings to other users</li>
                    <li>Send you important updates about your account or listings</li>
                    <li>Improve our Service and user experience</li>
                    <li>Prevent fraud and ensure security</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    4. Information Sharing and Disclosure
                  </h2>
                  
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    4.1 Public Information
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    When you create a garage sale listing, the following information becomes publicly visible:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>Sale title, description, and dates</li>
                    <li>Sale location (address)</li>
                    <li>Item categories</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Important:</strong> Your contact information (name, email, phone number) is never displayed publicly. This information is only used internally and is never shared without your explicit consent.
                  </p>

                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    4.2 Third-Party Services
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We may share limited information with trusted third-party services:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>Authentication providers (Google OAuth) for secure login</li>
                    <li>Mapping services for location display</li>
                    <li>Analytics services to improve our platform</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    4.3 Legal Requirements
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may disclose your information if required by law, court order, or to protect our rights, property, or safety of our users.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    5. Data Security and Storage
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We implement appropriate security measures to protect your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>Encrypted data transmission (HTTPS)</li>
                    <li>Secure database storage in Canadian data centres</li>
                    <li>Regular security assessments</li>
                    <li>Access controls and authentication</li>
                    <li>Data backup and recovery procedures</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    <strong>Data Location:</strong> Our servers and databases are hosted in Canada, and all user data is stored within Canadian data centres. This ensures compliance with Canadian privacy laws and data protection standards.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    6. Your Rights and Choices
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li><strong>Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Update:</strong> Correct or update your information through your account settings</li>
                    <li><strong>Delete:</strong> Request deletion of your account and associated data</li>
                    <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                    <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300 mt-4">
                    To exercise these rights, please contact us using the information provided below.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    7. Data Retention
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We retain your personal information only as long as necessary to provide our services and comply with legal obligations. Garage sale listings are automatically archived after their end date, and inactive accounts may be deleted after extended periods of inactivity.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    8. Children&apos;s Privacy
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    9. International Users and Data Location
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    YardSaleFndr is operated from Canada, and all user data is stored and processed within Canadian data centres. If you are located outside Canada, please be aware that:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>Your information will be transferred to and stored in Canada</li>
                    <li>Your data is subject to Canadian privacy laws and regulations</li>
                    <li>We maintain the same level of protection for all users regardless of location</li>
                    <li>Data is not transferred to or stored in third-party countries</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300">
                    By using our Service, you consent to this transfer and storage of your data within Canada&apos;s secure data infrastructure.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    10. Changes to This Privacy Policy
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    11. Contact Us
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Email:</strong> privacy@yardsalefndr.com
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      <strong>Website:</strong> <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">yardsalefndr.com</Link>
                    </p>
                  </div>
                </section>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <Link 
                    href="/terms" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Terms of Service
                  </Link>
                  <Link 
                    href="/" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Back to YardSaleFndr
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
