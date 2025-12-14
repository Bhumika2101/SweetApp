# Sweet Shop Management System - Frontend

Modern, responsive React frontend for the Sweet Shop Management System.

## Features

- User authentication (Login/Register)
- Browse and search sweets
- Filter by category and price
- Purchase sweets with real-time stock updates
- Admin panel for inventory management
- Responsive design for all devices
- Beautiful, modern UI with animations

## Tech Stack

- React 18
- React Router v6
- Axios for API calls
- React Icons
- React Toastify for notifications
- CSS3 with custom properties

## Prerequisites

- Node.js (v14 or higher)
- Backend API running on port 5000

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Update `.env` if needed:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

Development mode:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js/css          # Navigation component
│   │   ├── SweetCard.js/css       # Sweet item card
│   │   └── SearchBar.js/css       # Search and filter component
│   ├── pages/
│   │   ├── Home.js/css            # Landing page
│   │   ├── Login.js               # Login page
│   │   ├── Register.js            # Registration page
│   │   ├── Dashboard.js/css       # User dashboard
│   │   ├── AdminPanel.js/css      # Admin management panel
│   │   └── Auth.css               # Shared auth styles
│   ├── context/
│   │   └── AuthContext.js         # Authentication context
│   ├── services/
│   │   └── api.js                 # API service layer
│   ├── App.js                     # Main app component
│   ├── index.js                   # Entry point
│   └── index.css                  # Global styles
├── package.json
└── README.md
```

## Features Breakdown

### User Features

- **Registration & Login**: Secure authentication with JWT
- **Browse Sweets**: View all available sweets with images
- **Search & Filter**: Find sweets by name, category, and price range
- **Purchase**: Buy sweets with real-time stock updates
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Admin Features

- **Add Sweets**: Create new sweet products
- **Edit Sweets**: Update existing sweet information
- **Delete Sweets**: Remove sweets from inventory
- **Restock**: Add inventory to existing sweets
- **Dashboard Stats**: View inventory statistics at a glance

## Design Features

- Modern gradient backgrounds
- Smooth animations and transitions
- Card-based layouts
- Hover effects
- Custom scrollbars
- Toast notifications
- Modal dialogs
- Loading states
- Responsive grid layouts

## API Integration

The frontend communicates with the backend API using Axios. All API calls are centralized in the `services/api.js` file for easy maintenance.

### Authentication Flow

1. User logs in/registers
2. JWT token is stored in localStorage
3. Token is attached to all authenticated requests
4. Token is validated on protected routes

### Protected Routes

- `/dashboard` - Requires authentication
- `/admin` - Requires admin role

## Styling

The project uses vanilla CSS with:

- CSS Custom Properties (CSS Variables)
- Flexbox and Grid layouts
- Media queries for responsiveness
- Animations and transitions
- Modular CSS files (component-specific)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
