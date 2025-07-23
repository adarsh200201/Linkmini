import React from "react";

const NotFound = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        {/* Error Animation */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-red-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-white/70 max-w-md mx-auto">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onBack}
            className="premium-btn px-8 py-3 text-lg font-bold"
          >
            🏠 Go Home
          </button>
          <button
            onClick={() => window.history.back()}
            className="premium-btn-secondary px-8 py-3 text-lg font-bold"
          >
            ← Go Back
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-white/50 text-sm">
          <p>If you believe this is an error, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
