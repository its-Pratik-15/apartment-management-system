import React from 'react';
import PublicLayout from '../components/PublicLayout';

const PrivacyPolicy = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700 mb-4">
                  We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
                </p>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Name, email address, and phone number</li>
                  <li>Apartment and lease information</li>
                  <li>Payment and billing information</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Communicate with you about products, services, and events</li>
                  <li>Monitor and analyze trends and usage</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>With service providers who assist us in operating our platform</li>
                  <li>When required by law or to protect our rights</li>
                  <li>In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
                <p className="text-gray-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to processing of your personal information</li>
                  <li>Request data portability</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar tracking technologies to collect and use personal information about you. For more information about our use of cookies, please see our Cookie Policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Links</h2>
                <p className="text-gray-700 mb-4">
                  Our service may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Email: privacy@apartmentpro.com<br />
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

export default PrivacyPolicy;