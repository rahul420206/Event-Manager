import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const Dashboard = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');

  const loadEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      console.log("Error loading events. Is the backend running?");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRSVP = async (id) => {
    if (!user) return alert("Please login first!");
    try {
      await api.rsvp(id);
      loadEvents();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      await api.deleteEvent(id);
      loadEvents();
    }
  };

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Upcoming Events</h2>
        <input
          type="text"
          placeholder="Search by title or city..."
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(event => {
          const image =
            event.imageUrl && event.imageUrl.trim() !== ''
              ? event.imageUrl
              : 'https://picsum.photos/400/200';

          return (
            <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              
              {/* ✅ Event Image */}
              <div className="h-44 w-full bg-gray-100">
                <img
                  src={image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://picsum.photos/400/200';
                  }}
                />
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-gray-500 text-sm">
                  {event.location} • {new Date(event.date).toLocaleDateString()}
                </p>

                <p className="mt-2 text-gray-700 text-sm line-clamp-2">
                  {event.description}
                </p>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm font-semibold">
                    Seats: {event.attendees.length} / {event.capacity}
                  </span>
                  {event.attendees.length >= event.capacity && (
                    <span className="text-red-500 font-bold text-xs">FULL</span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleRSVP(event._id)}
                    className={`flex-1 p-2 rounded text-white font-bold ${
                      event.attendees.includes(user?.id)
                        ? 'bg-orange-500'
                        : 'bg-blue-600'
                    }`}
                  >
                    {event.attendees.includes(user?.id) ? 'Leave' : 'RSVP'}
                  </button>

                  {user && user.id === event.creator && (
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No events found. Start by creating one!
        </p>
      )}
    </div>
  );
};
