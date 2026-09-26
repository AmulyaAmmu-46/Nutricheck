# NutriCheck: A Cloud-Native Food-Based Nutrition Assessment System

A production-ready, cloud-native nutrition tracking and recommendation platform built around the existing NutriCheck MERN application. The project preserves the current working app while adding deployment-ready Docker, CI/CD, Azure Container Registry, and Kubernetes architecture.

## 🎯 Aim
The aim of NutriCheck is to help users record the foods and quantities they consume, estimate their daily nutrition, compare it with personalized guidance, and discover suitable foods for nutrients that may be low.

## ✅ Objectives
- Allow users to create accounts and manage their personal health profiles.
- Calculate estimated calorie, macro, micronutrient, and water requirements from profile information.
- Let users select foods, quantities, units, and meal types instead of manually entering nutrient values.
- Compare daily intake with recommended values using Low, Adequate, and High statuses.
- Provide deficiency-based food recommendations and downloadable professional reports.
- Preserve legacy free-text meal logging and protein tracking.

## ⚠️ Problem Statement
Many people find it difficult to track their daily food intake and protein consumption manually. This often leads to poor dietary habits, inconsistent nutrition planning, and a lack of awareness about whether their needs are being met. A simple digital solution is needed to make nutrition tracking more accurate, efficient, and accessible.

## 🔧 Methodology
The project follows a modular approach that combines user profile management, structured food logging, a maintainable food database, nutrient calculation, personalized comparison, recommendations, and reporting. Legacy free-text meals remain supported while structured entries provide the complete assessment.

### Methodology Procedure
1. Collect profile information such as age, gender, height, weight, activity level, health conditions, and goal.
2. Calculate approximate daily energy, macro, micronutrient, and water requirements.
3. Let the user select a food, quantity, unit, and meal type, with optional water intake.
4. Calculate daily calories, protein, carbohydrates, fats, fiber, vitamins, minerals, and food water contribution.
5. Compare intake with requirements and classify each nutrient as Low, Adequate, or High.
6. Generate recommendations for nutrients identified as low.
7. Store the daily food data and assessment in MongoDB.
8. Display the result on the dashboard and generate an organized PDF report.

## 💻 Technologies
The application is built using the following technologies:
- Node.js and Express.js for backend development
- MongoDB and Mongoose for database management
- React.js for the frontend interface
- Tailwind CSS for modern UI styling
- PDFKit for professional PDF report generation
- JWT for authentication and Axios for API communication
- Nodemailer for email notifications

## 📝 Conclusion
NutriCheck offers a practical solution for personal nutrition management. By combining food-based calculation, personalized comparison, recommendations, and reporting, it helps users make more informed everyday nutrition choices.

## ☁️ Cloud-Native Deployment Goal
This project keeps the working React + Express + MongoDB application and adds a clean deployment path for Dockerized local development, Jenkins automation, Azure Container Registry publishing, and Kubernetes-based cloud hosting.

### Docker Compose

The root `docker-compose.yml` runs MongoDB, the backend, and the React/Nginx frontend. The backend is exposed on port `5001` and the frontend on port `3000`.

```bash
docker compose up --build
```

Open `http://localhost:3000`. The backend health endpoints are `http://localhost:5001/health` and `http://localhost:5001/api/health`.

### CI/CD and Azure

The deployment path is:

```text
GitHub -> Jenkins -> Docker build/test -> Azure Container Registry -> Kubernetes -> Azure
```

The root `Jenkinsfile`, `Dockerfile`, `docker-compose.yml`, and `k8s/` manifests support the planned workflow. See [DOCKER.md](DOCKER.md), [DOCKER_VALIDATION.md](DOCKER_VALIDATION.md), [DEPLOYMENT_FLOW.md](DEPLOYMENT_FLOW.md), and [JENKINS_CICD.md](JENKINS_CICD.md) for environment-specific commands, registry credentials, secrets, health checks, and rollout guidance. Nutrition code is contained within the existing backend and frontend images, so no additional deployment service or database is required.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Application Flow](#application-flow)
- [Database Schema](#database-schema)
- [Nutrition Assessment Rules](#nutrition-assessment-rules)
- [Testing the Application](#testing-the-application)
- [Docker and DevOps](#cloud-native-deployment-goal)

## ✨ Features

- **User Authentication**: JWT-based authentication with mandatory camera face recognition
- **Profile Management**: Create and manage user profiles with health information
- **Food-Based Assessment**: Select foods, quantities, units, and meal types.
- **Nutrition Database**: Extensible structured database for common Indian and everyday foods.
- **Nutrition Calculation**: Calories, protein, carbohydrates, fats, fiber, vitamins, minerals, and water.
- **Personalized Requirements**: Uses age, gender, height, weight, activity level, and goal.
- **Nutrition Comparison**: Low, Adequate, and High status for each tracked nutrient.
- **Recommendations**: Suggests foods for low protein, fiber, vitamin C, calcium, iron, and water.
- **Professional Reports**: Fixed two-page PDF with overview, comparison, meals, micronutrients, and recommendations.
- **Legacy Protein Tracking**: Existing protein calculation and free-text meal fields remain available.
- **Email Notifications**: Automated email notifications with protein tracking summary
- **Modern UI**: Responsive design with Tailwind CSS
- **Clean Architecture**: MVC pattern with proper separation of concerns

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email notifications

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

## 📁 Project Structure

```
nuricheck/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   └── foodController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Profile.js
│   │   └── Food.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   └── foodRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── generateOTP.js
│   │   ├── calculateProtein.js
│   │   ├── proteinDataset.js
│   │   ├── nutritionDataset.js
│   │   ├── nutritionEngine.js
│   │   ├── pdfService.js
│   │   └── emailService.js
│   ├── tests/
│   │   ├── health.test.js
│   │   └── nutrition.test.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   ├── Dashboard.js
│   │   │   └── FoodEntry.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd nuricheck
```

### Step 2: Backend Setup

```bash
cd backend
npm install
```

### Step 3: Frontend Setup

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```bash
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nutricheck
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=nuricheck@example.com
```

**Note**: For Gmail, you need to generate an App Password:
1. Go to Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password
4. Use that password in `EMAIL_PASS`

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
REACT_APP_API_URL=http://localhost:5000
```

## 🏃 Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
mongod
```

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "username": "john_doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Registration successful. Please verify OTP.",
  "data": {
    "userId": "...",
    "otp": "123456",
    "email": "john@example.com"
  }
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "OTP verified successfully. You can now login."
}
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "...",
      "username": "john_doe",
      "email": "john@example.com",
      "phone": "1234567890"
    }
  }
}
```

### Profile Endpoints (Protected)

#### Create/Update Profile
```
POST /api/profile
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "age": 30,
  "gender": "Female",
  "height": 175,
  "weight": 70,
  "activityLevel": "Moderate",
  "diseases": ["BP", "Diabetes"],
  "goal": "Bulking"
}

Response:
{
  "success": true,
  "message": "Profile saved successfully",
  "data": {
    "profile": {
      "age": 30,
      "gender": "Female",
      "height": 175,
      "weight": 70,
      "activityLevel": "Moderate",
      "diseases": ["BP", "Diabetes"],
      "goal": "Bulking",
      "proteinRequirement": 140
    }
  }
}
```

#### Get Profile
```
GET /api/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "profile": {
      "age": 30,
      "gender": "Female",
      "height": 175,
      "weight": 70,
      "activityLevel": "Moderate",
      "diseases": ["BP", "Diabetes"],
      "goal": "Bulking",
      "proteinRequirement": 140
    }
  }
}
```

### Food Endpoints (Protected)

#### Add/Update Today's Food
```
POST /api/food
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "date": "2026-08-25",
  "foodItems": [
    { "foodName": "banana", "quantity": 1, "unit": "pieces", "mealType": "Breakfast" },
    { "foodName": "rice", "quantity": 200, "unit": "grams", "mealType": "Lunch" },
    { "foodName": "dal", "quantity": 100, "unit": "grams", "mealType": "Lunch" },
    { "foodName": "spinach", "quantity": 100, "unit": "grams", "mealType": "Dinner" }
  ],
  "waterIntakeLitres": 2,
  "breakfast": "",
  "lunch": "",
  "dinner": "",
  "snacks": ""
}

Response:
{
  "success": true,
  "message": "Food entry saved successfully.",
  "data": {
    "food": {
      "breakfast": "",
      "lunch": "",
      "dinner": "",
      "snacks": "",
      "proteinConsumed": 6.5,
      "foodItems": [
        { "foodName": "banana", "quantity": 1, "unit": "pieces", "mealType": "Breakfast" }
      ],
      "waterIntakeLitres": 2,
      "dailyNutrition": { "calories": 349, "protein": 6.5, "carbohydrates": 79, "fats": 0.9, "fiber": 3.4, "water": 2000, "vitamins": { "A": 3, "C": 8.7, "D": 0, "B12": 0 }, "minerals": { "calcium": 25, "iron": 0.7, "magnesium": 51, "potassium": 428 }
    },
    "proteinTracking": {
      "requiredProtein": 140,
      "consumedProtein": 6.5,
      "remainingProtein": 133.5
    },
    "requirements": { "calories": 2200, "protein": 140, "carbohydrates": 275, "fats": 73, "fiber": 31, "water": 2.5 },
    "comparison": {
      "calories": { "intake": 349, "recommended": 2200, "status": "Low" },
      "protein": { "intake": 6.5, "recommended": 140, "status": "Low" }
    },
    "recommendations": ["Oats", "Beans"]
  }
}
```

#### Get Today's Food
```
GET /api/food/today
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "food": { "foodItems": [], "waterIntakeLitres": 0, "proteinConsumed": 0 },
    "proteinTracking": {
      "requiredProtein": 140,
      "consumedProtein": 0,
      "remainingProtein": 140
    },
    "nutritionAssessment": { "carbohydrates": 0, "fiber": 0, "water": 0 },
    "dailyNutrition": { "calories": 0, "protein": 0, "carbohydrates": 0, "fats": 0, "fiber": 0, "water": 0 },
    "requirements": { "calories": 2200, "protein": 140, "carbohydrates": 275, "fats": 73, "fiber": 31, "water": 2.5 },
    "comparison": { "calories": { "intake": 0, "recommended": 2200, "status": "Low" } },
    "recommendations": ["Eggs", "Dal", "Paneer"]
  }
}
```

#### Get Food Database
```
GET /api/food/database
Authorization: Bearer <token>
```

Returns the structured food catalog and per-100g nutrient values used by the calculator. The endpoint is protected because it is part of the authenticated application flow.

#### Download Daily Report
```
GET /api/food/report?date=2026-08-25
Authorization: Bearer <token>
```

Returns a fixed two-page PDF containing the daily overview, nutrient comparison, meal details, vitamins, minerals, and recommended foods.

#### Get Meal History
```
GET /api/food/history?limit=7
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "history": [
      {
        "breakfast": "...",
        "lunch": "...",
        "dinner": "...",
        "snacks": "...",
        "proteinConsumed": 125.5,
        "date": "2024-01-15T00:00:00.000Z"
      }
    ]
  }
}
```

## 🔄 Application Flow

1. **Registration**: User registers with username, email, phone, and password
2. **OTP Verification**: System generates 6-digit OTP (displayed in UI for demo)
3. **Login**: User logs in with email and password
4. **Profile Creation**: User creates a profile with age, gender, height, weight, activity level, health conditions, and goal
5. **Personalized Requirements**: System estimates calories, protein, carbohydrates, fats, fiber, water, vitamins, and minerals
   - Bulking: weight × 2
   - Leaning: weight × 1.6
   - Maintaining Health: weight × 1
6. **Food Entry**: User selects food, quantity, unit, and meal type, or uses legacy free-text meal fields
7. **Nutrition Calculation**: The engine calculates daily calories, macronutrients, micronutrients, and water contribution
8. **Assessment**: Intake is compared with estimated requirements as Low, Adequate, or High
9. **Recommendations**: Low nutrients produce suggested food choices
10. **Report**: The dashboard and fixed two-page PDF show the complete assessment
11. **Email Notification**: Existing protein tracking email functionality remains available

## 🗄️ Database Schema

### User
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  phone: String (required, unique),
  password: String (required, hashed),
  otp: String,
  otpExpiry: Date,
  isVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Profile
```javascript
{
  userId: ObjectId (ref: User, required, unique),
  age: Number (optional, 13-120),
  gender: String (optional, Male, Female, Other),
  height: Number (required, 50-300),
  weight: Number (required, 20-500),
  activityLevel: String (Sedentary, Light, Moderate, Active),
  diseases: [String] (enum: BP, Diabetes, PCOD, Kidney Disease, Heart Disease),
  goal: String (required, enum: Bulking, Leaning, Maintaining Health),
  proteinRequirement: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Food
```javascript
{
  userId: ObjectId (ref: User, required),
  date: Date (required),
  breakfast: String,
  lunch: String,
  dinner: String,
  snacks: String,
  foodItems: [{
    foodName: String,
    quantity: Number,
    unit: String (grams, ml, pieces, cups, kg, liters),
    mealType: String (Breakfast, Lunch, Dinner, Snacks)
  }],
  waterIntakeLitres: Number,
  proteinConsumed: Number (default: 0),
  nutritionConsumed: Object,
  dailyNutrition: {
    calories: Number,
    protein: Number,
    carbohydrates: Number,
    fats: Number,
    fiber: Number,
    water: Number,
    vitamins: Object,
    minerals: Object
  },
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing the Application

### Automated Tests

Run the backend regression and health tests:

```bash
cd backend
npm test
```

The frontend production build can be verified with:

```bash
cd frontend
npm run build
```

The nutrition tests cover structured quantity conversion, daily nutrient totals, requirement comparison, and recommendations.

### Test Registration Flow

1. Navigate to `http://localhost:3000/register`
2. Fill in registration form
3. Note the OTP displayed in the response
4. Go to OTP verification page
5. Enter the OTP
6. Login with credentials

### Test Food Entry

1. Create or update a profile after login.
2. Add age, gender, activity level, height, weight, and goal for better estimates.
3. Open the Food Entry page and add structured rows such as `Rice | 200 | grams | Lunch`.
4. Add water intake in litres.
5. Save meals and review the nutrition assessment on the dashboard.
6. Use the comparison table and recommended foods to identify areas to improve.
7. Download the two-page PDF report when needed.

## 📝 Food and Nutrient Database

The structured database is maintained in `backend/utils/nutritionEngine.js`. It includes rice, chapati, oats, potato, bread, fruits, vegetables, dal/lentils, chickpeas, soybean, egg, chicken, fish, milk, curd, paneer, nuts, and seeds.

Values are approximate per 100g. Units such as pieces, cups, kilograms, and litres are converted to an estimated gram equivalent before calculation. The older protein parser remains in `backend/utils/proteinDataset.js` for backwards-compatible free-text meals.

## 📊 Nutrition Assessment Rules

The engine estimates requirements using a Mifflin-St Jeor-style calorie baseline and activity multiplier. Protein continues to use the existing goal-based calculation. Carbohydrates and fats are estimated from calorie percentages, fiber scales with calories, and water uses an approximate gender-based baseline.

Status thresholds are:

- **Low**: intake is below 80% of the recommendation
- **Adequate**: intake is between 80% and 120%
- **High**: intake is above 120%

These estimates are for general guidance and are not a medical diagnosis. Users with medical conditions should consult a qualified healthcare professional.

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Protected routes with middleware
- Input validation
- OTP expiration (10 minutes)

## 📧 Email Configuration

The existing email service sends a protein tracking summary with the daily protein requirement, consumed protein, remaining protein, and progress visualization. Email is supplementary; nutrition assessment results are available directly in the dashboard and PDF report.

Make sure to configure email settings in `.env` file.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

### Email Not Sending
- Verify email credentials
- For Gmail, use App Password
- Check email service logs

### CORS Issues
- Ensure backend CORS is configured
- Check frontend API URL

### Nutrition Values Are Zero
- Select a food from the structured Food-Based Assessment list.
- Check that quantity is greater than zero and the unit is correct.
- Use the exact food names available from `GET /api/food/database`.
- Legacy free-text meals only calculate values for foods recognized by the legacy datasets.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm start  # Runs on http://localhost:3000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using MERN Stack**



# Nutricheck
