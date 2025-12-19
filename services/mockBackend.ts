// /**
//  * NOTE FOR BEGINNERS:
//  * This file FAKES a backend server. 
//  * In your real assignment, you will replace these function calls 
//  * with `fetch('http://localhost:5000/api/...')`.
//  * 
//  * I have implemented this so you can see the App working right now in the browser!
//  */

// // Types mimicking Mongoose models
// export interface User {
//   id: string;
//   email: string;
//   password: string; // In real app, this is hashed!
//   name: string;
// }

// export interface Event {
//   id: string;
//   title: string;
//   description: string;
//   date: string;
//   location: string;
//   capacity: number;
//   imageUrl: string;
//   creatorId: string;
//   attendees: string[]; // List of User IDs
// }

// // Helpers to get/set from LocalStorage
// const getEvents = (): Event[] => JSON.parse(localStorage.getItem('events') || '[]');
// const setEvents = (events: Event[]) => localStorage.setItem('events', JSON.stringify(events));
// const getUsers = (): User[] => JSON.parse(localStorage.getItem('users') || '[]');
// const setUsers = (users: User[]) => localStorage.setItem('users', JSON.stringify(users));

// // Initialize some dummy data if empty
// if (getEvents().length === 0) {
//   setEvents([
//     {
//       id: '1',
//       title: 'Tech Meetup 2024',
//       description: 'A gathering for tech enthusiasts to discuss React and Node.js.',
//       date: '2024-12-25T18:00',
//       location: 'Community Hall, NY',
//       capacity: 50,
//       imageUrl: 'https://picsum.photos/400/200',
//       creatorId: 'admin',
//       attendees: []
//     }
//   ]);
// }

// // --- Auth Services ---

// export const loginUser = async (email: string, password: string) => {
//   const users = getUsers();
//   const user = users.find(u => u.email === email && u.password === password);
//   if (user) {
//     // Simulate a JWT token simply by returning the user info
//     return { token: 'fake-jwt-token', user: { id: user.id, name: user.name, email: user.email } };
//   }
//   throw new Error('Invalid email or password');
// };

// export const registerUser = async (name: string, email: string, password: string) => {
//   const users = getUsers();
//   if (users.find(u => u.email === email)) {
//     throw new Error('User already exists');
//   }
//   const newUser = { id: Date.now().toString(), name, email, password };
//   users.push(newUser);
//   setUsers(users);
//   return { token: 'fake-jwt-token', user: { id: newUser.id, name: newUser.name, email: newUser.email } };
// };

// // --- Event Services ---

// export const fetchEvents = async () => {
//   return getEvents();
// };

// export const createEvent = async (eventData: Omit<Event, 'id' | 'attendees'>) => {
//   const events = getEvents();
//   const newEvent: Event = { ...eventData, id: Date.now().toString(), attendees: [] };
//   events.push(newEvent);
//   setEvents(events);
//   return newEvent;
// };

// export const deleteEvent = async (eventId: string, userId: string) => {
//   let events = getEvents();
//   const event = events.find(e => e.id === eventId);
//   if (!event) throw new Error('Event not found');
//   if (event.creatorId !== userId) throw new Error('Not authorized');
  
//   events = events.filter(e => e.id !== eventId);
//   setEvents(events);
// };

// export const rsvpEvent = async (eventId: string, userId: string) => {
//   const events = getEvents();
//   const eventIndex = events.findIndex(e => e.id === eventId);
//   if (eventIndex === -1) throw new Error('Event not found');

//   const event = events[eventIndex];

//   // Logic: No Duplicates
//   if (event.attendees.includes(userId)) {
//     // If already joined, leave
//     event.attendees = event.attendees.filter(id => id !== userId);
//   } else {
//     // Logic: Capacity Enforcement
//     if (event.attendees.length >= event.capacity) {
//       throw new Error('Event is full!');
//     }
//     event.attendees.push(userId);
//   }

//   events[eventIndex] = event;
//   setEvents(events);
//   return event;
// };
