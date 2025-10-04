import { useState, useEffect } from "react";
import { Loader } from "./components/Loader";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { Dashboard } from "./components/Dashboard";
import { storage } from "./utils/storage";
import { initializeDemoData } from "./utils/demoData";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    initializeDemoData();

    const token = storage.getToken();
    if (token) {
      setIsAuthenticated(true);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      console.log("🔐 Attempting login for:", username);

      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Login failed:", data);
        setError(data.message || "Login failed");
        return;
      }

      console.log("✅ Login successful:", data);
      const { user, token } = data;
      storage.setUser(user);
      storage.setToken(token);
      setIsAuthenticated(true);
      setError("");
    } catch (e) {
      console.error("❌ Network error:", e);
      setError(
        "Unable to connect to server. Please check if the backend is running."
      );
    }
  };

  const handleSignup = async (username: string, password: string) => {
    try {
      console.log("🚀 Attempting signup for:", username);

      const res = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Signup failed:", data);
        setError(data.message || "Signup failed");
        return;
      }

      console.log("Signup successful:", data);

      // After successful signup, redirect to login page
      setShowSignup(false);
      setError(
        "Account created successfully! Please login with your credentials."
      );
    } catch (e) {
      console.error("Network error:", e);
      setError(
        "Unable to connect to server. Please check if the backend is running."
      );
    }
  };

  const handleLogout = () => {
    storage.clearUser();
    storage.clearToken();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <Signup
          onSignup={handleSignup}
          error={error}
          onShowLogin={() => setShowSignup(false)}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        error={error}
        onShowSignup={() => setShowSignup(true)}
      />
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
