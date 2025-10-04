import { useState, useEffect } from 'react';
import { Loader } from './components/Loader';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { storage } from './utils/storage';
import { initializeDemoData } from './utils/demoData';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initializeDemoData();

    const user = storage.getUser();
    if (user) {
      setIsAuthenticated(true);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleLogin = async (username: string, password: string) => {
    if (username === 'admin' && password === 'admin123') {
      const user = {
        id: crypto.randomUUID(),
        username,
        email: 'admin@aicampus.edu'
      };
      storage.setUser(user);
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    storage.clearUser();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} error={error} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
