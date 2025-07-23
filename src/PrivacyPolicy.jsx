import React from "react";

const PrivacyPolicy = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-60"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-xl">L</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Linkmini
                </h1>
                <p className="text-xs text-gray-500 font-medium">Next-Gen Platform</p>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Page Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-full mb-6">
              <span className="text-xs font-medium text-white/90">📋 Legal Documentation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-white/60 mt-4">
              Last updated: January 23, 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 md:p-12">
            <div className="prose prose-lg prose-invert max-w-none">
              
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="text-white/80 mb-6">
                We collect information you provide directly to us, such as when you create an account, use our URL shortening service, or contact us for support.
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-3">Information you provide to us:</h3>
              <ul className="text-white/80 mb-6 space-y-2">
                <li>• Account information (name, email address)</li>
                <li>• URLs you choose to shorten</li>
                <li>• Custom aliases you create</li>
                <li>• Communications with our support team</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">Information we collect automatically:</h3>
              <ul className="text-white/80 mb-6 space-y-2">
                <li>• Usage data and analytics</li>
                <li>• Device information and browser type</li>
                <li>• IP addresses and location data</li>
                <li>• Click data for shortened URLs</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-white/80 mb-4">We use the information we collect to:</p>
              <ul className="text-white/80 mb-6 space-y-2">
                <li>• Provide, maintain, and improve our services</li>
                <li>• Process transactions and send related information</li>
                <li>• Send technical notices and support messages</li>
                <li>• Respond to your comments and questions</li>
                <li>• Monitor and analyze trends and usage</li>
                <li>• Detect, prevent, and address technical issues</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p className="text-white/80 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy:
              </p>
              <ul className="text-white/80 mb-6 space-y-2">
                <li>• With your consent</li>
                <li>• To comply with legal obligations</li>
                <li>• To protect our rights and safety</li>
                <li>• With service providers who assist our operations</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
              <p className="text-white/80 mb-6">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">5. Data Retention</h2>
              <p className="text-white/80 mb-6">
                We retain your personal information for as long as your account is active or as needed to provide you services. We will also retain and use your information as necessary to comply with legal obligations and resolve disputes.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
              <p className="text-white/80 mb-4">You have the right to:</p>
              <ul className="text-white/80 mb-6 space-y-2">
                <li>• Access your personal information</li>
                <li>• Correct inaccurate information</li>
                <li>• Delete your account and data</li>
                <li>• Export your data</li>
                <li>• Opt out of certain communications</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
              <p className="text-white/80 mb-6">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can control the use of cookies at the browser level.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Links</h2>
              <p className="text-white/80 mb-6">
                Our service may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to read their privacy policies.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
              <p className="text-white/80 mb-6">
                Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
              <p className="text-white/80 mb-6">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
              <p className="text-white/80 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-white/5 rounded-xl p-4 text-white/80">
                <p><strong>G-INITIATIONS ESERVICES PRIVATE LIMITED</strong></p>
                <p>Email: privacy@ginit.in</p>
                <p>Address: [Company Address]</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/50 backdrop-blur-2xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-sm text-white/60">
              © 2025 G-INITIATIONS ESERVICES PRIVATE LIMITED. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
