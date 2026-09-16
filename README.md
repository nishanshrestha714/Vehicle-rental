# Drivex 

Drivex is a full-stack vehicle rental platform built for the Nepal market — book verified vehicles online, pay with **eSewa** or **Khalti**, and manage rentals without paperwork at a counter.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Backend setup](#2-backend-setup)
  - [3. Frontend setup](#3-frontend-setup)
  - [4. Running the app](#4-running-the-app)
- [Environment Variables](#environment-variables)
- [Design System](#design-system)
- [Roadmap](#roadmap)

---

## Features

-  **Authentication** — JWT-based auth with role-based access control (user/admin)
-  **Nagarikta (citizenship) verification** — bilingual verification form with document upload
-  **Nepal-specific validation** — Nepali phone number format, local address handling
-  **Vehicle browsing & booking** — vehicle listing, detail pages, pickup/drop location & date selection
-  **Local payment gateways** — eSewa and Khalti integration (HMAC-SHA256 signed requests, payment confirmation flow)
-  **User profile management** — booking history, editable profile fields, real-time validation
-  **Media storage** — vehicle and document images hosted on Cloudinary
-  **Admin & booking management** — booking status tracking, vehicle/booking/payment models

---

## Tech Stack

**Frontend**
- React
- Redux Toolkit (RTK Query) for API state management
- React Router
- React Bootstrap
- React Toastify (notifications)
- React Icons

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Cloudinary (media uploads)
- eSewa / Khalti payment gateway integration

**Fonts**
- Syne (display/headings)
- DM Sans (body text)

---

## Project Structure

> Adjust this to match your actual folder names if they differ.

```
drivex/
├── backend/
│   ├── config/          # DB connection, Cloudinary config
│   ├── controllers/     # Route logic (auth, booking, payment, vehicle, etc.)
│   ├── middleware/      # Auth guard, error handler, upload middleware
│   ├── models/          # Mongoose schemas (User, Vehicle, Booking, Payment)
│   ├── routes/          # Express route definitions
│   ├── utils/           # Helpers (HMAC signing, token generation, etc.)
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── Pages/           # RegisterPage, SigninPage, ProfilePage, VehiclePage, etc.
│   │   ├── Slices/          # RTK Query API slices & auth slice
│   │   ├── components/      # Shared/reusable components
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local install or a MongoDB Atlas cluster)
- A [Cloudinary](https://cloudinary.com/) account (for media uploads)
- eSewa / Khalti merchant credentials (test/sandbox credentials for development)

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/nishanshrestha714/drivex.git
cd drivex
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (see [Environment Variables](#environment-variables) below).

```bash
npm run dev
```

By default the backend should run on `http://localhost:5000` (adjust `PORT` in `.env` if needed).

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` folder if your app reads any frontend-facing environment variables (e.g. API base URL).

```bash
npm run dev
```

By default Vite/CRA should run the frontend on `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA) — adjust based on your setup.

### 4. Running the app

With both servers running:

1. Backend API → `http://localhost:5000`
2. Frontend → `http://localhost:5173`

Open the frontend URL in your browser to use Drivex.

---

## Environment Variables

Create a `.env` file inside `backend/` with the following keys (replace with your actual values):

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# eSewa
ESEWA_MERCHANT_CODE=your_esewa_merchant_code
ESEWA_SECRET_KEY=your_esewa_secret_key
ESEWA_SUCCESS_URL=http://localhost:5000/api/payment/esewa/confirm-payment
ESEWA_FAILURE_URL=http://localhost:5173/payment-failed

# Khalti
KHALTI_SECRET_KEY=your_khalti_secret_key
KHALTI_SUCCESS_URL=http://localhost:5173/payment-success
```

If your frontend calls the backend via a configured base URL, add a `.env` in `frontend/` too:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

>  Never commit your `.env` file. Make sure it's listed in `.gitignore`.

---

## Design System

| Token | Value |
|---|---|
| Coral (primary accent) | `#ff6b4a` |
| Cream (background) | `#fbf7f0` |
| Ink (text) | `#211c16` |
| Display font | Syne (600/700/800) |
| Body font | DM Sans (400–700) |

---

## Roadmap

- [ ] Admin dashboard for managing vehicles and bookings
- [ ] Email/SMS notifications for booking confirmations
- [ ] Reviews and ratings for vehicles
- [ ] Multi-language support (English/Nepali)

---

## License

This project is currently private/unlicensed. Add a license here if you plan to open-source it.