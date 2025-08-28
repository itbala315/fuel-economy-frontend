# 🚗 WEX Fuel Economy Frontend

React-based frontend application for analyzing automotive fuel economy data with authentication, interactive visualizations, and advanced filtering.

## 🌟 Features

- ✅ **Authentication System** - Login/Register with form validation and session persistence
- ✅ **5+ Routes** - Home, Dashboard, Browse, Car Details, Visualizations, Favorites, About  
- ✅ **Vehicle Gallery** (Species Gallery equivalent) - Browse with filtering and search
- ✅ **Detailed Views** (Detailed Species View equivalent) - Comprehensive car specifications
- ✅ **Interactive D3.js Visualizations** - Charts and data analytics
- ✅ **User Persistence** - Favorites and session management with localStorage
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS

## 🛠 Tech Stack

- **React 18** with TypeScript
- **React Router v6** with Protected Routes
- **Redux Toolkit** + AuthContext for state management
- **Tailwind CSS** for styling
- **D3.js** for data visualizations
- **Framer Motion** for animations
- **Lucide React** for icons

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server (opens http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🌐 Backend API

Connected to: `https://fuel-economy-backend.onrender.com/api`

## 📊 Application Routes

- **`/`** - Home dashboard with welcome and statistics
- **`/dashboard`** - Main analytics dashboard  
- **`/browse`** - Vehicle gallery with advanced filtering
- **`/car/:id`** - Detailed vehicle specifications
- **`/visualizations`** - Interactive D3.js charts
- **`/favorites`** - User's saved vehicles
- **`/about`** - Application information
- **`/login`** - Authentication (login/register)

## 🔐 Authentication Flow

1. **Login/Register** - Toggle between modes with form validation
2. **Session Persistence** - User stays logged in across browser sessions
3. **Protected Routes** - Automatic redirects for unauthorized access
4. **User Context** - Global authentication state management

## 📱 Deployment

### Render Static Site Deployment

1. Connect this GitHub repository to Render
2. **Build Command**: `npm install && npm run build`
3. **Publish Directory**: `build`

---

**WEX Coding Challenge Implementation** - Complete React SPA with authentication, 5+ routes, interactive dashboard, and data visualizations.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
