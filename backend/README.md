# Sweet Shop Management System - Backend

Backend API for the Sweet Shop Management System built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Role-based access control (User/Admin)
- RESTful API for sweet management
- Inventory management (purchase/restock)
- Search and filter functionality
- Comprehensive test coverage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Update `.env` with your configuration:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweetshop
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Application

Development mode with auto-reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Running Tests

Run all tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Sweets

- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/:id` - Get single sweet
- `GET /api/sweets/search` - Search sweets (Query params: name, category, minPrice, maxPrice)
- `POST /api/sweets` - Create sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Inventory

- `POST /api/sweets/:id/purchase` - Purchase sweet (Protected)
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   └── sweetController.js # Sweet management logic
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── User.js            # User model
│   └── Sweet.js           # Sweet model
├── routes/
│   ├── auth.js            # Auth routes
│   └── sweets.js          # Sweet routes
├── tests/
│   ├── auth.test.js       # Auth tests
│   └── sweet.test.js      # Sweet tests
├── utils/
│   └── generateToken.js   # JWT token generator
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── server.js              # Application entry point
```

## Testing Strategy

The project follows Test-Driven Development (TDD) principles with:

- Unit tests for controllers
- Integration tests for API endpoints
- Authentication and authorization tests
- Edge case handling

## License

MIT
