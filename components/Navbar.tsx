import React from 'react';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNavigate }) => {
  return (
    <nav className="bg-indigo-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 
          className="text-2xl font-bold cursor-pointer" 
          onClick={() => onNavigate('dashboard')}
        >
          EventHub
        </h1>
        
        <div className="space-x-4">
          {user ? (
            <>
              <span className="hidden sm:inline">Welcome, {user.name}</span>
              <button 
                onClick={() => onNavigate('create')}
                className="bg-indigo-500 hover:bg-indigo-700 px-3 py-1 rounded transition"
              >
                Create Event
              </button>
              <button 
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('login')}
                className="hover:text-gray-200"
              >
                Login
              </button>
              <button 
                onClick={() => onNavigate('register')}
                className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-100"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};