import { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | YardSaleFndr',
  description: 'Get in touch with YardSaleFndr. We\'re here to help with questions, feedback, or support.',
  robots: 'index, follow',
};

export default function ContactPage() {
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
              <Mail className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Contact Us
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Get in Touch
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Have a question, suggestion, or need help? We&apos;d love to hear from you. 
              Send us a message and we&apos;ll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Contact Form */}
            <div className="w-full">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Send us a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Other Ways to Connect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Report an Issue
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Found a bug or technical problem? Help us improve YardSaleFndr by reporting it.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use the contact form above with &quot;Bug Report&quot; as the subject.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Feature Requests
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Have an idea to make YardSaleFndr better? We&apos;d love to hear your suggestions.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use &quot;Feature Request&quot; as your subject when contacting us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
