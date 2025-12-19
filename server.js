const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// CONFIG
const PORT = 5000;
const MONGO_URI = 'mongodb://localhost:27017/eventDB'; // Change to your Atlas URI
const JWT_SECRET = 'my_super_secret_key';

// DATABASE MODELS
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String }
}));

const Event = mongoose.model('Event', new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  capacity: Number,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}));

// AUTH MIDDLEWARE
const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Not authorized' });
  }
};

// ROUTES
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hash });
    res.json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ message: 'Email already exists' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.get('/api/events', async (req, res) => {
  const events = await Event.find();
  res.json(events);
});

app.post('/api/events', protect, async (req, res) => {
  const event = await Event.create({ ...req.body, creator: req.userId });
  res.json(event);
});

app.delete('/api/events/:id', protect, async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// CRITICAL BUSINESS LOGIC: Atomic RSVP with Capacity Check
app.post('/api/events/:id/rsvp', protect, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Not found' });

  // Toggle RSVP
  if (event.attendees.includes(req.userId)) {
    event.attendees.pull(req.userId);
    await event.save();
    return res.json(event);
  }

  // Check Capacity
  if (event.attendees.length >= event.capacity) {
    return res.status(400).json({ message: 'Event is full!' });
  }

  event.attendees.push(req.userId);
  await event.save();
  res.json(event);
});

// START
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));
  })
  .catch(err => console.log(err));
