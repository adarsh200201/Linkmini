import React from "react";

const TermsOfService = ({ onBack }) => {
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
              <span className="text-xs font-medium text-white/90">📜 Legal Documentation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              These terms govern your use of our URL shortening service. Please read them carefully.
            </p>
            <p className="text-sm text-white/60 mt-4">
              Last updated: January 23, 2025
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8 md:p-12">
            <div className="prose prose-lg prose-invert max-w-none">
              
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-white/80 mb-6">
                By accessing and using Linkmini's URL shortening service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">2. Service Description</h2>
              <p className="text-white/80 mb-6">
                Linkmini provides URL shortening services that allow users to create shortened versions of long URLs. Our service also includes QR code generation, link analytics, and custom alias features.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
              <p className="text-white/80 mb-4">To use certain features of our service, you may be required to create an account. You agree to:</p>
              <ul className="text-white/80 mb-6 space-y-2">
                <li>• Provide accurate and complete information</li>
                <li>• Maintain the security of your account</li>
                <li>• Be responsible for all activities under your account</li>
                <li>• Notify us immediately of any unauthorized use</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use</h2>
              <p className="text-white/80 mb-4">You agree not to use our service to:</p>
              <ul className="text-white/80 mb-6 space-y-2">
                <li>• Shorten URLs that lead to illegal, harmful, or offensive content</li>
                <li>• Distribute malware, viruses, or other malicious code</li>
                <li>• Engage in phishing, spam, or other fraudulent activities</li>
                <li>• Violate any applicable laws or regulations</li>
                <li>• Infringe upon intellectual property rights</li>
                <li>• Harass, abuse, or harm others</li>
                <li>• Bypass or attempt to bypass our security measures</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">5. Content Guidelines</h2>
              <p className="text-white/80 mb-4">Shortened URLs must not link to content that:</p>
              <ul className="text-white/80 mb-6 space-y-2">
                <li>• Contains hate speech or discriminatory content</li>
                <li>• Promotes violence or illegal activities</li>
                <li>• Contains adult content without proper age verification</li>
                <li>• Violates privacy or data protection laws</li>
                <li>• Infringes on copyrights or trademarks</li>
              </ul>

              <h2 className="text-2xl font-bold text-white mb-4">6. Service Availability</h2>
              <p className="text-white/80 mb-6">
                We strive to maintain high availability of our service, but we do not guarantee uninterrupted access. We reserve the right to modify, suspend, or discontinue any part of our service at any time.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">7. Link Expiration and Deletion</h2>
              <p className="text-white/80 mb-6">
                We reserve the right to delete or deactivate shortened URLs that violate these terms, are inactive for extended periods, or for any other reason at our discretion. We will make reasonable efforts to notify users before deletion when possible.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">8. Privacy and Data Collection</h2>
              <p className="text-white/80 mb-6">
                Our collection and use of personal information is governed by our Privacy Policy. By using our service, you consent to the collection and use of information as outlined in our Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">9. Intellectual Property</h2>
              <p className="text-white/80 mb-6">
                The Linkmini service, including its software, design, and content, is protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or reverse engineer our service without permission.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
              <p className="text-white/80 mb-6">
                G-INITIATIONS ESERVICES PRIVATE LIMITED shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our service. Our total liability shall not exceed the amount paid by you for our services.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
              <p className="text-white/80 mb-6">
                You agree to indemnify and hold harmless G-INITIATIONS ESERVICES PRIVATE LIMITED from any claims, damages, or expenses arising from your use of our service or violation of these terms.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">12. Termination</h2>
              <p className="text-white/80 mb-6">
                We may terminate or suspend your account and access to our service immediately, without prior notice, for conduct that we believe violates these terms or is harmful to our service or other users.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
              <p className="text-white/80 mb-6">
                These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of [Jurisdiction].
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">14. Changes to Terms</h2>
              <p className="text-white/80 mb-6">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the updated terms on our website. Your continued use of our service after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">15. Severability</h2>
              <p className="text-white/80 mb-6">
                If any provision of these terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
              </p>

              <h2 className="text-2xl font-bold text-white mb-4">16. Contact Information</h2>
              <p className="text-white/80 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-white/5 rounded-xl p-4 text-white/80">
                <p><strong>G-INITIATIONS ESERVICES PRIVATE LIMITED</strong></p>
                <p>Email: legal@ginit.in</p>
                <p>Address: [Company Address]</p>
                <p>Phone: [Company Phone]</p>
              </div>

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
                <p className="text-blue-200 text-sm">
                  <strong>Note:</strong> By using our service, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
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

export default TermsOfService;
