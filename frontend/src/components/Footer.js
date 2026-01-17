import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Apartment Management System</h3>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Streamline your apartment complex operations with our comprehensive management solution. 
                From tenant management to maintenance tracking, we've got you covered.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/its-Pratik-15" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="mailto:contact@apartmentms.com" 
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Email"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/notices" className="text-gray-300 hover:text-white transition-colors">
                    Notices
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/bills" className="text-gray-300 hover:text-white transition-colors">
                    Bills
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/visitors" className="text-gray-300 hover:text-white transition-colors">
                    Visitors
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/profile" className="text-gray-300 hover:text-white transition-colors">
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">
                Contact
              </h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    type="button"
                    className="text-gray-300 hover:text-white transition-colors text-left"
                    onClick={() => console.log('Help Center clicked')}
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    className="text-gray-300 hover:text-white transition-colors text-left"
                    onClick={() => console.log('Documentation clicked')}
                  >
                    Documentation
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    className="text-gray-300 hover:text-white transition-colors text-left"
                    onClick={() => console.log('Contact Support clicked')}
                  >
                    Contact Support
                  </button>
                </li>
                <li>
                  <button 
                    type="button"
                    className="text-gray-300 hover:text-white transition-colors text-left"
                    onClick={() => console.log('System Status clicked')}
                  >
                    System Status
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-gray-400">
                © {currentYear} Apartment Management System. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-gray-400">
                <Link 
                  to="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms-of-service"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link 
                  to="/cookie-policy"
                  className="hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Built by{' '}
              <a 
                href="https://github.com/its-Pratik-15" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Pratik Kumar Pan
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;