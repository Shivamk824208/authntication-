# 🔐 Authentication System Backend

A secure authentication backend built using **Node.js**, **Express**, and **MongoDB**.
This project provides APIs for user registration,verification, login,logout,forgot-password, change-password and protected routes using **JWT authentication**.

---

## 🚀 Features

* User Registration
* User Login
* Password Hashing using bcrypt
* JWT Token Authentication
* Protected Routes
* Environment Variables for security

---

## 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB
* JWT (JSON Web Token)
* bcrypt
* dotenv

---

## 📂 Project Structure

```
backend
│
├── controllers
├── models
├── routes
├── middleware
├── config
│
├── server.js
├── package.json
└── .env
```

---

## ⚙️ Installation

Clone the repository

```
git clone https://github.com/Shivamk824208/authntication-.git
```

Go to project folder

```
cd backend
```

Install dependencies

```
npm install
```

Create `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run server

```
npm start
```

---

## 🔑 API Endpoints

| Method | Endpoint                     | Description     |
| ------ | -----------------------      | --------------- |
| POST   | /user/register               | Register user   |
| POST   | /user/verify                 | verify user     |
| POST   | /user/login                  | Login user      |
| POST   | /user/logout                 | Logout user     |
| post   | /user/forgot-password        | forgot-password |
| post   | /user/verify-otp/:email      | verifyOTP       |
| post   | /user/change-password/:email | change-password |       |

---

## 🔮 Future Improvements

* Email verification
* Password reset
* OAuth login 
* Refresh token system

---

## 👨‍💻 Author

**Shivam Kumar**

Backend Developer (Node.js)
