

## ✅ `README.md` for **Backend Repo**

# 🛠️ Expense Tracker Backend

A secure and scalable backend for the Expense Tracker app, built using **Node.js**, **Express**, and **MongoDB Atlas**.

🔗 **Live API:** [expense-tracker-backend](https://expense-tracker-backend-8csc.onrender.com)

---

## 🚀 Features

- 🔐 JWT Authentication (Signup / Login / Reset Password)
- 🧾 CRUD operations for expenses (User-specific)
- 📧 Password reset via email (Gmail App Password)
- 🔒 Passwords hashed with bcrypt
- 🌐 CORS enabled for frontend integration

---

## 🛠️ Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Nodemailer for email
- Render (for deployment)

---

## 🔧 Environment Variables

Create a `.env` file in the root with:

MONGO_URI=your-mongodb-uri
JWT_SECRET=yourSuperSecretKey
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=https://expense-tracker-frontend-neon-eight.vercel.app/
🧑‍💻 Run Locally

git clone https://github.com/ramsamujhsingh70/expense-tracker-backend.git
cd expense-tracker-backend
npm install
node server.js
📦 Deployment
Hosted on Render. Automatically connected to GitHub for CI/CD.

📁 Folder Structure

.
├── models/           # User.js and Expense.js
├── routes/           # auth.js (for login/signup)
├── middleware/       # JWT auth check
├── server.js         # Main entry point
└── .env
📧 Contact
Made with ❤️ by Ram Samujh Singh

