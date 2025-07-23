import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import MainApp from "./MainApp";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import Contact from "./Contact";

const App = () => {
  const [currentView, setCurrentView] = useState("app"); // "login", "register", "app", "privacy", "terms", "contact"
  const [user, setUser] = useState({
    name: "Guest",
    email: "guest@linkmini.com",
  });

  // Check if user is logged in on app load and handle URL routing
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Handle URL routing
    const path = window.location.pathname;
    if (path === "/privacy-policy") {
      setCurrentView("privacy");
    } else if (path === "/terms-of-service") {
      setCurrentView("terms");
    } else if (path === "/contact" || path === "/support") {
      setCurrentView("contact");
    } else if (savedUser) {
      setCurrentView("app");
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentView("app");
  };

  const handleRegister = (userData) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setCurrentView("app");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    setCurrentView("login");
  };

  const switchToLogin = () => {
    setCurrentView("login");
  };

  const switchToRegister = () => {
    setCurrentView("register");
  };

  const switchToPrivacy = () => {
    setCurrentView("privacy");
    window.history.pushState({}, "", "/privacy-policy");
  };

  const switchToTerms = () => {
    setCurrentView("terms");
    window.history.pushState({}, "", "/terms-of-service");
  };

  const switchToContact = () => {
    setCurrentView("contact");
    window.history.pushState({}, "", "/contact");
  };

  const backToMain = () => {
    setCurrentView("app");
    window.history.pushState({}, "", "/");
  };

  if (currentView === "privacy") {
    return <PrivacyPolicy onBack={backToMain} />;
  }

  if (currentView === "terms") {
    return <TermsOfService onBack={backToMain} />;
  }

  if (currentView === "contact") {
    return <Contact onBack={backToMain} />;
  }

  if (currentView === "app") {
    return (
      <MainApp
        user={user}
        onLogout={handleLogout}
        onShowLogin={switchToLogin}
        onShowRegister={switchToRegister}
        onShowPrivacy={switchToPrivacy}
        onShowTerms={switchToTerms}
        onShowContact={switchToContact}
      />
    );
  }

  if (currentView === "register") {
    return (
      <Register onRegister={handleRegister} onSwitchToLogin={switchToLogin} />
    );
  }

  return <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />;
};

export default App;
