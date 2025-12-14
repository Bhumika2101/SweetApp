# Sweet Shop Management System 🍬

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing a sweet shop. This project demonstrates modern web development practices including RESTful API design, JWT authentication, role-based access control, and responsive UI design.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features

- User registration and authentication with JWT
- Browse sweet collection with images
- Search and filter sweets by name, category, and price
- Purchase sweets with real-time stock updates
- Responsive design for all devices

### Admin Features

- Add new sweets to inventory
- Edit existing sweet details
- Delete sweets from inventory
- Restock inventory
- View inventory statistics
- Admin-only access control

### Technical Features

- RESTful API architecture
- Token-based authentication (JWT)
- Role-based authorization (User/Admin)
- MongoDB database with Mongoose ODM
- Input validation
- Error handling
- Test-Driven Development (TDD)
- Comprehensive test coverage
- Modern, responsive UI
- Toast notifications
- Loading states
- Form validation

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Testing**: Jest, Supertest
- **CORS**: cors

### Frontend

- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Notifications**: React Toastify
- **Styling**: CSS3 (Custom Properties, Flexbox, Grid)

## 📁 Project Structure

```
SweetApp/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   └── sweetController.js    # Sweet CRUD logic
│   ├── middleware/
│   │   └── auth.js               # Auth middleware
│   ├── models/
│   │   ├── User.js               # User model
│   │   └── Sweet.js              # Sweet model
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   └── sweets.js             # Sweet routes
│   ├── tests/
│   │   ├── auth.test.js          # Auth tests
│   │   └── sweet.test.js         # Sweet tests
│   ├── utils/
│   │   └── generateToken.js      # JWT utility
│   ├── .env.example              # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   ├── server.js                 # Entry point
│   └── README.md
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js/css
│   │   │   ├── SweetCard.js/css
│   │   │   └── SearchBar.js/css
│   │   ├── pages/
│   │   │   ├── Home.js/css
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js/css
│   │   │   ├── AdminPanel.js/css
│   │   │   └── Auth.css
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
│
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**

```bash
cd e:\Bhumi\SweetApp
```

2. **Setup Backend**

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/sweetshop
# JWT_SECRET=your_secure_secret_key
# JWT_EXPIRE=7d
```

3. **Setup Frontend**

```bash
cd ../frontend
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed
# REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend will run on http://localhost:5000

**Terminal 2 - Frontend:**

```bash
cd frontend
npm start
```

Frontend will run on http://localhost:3000

### Running Tests

**Backend Tests:**

```bash
cd backend
npm test

# With coverage
npm run test:coverage
```

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Sweet Endpoints

#### Get All Sweets

```http
GET /api/sweets
```

#### Get Single Sweet

```http
GET /api/sweets/:id
```

#### Search Sweets

```http
GET /api/sweets/search?name=chocolate&category=Chocolate&minPrice=0&maxPrice=10
```

#### Create Sweet (Admin Only)

```http
POST /api/sweets
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Chocolate Bar",
  "category": "Chocolate",
  "price": 2.99,
  "quantity": 100,
  "description": "Delicious chocolate",
  "image": "https://example.com/image.jpg"
}
```

#### Update Sweet (Admin Only)

```http
PUT /api/sweets/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 3.99
}
```

#### Delete Sweet (Admin Only)

```http
DELETE /api/sweets/:id
Authorization: Bearer <admin_token>
```

#### Purchase Sweet

```http
POST /api/sweets/:id/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 1
}
```

#### Restock Sweet (Admin Only)

```http
POST /api/sweets/:id/restock
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "quantity": 50
}
```

## 🧪 Testing

The project follows Test-Driven Development (TDD) practices:

- Unit tests for controllers
- Integration tests for API endpoints
- Authentication and authorization tests
- Edge case handling
- High test coverage

Run tests:

```bash
cd backend
npm test
```

## 🎨 Design Philosophy

- **Clean Code**: Following SOLID principles
- **Responsive Design**: Mobile-first approach
- **User Experience**: Intuitive navigation and feedback
- **Performance**: Optimized rendering and API calls
- **Accessibility**: Semantic HTML and keyboard navigation
- **Maintainability**: Modular components and clear separation of concerns

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweetshop
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## � My AI Usage

This project was developed with the assistance of AI tools as part of modern software development practices. Below is a detailed account of how AI was utilized throughout the development process.

### AI Tools Used

| Tool               | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| **GitHub Copilot** | Code autocompletion, boilerplate generation, test case suggestions  |
| **ChatGPT/Claude** | Architecture decisions, debugging assistance, documentation writing |

### How AI Was Used

#### 1. Backend Development

- **Boilerplate Generation**: Used GitHub Copilot to generate initial Express.js server setup, MongoDB connection configuration, and controller function templates.
- **Test Case Generation**: AI assisted in writing comprehensive test cases for authentication and CRUD operations. The TDD approach was followed with AI suggesting edge cases and validation scenarios.

- **Middleware Implementation**: Copilot helped generate JWT verification logic and role-based authorization middleware patterns.

- **Model Schema Design**: AI provided suggestions for Mongoose schema validation patterns, including regex for email validation and enum constraints for categories.

#### 2. Frontend Development

- **Component Boilerplate**: Used AI to generate React component templates, including functional components with hooks.

- **API Service Layer**: AI helped structure the axios-based API service with proper error handling and token attachment.

- **Context API Setup**: Copilot assisted in implementing the AuthContext for global state management.

- **CSS Styling**: AI provided CSS suggestions for responsive layouts and component styling.

#### 3. Testing (TDD Approach)

- **Test Structure**: AI helped establish the test file structure following the Red-Green-Refactor pattern.

- **Edge Cases**: AI suggested numerous edge cases including:

  - Concurrent request handling
  - Input validation (SQL injection, XSS attempts)
  - Boundary conditions (zero quantity, negative prices)
  - Authentication edge cases (expired tokens, malformed headers)

- **Mock Data**: AI generated realistic test data and mock objects.

#### 4. Documentation

- **README Creation**: AI assisted in structuring comprehensive documentation with proper markdown formatting.

- **API Documentation**: Generated API endpoint documentation with request/response examples.

- **Code Comments**: AI helped write meaningful JSDoc comments for functions and modules.

### Reflection on AI Impact

#### Positive Impacts

1. **Increased Productivity**: AI significantly reduced time spent on repetitive boilerplate code, allowing more focus on business logic and architecture decisions.

2. **Better Test Coverage**: AI suggested test cases I might have overlooked, particularly edge cases for security and validation.

3. **Learning Opportunity**: Working with AI suggestions exposed me to best practices and patterns I wasn't previously aware of.

4. **Documentation Quality**: AI helped create more comprehensive and well-structured documentation.

5. **Debugging Efficiency**: When encountering errors, AI provided quick insights into potential causes and solutions.

#### Challenges & Learnings

1. **Code Review Necessity**: Not all AI suggestions were optimal. I learned to critically evaluate each suggestion before accepting it.

2. **Context Understanding**: AI sometimes missed project-specific context, requiring manual adjustments to generated code.

3. **Security Awareness**: I made sure to review all AI-generated code for potential security vulnerabilities.

4. **Maintaining Consistency**: Had to ensure AI-generated code followed project conventions and coding standards.

### AI Co-authorship in Commits

All commits where AI assistance was used include the co-author trailer as per project requirements:

```
Co-authored-by: GitHub Copilot <copilot@github.com>
```

### Transparency Statement

I believe in being transparent about AI usage in software development. AI served as a productivity tool and coding assistant, but all architectural decisions, code reviews, and final implementations were made by me. The AI did not make independent decisions about the project's direction or critical functionality.

---

## 🧪 Test-Driven Development (TDD)

This project strictly follows TDD principles with a clear Red-Green-Refactor pattern visible in the commit history.

### Test Coverage Summary

| Module      | Test File                                 | Coverage                              |
| ----------- | ----------------------------------------- | ------------------------------------- |
| Auth API    | `auth.test.js`, `auth.extended.test.js`   | Registration, Login, Token validation |
| Sweet API   | `sweet.test.js`, `sweet.extended.test.js` | CRUD, Search, Purchase, Restock       |
| User Model  | `user.model.test.js`                      | Schema validation, Password hashing   |
| Sweet Model | `sweet.model.test.js`                     | Schema validation, Constraints        |
| Middleware  | `middleware.auth.test.js`                 | Protection, Authorization             |
| Utilities   | `generateToken.test.js`                   | JWT generation                        |

### Running Tests

```bash
# Run all tests
cd backend
npm test

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- auth.test.js
```

---

## �🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Built with ❤️ as a demonstration of full-stack MERN development skills.

## 🙏 Acknowledgments

- MongoDB for the excellent database
- Express.js team for the web framework
- React team for the UI library
- All open-source contributors

---

**Note**: Remember to change the JWT_SECRET in production and never commit your `.env` file to version control!
