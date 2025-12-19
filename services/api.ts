/**
 * API SERVICE
 * This file handles all the 'fetch' calls to our Node.js backend.
 */

const BASE_URL = 'http://localhost:5000/api';

// Helper function to get the token from local storage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // LOGIN
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  },

  // REGISTER
  register: async (name, email, password) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  },

  // GET ALL EVENTS
  getEvents: async () => {
    const response = await fetch(`${BASE_URL}/events`);
    return response.json();
  },

  // CREATE EVENT
  createEvent: async (eventData) => {
    const response = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(eventData)
    });
    return response.json();
  },

  // RSVP (JOIN/LEAVE)
  rsvp: async (eventId) => {
    const response = await fetch(`${BASE_URL}/events/${eventId}/rsvp`, {
      method: 'POST',
      headers: { 
        ...getAuthHeader()
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'RSVP failed');
    }
    return response.json();
  },

  // DELETE EVENT
  deleteEvent: async (eventId) => {
    const response = await fetch(`${BASE_URL}/events/${eventId}`, {
      method: 'DELETE',
      headers: { 
        ...getAuthHeader()
      }
    });
    return response.json();
  }
};