# Full Stack Intern Assignment - Submission Guide

This project is set up as a **Frontend Demo** for the assignment. Because you are viewing this in a browser preview, the "backend" is simulated using browser storage (`mockBackend.ts`).

HOWEVER, for your actual assignment submission, you need to provide the **real** Node.js/Express backend code.

**I have written the complete, beginner-friendly Backend code for you below.**

---

## 1. Project Structure for Submission

When you submit to GitHub, your folder structure should look like this:

```
my-event-app/
├── client/         <-- (Put the React code I generated here)
├── server/         <-- (Create this folder and put the code below inside)
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── .env
│   ├── package.json
│   └── server.js
└── README.md
```

---

## 2. Backend Code (Copy and Paste this)

### Step A: Setup Server

Open a terminal in the `server` folder and run:

```bash
npm init -y
npm install express mongoose cors dotenv jsonwebtoken bcryptjs
```

### Step B: Create `.env` file

```env
PORT=5000
MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/events_db
JWT_SECRET=supersecretkey123
```

### Step C: Create `server.js` (The Main Backend File)

This file handles everything: Auth, Events, and the **Critical RSVP Concurrency Logic**.

```javascript
// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// --- Database Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// --- Models ---
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  location: String,
  capacity: Number,
  imageUrl: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
const Event = mongoose.model("Event", EventSchema);

// --- Middleware ---
const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

// --- Routes: Auth ---
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  try {
    await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send("Email already exists");
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found");

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send("Invalid password");

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  res
    .header("Authorization", token)
    .send({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
});

// --- Routes: Events ---
app.get("/api/events", async (req, res) => {
  const events = await Event.find();
  res.send(events);
});

app.post("/api/events", auth, async (req, res) => {
  const event = new Event({ ...req.body, creator: req.user._id });
  await event.save();
  res.send(event);
});

// CRITICAL BUSINESS LOGIC: RSVP with Concurrency Handling
// We use MongoDB's atomic query to ensure we don't exceed capacity.
app.post("/api/events/:id/rsvp", auth, async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user._id;

  try {
    // 1. Check if user is already attending (simple check)
    const eventCheck = await Event.findById(eventId);
    if (eventCheck.attendees.includes(userId)) {
      // If attending, remove them (Toggle RSVP)
      eventCheck.attendees.pull(userId);
      await eventCheck.save();
      return res.send(eventCheck);
    }

    // 2. CONCURRENCY SAFE JOIN
    // We try to find the event AND ensure current attendees < capacity in one DB operation.
    // $lt means "less than".
    const event = await Event.findOneAndUpdate(
      {
        _id: eventId,
        $expr: { $lt: [{ $size: "$attendees" }, "$capacity"] },
      },
      { $push: { attendees: userId } },
      { new: true }
    );

    if (!event) {
      return res.status(400).send("Event is full or does not exist");
    }

    res.send(event);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
```

---

## 3. Database Setup (MongoDB)

1. Go to **MongoDB Atlas** (cloud.mongodb.com).
2. Create a free account and a free cluster.
3. In "Database Access", create a user (e.g., `admin` / `password123`).
4. In "Network Access", allow IP `0.0.0.0/0` (access from anywhere).
5. Get the connection string (Driver Node.js) and paste it into `.env`.

**(Note: You do not need a SQL script for MongoDB. It creates collections automatically when you save data.)**

---

## 4. Deployment Instructions

### Backend (Render.com)

1. Push your `server` folder code to GitHub.
2. Go to Render.com -> "New Web Service".
3. Connect your repo.
4. Set Build Command: `npm install`.
5. Set Start Command: `node server.js`.
6. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`) in the Render dashboard.

### Frontend (Vercel)

1. Push your `client` folder code to GitHub.
2. Go to Vercel.com -> "Add New".
3. Connect repo.
4. It should auto-detect React.
5. **Important:** You need to change the API URLs in the frontend code from `mockBackend` to your deployed Render URL (e.g., `https://my-api.onrender.com/api/...`).

---

## 5. Technical Explanation for Interview (Concurrency)

**Question:** How did you handle the "race condition" where two people RSVP for the last spot at the exact same millisecond?

**Answer:**

> "I handled concurrency by using MongoDB's atomic `findOneAndUpdate` operation. instead of reading the event capacity, checking it in JavaScript, and then saving (which causes race conditions), I pushed the logic into the database query itself.
>
> The query looks for an event with the specific ID **AND** where the size of the `attendees` array is strictly less than the `capacity` field (`$expr: { $lt: ... }`).
>
> Since MongoDB operations on a single document are atomic, if two requests come in simultaneously for the last spot, only the first one will match the query condition and successfully update the document. The second one will fail to find a matching document (because capacity is now full) and will return null, allowing me to send a 'Sold Out' message."
