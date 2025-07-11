# MERN Blog Application

## 🚀 Project Overview
A full-stack MERN (MongoDB, Express.js, React.js, Node.js) blog application with user authentication, post and category management, and a modern React frontend.

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```
git clone <your-repo-url>
cd <your-repo-directory>
```

### 2. Setup the Server
```
cd server
cp .env.example .env # Fill in your values
npm install
npm run dev
```

### 3. Setup the Client
```
cd ../client
cp .env.example .env # (Optional, for VITE_API_URL)
npm install
npm run dev
```

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Posts
- `GET /api/posts` — List all posts
- `GET /api/posts/:id` — Get a single post
- `POST /api/posts` — Create a post (auth required)
- `PUT /api/posts/:id` — Update a post (auth, author only)
- `DELETE /api/posts/:id` — Delete a post (auth, author only)

### Categories
- `GET /api/categories` — List all categories
- `POST /api/categories` — Create a category (auth required)
- `PUT /api/categories/:id` — Update a category (auth required)
- `DELETE /api/categories/:id` — Delete a category (auth required)

---

## ✨ Features Implemented
- User registration and login (JWT authentication)
- Create, edit, delete blog posts (protected routes)
- View all posts and single post details
- Category management (CRUD)
- Responsive React frontend with React Router
- Error handling and loading states
- Clean code organization

---

## 🖼️ Screenshots
<!-- Add screenshots of your app here -->

---

## 📦 Folder Structure
```
client/    # React frontend
server/    # Express/MongoDB backend
```

---

## 📝 Notes
- Make sure MongoDB is running before starting the server.
- Update `.env` files with your own secrets and URIs.
- For any issues, check the console for errors or open an issue.

---

## 📣 Future Improvements
- Image uploads for posts
- Pagination, search, and filtering
- Comments on posts
- Admin roles and permissions

--- 