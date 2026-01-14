import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';

const LandingPage = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-900/90"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 animate-pulse"></span>
                <span className="text-blue-300 text-sm font-medium tracking-wide">The #1 Apartment Management System</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
                Smart Living <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  Elevated.
                </span>
              </h1>
              
              <p className="text-xl text-blue-100/80 max-w-xl leading-relaxed">
                Experience the future of property management with our comprehensive, AI-enhanced platform designed for modern communities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/login"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl overflow-hidden transition-all duration-300 hover:bg-blue-700 hover:scale-105 shadow-xl hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Now
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white/90 border border-white/20 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/40"
                >
                  Explore Features
                </a>
              </div>
            </div>

            {/* Hero Image / Dashboard Preview */}
            <div className="relative group perspective-1000">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative transform rotate-y-12 rotate-x-6 group-hover:rotate-0 transition-all duration-700 ease-out shadow-2xl rounded-2xl overflow-hidden bg-gray-900 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 mix-blend-overlay z-10"></div>
                {/* Use a real screenshot if available, otherwise fallback to the mock UI */}
                <img 
                   src="/assets/screenshots/secretary-dashboard.png" 
                   onError={(e) => {
                     e.target.onerror = null; 
                     e.target.src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80"
                   }}
                   alt="Apartment Management System Dashboard" 
                   className="w-full h-auto object-cover opacity-90"
                />
                
                {/* Floating Stats Cards to simulate 3D effect */}
                <div className="absolute top-6 right-6 bg-gray-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl transform translate-z-10 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Revenue</div>
                      <div className="text-lg font-bold text-white">₹ 12.5L</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-gray-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl transform translate-z-10 animate-float delay-1000">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Active Tenants</div>
                      <div className="text-lg font-bold text-white">1,240+</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 -mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-2xl shadow-xl p-8 divide-x divide-gray-100">
          {[
            { label: 'Properties Managed', value: '500+', color: 'text-blue-600' },
            { label: 'Happy Residents', value: '10K+', color: 'text-green-600' },
            { label: 'Uptime Guarantee', value: '99.9%', color: 'text-purple-600' },
            { label: 'Support Available', value: '24/7', color: 'text-orange-600' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4">
              <div className={`text-4xl font-extrabold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-base font-bold text-blue-600 tracking-wide uppercase">Features</h2>
            <h2 className="mt-2 text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              One Platform, <span className="text-blue-600">Endless Possibilities</span>
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline operations, improve tenant satisfaction, and maximize your property's potential with our comprehensive suite of tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                title: "Smart Bill Management",
                desc: "Automate billing, track payments, and send reminders. Full support for Indian currency and tax formats.",
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: "bg-blue-600",
                features: ["Automated Invoicing", "Late Fee Tracking", "Financial Reports"],
                image: "/assets/screenshots/bill-management.png"
              },
              {
                title: "Visitor Tracking",
                desc: "Secure your premises with digital check-ins, OTP verifications, and real-time host notifications.",
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                color: "bg-purple-600",
                features: ["Digital Entry Pass", "Pre-approve Guests", "Live Visitor Count"],
                image: "/assets/screenshots/visitor-management.png"
              },
              {
                title: "Issue Resolution",
                desc: "Efficient ticketing system for maintenance requests with priority levels and staff assignment.",
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: "bg-red-500",
                features: ["Photo Uploads", "Priority Management", "Staff Assignment"],
                image: "/assets/screenshots/issue-tracking.png"
              },
              {
                title: "Lease Management",
                desc: "Digitize your lease agreements, track expiries, and manage renewals seamlessly.",
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                color: "bg-green-600",
                features: ["Expiration Tracking", "Auto-Reminders", "History Log"],
                image: "/assets/screenshots/lease-management.png"
              },
              {
                title: "Communication Hub",
                desc: "Keep everyone in the loop with digital notice boards, polls, and emergency alerts.",
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                ),
                color: "bg-yellow-500",
                features: ["Role-Based Notices", "Pinned Messages", "Real-time Updates"],
                image: "/assets/screenshots/notice-management.png"
              },
              {
                title: "User Roles & Access",
                desc: "Granular permission controls for Owners, Tenants, Staff, and Admins.",
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                ),
                color: "bg-indigo-600",
                features: ["RBAC System", "Audit Logs", "Secure Login"],
                image: "/assets/screenshots/user-management.png"
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opactiy-0 group-hover:opacity-100 transition-opacity"></div>
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src=`https://source.unsplash.com/random/800x600?${feature.title.split(' ')[0]}`
                      }}
                    />
                    <div className={`absolute bottom-4 left-4 w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center shadow-lg z-20`}>
                      {feature.icon}
                    </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 mb-6 flex-1 leading-relaxed">
                    {feature.desc}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-500 font-medium">
                        <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Tailored Solutions for Every Role
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform adapts to your needs, whether you own the property, manage it, or live there.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Owners */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-10 border border-blue-100/50 hover:border-blue-200 transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Property Owners</h3>
              <p className="text-blue-600 font-medium mb-6">Maximize ROI & Transparency</p>
              
              <ul className="space-y-4">
                {[
                  "View Tenant Details & History",
                  "Track Property Information",
                  "Monitor Bill Payments",
                  "Occupancy Status Tracking"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                       <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tenants */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-10 border border-green-100/50 hover:border-green-200 transition-all hover:shadow-xl transform lg:-translate-y-4 shadow-2xl relative z-10">
              <div className="absolute top-0 right-0 p-4">
                 <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
              </div>
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Tenants</h3>
              <p className="text-green-600 font-medium mb-6">Convenience & Community</p>
              
               <ul className="space-y-4">
                {[
                  "Pay Bills Online (Utilities/Rent)",
                  "Manage Visitor Access",
                  "Report Maintenance Issues",
                  "Track Lease Status"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                     <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                       <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Staff */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl p-10 border border-purple-100/50 hover:border-purple-200 transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Staff & Guards</h3>
              <p className="text-purple-600 font-medium mb-6">Efficiency & Security</p>
              
               <ul className="space-y-4">
                {[
                  "Issue Management & Maintenance",
                  "Visitor Entry/Exit Tracking",
                  "Security Monitoring",
                  "Mobile-Optimized Interface"
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                     <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5">
                       <svg className="w-3.5 h-3.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative py-24 bg-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 opacity-90"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of property managers who have revolutionized their operations. 
            Start your free trial today and experience the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-blue-900 bg-white rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Try Now
              <svg className="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
          
        </div>
      </section>
    </PublicLayout>
  );
};

export default LandingPage;