# 🏬 Store Ratings App

A full-stack web application where users can **rate stores**, and administrators can **manage users, stores, and ratings**.  
Built as part of the **FullStack Intern Coding Challenge**.

---

## 🚀 Features

### 🔑 Authentication & Roles
- Single login system with **role-based access control**:
  - **System Administrator**  
    - Manage users and stores.  
    - View dashboards with platform statistics.  
  - **Normal User**  
    - Register, log in, and rate stores.  
    - Search stores and manage their own ratings.  
  - **Store Owner**  
    - Manage their store information.  
    - View ratings submitted by users for their store.

---

### 📊 Admin Dashboard
- Displays **total users, total stores, total ratings, average rating**.  
- Manage:
  - Users (create/update/delete).  
  - Stores (assign to store owners).  
- Apply filters and sorting on all listings.  

**Screenshot:**  
![Admin Dashboard](./screenshots/Screenshot%202025-09-15%20014206.png)

---

### 👤 Normal User
- Register and log in.  
- View/search stores by **name** and **address**.  
- Submit ratings (⭐ 1–5) and comments.  
- Edit/update their submitted ratings.  
- See personal rating history.  

**Login Page**  
![Login](./screenshots/Screenshot%202025-09-15%20014038.png)  

**Signup Page**  
![Signup](./screenshots/Screenshot%202025-09-15%20014018.png)  

**User Dashboard (Explore Stores & Ratings)**  
![User Dashboard](./screenshots/Screenshot%202025-09-14%20212339.png)

---

### 🏪 Store Owner
- Log in to access store dashboard.  
- Manage their **store profile** (name, address).  
- See **all ratings** submitted for their store.  
- View **average rating** and **comments**.  

**Screenshot:**  
![Store Owner Dashboard](./screenshots/Screenshot%202025-09-14%20212249.png)

---

### ✅ Validations
- **Name:** 20–60 characters.  
- **Address:** Max 400 characters.  
- **Password:** 8–16 characters, at least one uppercase and one special character.  
- **Email:** Standard email format.  

---

## 🛠 Tech Stack

### Backend
- **Node.js + Express.js**
- **MySQL / PostgreSQL** (SQL DB)
- Authentication via **JWT**

### Frontend
- **React.js (Vite / CRA)**
- **React Query** for data fetching
- **TailwindCSS + Lucide Icons** for UI
- **React Hot Toast** for notifications

---

## 📂 Project Structure

```bash
store-rating-App/ 
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── stores.js
│   │   ├── ratings.js
│   │   └── admin.js
│   ├── scripts/
│   │   ├── init-database.sql
│   │   └── seed-data.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/ 
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── LoadingSpinner.jsx
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   └── PrivateRoute.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   └── PasswordModal.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── StatsCards.jsx
│   │   │   │   ├── UsersTable.jsx
│   │   │   │   ├── StoresTable.jsx
│   │   │   │   └── AddModal.jsx
│   │   │   ├── user/
│   │   │   │   ├── UserDashboard.jsx
│   │   │   │   ├── StoreCard.jsx
│   │   │   │   ├── StoreList.jsx
│   │   │   │   └── RatingStars.jsx
│   │   │   └── store-owner/
│   │   │       ├── StoreOwnerDashboard.jsx
│   │   │       ├── RatingsTable.jsx
│   │   │       └── StoreStats.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── storeService.js
│   │   │   └── ratingService.js
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── validators.js
│   │   │   └── helpers.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   └── useForm.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
     ── .env
│   ├── .gitignore
│   ├── package.json
└── README.md





📸 Screenshots Overview
Admin Dashboard – Manage users, stores, and see stats.

Login Page – User authentication.

Signup Page – Create a new account with validations.

User Dashboard – Explore and rate stores.

Store Owner Dashboard – Manage store and view ratings.

⚡ Getting Started
Backend
bash
Copy code
cd backend
npm install
npm run dev
Frontend
bash
Copy code
cd frontend
npm install
npm run dev


Run backend tests:

```bash
cd backend
npm test
```

Run frontend tests:

```bash
cd frontend
npm test
```

---

## 📌 To-Do / Improvements

* [ ] Add pagination to tables (users, stores, ratings).
* [ ] Implement password reset via email.
* [ ] Improve admin analytics (charts, trends).

---

## 📄 License

This project is licensed under the MIT License.

This project is built for the FullStack Intern Coding Challenge.

Free to use for educational purposes.## 🧪 Testing

---

## 👨‍💻 Author

* Developed as part of **FullStack Intern Coding Challenge**.
Author: **Vikas Rathod**  
* GitHub: [Vicky9022](https://github.com/Vicky9022)  
* LinkedIn: [Vikas Rathod](www.linkedin.com/in/vikasrathod90) 




