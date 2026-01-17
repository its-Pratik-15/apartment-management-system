import React from 'react';
import PublicLayout from '../components/PublicLayout';

const TermsOfService = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing and using the Apartment Management System ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-700 mb-4">
                  Our Apartment Management System provides a comprehensive platform for managing apartment complexes, including tenant management, maintenance tracking, billing, and communication tools.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
                <p className="text-gray-700 mb-4">
                  To access certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
                <p className="text-gray-700 mb-4">
                  You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Attempt to gain unauthorized access to any part of the Service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacy and Data Protection</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of Apartment Management System and its licensors.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  In no event shall Apartment Management System be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Termination</h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact Information</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Email: support@apartmentpro.com<br />
                    Phone: +91 98765 43210<br />
                    Address: 123 Business District, Mumbai, Maharashtra 400001
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TermsOfService;