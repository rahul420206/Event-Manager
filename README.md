# Beginner Event Manager (MERN)

This is a complete project for your university assignment. 

## 1. Backend Setup
1. Create a folder named `server`.
2. Open terminal in that folder and run:
   `npm init -y`
   `npm install express mongoose cors dotenv jsonwebtoken bcryptjs`
3. Create a file named `server.js` and paste the code from the `server.js` file in this project.
4. Run the server: `node server.js`.

## 2. Frontend Setup
1. Use the React code provided in the `App.tsx` and `pages/` folder.
2. The frontend is configured to talk to `http://localhost:5000`.

## 3. Database
- By default, it connects to a local MongoDB: `mongodb://localhost:27017/eventDB`.
- If you use MongoDB Atlas, replace the string in `server.js`.

## 4. Why this code is "Beginner Friendly"
- No complicated Redux or Context API; just simple `useState`.
- Straightforward `fetch` calls in `services/api.ts`.
- Routing is done with simple conditional rendering (`page === 'dashboard'`).
- The Backend is one single file (`server.js`) so you can see all logic at once.
