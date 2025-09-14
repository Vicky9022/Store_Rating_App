🏪 Store Ratings App

A full-stack web application where Admins, Store Owners, and Users interact in a store rating system.
Admins manage users and stores, store owners manage their stores & ratings, and users explore and rate stores.

🚀 Features
👩‍💻 Admin Dashboard

View total users, stores, and ratings (auto-updating).

Add, edit, or delete users and stores.

Monitor store performance with live stats.

🏬 Store Owner Dashboard

Manage one store per owner.

View & update store details.

Analyze ratings & customer reviews with statistics.

🙍 User Dashboard

Explore available stores.

Add ratings & reviews.

View personal rating history.

🛠 Tech Stack

Frontend: React, TailwindCSS, React Query, Lucide Icons

Backend: Node.js, Express.js

Database: MongoDB / MySQL (based on your setup)

Authentication: JWT (JSON Web Token)

Other Tools: Axios, React Hot Toast, React Router

⚙️ Installation
1️⃣ Clone repository
git clone https://github.com/your-username/store-ratings-app.git
cd store-ratings-app

2️⃣ Install dependencies

Frontend:

cd client
npm install


Backend:

cd server
npm install

3️⃣ Setup environment variables

Create .env in server/:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

4️⃣ Run the project

Backend:

cd server
npm run dev


Frontend:

cd client
npm start

📸 Screenshots
🔑 Authentication


Login page for users, store owners, and admins.


Register as User or Store Owner.

👩‍💻 Admin Dashboard


Admins can manage users, stores, and monitor live stats.

🏬 Store Owner Dashboard


Store Owners manage their store, edit info, and view reviews.

🙍 User Dashboard


Users can explore stores and leave ratings.

🔮 Future Improvements

Add role-based analytics dashboards.

Support multiple stores per owner.

Export data to CSV & PDF.

Add store images and location map.

📜 License

This project is licensed under the MIT License.