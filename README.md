# 🚗 WEX Fuel Economy Fullstack Application

A comprehensive React-based web application for analyzing automotive fuel economy data with interactive visualizations, user authentication, and advanced filtering capabilities.

## 🌟 Features

### 🔐 Authentication System ✅
- User registration and login with form validation
- Session persistence with localStorage
- Protected routes with automatic redirects
- Toggle between login/signup modes

### 📊 Data Visualization ✅
- Interactive D3.js charts and graphs
- MPG trends by year analysis
- Cylinder count vs efficiency comparisons
- Real-time data filtering and sorting

### 🚙 Vehicle Management ✅
- Comprehensive vehicle database browser (Species Gallery equivalent)
- Advanced search and filtering by make, model, origin
- Detailed vehicle specifications view (Detailed Species View equivalent)
- Favorites system with user persistence
- Grid and list view toggles

### 🎨 User Experience ✅
- Responsive design (mobile-first approach)
- Smooth animations with Framer Motion
- Loading states and error boundaries
- Accessibility features (ARIA labels, keyboard navigation)

### Technology Stack
- **Frontend**: React 18+, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query + AuthContext
- **Routing**: React Router v6 with Protected Routes
- **Visualizations**: D3.js for interactive charts
- **Animations**: Framer Motion
- **Backend**: Node.js/Express (deployed on Render)
- **UI Components**: Lucide React icons
- **Backend**: Node.js, Express, CSV Parser

## 🏗️ Architecture Overview

### System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend (React App)"
        A[React App] --> B[React Router]
        A --> C[Redux Store]
        A --> D[Components]
        A --> E[Pages]
        A --> F[Contexts]
        
        subgraph "State Management"
            C --> G[Auth Slice]
            C --> H[Filters Slice]
            C --> I[Favorites Slice]
            C --> J[RTK Query API]
        end
        
        subgraph "UI Layer"
            D --> K[Layout]
            D --> L[ThemeSelector]
            D --> M[Charts/D3]
            E --> N[Dashboard]
            E --> O[Browse]
            E --> P[Login]
            E --> Q[Favorites]
        end
        
        subgraph "Context Providers"
            F --> R[AuthContext]
            F --> S[ThemeContext]
        end
    end
    
    subgraph "Backend (Node.js API)"
        T[Express Server] --> U[Route Handlers]
        T --> V[Middleware]
        T --> W[Data Layer]
        
        U --> X[Cars API]
        U --> Y[Statistics API]
        U --> Z[Visualizations API]
        
        W --> AA[CSV Parser]
        W --> AB[auto-mpg.csv]
    end
    
    subgraph "External Services"
        CC[Vercel/Netlify<br/>Frontend Deploy]
        DD[Render<br/>Backend Deploy]
    end
    
    J -->|HTTP Requests| T
    A -->|Build| CC
    T -->|Deploy| DD
    
    style A fill:#e1f5fe
    style T fill:#fff3e0
    style CC fill:#e8f5e8
    style DD fill:#fce4ec
```

### Component Interaction Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant R as Router
    participant AC as AuthContext
    participant RC as Redux Store
    participant API as RTK Query
    participant B as Backend
    
    Note over U,B: Application Initialization
    U->>A: Loads Application
    A->>AC: Initialize Auth Context
    AC->>AC: Check localStorage for user
    A->>RC: Initialize Redux Store
    A->>R: Setup Router
    
    Note over U,B: User Authentication Flow
    U->>R: Navigate to /login
    R->>A: Route to Login Page
    U->>A: Submit Login Form
    A->>AC: Login User
    AC->>AC: Store user in localStorage
    AC->>R: Redirect to Dashboard
    
    Note over U,B: Data Fetching Flow
    R->>A: Route to Browse Page
    A->>API: Trigger getCars query
    API->>B: GET /api/cars
    B->>B: Parse CSV data
    B->>API: Return cars data
    API->>RC: Cache response
    API->>A: Update component
    A->>U: Render car list
    
    Note over U,B: Filter Interaction
    U->>A: Apply MPG filter
    A->>RC: Dispatch setMpgRange
    RC->>RC: Update filters state
    RC->>API: Invalidate cars cache
    API->>B: GET /api/cars?minMpg=20&maxMpg=40
    B->>API: Return filtered data
    API->>A: Update component
    A->>U: Render filtered results
    
    Note over U,B: Favorites Management
    U->>A: Click Add to Favorites
    A->>RC: Dispatch addFavorite
    RC->>RC: Update favorites state
    RC->>RC: Persist to localStorage
    A->>U: Update UI
    
    Note over U,B: Theme Context Flow
    U->>A: Select theme
    A->>AC: Update theme context
    AC->>AC: Store in localStorage
    AC->>A: Broadcast theme change
    A->>U: Apply new theme styles
```

### Frontend Component Hierarchy

```mermaid
graph TD
    A[App.tsx] --> B[Router]
    A --> C[AuthProvider]
    A --> D[ThemeProvider]
    A --> E[Redux Provider]
    
    B --> F[Layout]
    B --> G[Protected Routes]
    
    F --> H[Navigation]
    F --> I[Main Content]
    F --> J[Footer]
    F --> K[ThemeSelector]
    
    G --> L[Dashboard]
    G --> M[Browse]
    G --> N[CarDetails]
    G --> O[Favorites]
    G --> P[About]
    G --> Q[Login]
    
    M --> R[SearchFilters]
    M --> S[SortControls]
    M --> T[CarGrid]
    M --> U[Pagination]
    
    L --> V[StatisticsCards]
    L --> W[MPGChart]
    L --> X[CylinderChart]
    L --> Y[RecentActivity]
    
    N --> Z[CarSpecs]
    N --> AA[MPGRating]
    N --> BB[RelatedCars]
    
    O --> CC[FavoritesList]
    O --> DD[FavoriteFilters]
    
    style A fill:#ff9999
    style F fill:#99ccff
    style M fill:#99ff99
    style L fill:#ffcc99
    style N fill:#cc99ff
```

### Data Flow Architecture

```mermaid
flowchart LR
    subgraph "Data Sources"
        A[auto-mpg.csv]
    end
    
    subgraph "Backend Layer"
        B[Express Server]
        C[CSV Parser]
        D[Route Handlers]
        E[Data Processing]
    end
    
    subgraph "API Layer"
        F[REST Endpoints]
        G["API/cars"]
        H["API/statistics"]
        I["API/visualizations"]
    end
    
    subgraph "Frontend State"
        J[RTK Query Cache]
        K[Redux Store]
        L[Local Storage]
    end
    
    subgraph "React Components"
        M[Smart Components]
        N[Presentational Components]
        O[Hooks]
    end
    
    subgraph "UI Layer"
        P[Charts/D3]
        Q[Tables/Lists]
        R[Forms]
        S[Navigation]
    end
    
    A --> C
    C --> E
    E --> D
    D --> F
    F --> G
    F --> H
    F --> I
    
    G --> J
    H --> J
    I --> J
    
    J --> K
    K --> L
    
    K --> M
    M --> N
    M --> O
    
    N --> P
    N --> Q
    N --> R
    N --> S
    
    style A fill:#ffe0e0
    style F fill:#e0e0ff
    style K fill:#e0ffe0
    style P fill:#ffe0ff
```

## 📁 Project Structure

```
fuel-economy-app/
├── backend/                 # Node.js Express API
│   ├── server.js           # Main server file
│   ├── auto-mpg.csv        # Dataset
│   └── package.json        # Backend dependencies
├── frontend/               # React TypeScript App
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store & slices
│   │   ├── types/          # TypeScript definitions
│   │   └── App.tsx         # Main app component
│   └── package.json        # Frontend dependencies
└── README.md              # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run dev
```
The API will start on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The app will start on `http://localhost:3000`

## 🎯 API Endpoints

- `GET /` - API information
- `GET /api/cars` - Get cars with filtering/pagination
- `GET /api/cars/:id` - Get single car details
- `GET /api/statistics` - Get dataset statistics
- `GET /api/visualizations/mpg-by-year` - MPG trend data
- `GET /api/visualizations/mpg-by-cylinders` - MPG by cylinders
- `GET /api/health` - Health check

## 🎨 Key Features

### Interactive Dashboard
- **Live Search**: Real-time filtering by car name
- **Advanced Filters**: MPG range, cylinders, origin, year range
- **Dynamic Sorting**: Multiple sort options with visual indicators
- **Pagination**: Efficient data loading with page controls

### Data Visualizations
- **MPG Trend Chart**: Line chart showing fuel economy over years
- **Cylinder Analysis**: Bar chart of MPG by cylinder count
- **Origin Distribution**: Pie chart of cars by country
- **Weight vs MPG Scatter**: D3-powered interactive scatter plot

### Favorites System
- **Persistent Storage**: localStorage-based favorites
- **Multiple Types**: Save cars, searches, and visualizations
- **Category Tabs**: Organized view by favorite type
- **Quick Actions**: Add/remove with toast notifications

### Car Details Page
- **Creative Interactions**: Mouse-responsive background animations
- **Comprehensive Specs**: Performance metrics and efficiency analysis
- **Visual Design**: Modern card-based layout with icons
- **Favorite Integration**: Add/remove from favorites

## 🎭 Creative Elements

### Mouse Interactions
- **Car Details Page**: Dynamic background shapes that follow mouse movement
- **Hover Effects**: Smooth animations on cards and buttons
- **Loading States**: Animated spinners and skeleton screens

### Visual Design
- **Color System**: Consistent color palette with semantic meanings
- **Typography**: Hierarchical text styling with proper contrast
- **Spacing**: Systematic spacing using Tailwind's scale
- **Responsive**: Mobile-first design with breakpoint optimizations

## 📊 Data Processing

The application processes automotive fuel economy data including:
- **Performance Metrics**: MPG, horsepower, acceleration
- **Engine Specs**: Cylinders, displacement
- **Vehicle Info**: Weight, model year, country of origin
- **Calculated Fields**: Power-to-weight ratio, efficiency ratings

## 🔧 Development Decisions

### State Management
- **Redux Toolkit**: Simplified Redux with RTK Query for API calls
- **Local State**: React hooks for component-specific state
- **Persistence**: localStorage for favorites with error handling

### Type Safety
- **TypeScript**: Complete type coverage for better DX
- **API Types**: Strongly typed API responses and requests
- **Component Props**: Typed component interfaces

### Performance
- **Code Splitting**: Route-based code splitting
- **Memoization**: Strategic use of React.memo and useMemo
- **API Caching**: RTK Query automatic caching and invalidation

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build folder
```

### Backend (Render/Fly.io)
```bash
# Backend ready for deployment
# Environment variables: PORT (default: 5000)
```

## 📝 Development Notes

This project demonstrates:
- Modern React patterns with hooks and functional components
- Advanced TypeScript usage with proper type definitions
- Complex state management with Redux Toolkit
- Data visualization best practices
- Responsive design principles
- API design and documentation
- Performance optimization techniques
- User experience considerations

## 🤝 Contributing

This is a take-home coding challenge project. For questions or feedback, please reach out to the development team.

## 📄 License

This project is for demonstration purposes as part of a coding challenge.
