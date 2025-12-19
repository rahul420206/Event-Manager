import React, { useState } from 'react';
import { api } from '../services/api';
import { getAIDescription } from '../services/ai';

export const CreateEvent = ({ user, onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(10);
  const [aiLoading, setAiLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');


  const handleAI = async () => {
    if (!title) return alert("Enter a title first!");
    setAiLoading(true);
    const text = await getAIDescription(title);
    setDescription(text);
    setAiLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createEvent({ title, description, date, location, capacity,imageUrl });
      alert("Event Published!");
      onCreated();
    } catch (err) {
      alert("Error creating event. Check your backend.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600">Event Title</label>
          <input 
            className="w-full border p-2 rounded" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-gray-600">Description</label>
            <button 
              type="button" 
              onClick={handleAI} 
              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded border border-purple-300"
              disabled={aiLoading}
            >
              {aiLoading ? 'Thinking...' : '✨ Magic AI Describe'}
            </button>
          </div>
          <textarea 
            className="w-full border p-2 rounded h-24" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">Date</label>
            <input 
              type="date" 
              className="w-full border p-2 rounded" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-gray-600">Max Capacity</label>
            <input 
              type="number" 
              className="w-full border p-2 rounded" 
              value={capacity} 
              onChange={(e) => setCapacity(Number(e.target.value))} 
              required 
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-600">Location (City)</label>
          <input 
            className="w-full border p-2 rounded" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label className="block text-gray-600">Image URL</label>
          <input
            className="w-full border p-2 rounded text-sm"
            placeholder="https://picsum.photos/400/200"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">
            Leave empty for default image
          </p>
        </div>

        <button className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
          Create Event Now
        </button>
      </form>
    </div>
  );
};