import React from 'react';
import PublicLayout from '../components/PublicLayout';

const About = () => {
  return (
    <PublicLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="relative bg-blue-900 py-24 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/90"></div>
          </div>
          <div className="relative max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About Us
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
              Revolutionizing apartment management with intelligent, user-centric solutions.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                The Problem
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                Traditional apartment management relies on manual processes, paper-based records, and disconnected systems. This leads to inefficiencies, communication gaps, and a poor experience for both residents and management.
              </p>
              
              <h2 className="mt-10 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Solution
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                We provide a unified digital platform that significantly enhances living experiences.
              </p>
              <ul className="mt-4 space-y-4">
                {[
                  "Automates billing and financial tracking",
                  "Streamlines visitor management and security",
                  "Enables efficient issue tracking and resolution",
                  "Provides role-based dashboards for all stakeholders"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="ml-3 text-base text-gray-500">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 lg:mt-0">
              <div className="bg-gray-50 rounded-2xl shadow-xl overflow-hidden">
                <img 
                  className="w-full h-full object-cover"
                  src="/assets/screenshots/secretary-dashboard.png" 
                  alt="Dashboard Preview" 
                  onError={(e) => {
                     e.target.onerror = null; 
                     e.target.src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                   }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default About;
