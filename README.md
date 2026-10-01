# ExpenseWise

**ExpenseWise** is a full-stack personal finance management application designed to help users track, organize, and understand their income and expenses in one place.

The application provides a simple dashboard for monitoring financial activity, managing transactions, viewing spending patterns, and maintaining better control over personal finances.

> **Project Status:** In Development

---

## ✨ Features

### 🔐 Authentication

* User registration and login
* Secure authentication
* Protected user-specific data
* Logout functionality
* Current-user/session management
* Password management

### 💰 Income & Expense Management

* Add income transactions
* Add expense transactions
* Edit existing transactions
* Delete transactions
* Categorize transactions
* Add transaction descriptions/notes
* Track transaction dates
* View transaction history

### 📊 Financial Dashboard

* Total income overview
* Total expenses overview
* Current balance
* Recent transactions
* Spending summaries
* Financial activity at a glance

### 📈 Reports & Analytics

* Expense breakdown by category
* Income and expense comparisons
* Spending trends
* Date-based filtering
* Visual financial insights

### 🏷️ Categories

* Organize transactions into categories
* Support different income and expense categories
* Filter transactions by category

### 🔎 Transaction Management

* Search transactions
* Filter by type
* Filter by category
* Filter by date
* Sort transaction history

### 🌓 User Experience

* Responsive design
* Desktop and mobile support
* Light and dark themes
* Clean and accessible interface
* User-friendly navigation

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Lucide React
* React Router
* Charting/visualization libraries where required

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* REST API

### Development Tools

* Git
* GitHub
* VS Code
* Postman
* MongoDB Compass

---

## 📁 Project Structure

The project is separated into frontend and backend applications to keep the codebase organized and maintainable.

```text
ExpenseWise/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

> The exact folder names may vary slightly depending on the current implementation.

---

## 🧩 Application Architecture

ExpenseWise follows a client-server architecture:

```text
┌──────────────────────────┐
│        User / Browser    │
└────────────┬─────────────┘
             │
             │ HTTP / REST API
             ▼
┌──────────────────────────┐
│      React Frontend      │
│     TypeScript + Vite    │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Express Backend     │
│        Node.js           │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│        MongoDB           │
│        Database          │
└──────────────────────────┘
```

Authentication protects user-specific resources, while the backend handles business logic and communication with MongoDB.

---

## 🗄️ Core Data Models

### User

Typical user information includes:

```text
User
├── name
├── email
├── password
├── createdAt
└── updatedAt
```

Passwords should never be stored as plain text.

### Transaction

A transaction represents either income or an expense.

```text
Transaction
├── user
├── type
├── amount
├── category
├── description
├── date
├── createdAt
└── updatedAt
```

The `type` distinguishes between:

```text
income
expense
```

---

## 🔌 API Overview

The backend exposes RESTful endpoints for authentication and financial data.

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/change-password
```

### Transactions

Example endpoints:

```http
GET    /api/transactions
GET    /api/transactions/:id
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

### Dashboard / Analytics

Example endpoints:

```http
GET /api/dashboard
GET /api/analytics
```

> Endpoint names should be updated if the implemented backend uses different routes.

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
```

For the frontend, create a `.env` file if your application requires an API base URL:

```env
VITE_API_URL=http://localhost:5000/api
```

### Important

Do not commit `.env` files or secrets to GitHub.

Make sure `.gitignore` contains:

```gitignore
.env
.env.*
!.env.example
node_modules/
dist/
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/expensewise.git
```

```bash
cd expensewise
```

---

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

---

### 4. Configure Environment Variables

Create the required `.env` files.

Example:

```env
MONGODB_URI=mongodb://localhost:27017/expensewise
JWT_SECRET=your_secret_key
PORT=5000
```

For MongoDB Atlas, use your Atlas connection string instead.

---

### 5. Start the Backend

```bash
cd backend
npm run dev
```

The API should be available at:

```text
http://localhost:5000
```

---

### 6. Start the Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🧪 Testing

The backend API can be tested using tools such as **Postman**.

Recommended testing flow:

```text
1. Register user
       ↓
2. Login
       ↓
3. Receive authentication/session
       ↓
4. Create transaction
       ↓
5. Retrieve transactions
       ↓
6. Update transaction
       ↓
7. Delete transaction
       ↓
8. Check dashboard/analytics
```

Frontend testing should also cover:

* Registration
* Login/logout
* Protected routes
* Adding transactions
* Editing transactions
* Deleting transactions
* Filtering/searching
* Dashboard calculations
* Theme switching
* Responsive layouts
* API error handling
* Empty states
* Loading states

---

## 🔒 Security Considerations

ExpenseWise is designed with basic application security principles in mind.

* Passwords should be hashed before storage.
* Authentication should use secure tokens/sessions.
* Protected API routes should verify authentication.
* Users should only access their own financial data.
* Environment variables should contain secrets.
* Sensitive credentials should never be committed to Git.
* API input should be validated.
* Proper HTTP status codes should be returned.
* Production deployments should use HTTPS.

---

## 📱 Responsive Design

ExpenseWise is designed to work across different screen sizes:

```text
Desktop
   │
   ├── Dashboard
   ├── Transactions
   ├── Analytics
   └── Settings

Tablet
   │
   └── Responsive layout

Mobile
   │
   ├── Mobile navigation
   ├── Dashboard
   ├── Transactions
   └── Financial summaries
```

---

## 🎯 Project Goals

ExpenseWise was created to solve a simple problem:

> **Make personal financial tracking easier, clearer, and more organized.**

Instead of maintaining financial records manually in notebooks or spreadsheets, users can manage their financial activity through a centralized web application.

The project also serves as a practical full-stack development project covering:

* React development
* TypeScript
* REST API development
* Node.js and Express
* MongoDB database design
* Authentication
* API integration
* Responsive UI development
* State management
* Error handling
* Deployment

---

## 🔮 Future Improvements

Potential future features include:

* Monthly budgets
* Budget alerts
* Recurring transactions
* Savings goals
* Financial reminders
* Export transactions to CSV/PDF
* Advanced reports
* Monthly/yearly financial summaries
* Custom categories
* Multiple currencies
* Backup and restore
* Email notifications
* More advanced analytics
* Progressive Web App support

---

## 📸 Screenshots

Add screenshots of the application here once the UI is finalized.

Example:

```text
docs/
└── screenshots/
    ├── dashboard.png
    ├── transactions.png
    ├── analytics.png
    ├── login.png
    └── mobile.png
```

Then reference them:

```markdown
![Dashboard](docs/screenshots/dashboard.png)
```

---

## 🧑‍💻 Development

### Build Frontend

```bash
cd frontend
npm run build
```

### Build Backend

```bash
cd backend
npm run build
```

### Production

Before deploying:

1. Configure production environment variables.
2. Use a production MongoDB database.
3. Configure CORS correctly.
4. Use HTTPS.
5. Never expose secrets in frontend code.
6. Build and test both applications.
7. Verify authentication and authorization.
8. Test the production API connection.

---

## 🤝 Contributing

Contributions are welcome.

To contribute:

```bash
git clone https://github.com/your-username/expensewise.git
```

Create a new branch:

```bash
git checkout -b feature/your-feature
```

Make your changes and commit them:

```bash
git add .
git commit -m "feat: add your feature"
```

Push the branch:

```bash
git push origin feature/your-feature
```

Then open a pull request.

---

## 📄 License

This project is currently intended as a personal/educational project.

If you plan to distribute or commercialize it, add an appropriate open-source or proprietary license.

---

## 👨‍💻 Author

**Nischal Joshi**

BSc CSIT Student | Aspiring Full-Stack Developer

* GitHub: `https://github.com/nischalcode`
* LinkedIn: `https://www.linkedin.com/in/nischaljoshi-dev/`
* Email: `joshinischal110@gmail.com`

---

## ⭐ Project

If you find ExpenseWise useful or interesting, consider giving the repository a ⭐ on GitHub.

**ExpenseWise — Track your money. Understand your spending. Take control of your finances.**
