# Nuricheck Project Structure

## Complete Directory Tree

```
nuricheck/
│
├── backend/
│   ├── controllers/
│   │   ├── authController.js          # Authentication logic (register, login, verify OTP)
│   │   ├── profileController.js      # Profile CRUD operations
│   │   └── foodController.js          # Food entry and tracking logic
│   │
│   ├── middleware/
│   │   └── authMiddleware.js          # JWT authentication middleware
│   │
│   ├── models/
│   │   ├── User.js                    # User schema (username, email, phone, password, OTP)
│   │   ├── Profile.js                 # Profile schema (height, weight, diseases, goal)
│   │   └── Food.js                    # Food entry schema (meals, protein consumed)
│   │
│   ├── routes/
│   │   ├── authRoutes.js              # Authentication routes
│   │   ├── profileRoutes.js           # Profile routes (protected)
│   │   └── foodRoutes.js              # Food routes (protected)
│   │
│   ├── utils/
│   │   ├── generateToken.js           # JWT token generation
│   │   ├── generateOTP.js             # 6-digit OTP generation
│   │   ├── calculateProtein.js        # Protein requirement calculation
│   │   ├── proteinDataset.js          # Food protein database and extraction logic
│   │   └── emailService.js            # Nodemailer email service
│   │
│   ├── server.js                      # Express server entry point
│   ├── package.json                   # Backend dependencies
│   └── .env.example                   # Environment variables template
│
├── frontend/
│   ├── public/
│   │   └── index.html                 # HTML template
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js        # Protected route component
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.js         # Authentication context provider
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.js               # Login page
│   │   │   ├── Register.js            # Registration page
│   │   │   ├── OTPVerification.js    # OTP verification page
│   │   │   ├── Profile.js             # Profile creation/editing page
│   │   │   ├── Dashboard.js           # Main dashboard with stats
│   │   │   └── FoodEntry.js           # Food entry form
│   │   │
│   │   ├── utils/
│   │   │   └── api.js                 # Axios instance with interceptors
│   │   │
│   │   ├── App.js                     # Main app component with routing
│   │   ├── index.js                   # React entry point
│   │   └── index.css                  # Global styles with Tailwind
│   │
│   ├── package.json                   # Frontend dependencies
│   ├── tailwind.config.js             # Tailwind CSS configuration
│   ├── postcss.config.js              # PostCSS configuration
│   └── .env.example                   # Frontend environment variables
│
├── README.md                           # Main project documentation
├── API_DOCUMENTATION.md                # Complete API reference
├── INSTALLATION_GUIDE.md               # Step-by-step setup guide
├── PROJECT_STRUCTURE.md                # This file
└── .gitignore                          # Git ignore rules
```

## File Descriptions

### Backend Files

#### Controllers
- **authController.js**: Handles user registration, OTP verification, and login
- **profileController.js**: Manages user profile creation, updates, and retrieval
- **foodController.js**: Handles food entry, protein calculation, and email notifications

#### Models
- **User.js**: User schema with password hashing, OTP storage, and verification status
- **Profile.js**: Profile schema with height, weight, health conditions, goal, and calculated protein requirement
- **Food.js**: Food entry schema with meals and protein consumption tracking

#### Routes
- **authRoutes.js**: Public routes for authentication
- **profileRoutes.js**: Protected routes for profile management
- **foodRoutes.js**: Protected routes for food tracking

#### Utils
- **generateToken.js**: Creates JWT tokens for authenticated users
- **generateOTP.js**: Generates 6-digit OTP for verification
- **calculateProtein.js**: Calculates daily protein requirement based on weight and goal
- **proteinDataset.js**: Contains food database and protein extraction algorithm
- **emailService.js**: Sends HTML email notifications with protein tracking data

### Frontend Files

#### Pages
- **Login.js**: User login form with email and password
- **Register.js**: User registration form
- **OTPVerification.js**: OTP input and verification
- **Profile.js**: Profile creation/editing form
- **Dashboard.js**: Main dashboard displaying protein stats, progress, and meal history
- **FoodEntry.js**: Form for entering daily meals

#### Components
- **PrivateRoute.js**: HOC for protecting routes that require authentication

#### Context
- **AuthContext.js**: Global authentication state management

#### Utils
- **api.js**: Axios instance with authentication headers and error handling

## Data Flow

### Registration Flow
1. User submits registration form → `Register.js`
2. POST to `/api/auth/register` → `authController.register`
3. OTP generated and stored → User redirected to OTP page
4. User enters OTP → `OTPVerification.js`
5. POST to `/api/auth/verify-otp` → `authController.verifyOTP`
6. User verified → Redirect to login

### Login Flow
1. User submits login form → `Login.js`
2. POST to `/api/auth/login` → `authController.login`
3. JWT token returned → Stored in localStorage
4. User redirected to dashboard

### Profile Creation Flow
1. User creates profile → `Profile.js`
2. POST to `/api/profile` → `profileController.createOrUpdateProfile`
3. Protein requirement calculated → Profile saved
4. User redirected to dashboard

### Food Entry Flow
1. User enters meals → `FoodEntry.js`
2. POST to `/api/food` → `foodController.addFood`
3. Protein extracted from food text → Total calculated
4. Email notification sent → Food entry saved
5. User redirected to dashboard

## Key Features by File

### Backend
- **server.js**: Express setup, middleware, routes, error handling
- **authMiddleware.js**: JWT verification, user authentication check
- **proteinDataset.js**: 50+ food items with protein values per 100g
- **emailService.js**: Beautiful HTML email templates

### Frontend
- **App.js**: React Router setup, route definitions
- **Dashboard.js**: Real-time protein tracking, progress visualization
- **FoodEntry.js**: Multi-meal input with protein preview

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRE`: Token expiration time
- `EMAIL_*`: Email service configuration

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API URL

## Dependencies Summary

### Backend
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **nodemailer**: Email service
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

### Frontend
- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **tailwindcss**: CSS framework
- **react-scripts**: Build tools

## Architecture Patterns

1. **MVC Pattern**: Models, Views (Controllers), Routes separation
2. **RESTful API**: Standard HTTP methods and status codes
3. **JWT Authentication**: Stateless authentication
4. **Context API**: Global state management in React
5. **Protected Routes**: Route-level authentication
6. **Middleware Pattern**: Request processing pipeline

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected API routes
- Input validation
- OTP expiration (10 minutes)
- Secure password storage

## Scalability Considerations

- Modular file structure for easy expansion
- Reusable utility functions
- Database indexing on frequently queried fields
- Async email sending (non-blocking)
- Environment-based configuration

---

**This structure follows clean architecture principles and best practices for MERN stack applications.**



