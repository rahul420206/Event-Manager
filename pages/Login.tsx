import React, { useState } from 'react';
import { api } from '../services/api';

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.login(email, password);
      // Save to browser memory
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLoginSuccess(data.user);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Member Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600">Email Address</label>
          <input 
            type="email" 
            className="w-full border p-2 rounded" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-600">Password</label>
          <input 
            type="password" 
            className="w-full border p-2 rounded" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button className="w-full bg-blue-600 text-white p-2 rounded font-bold hover:bg-blue-700">
          Login Now
        </button>
      </form>
    </div>
  );
};