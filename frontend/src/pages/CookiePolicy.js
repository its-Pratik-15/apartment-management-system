import React from 'react';
import PublicLayout from '../components/PublicLayout';

const CookiePolicy = () => {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies for several purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>To enable certain functions of our service</li>
                  <li>To provide analytics and track usage</li>
                  <li>To store your preferences and settings</li>
                  <li>To improve your user experience</li>
                  <li>To remember your login information</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies collect information about how visitors use our website, such as which pages are visited most often and if they get error messages from web pages.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Functionality Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies allow the website to remember choices you make and provide enhanced, more personal features.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Targeting Cookies</h3>
                  <p className="text-gray-700 mb-4">
                    These cookies are used to deliver advertisements more relevant to you and your interests.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
                <p className="text-gray-700 mb-4">
                  We may also use third-party cookies from trusted partners for analytics and advertising purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Google Analytics - for website analytics</li>
                  <li>Social media platforms - for social sharing features</li>
                  <li>Payment processors - for secure transactions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Managing Cookies</h2>
                <p className="text-gray-700 mb-4">
                  You can control and manage cookies in various ways:
                </p>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Browser Settings</h3>
                  <p className="text-gray-700 mb-4">
                    Most web browsers allow you to control cookies through their settings preferences. You can set your browser to:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Delete all cookies</li>
                    <li>Block all cookies</li>
                    <li>Allow all cookies</li>
                    <li>Block third-party cookies</li>
                    <li>Clear all cookies when you close the browser</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Opt-Out Links</h3>
                  <p className="text-gray-700 mb-4">
                    You can opt out of certain third-party cookies:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                    <li>Google Analytics: <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:text-blue-800">Google Analytics Opt-out</a></li>
                    <li>Network Advertising Initiative: <a href="http://www.networkadvertising.org/choices/" className="text-blue-600 hover:text-blue-800">NAI Opt-out</a></li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Impact of Disabling Cookies</h2>
                <p className="text-gray-700 mb-4">
                  Please note that disabling cookies may affect the functionality of our website. Some features may not work properly or may not be available if cookies are disabled.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Updates to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about our use of cookies, please contact us:
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

export default CookiePolicy;