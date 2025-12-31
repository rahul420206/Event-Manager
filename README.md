# Event Manager (MERN)
o
This is a complete project that was developed as part of a hiring process at Fission Infotech for the Software engineer intern position.

# Here is the deployed Application link
https://event-manager-git-main-rahuls-projects-6503ee86.vercel.app/?_vercel_share=9ndvPrSGbLgH6o4ObegZ9o6o1ZhswaUC

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


# Instructions to Access the Application
Initial Load Time
When the site is opened for the first time, it may take 1–2 minutes to respond. This is because the backend is deployed on Render, which spins down inactive services and requires some time to start up.
(This is a deployment platform limitation and not an issue with the application code.). After that it will work fine.

If needed, please check the Network tab in the browser’s developer console to confirm that the API response is being received.

Backend: Deployed on Render
Frontend: Deployed on Vercel
Database: MongoDB Atlas

Login / Signup
You can either create a new account by signing up or log in using the following test credentials:

Username: rahul@email.com
Password: 1234


