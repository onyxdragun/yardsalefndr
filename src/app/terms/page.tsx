import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | YardSaleFndr',
  description: 'Terms and conditions for using YardSaleFndr, the global platform for discovering garage sales and yard sales.',
  robots: 'index, follow',
};

export default function TermsOfServicePage() {
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
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Terms of Service
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
                  Terms of Service
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Last updated: August 4, 2025
                </p>
              </div>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Welcome to YardSaleFndr (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your use of our website at yardsalefndr.com and our services (collectively, the &quot;Service&quot;).
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, then you may not access the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    2. Description of Service
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    YardSaleFndr is a platform that helps users discover and list garage sales, yard sales, and similar events worldwide. Our Service includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li>Browsing and searching for garage sales</li>
                    <li>Creating and managing garage sale listings</li>
                    <li>Interactive maps and location-based discovery</li>
                    <li>User accounts and personalization features</li>
                    <li>Favoriting and tracking sales</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    3. User Accounts
                  </h2>
                  
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    3.1 Account Creation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    To use certain features of our Service, you must create an account. You agree to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>Provide accurate and complete information</li>
                    <li>Keep your account information updated</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    3.2 Account Termination
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We reserve the right to suspend or terminate your account at any time for violation of these Terms or any other reason we deem appropriate.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    4. Content and Listings
                  </h2>
                  
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    4.1 User-Generated Content
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You are solely responsible for all content you post, including garage sale listings, descriptions, and any other information. You agree that your content will:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>Be accurate and truthful</li>
                    <li>Not violate any laws or regulations</li>
                    <li>Not infringe on others&apos; rights</li>
                    <li>Not contain harmful, offensive, or inappropriate material</li>
                    <li>Not include spam or misleading information</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    4.2 Content License
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    By posting content on our Service, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, display, and distribute your content for the purpose of operating and improving our Service.
                  </p>

                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    4.3 Content Moderation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We reserve the right to remove any content that violates these Terms or is otherwise inappropriate, without prior notice.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    5. Acceptable Use
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    You agree not to use our Service to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Post false, misleading, or fraudulent information</li>
                    <li>Spam or send unsolicited communications</li>
                    <li>Interfere with or disrupt our Service</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use automated tools to scrape or collect data</li>
                    <li>Sell illegal or prohibited items</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    6. Privacy and Data Protection
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your privacy is important to us. Our collection and use of your personal information is governed by our <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    7. Intellectual Property
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Our Service and its original content, features, and functionality are owned by YardSaleFndr and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    You may not reproduce, distribute, modify, or create derivative works of our Service without our express written permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    8. Third-Party Services
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Our Service may contain links to third-party websites or services. We are not responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    <li>The content or privacy practices of third-party sites</li>
                    <li>Any transactions between you and third parties</li>
                    <li>The availability or functionality of external services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    9. Disclaimers and Limitation of Liability
                  </h2>
                  
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    9.1 Service Availability
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    We provide our Service on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee uninterrupted or error-free operation of our Service.
                  </p>

                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    9.2 User Interactions
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    YardSaleFndr is a platform that connects users. We are not party to any transactions or interactions between users. You agree that:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                    <li>All transactions are solely between you and other users</li>
                    <li>We are not responsible for the quality, safety, or legality of items sold</li>
                    <li>We do not guarantee the accuracy of user-posted information</li>
                    <li>You should exercise caution when meeting strangers or visiting sales</li>
                  </ul>

                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                    9.3 Limitation of Liability
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    To the maximum extent permitted by law, YardSaleFndr shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    10. Indemnification
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    You agree to defend, indemnify, and hold harmless YardSaleFndr and its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our Service or violation of these Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    11. Governing Law
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    These Terms shall be governed by and construed in accordance with the laws of Canada, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Canada.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    12. Changes to Terms
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the updated Terms on our website. Your continued use of our Service after such changes constitutes acceptance of the new Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    13. Severability
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                    14. Contact Information
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    If you have questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Email:</strong> legal@yardsalefndr.com
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
                    href="/privacy" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Privacy Policy
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
