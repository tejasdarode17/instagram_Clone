📱 MERN Social Media App
A full-stack social media application built using the MERN stack (MongoDB, Express, React, Node.js). It includes core social features like posting, commenting, following, along with real-time chat and live notifications powered by WebSockets (Socket.IO) — all in a clean, scalable architecture.

🚀 Features
🔐 Authentication
Sign-up / Login with email and password

Email verification using Nodemailer

JWT-based authentication and session handling

📝 Posts
Create, edit, and delete posts

Like/unlike posts

Personalized feed showing posts from followed users

💬 Comments
Add, edit, and delete comments

Reply to comments (nested replies)

Like/unlike comments

👥 Social Features
Follow / unfollow users

View user profiles

Followers and following list

💬 Real-time Chat (WebSocket)
One-on-one instant messaging

Online/offline status indicators

Chat history saved in the database

🔔 Real-time Notifications
Live notifications for likes, comments, and follows

Delivered via WebSocket (Socket.IO)

Seen/unseen notification status

🛠️ Tech Stack
Frontend	Backend	Real-time & Utilities
React	Node.js + Express	Socket.IO (WebSocket)
Redux Toolkit	MongoDB + Mongoose	Nodemailer (Email Verify)
React Router	JWT Auth	Cloudinary (Image Upload)
