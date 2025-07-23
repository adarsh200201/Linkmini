import React, { useState } from "react";

const Contact = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 2000);
  };

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
              <span className="text-xs font-medium text-white/90">💬 Get In Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Contact & Support
              </span>
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Need help or have questions? We're here to assist you with any inquiries about our URL shortening service.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Contact Form */}
            <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
              
              {submitted && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl text-green-200">
                  ✅ Thank you! Your message has been sent successfully. We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-white/50 transition-all text-white placeholder-white/60"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-white/50 transition-all text-white placeholder-white/60"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-white/50 transition-all text-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-white/50 transition-all text-white placeholder-white/60 resize-none"
                    placeholder="Please describe your inquiry or issue..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full premium-btn py-3 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8">
                <h3 className="text-xl font-bold text-white mb-4">Company Information</h3>
                <div className="space-y-3 text-white/80">
                  <div>
                    <p className="font-semibold text-white">G-INITIATIONS ESERVICES PRIVATE LIMITED</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-400">📧</span>
                    <span>support@ginit.in</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-400">🌐</span>
                    <span>https://ginit.in</span>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-8">
                <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-white mb-1">How do I create a short link?</h4>
                    <p className="text-sm text-white/70">Simply paste your long URL in our shortener tool and click "Shorten". You can also add a custom alias.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Are shortened links permanent?</h4>
                    <p className="text-sm text-white/70">Yes, your shortened links will remain active as long as they comply with our terms of service.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Can I track link analytics?</h4>
                    <p className="text-sm text-white/70">Analytics features are available for registered users. Sign up to access detailed link statistics.</p>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-400/30 rounded-xl p-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-semibold text-white mb-1">Quick Response</h4>
                  <p className="text-sm text-white/70">We typically respond to inquiries within 24 hours during business days.</p>
                </div>
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

export default Contact;
