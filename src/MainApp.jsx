import React, { useState, useEffect, useRef, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "qrcode";

const MainApp = ({ user, onLogout, onShowLogin, onShowRegister, onShowPrivacy, onShowTerms, onShowContact }) => {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [recentLinks, setRecentLinks] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [activeTab, setActiveTab] = useState("shortener");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [qrOptions, setQrOptions] = useState({
    errorCorrectionLevel: "M",
    type: "image/png",
    quality: 0.92,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    width: 256,
  });
  const [qrLogo, setQrLogo] = useState(null);
  const [exportFormat, setExportFormat] = useState("PNG");
  const [exportSize, setExportSize] = useState("256px");
  const [socialTab, setSocialTab] = useState("URL");
  const [socialData, setSocialData] = useState({
    URL: "",
    Facebook: "",
    Pinterest: "",
    LinkedIn: "",
    WhatsApp: "",
    Email: "",
    Telephone: "",
    SMS: "",
  });

  const observerRef = useRef();
  const statsRef = useRef();
  const pricingRef = useRef();
  const featuresRef = useRef();

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const elements = [
      statsRef.current,
      pricingRef.current,
      featuresRef.current,
    ];
    elements.forEach((el) => {
      if (el) observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Counter animation for statistics
  const useCountUp = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
      if (isVisible.stats && !hasStarted) {
        setHasStarted(true);
        let startTimestamp = null;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      }
    }, [hasStarted, end, duration]);

    return count;
  };

  

  // Load recent links from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentLinks");
    if (saved) {
      setRecentLinks(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  const saveToRecent = (originalUrl, shortUrl) => {
    const newLink = {
      id: Date.now(),
      originalUrl,
      shortUrl,
      timestamp: new Date().toISOString(),
    };

    const updated = [
      newLink,
      ...recentLinks.filter((link) => link.originalUrl !== originalUrl),
    ].slice(0, 10);
    setRecentLinks(updated);
    localStorage.setItem("recentLinks", JSON.stringify(updated));
  };

  // Validate URL
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url.trim())) {
      setError("Please enter a valid URL (including http:// or https://)");
      return;
    }

    setLoading(true);

    const payload = {
      long_url: url.trim(),
    };

    if (customAlias.trim()) {
      payload.custom_code = customAlias.trim();
    }

    try {
      const response = await fetch("https://short.ginit.in/api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.error) {
        throw new Error(data.error);
      }

      if (data && data.short_url) {
        setResult({
          originalUrl: url.trim(),
          shortUrl: data.short_url,
          shortCode: data.short_code || "",
          qrCodeUrl: data.qr_code_url || "",
        });
        saveToRecent(url.trim(), data.short_url);
        toast.success("🚀 URL transformed successfully!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error("Invalid response format from API");
      }
    } catch (err) {
      console.error("API error:", err);
      let errorMessage = "Failed to shorten URL. Please try again.";

      if (err.name === "TypeError" && err.message.includes("Failed to fetch")) {
        errorMessage = "Unable to connect to the shortening service. Please check your internet connection.";
      } else if (err.message.includes("CORS")) {
        errorMessage = "Network error. Please try again later.";
      } else if (err.message.includes("400")) {
        errorMessage = "Bad request. Please check your URL format.";
      } else if (err.message.includes("409")) {
        errorMessage = "This custom alias is already taken";
      } else if (err.message.includes("500")) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message.includes("404")) {
        errorMessage = "Service temporarily unavailable. Please try again later.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`, {
        position: "bottom-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code
  const generateQRCode = useCallback(async (text) => {
    try {
      if (!text.trim()) {
        setQrCodeImage("");
        return;
      }

      const qrCodeDataURL = await QRCode.toDataURL(text, qrOptions);
      setQrCodeImage(qrCodeDataURL);
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("❌ Failed to generate QR code", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  }, [qrOptions]);

  // Handle logo upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("❌ Logo file must be less than 2MB", {
          position: "bottom-right",
          autoClose: 3000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setQrLogo(e.target.result);
        toast.success("✅ Logo uploaded successfully!", {
          position: "bottom-right",
          autoClose: 2000,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle social tab data change
  const handleSocialDataChange = (value) => {
    setSocialData((prev) => ({
      ...prev,
      [socialTab]: value,
    }));

    if (socialTab === "URL") {
      setQrCodeUrl(value);
    } else if (socialTab === "Email") {
      setQrCodeUrl(value ? `mailto:${value}` : "");
    } else if (socialTab === "Telephone") {
      setQrCodeUrl(value ? `tel:${value}` : "");
    } else if (socialTab === "SMS") {
      setQrCodeUrl(value ? `sms:${value}` : "");
    } else if (socialTab === "WhatsApp") {
      setQrCodeUrl(value ? `https://wa.me/${value}` : "");
    } else {
      setQrCodeUrl(value);
    }
  };

  // Real-time QR code generation
  useEffect(() => {
    if (activeTab === "qr-generator" && qrCodeUrl) {
      generateQRCode(qrCodeUrl);
    }
  }, [qrCodeUrl, qrOptions, activeTab, generateQRCode]);

  // Download QR code
  const downloadQRCode = () => {
    if (!qrCodeImage) return;

    const link = document.createElement("a");
    link.download = `qr-code-${exportSize}.${exportFormat.toLowerCase()}`;
    link.href = qrCodeImage;
    link.click();

    toast.success(`📥 QR code downloaded as ${exportFormat}!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Share QR code on social media
  const shareQRCode = (platform) => {
    const text = `Check out this QR code generated with Linkmini!`;
    const url = window.location.href;

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");

    toast.success(`📱 Shared on ${platform}!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  // Copy to clipboard with enhanced feedback
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("📋 Copied to clipboard!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("📋 Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Ultra Modern Header */}
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

            {/* Tab Navigation */}
            <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-xl rounded-xl p-2 border border-white/10">
              <button
                onClick={() => setActiveTab("shortener")}
                className={`relative px-6 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
                  activeTab === "shortener"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {activeTab === "shortener" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg"></div>
                )}
                <span className="relative flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>URL Shortener</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("qr-generator")}
                className={`relative px-6 py-3 text-sm font-bold rounded-lg transition-all duration-300 ${
                  activeTab === "qr-generator"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {activeTab === "qr-generator" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg"></div>
                )}
                <span className="relative flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>QR Generator</span>
                </span>
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user.email === "guest@linkmini.com" ? (
                <>
                  <button
                    onClick={onShowLogin}
                    className="text-sm text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={onShowRegister}
                    className="premium-btn-small"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <>
                  <div className="text-sm text-gray-400">
                    <span className="font-medium text-white">{user.name}</span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

            {/* Ultra Modern Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden pt-20">
        {/* Advanced animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
          <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
        </div>
        
        {/* Advanced floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full filter blur-3xl animate-float-slow"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full filter blur-3xl animate-float-slower"></div>
          <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full filter blur-3xl animate-float-reverse"></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-20 right-20 w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rotate-45 animate-spin-slow opacity-60"></div>
          <div className="absolute bottom-32 left-32 w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce-slow opacity-40"></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rotate-12 animate-pulse opacity-50"></div>
        </div>

                <div className="relative max-w-7xl mx-auto px-6 py-16 text-center">
                    {activeTab === "shortener" ? (
            <>
              <div className="mb-8">
                {/* Badge */}
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-full mb-6">
                                    <span className="text-xs font-medium text-white/90">🚀 Next-Gen URL Shortener</span>
                </div>
                
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
                    Shorten Everything
                  </span>
                </h1>
                
                                <p className="text-base md:text-lg text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                  Transform long URLs into elegant, trackable links with 
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-semibold">lightning speed</span> and 
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">precision</span>
                </p>
                
                              </div>
            </>
          ) : (
            <>
              <div className="mb-16">
                {/* Badge */}
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-full mb-6">
                  <span className="text-xs font-medium text-white/90">✨ AI-Powered QR Generator</span>
                </div>
                
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-rose-600 bg-clip-text text-transparent drop-shadow-2xl">
                    QR Codes Reimagined
                  </span>
                </h1>
                
                <p className="text-base md:text-lg text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
                                    Generate customizable QR codes with 
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent font-semibold">real-time preview</span> and 
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-semibold">4K exports</span>
                </p>
              </div>
            </>
          )}

          {/* Ultra Modern Glass Card */}
          <div className="max-w-6xl mx-auto">
            <div className="relative group">
              {/* Card glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              
              <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-12 md:p-16 shadow-2xl">
              {activeTab === "shortener" ? (
                <>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Main URL Input */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-50"></div>
                      <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-2">
                        <div className="flex flex-col lg:flex-row gap-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={url}
                              onChange={(e) => setUrl(e.target.value)}
                              placeholder="✨ Enter your URL to transform..."
                              className={`w-full px-8 py-6 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-xl focus:ring-4 focus:ring-cyan-500/30 focus:bg-white transition-all placeholder-gray-500 text-gray-800 font-medium ${
                                error ? "ring-2 ring-red-400" : ""
                              }`}
                              disabled={loading}
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={loading || !url.trim()}
                            className="premium-btn lg:px-12 py-6 text-lg font-bold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                          >
                            {loading ? (
                              <div className="flex items-center justify-center space-x-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Processing...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-3">
                                <span>⚡ Shorten</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Custom Alias Input */}
                    <div className="relative">
                      <input
                        type="text"
                        value={customAlias}
                        onChange={(e) => setCustomAlias(e.target.value)}
                        placeholder="🎯 Custom alias (make it memorable)"
                        className="w-full px-8 py-4 text-lg bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-white/50 transition-all placeholder-white/60 text-white font-medium"
                        disabled={loading}
                      />
                    </div>

                    {error && (
                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                        <div className="relative bg-red-500/20 backdrop-blur-xl border border-red-400/30 rounded-2xl p-6 text-red-100">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="font-medium">{error}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>

                  {result && (
                    <div className="mt-12 relative">
                      {/* Success glow effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                      
                      <div className="relative bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-2xl border border-green-400/30 rounded-2xl p-8">
                        {/* Success header */}
                        <div className="flex items-center justify-center mb-8">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-white">Link Transformed!</h3>
                              <p className="text-green-200 text-sm">Your URL is now ready to share</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* URL display */}
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 mb-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Shortened URL</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-xs text-green-600 font-medium">ACTIVE</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="flex-1 text-2xl font-mono font-bold text-blue-600 break-all">
                              {result.shortUrl}
                            </span>
                            <button
                              onClick={() => copyToClipboard(result.shortUrl)}
                              className={`premium-copy-btn px-6 py-3 rounded-xl font-bold transition-all ${
                                copied 
                                  ? "bg-green-500 text-white scale-95" 
                                  : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105"
                              }`}
                            >
                              {copied ? (
                                <div className="flex items-center space-x-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Copied!</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-2">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  <span>Copy</span>
                                </div>
                              )}
                            </button>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Original:</span>
                              <span className="ml-2 break-all">{result.originalUrl}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <button
                            onClick={() => {
                              setSocialData((prev) => ({
                                ...prev,
                                URL: result.shortUrl,
                              }));
                              setQrCodeUrl(result.shortUrl);
                              setActiveTab("qr-generator");
                            }}
                            className="group bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-xl px-6 py-4 text-white font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all transform hover:scale-105"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>QR Code</span>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => window.open(result.shortUrl, '_blank')}
                            className="group bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-400/30 rounded-xl px-6 py-4 text-white font-medium hover:from-blue-500/30 hover:to-cyan-500/30 transition-all transform hover:scale-105"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              <span>Test Link</span>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: 'Check out this shortened link',
                                  url: result.shortUrl
                                });
                              } else {
                                copyToClipboard(result.shortUrl);
                              }
                            }}
                            className="group bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-xl px-6 py-4 text-white font-medium hover:from-emerald-500/30 hover:to-teal-500/30 transition-all transform hover:scale-105"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                              </svg>
                              <span>Share</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* QR Code Generator */}
                  <div className="space-y-8">
                    {/* Social Tabs */}
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-6">
                      <div className="flex flex-wrap gap-3 mb-6">
                        {[
                          "URL",
                          "Facebook", 
                          "Pinterest",
                          "LinkedIn",
                          "WhatsApp",
                          "Email",
                          "Telephone",
                          "SMS",
                        ].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setSocialTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all transform hover:scale-105 ${
                              socialTab === tab
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                                : "bg-white/20 text-white/70 hover:bg-white/30 shadow-sm"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={socialData[socialTab]}
                            onChange={(e) =>
                              handleSocialDataChange(e.target.value)
                            }
                            placeholder={
                              socialTab === "URL"
                                ? "Paste a URL to generate QR code"
                                : socialTab === "Email"
                                  ? "Enter email address"
                                  : socialTab === "Telephone"
                                    ? "Enter phone number"
                                    : socialTab === "SMS"
                                      ? "Enter SMS number"
                                      : socialTab === "WhatsApp"
                                        ? "Enter WhatsApp number"
                                        : `Enter ${socialTab} content`
                            }
                            className="w-full px-6 py-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-white/50 transition-all placeholder-white/60 text-white font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Customization Panel */}
                      <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold mb-4 text-white">
                            Customize QR Code
                          </h3>

                          {/* Color Controls */}
                          <div className="space-y-4 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-white/80 mb-2">
                                Background Color
                              </label>
                              <div className="flex items-center space-x-3">
                                <input
                                  type="color"
                                  value={qrOptions.color.light}
                                  onChange={(e) =>
                                    setQrOptions((prev) => ({
                                      ...prev,
                                      color: {
                                        ...prev.color,
                                        light: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-12 h-10 rounded-lg border-2 border-white/30 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={qrOptions.color.light}
                                  onChange={(e) =>
                                    setQrOptions((prev) => ({
                                      ...prev,
                                      color: {
                                        ...prev.color,
                                        light: e.target.value,
                                      },
                                    }))
                                  }
                                  className="flex-1 px-3 py-2 text-sm bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-white/80 mb-2">
                                Foreground Color
                              </label>
                              <div className="flex items-center space-x-3">
                                <input
                                  type="color"
                                  value={qrOptions.color.dark}
                                  onChange={(e) =>
                                    setQrOptions((prev) => ({
                                      ...prev,
                                      color: {
                                        ...prev.color,
                                        dark: e.target.value,
                                      },
                                    }))
                                  }
                                  className="w-12 h-10 rounded-lg border-2 border-white/30 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={qrOptions.color.dark}
                                  onChange={(e) =>
                                    setQrOptions((prev) => ({
                                      ...prev,
                                      color: {
                                        ...prev.color,
                                        dark: e.target.value,
                                      },
                                    }))
                                  }
                                  className="flex-1 px-3 py-2 text-sm bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Margin Control */}
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Margin: {qrOptions.margin}
                            </label>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-white/60">0</span>
                              <input
                                type="range"
                                min="0"
                                max="10"
                                step="1"
                                value={qrOptions.margin}
                                onChange={(e) =>
                                  setQrOptions((prev) => ({
                                    ...prev,
                                    margin: parseInt(e.target.value),
                                  }))
                                }
                                className="flex-1 slider-input"
                              />
                              <span className="text-sm text-white/60">10</span>
                            </div>
                          </div>

                          {/* Error Correction Level */}
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Error Correction Level
                            </label>
                            <select
                              value={qrOptions.errorCorrectionLevel}
                              onChange={(e) =>
                                setQrOptions((prev) => ({
                                  ...prev,
                                  errorCorrectionLevel: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-white/50 text-white"
                            >
                              <option value="L">Low (7%)</option>
                              <option value="M">Medium (15%)</option>
                              <option value="Q">Quartile (25%)</option>
                              <option value="H">High (30%)</option>
                            </select>
                          </div>

                          {/* Logo Upload */}
                          <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                              Upload Logo
                            </label>
                            <div className="border-2 border-dashed border-white/30 rounded-lg p-4 text-center hover:border-purple-400/50 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                                id="logo-upload"
                              />
                              <label
                                htmlFor="logo-upload"
                                className="cursor-pointer"
                              >
                                <div className="text-white/70">
                                  <div className="text-2xl mb-2">📁</div>
                                  <p className="text-sm">
                                    {qrLogo
                                      ? "Logo uploaded!"
                                      : "Click to select file"}
                                  </p>
                                  <p className="text-xs text-white/50 mt-1">
                                    PNG, JPG up to 2MB
                                  </p>
                                </div>
                              </label>
                            </div>
                            {qrLogo && (
                              <div className="mt-3 flex items-center justify-between p-2 bg-green-500/20 rounded">
                                <span className="text-sm text-green-300">
                                  �� Logo ready
                                </span>
                                <button
                                  onClick={() => setQrLogo(null)}
                                  className="text-red-400 hover:text-red-300 text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* QR Code Preview */}
                      <div className="lg:col-span-2">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">
                              QR Code Preview
                            </h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => shareQRCode("facebook")}
                                className="p-2 bg-blue-600/80 text-white rounded hover:bg-blue-700 transition-colors"
                                title="Share on Facebook"
                              >
                                📘
                              </button>
                              <button
                                onClick={() => shareQRCode("twitter")}
                                className="p-2 bg-blue-400/80 text-white rounded hover:bg-blue-500 transition-colors"
                                title="Share on Twitter"
                              >
                                🐦
                              </button>
                              <button
                                onClick={() => shareQRCode("linkedin")}
                                className="p-2 bg-blue-700/80 text-white rounded hover:bg-blue-800 transition-colors"
                                title="Share on LinkedIn"
                              >
                                💼
                              </button>
                              <button
                                onClick={() => shareQRCode("whatsapp")}
                                className="p-2 bg-green-500/80 text-white rounded hover:bg-green-600 transition-colors"
                                title="Share on WhatsApp"
                              >
                                💬
                              </button>
                            </div>
                          </div>

                          <div className="qr-preview-container mb-6 bg-white/5 rounded-2xl p-8 min-h-[320px] flex items-center justify-center">
                            {qrCodeImage ? (
                              <img
                                src={qrCodeImage}
                                alt="Generated QR Code"
                                className="max-w-full h-auto mx-auto rounded-xl shadow-lg"
                                style={{ maxWidth: "300px" }}
                              />
                            ) : (
                              <div className="text-center text-white/60">
                                <div className="text-6xl mb-4">📱</div>
                                <p className="text-lg font-medium">
                                  Enter URL or text above
                                </p>
                                <p className="text-sm mt-2 opacity-75">
                                  QR code preview will appear here
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Export Options */}
                          <div className="bg-white/5 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-medium text-white">
                                Export Options
                              </h4>
                              <div className="flex items-center space-x-2">
                                <select
                                  value={exportSize}
                                  onChange={(e) => setExportSize(e.target.value)}
                                  className="px-3 py-1 text-sm bg-white/20 backdrop-blur-xl border border-white/30 rounded focus:ring-2 focus:ring-purple-500 text-white"
                                >
                                  <option value="64px">64 px</option>
                                  <option value="128px">128 px</option>
                                  <option value="256px">256 px</option>
                                  <option value="512px">512 px</option>
                                  <option value="1024px">1024 px</option>
                                </select>
                                <select
                                  value={exportFormat}
                                  onChange={(e) =>
                                    setExportFormat(e.target.value)
                                  }
                                  className="px-3 py-1 text-sm bg-white/20 backdrop-blur-xl border border-white/30 rounded focus:ring-2 focus:ring-purple-500 text-white"
                                >
                                  <option value="PNG">PNG</option>
                                  <option value="SVG">SVG</option>
                                  <option value="PDF">PDF</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button
                                onClick={downloadQRCode}
                                disabled={!qrCodeImage}
                                className="flex-1 premium-btn disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl"
                              >
                                📥 Download
                              </button>
                              <button
                                onClick={() => copyToClipboard(qrCodeUrl)}
                                disabled={!qrCodeUrl}
                                className="flex-1 premium-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl"
                              >
                                📋 Copy URL
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

          {/* Footer */}
          <div className="mt-20 text-center">
            <p className="text-sm text-white/60 max-w-2xl mx-auto">
              Trusted by developers worldwide. Built with ❤️ for the modern web.
            </p>
            <div className="flex justify-center space-x-6 mt-4 text-xs text-white/40">
              <button
                onClick={onShowTerms}
                className="hover:text-white/60 cursor-pointer transition-colors"
              >
                Terms
              </button>
              <button
                onClick={onShowPrivacy}
                className="hover:text-white/60 cursor-pointer transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={onShowContact}
                className="hover:text-white/60 cursor-pointer transition-colors"
              >
                Support
              </button>
            </div>
            <div className="mt-4">
              <p className="text-xs text-white/50">
                © 2025 G-INITIATIONS ESERVICES PRIVATE LIMITED. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Toast Container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="text-sm"
        toastClassName="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default MainApp;
