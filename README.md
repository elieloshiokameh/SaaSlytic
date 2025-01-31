# SaaSlytic

## 🚀 Overview

This project is a micro-SaaS application that integrates with the Shopify API to generate sales reports and send automated email reports to merchants. Users can also manage their subscription using Stripe.

## 📁 Project Structure

```shopify-sales-reports/
│── backend/                  # Backend (Express.js + Node.js)
│   ├── controllers/          # API Controllers
│   │   ├── shopifyController.js  # Shopify API logic
│   │   ├── emailController.js    # Email sending logic
│   │   ├── subscriptionController.js  # Stripe subscriptions
│   ├── models/               # Database models (MongoDB/PostgreSQL)
│   ├── routes/               # Express.js routes
│   ├── config/               # Configurations (DB, API Keys)
│   ├── server.js             # Main backend server
│── frontend/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Pages (Dashboard, Reports, Subscription)
│   │   ├── services/         # API request handlers
│   │   ├── App.js            # Main React App
│   │   ├── index.js          # React entry point
│   ├── vite.config.js        # Vite Configuration
│── .env                      # Environment Variables
│── package.json              # Project Dependencies
│── README.md                 # Documentation
```
## 🎯 Features

🔐 Shopify Authentication: OAuth integration for accessing store data.

📊 Sales Data Reports: Fetch sales and order data via Shopify API.

📧 Automated Email Reports: Sends sales reports via SendGrid.

💳 Subscription Management: Handles payments with Stripe.

📈 Dashboard UI: Frontend with charts and reports.

🚀 Deployment Ready: Can be hosted on Vercel & Render.

## ⚡ Installation & Setup

### 1️⃣ Clone the Repository

* git clone https://github.com/elieloshiokmaeh/shopify-sales-reports.git 
* cd shopify-sales-reports

### 2️⃣ Install Dependencies

* cd backend
* npm install
* cd ../frontend
* npm install

### 3️⃣ Setup Environment Variables

* Create a .env file in backend/:

* SHOPIFY_API_KEY=your-shopify-api-key
* SHOPIFY_SECRET_KEY=your-shopify-secret
* REDIRECT_URI=http://localhost:5000/api/shopify/auth
* SENDGRID_API_KEY=your-sendgrid-api-key
* STRIPE_SECRET_KEY=your-stripe-secret-key
* DATABASE_URL=your-database-url

### 4️⃣ Start Backend

* cd backend
* npm start

### 5️⃣ Start Frontend

* cd frontend
* npm run dev

## 🚀 API Endpoints

  Shopify API

  GET /api/shopify/auth → Redirects to Shopify OAuth login

  GET /api/shopify/sales-data → Fetches sales data

  Email Reports API

POST /api/email/send-report → Sends sales report via email

Stripe Subscription API

POST /api/subscription/create-checkout-session → Creates Stripe checkout session

GET /api/subscription/status → Checks user subscription status

## 📚 Technologies Used

Frontend: React, Vite, Tailwind CSS

Backend: Node.js, Express.js

Database: PostgreSQL / MongoDB (Supabase or Render DB)

Authentication: Shopify OAuth

Email Service: SendGrid

Payments: Stripe

Hosting: Vercel (Frontend), Render (Backend & Database)

## 🌍 Deployment

Frontend: Deploy on Vercel (vercel deploy)

Backend: Deploy on Render (git push render main)

Database: Use Supabase/PostgreSQL on Render

## 🛠 Next Steps

✅ Add CSV Export for sales data

✅ Add Graph Reports using Chart.js

✅ Improve UI & UX

## 🎯 Contributing

Fork the repository 🍴

Create a feature branch (git checkout -b feature-name)

Commit your changes (git commit -m 'Added feature')

Push to the branch (git push origin feature-name)

Open a Pull Request 🚀

## 📞 Support

For issues, create a GitHub Issue or reach out via eliel.oshiokameh@gmail.com.

## 🚀 Let's build this Shopify micro-SaaS together! 🚀

