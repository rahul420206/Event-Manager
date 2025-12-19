import React, { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CreateEvent } from './pages/CreateEvent';

const App = () => {
  // State to track which page we are on
  const [page, setPage] = useState('dashboard');
  
  // State to track the logged in user
  const [user, setUser] = useState(null);

  // When the app starts, check if someone is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* SIMPLE NAVBAR */}
      <nav className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-lg">
        <h1 
          className="text-2xl font-bold cursor-pointer" 
          onClick={() => setPage('dashboard')}
        >
          EventManager
        </h1>
        <div className="space-x-4">
          <button onClick={() => setPage('dashboard')} className="hover:underline">Home</button>
          {user ? (
            <>
              <button onClick={() => setPage('create')} className="bg-blue-500 px-3 py-1 rounded">Create Event</button>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage('login')} className="hover:underline">Login</button>
              <button onClick={() => setPage('register')} className="bg-white text-blue-600 px-3 py-1 rounded font-bold">Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {/* PAGE ROUTER */}
      <div className="container mx-auto p-6">
        {page === 'dashboard' && <Dashboard user={user} />}
        {page === 'login' && <Login onLoginSuccess={(u) => { setUser(u); setPage('dashboard'); }} />}
        {page === 'register' && <Register onRegisterSuccess={(u) => { setUser(u); setPage('dashboard'); }} />}
        {page === 'create' && <CreateEvent user={user} onCreated={() => setPage('dashboard')} />}
      </div>
    </div>
  );
};

export default App;